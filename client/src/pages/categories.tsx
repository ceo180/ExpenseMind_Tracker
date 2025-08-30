import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import CategoryForm from "@/components/forms/category-form";
import { Plus, Edit, Trash2, Tags } from "lucide-react";
import type { Category } from "@shared/schema";

export default function Categories() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the "${name}" category? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const getCategoryIcon = (icon: string) => {
    const iconMap: { [key: string]: string } = {
      "fas fa-utensils": "🍽️",
      "fas fa-car": "🚗",
      "fas fa-shopping-bag": "🛍️",
      "fas fa-film": "🎬",
      "fas fa-home": "🏠",
      "fas fa-heart": "❤️",
      "fas fa-plane": "✈️",
      "fas fa-graduation-cap": "🎓",
      "fas fa-tag": "🏷️",
    };
    return iconMap[icon] || "📝";
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-categories-title">
            Categories
          </h1>
          <p className="text-muted-foreground" data-testid="text-categories-subtitle">
            Organize your expenses with custom categories
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-category">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm onSuccess={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            All Categories
          </CardTitle>
          <CardDescription>
            {categories?.length || 0} categor{categories?.length !== 1 ? 'ies' : 'y'} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : categories?.length === 0 ? (
            <div className="text-center py-8" data-testid="text-no-categories">
              <Tags className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No categories found</h3>
              <p className="text-muted-foreground mb-4">Create your first category to start organizing your expenses.</p>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                  </DialogHeader>
                  <CategoryForm onSuccess={() => setIsAddModalOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories?.map((category) => (
                <Card key={category.id} className="relative hover:shadow-md transition-shadow" data-testid={`card-category-${category.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                          style={{ 
                            backgroundColor: `${category.color}20`,
                            color: category.color 
                          }}
                        >
                          {getCategoryIcon(category.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{category.name}</h3>
                          {category.isDefault === 1 && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCategory(category)}
                          data-testid={`button-edit-${category.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id, category.name)}
                          disabled={deleteMutation.isPending || category.isDefault === 1}
                          data-testid={`button-delete-${category.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-muted-foreground font-mono">
                        {category.color}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm 
              category={editingCategory}
              onSuccess={() => setEditingCategory(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
