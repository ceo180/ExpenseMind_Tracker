import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MetricCard from "@/components/dashboard/metric-card";
import BudgetProgress from "@/components/dashboard/budget-progress";
import CategoryChart from "@/components/dashboard/category-chart";
import TrendChart from "@/components/dashboard/trend-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import ExpenseForm from "@/components/forms/expense-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const { data: totals, isLoading: totalsLoading } = useQuery({
    queryKey: ["/api/analytics/totals"],
  });

  const { data: budgetProgress, isLoading: budgetLoading } = useQuery({
    queryKey: ["/api/analytics/budget-progress"],
  });

  const { data: monthlyExpenses } = useQuery({
    queryKey: ["/api/analytics/monthly-expenses"],
  });

  const { data: expenses } = useQuery({
    queryKey: ["/api/expenses"],
  });

  // Calculate budget alerts
  const budgetAlerts = budgetProgress?.filter((item: any) => {
    const percentage = (item.spent / parseFloat(item.budget.amount)) * 100;
    return percentage >= 80;
  }) || [];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-expense">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm onSuccess={() => setIsExpenseModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <Alert className="border-warning bg-warning/10" data-testid="alert-budget-warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Budget Alert:</strong> You've exceeded 80% of your budget in {budgetAlerts.length} categor{budgetAlerts.length === 1 ? 'y' : 'ies'}.
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="This Month's Expenses"
          value={totals?.totalExpenses || 0}
          type="expense"
          isLoading={totalsLoading}
          data-testid="metric-total-expenses"
        />
        <MetricCard
          title="Monthly Income"
          value={totals?.totalIncome || 0}
          type="income"
          isLoading={totalsLoading}
          data-testid="metric-total-income"
        />
        <MetricCard
          title="Net Savings"
          value={totals?.netSavings || 0}
          type="savings"
          isLoading={totalsLoading}
          data-testid="metric-net-savings"
        />
        <MetricCard
          title="Budget Remaining"
          value={budgetProgress?.reduce((sum: number, item: any) => {
            const remaining = parseFloat(item.budget.amount) - item.spent;
            return sum + Math.max(0, remaining);
          }, 0) || 0}
          type="budget"
          isLoading={budgetLoading}
          data-testid="metric-budget-remaining"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart data={monthlyExpenses} />
        <TrendChart />
      </div>

      {/* Budget Progress and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <BudgetProgress data={budgetProgress} isLoading={budgetLoading} />
        </div>
        <div className="lg:col-span-8">
          <RecentTransactions data={expenses} />
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="rounded-full h-14 w-14 shadow-lg"
              data-testid="button-fab-add-expense"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm onSuccess={() => setIsExpenseModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
