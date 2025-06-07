"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Home,
  Users,
  Scissors,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  MapPin,
} from "lucide-react";
import { authService } from "@/lib/api/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Cadastros",
    icon: Settings,
    children: [
      {
        title: "Cadastro de Serviços",
        icon: Scissors,
        href: "/dashboard/cadastros/servicos",
      },
      {
        title: "Cadastro de Funcionários",
        icon: Users,
        href: "/dashboard/cadastros/funcionarios",
      },
    ],
  },
];

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const barberShop = authService.getBarberShop();

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const handleLogout = () => {
    authService.logout();
    router.push("/admin");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <div
      className={cn(
        "bg-background flex h-full w-64 flex-col border-r",
        className,
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Scissors className="text-primary-foreground h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold"> {barberShop?.nome} </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <Collapsible
                  open={openItems.includes(item.title)}
                  onOpenChange={() => toggleItem(item.title)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hover:bg-accent w-full justify-between"
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      {openItems.includes(item.title) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.title}
                        variant="ghost"
                        className="hover:bg-accent w-full justify-start pl-8"
                        onClick={() => router.push(child.href || "#")}
                      >
                        <child.icon className="mr-2 h-4 w-4" />
                        <span className="text-sm">{child.title}</span>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Button
                  variant="ghost"
                  className="hover:bg-accent w-full justify-start"
                  onClick={() => router.push(item.href || "#")}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span className="text-sm">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={barberShop?.nome || "Usuário"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {barberShop?.nome ? getInitials(barberShop.nome) : "BB"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start text-left">
                  <p className="text-sm leading-none font-medium">
                    {barberShop?.nome || "Barbearia"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {barberShop?.email || "email@exemplo.com"}
                  </p>
                </div>
                <ChevronDown className="text-muted-foreground h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">
                  {barberShop?.nome || "Barbearia"}
                </p>
                <p className="text-muted-foreground text-xs leading-none">
                  {barberShop?.email || "email@exemplo.com"}
                </p>
                <div className="text-muted-foreground flex items-center text-xs">
                  <MapPin className="mr-1 h-3 w-3" />
                  {barberShop?.cidade || "Cidade"},{" "}
                  {barberShop?.estado || "Estado"}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
