import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  variant?: "mobile" | "desktop";
  className?: string;
}

const FavoriteButton = ({
  isFavorite,
  onToggle,
  variant = "mobile",
  className = "",
}: FavoriteButtonProps) => {
  const isMobile = variant === "mobile";

  return (
    <Button
      size="sm"
      variant="ghost"
      className={`p-0 ${
        isMobile ? "h-8 w-8 hover:bg-gray-800" : "h-10 w-10 hover:bg-gray-100"
      } ${className}`}
      onClick={onToggle}
    >
      <Heart
        className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} ${
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-500"
        }`}
      />
    </Button>
  );
};

export default FavoriteButton;
