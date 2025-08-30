import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import IncomeForm from "@/components/forms/income-form";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { format } from "date-fns";
import type { Income } from "@shared/schema";

export default function IncomePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const { toast } = useToast();

  const { data: incomeList, isLoading } = useQuery<Income[]>({
    queryKey: ["/api/income"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/income/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/income"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/totals"] });
      toast({
        title: "Success",
        description: "Income deleted successfully",
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

  const handleDelete = (id: string, source: string) => {
    if (confirm(`Are you sure you want to delete the "${source}" income entry? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const totalIncome = incomeList?.reduce((sum, income) => sum + parseFloat(income.amount), 0) || 0;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-income-title">
            Income
          </h1>
          <p className="text-muted-foreground" data-testid="text-income-subtitle">
            Track your income sources and earnings
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-income">
              <Plus className="h-4 w-4 mr-2" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Income</DialogTitle>
            </DialogHeader>
            <IncomeForm onSuccess={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-total-income">
            ${totalIncome.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {incomeList?.length || 0} income {incomeList?.length === 1 ? 'entry' : 'entries'}
          </p>
        </CardContent>
      </Card>

      {/* Income List */}
      <Card>
        <CardHeader>
          <CardTitle>Income Entries</CardTitle>
          <CardDescription>
            All your income sources and earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !incomeList || incomeList.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No income entries yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your income by adding your first entry
              </p>
              <Button onClick={() => setIsAddModalOpen(true)} data-testid="button-add-first-income">
                <Plus className="h-4 w-4 mr-2" />
                Add Income Entry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {incomeList.map((income) => (
                <div
                  key={income.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  data-testid={`income-item-${income.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground" data-testid={`text-income-source-${income.id}`}>
                          {income.source}
                        </h3>
                        {income.description && (
                          <p className="text-sm text-muted-foreground" data-testid={`text-income-description-${income.id}`}>
                            {income.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {format(new Date(income.date), "MMM dd, yyyy")}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600" data-testid={`text-income-amount-${income.id}`}>
                          +${parseFloat(income.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingIncome(income)}
                      data-testid={`button-edit-income-${income.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(income.id, income.source)}
                      data-testid={`button-delete-income-${income.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingIncome} onOpenChange={(open) => !open && setEditingIncome(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>
          {editingIncome && (
            <IncomeForm 
              income={editingIncome}
              onSuccess={() => setEditingIncome(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}