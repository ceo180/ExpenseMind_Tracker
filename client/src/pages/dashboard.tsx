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
import { Plus, AlertTriangle, Sparkles } from "lucide-react";

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
  const budgetAlerts = (budgetProgress as any)?.filter((item: any) => {
    const percentage = (item.spent / parseFloat(item.budget.amount)) * 100;
    return percentage >= 80;
  }) || [];

  return (
    <div className="p-4 lg:p-8 space-y-8 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent" data-testid="text-dashboard-title">
              Dashboard
            </h1>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg" data-testid="text-dashboard-subtitle">
            Welcome back! Here's your financial overview.
          </p>
        </div>
        <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
          <DialogTrigger asChild>
            <Button 
              className="rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
              data-testid="button-add-expense"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-0 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm onSuccess={() => setIsExpenseModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <Alert className="border-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl animate-pulse" data-testid="alert-budget-warning">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <AlertDescription className="text-amber-800 dark:text-amber-200 font-medium">
              <strong>Budget Alert:</strong> You've exceeded 80% of your budget in {budgetAlerts.length} categor{budgetAlerts.length === 1 ? 'y' : 'ies'}.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard
          title="This Month's Expenses"
          value={(totals as any)?.totalExpenses || 0}
          type="expense"
          isLoading={totalsLoading}
          data-testid="metric-total-expenses"
        />
        <MetricCard
          title="Monthly Income"
          value={(totals as any)?.totalIncome || 0}
          type="income"
          isLoading={totalsLoading}
          data-testid="metric-total-income"
        />
        <MetricCard
          title="Net Savings"
          value={(totals as any)?.netSavings || 0}
          type="savings"
          isLoading={totalsLoading}
          data-testid="metric-net-savings"
        />
        <MetricCard
          title="Budget Remaining"
          value={(budgetProgress as any)?.reduce((sum: number, item: any) => {
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
        <CategoryChart data={monthlyExpenses as any} />
        <TrendChart />
      </div>

      {/* Budget Progress and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <BudgetProgress data={budgetProgress as any} isLoading={budgetLoading} />
        </div>
        <div className="lg:col-span-8">
          <RecentTransactions data={expenses as any} />
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              className="rounded-full h-16 w-16 shadow-2xl shadow-primary/40 hover:scale-110 transition-all duration-300"
              data-testid="button-fab-add-expense"
            >
              <Plus className="h-7 w-7" />
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-0">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm onSuccess={() => setIsExpenseModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
