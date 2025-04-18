
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Cake, CalendarIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuAdminHeaderProps {
  title: string;
  description?: string;
}

const MenuAdminHeader: React.FC<MenuAdminHeaderProps> = ({
  title,
  description
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h2 className="text-2xl font-medium">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {!isMobile && (
        <div className="flex gap-2">
          <Button asChild variant="outline" className="bg-primary/10 border-primary/20">
            <Link to="/menu-admin">
              <BookOpen className="mr-2 h-4 w-4" /> Menu
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/events-admin">
              <Cake className="mr-2 h-4 w-4" /> Événements
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin">
              <CalendarIcon className="mr-2 h-4 w-4" /> Réservations
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuAdminHeader;
