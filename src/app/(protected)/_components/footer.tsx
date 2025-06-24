import { Card, CardContent } from "@/components/ui/card";

const Footer = () => {
  return (
    <footer>
      <Card>
        <CardContent className="px-10">
          <p className="text-sm text-gray-400">
            2025 Copyright <span className="font-bold">Barberia Shop</span>
          </p>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;
