import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Sheet, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import SiderMenu from "./Sidermenu";

const Header = () => {
  return (
    <Card className="max-h-20 rounded-none p-0">
      <CardContent className="flex flex-row items-center justify-between pt-0">
        <Link href="/">
          <Image
            alt="Barbearia"
            src="/logoHeader.png"
            height={18}
            width={120}
          />
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button size={"icon"} variant={"outline"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SiderMenu />
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Header;
