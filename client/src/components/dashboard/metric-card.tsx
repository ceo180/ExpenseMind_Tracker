import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const config = {
    expense: {
      gradient: "from-red-500 to-rose-600",
      bgGradient: "from-red-500/10 to-rose-500/5",
      icon: TrendingDown,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      valueColor: "text-red-600 dark:text-red-400"
    },
    income: {
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-500/10 to-green-500/5",
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      valueColor: "text-emerald-600 dark:text-emerald-400"
    },
    savings: {
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-500/5",
      icon: PiggyBank,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      valueColor: value >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
    },
    budget: {
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-500/10 to-orange-500/5",
      icon: DollarSign,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      valueColor: "text-amber-600 dark:text-amber-400"
    }
  };

  const { gradient, bgGradient, icon: Icon, iconBg, iconColor, valueColor } = config[type];

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-28 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover-lift border-0 shadow-md hover:shadow-xl transition-all duration-300">
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-50`} />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          {(change !== undefined) && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              change >= 0 
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                : "bg-red-500/10 text-red-600 dark:text-red-400"
            }`}>
              {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        
        <div className={`text-3xl font-bold mb-1 ${valueColor}`}>
          {formatValue(value)}
        </div>
        
        <div className="text-sm text-muted-foreground font-medium">
          {title}
        </div>
        
        {changeLabel && (
          <div className="text-xs text-muted-foreground mt-2">
            {changeLabel}
          </div>
        )}
        
        {/* Decorative gradient bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </CardContent>
    </Card>
  );
}
