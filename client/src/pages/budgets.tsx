import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import BudgetForm from "@/components/forms/budget-form";
import { Plus, Edit, Trash2, Target, AlertTriangle } from "lucide-react";

interface BudgetWithCategory {
  id: string;
  amount: string;
  period: string;
  startDate: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

interface BudgetProgress {
  budget: BudgetWithCategory;
  spent: number;
}

export default function Budgets() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetWithCategory | null>(null);
  const { toast } = useToast();

  const { data: budgets, isLoading } = useQuery<BudgetWithCategory[]>({
    queryKey: ["/api/budgets"],
  });

  const { data: budgetProgress } = useQuery<BudgetProgress[]>({
    queryKey: ["/api/analytics/budget-progress"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/budgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/budget-progress"] });
      toast({
        title: "Success",
        description: "Budget deleted successfully",
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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      deleteMutation.mutate(id);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-destructive";
    if (percentage >= 80) return "bg-warning";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-primary";
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
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-budgets-title">
            Budgets
          </h1>
          <p className="text-muted-foreground" data-testid="text-budgets-subtitle">
            Set and track your spending limits by category
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-budget">
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm onSuccess={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Progress Overview */}
      {budgetProgress && budgetProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Budget Progress
            </CardTitle>
            <CardDescription>
              Current spending vs. budget limits for this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetProgress.map((item) => {
              const percentage = (item.spent / parseFloat(item.budget.amount)) * 100;
              const remaining = parseFloat(item.budget.amount) - item.spent;
              
              return (
                <div key={item.budget.id} className="space-y-2" data-testid={`progress-budget-${item.budget.id}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(item.budget.category.icon)}</span>
                      <span className="font-medium">{item.budget.category.name}</span>
                      {percentage >= 80 && (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${item.spent.toFixed(2)} / ${parseFloat(item.budget.amount).toFixed(2)}
                      </div>
                      <div className={`text-sm ${remaining >= 0 ? 'text-muted-foreground' : 'text-destructive'}`}>
                        {remaining >= 0 ? `$${remaining.toFixed(2)} remaining` : `$${Math.abs(remaining).toFixed(2)} over budget`}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% of budget used
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Budgets List */}
      <Card>
        <CardHeader>
          <CardTitle>All Budgets</CardTitle>
          <CardDescription>
            {budgets?.length || 0} budget{budgets?.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : budgets?.length === 0 ? (
            <div className="text-center py-8" data-testid="text-no-budgets">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No budgets found</h3>
              <p className="text-muted-foreground mb-4">Create your first budget to start tracking your spending limits.</p>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Budget
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                  </DialogHeader>
                  <BudgetForm onSuccess={() => setIsAddModalOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {budgets?.map((budget) => {
                const progress = budgetProgress?.find(p => p.budget.id === budget.id);
                const spent = progress?.spent || 0;
                const percentage = (spent / parseFloat(budget.amount)) * 100;
                
                return (
                  <Card key={budget.id} className="relative" data-testid={`card-budget-${budget.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(budget.category.icon)}</span>
                          <span className="font-semibold">{budget.category.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingBudget(budget)}
                            data-testid={`button-edit-${budget.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(budget.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${budget.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          ${parseFloat(budget.amount).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {budget.period} budget
                        </div>
                      </div>
                      
                      {progress && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Spent: ${spent.toFixed(2)}</span>
                            <span>{percentage.toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={Math.min(percentage, 100)} 
                            className="h-2"
                          />
                          <div className="text-xs text-center text-muted-foreground">
                            ${Math.max(0, parseFloat(budget.amount) - spent).toFixed(2)} remaining
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Budget Dialog */}
      <Dialog open={!!editingBudget} onOpenChange={() => setEditingBudget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          {editingBudget && (
            <BudgetForm 
              budget={{
                ...editingBudget,
                categoryId: editingBudget.category.id
              }}
              onSuccess={() => setEditingBudget(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
