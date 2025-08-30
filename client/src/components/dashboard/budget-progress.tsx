import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, AlertTriangle } from "lucide-react";

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
    if (percentage >= 100) return "bg-destructive";
    if (percentage >= 80) return "bg-warning";
    return "bg-primary";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-budget-progress">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Budget Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!data || data.length === 0 ? (
          <div className="text-center py-6" data-testid="text-no-budgets-progress">
            <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No budgets set up yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item) => {
              const budgetAmount = parseFloat(item.budget.amount);
              const percentage = (item.spent / budgetAmount) * 100;
              const remaining = budgetAmount - item.spent;

              return (
                <div key={item.budget.id} className="space-y-2" data-testid={`budget-progress-${item.budget.id}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(item.budget.category.icon)}</span>
                      <span className="font-medium text-sm">{item.budget.category.name}</span>
                      {percentage >= 80 && (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        ${item.spent.toFixed(2)} / ${budgetAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}% used</span>
                    <span className={remaining >= 0 ? "" : "text-destructive"}>
                      {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
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
