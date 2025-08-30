import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, ExternalLink } from "lucide-react";
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
    <Card data-testid="card-recent-transactions">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
          <Link href="/expenses">
            <Button variant="outline" size="sm" data-testid="button-view-all">
              <ExternalLink className="h-4 w-4 mr-1" />
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-6" data-testid="text-no-transactions">
            <Receipt className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id} data-testid={`transaction-${transaction.id}`}>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(transaction.date), "MMM dd")}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">
                        <span className="mr-2">{getCategoryIcon(transaction.category.icon)}</span>
                        {transaction.category.name}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        Payment: {transaction.paymentMethod.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge 
                        variant="secondary" 
                        className="flex items-center gap-1 w-fit"
                        style={{ 
                          backgroundColor: `${transaction.category.color}20`,
                          color: transaction.category.color,
                        }}
                      >
                        <span>{getCategoryIcon(transaction.category.icon)}</span>
                        {transaction.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-destructive">
                      -${parseFloat(transaction.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
