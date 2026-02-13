import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, AlertTriangle, TrendingUp } from "lucide-react";

interface BudgetProgressProps {
  data?: Array<{
    budget: {
      id: string;
      amount: string;
      category: {
        name: string;
        icon: string;
        color: string;
      };
    };
    spent: number;
  }>;
  isLoading?: boolean;
}

export default function BudgetProgress({ data, isLoading }: BudgetProgressProps) {
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

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return { bg: "bg-red-500", text: "text-red-500" };
    if (percentage >= 80) return { bg: "bg-amber-500", text: "text-amber-500" };
    return { bg: "bg-emerald-500", text: "text-emerald-500" };
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Target className="h-5 w-5 text-purple-500" />
            </div>
            Budget Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-budget-progress">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-xl">
            <Target className="h-5 w-5 text-purple-500" />
          </div>
          Budget Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!data || data.length === 0 ? (
          <div className="text-center py-8" data-testid="text-no-budgets-progress">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Target className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-muted-foreground font-medium">No budgets set up yet</p>
            <p className="text-sm text-muted-foreground/70">Create a budget to track spending</p>
          </div>
        ) : (
          <div className="space-y-5">
            {data.map((item, index) => {
              const budgetAmount = parseFloat(item.budget.amount);
              const percentage = (item.spent / budgetAmount) * 100;
              const remaining = budgetAmount - item.spent;
              const colors = getProgressColor(percentage);

              return (
                <div 
                  key={item.budget.id} 
                  className="stagger-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  data-testid={`budget-progress-${item.budget.id}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-base"
                        style={{ backgroundColor: `${item.budget.category.color}15` }}
                      >
                        {getCategoryIcon(item.budget.category.icon)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2">
                          {item.budget.category.name}
                          {percentage >= 80 && (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${item.spent.toFixed(0)} of ${budgetAmount.toFixed(0)}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${colors.text}`}>
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                  
                  {/* Custom progress bar */}
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colors.bg} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-muted-foreground">
                      {remaining >= 0 ? (
                        <span className="text-emerald-500 font-medium">${remaining.toFixed(0)} left</span>
                      ) : (
                        <span className="text-red-500 font-medium">${Math.abs(remaining).toFixed(0)} over</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
