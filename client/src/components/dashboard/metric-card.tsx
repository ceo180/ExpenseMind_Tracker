import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  type: "expense" | "income" | "savings" | "budget";
  isLoading?: boolean;
  change?: number;
  changeLabel?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  type, 
  isLoading,
  change,
  changeLabel 
}: MetricCardProps) {
  const formatValue = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const getValueColor = (type: string) => {
    switch (type) {
      case "expense":
        return "text-destructive";
      case "income":
        return "text-green-600";
      case "savings":
        return value >= 0 ? "text-green-600" : "text-destructive";
      case "budget":
        return "text-orange-600";
      default:
        return "text-foreground";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "expense":
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      case "income":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "savings":
        return <PiggyBank className="h-5 w-5 text-blue-600" />;
      case "budget":
        return <DollarSign className="h-5 w-5 text-orange-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Skeleton className="h-4 w-16 mx-auto mb-2" />
          <Skeleton className="h-8 w-24 mx-auto mb-2" />
          <Skeleton className="h-3 w-20 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          {getIcon(type)}
        </div>
        <div className={`text-2xl font-bold mb-1 ${getValueColor(type)}`}>
          {formatValue(value)}
        </div>
        <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium mb-1">
          {title}
        </div>
        {(change !== undefined || changeLabel) && (
          <div className="text-xs text-muted-foreground">
            {change !== undefined && (
              <span className={change >= 0 ? "text-green-600" : "text-destructive"}>
                {change >= 0 ? "+" : ""}{change}%
              </span>
            )}
            {changeLabel && (
              <span className="ml-1">{changeLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
