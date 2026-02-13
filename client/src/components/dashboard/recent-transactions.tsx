import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

interface RecentTransactionsProps {
  data?: Array<{
    id: string;
    amount: string;
    description: string;
    paymentMethod: string;
    date: string;
    category: {
      id: string;
      name: string;
      icon: string;
      color: string;
    };
  }>;
}

export default function RecentTransactions({ data }: RecentTransactionsProps) {
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

  const recentTransactions = data?.slice(0, 5) || [];

  return (
    <Card className="overflow-hidden border-0 shadow-lg" data-testid="card-recent-transactions">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            Recent Transactions
          </CardTitle>
          <Link href="/expenses">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary hover:bg-primary/10 rounded-lg gap-1"
              data-testid="button-view-all"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-12" data-testid="text-no-transactions">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Receipt className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-muted-foreground font-medium">No transactions yet</p>
            <p className="text-sm text-muted-foreground/70">Add your first expense to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors stagger-item"
                style={{ animationDelay: `${index * 0.05}s` }}
                data-testid={`transaction-${transaction.id}`}
              >
                {/* Category Icon */}
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-sm"
                  style={{ 
                    backgroundColor: `${transaction.category.color}15`,
                  }}
                >
                  {getCategoryIcon(transaction.category.icon)}
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">
                    {transaction.description}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-0 h-5 font-medium"
                      style={{ 
                        backgroundColor: `${transaction.category.color}15`,
                        color: transaction.category.color,
                      }}
                    >
                      {transaction.category.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
                
                {/* Amount */}
                <div className="flex-shrink-0 text-right">
                  <div className="font-bold text-red-500 dark:text-red-400">
                    -${parseFloat(transaction.amount).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {transaction.paymentMethod.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
