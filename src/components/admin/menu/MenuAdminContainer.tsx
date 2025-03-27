
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MenuItem, MenuCategory } from "@/types/menu";
import MenuItemsList from "./MenuItemsList";
import MenuItemForm from "./MenuItemForm";
import MenuItemDialog from "./MenuItemDialog";
import MenuCategoryFilter from "./MenuCategoryFilter";

interface MenuAdminContainerProps {
  menuItems: MenuItem[];
  isLoading: boolean;
  onAddItem: (newItem: MenuItem) => void;
  onUpdateItem: (updatedItem: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const MenuAdminContainer: React.FC<MenuAdminContainerProps> = ({
  menuItems,
  isLoading,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | "Tous">("Tous");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const filteredItems = selectedCategory === "Tous" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleCategoryChange = (category: MenuCategory | "Tous") => {
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <Card className="w-full md:w-auto">
          <CardHeader className="pb-2">
            <CardTitle>Catégories</CardTitle>
            <CardDescription>Filtrer les plats par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <MenuCategoryFilter 
              selectedCategory={selectedCategory} 
              onCategoryChange={handleCategoryChange} 
            />
          </CardContent>
        </Card>

        <Button onClick={() => setIsAddDialogOpen(true)} className="ml-auto">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un plat
        </Button>
      </div>

      <MenuItemsList 
        items={filteredItems} 
        isLoading={isLoading}
        onUpdateItem={onUpdateItem}
        onDeleteItem={onDeleteItem}
      />

      <MenuItemDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        title="Ajouter un nouveau plat"
        description="Complétez le formulaire pour ajouter un plat au menu."
      >
        <MenuItemForm 
          onSubmit={(formData) => {
            // Génération d'un ID unique pour le nouveau plat
            const newItem: MenuItem = {
              ...formData,
              id: `new-${Date.now()}`,
            };
            onAddItem(newItem);
            setIsAddDialogOpen(false);
          }}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </MenuItemDialog>
    </div>
  );
};

export default MenuAdminContainer;
