import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

export default function Reports() {
  const [period, setPeriod] = useState("6months");

  const { data: totals } = useQuery({
    queryKey: ["/api/analytics/totals"],
  });

  const { data: monthlyExpenses } = useQuery({
    queryKey: ["/api/analytics/monthly-expenses"],
  });

  const { data: budgetProgress } = useQuery({
    queryKey: ["/api/analytics/budget-progress"],
  });

  const { data: expenses } = useQuery({
    queryKey: ["/api/expenses"],
  });

  const { data: incomes } = useQuery({
    queryKey: ["/api/incomes"],
  });

  // Calculate category spending for pie chart
  const categorySpending = expenses?.reduce((acc: any, expense: any) => {
    const categoryName = expense.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = { name: categoryName, value: 0, color: expense.category?.color || '#64748b' };
    }
    acc[categoryName].value += parseFloat(expense.amount);
    return acc;
  }, {});

  const pieData = categorySpending ? Object.values(categorySpending) : [];

  // Calculate month-over-month change
  const currentMonthExpenses = monthlyExpenses?.[monthlyExpenses.length - 1]?.amount || 0;
  const previousMonthExpenses = monthlyExpenses?.[monthlyExpenses.length - 2]?.amount || 0;
  const expenseChange = previousMonthExpenses > 0 
    ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses * 100).toFixed(1)
    : 0;

  // Format chart data
  const chartData = monthlyExpenses?.map((item: any) => ({
    month: item.month,
    expenses: parseFloat(item.amount),
  })) || [];

  return (
    <div className="p-4 lg:p-8 space-y-8 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Reports
            </h1>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg">
            Detailed insights into your financial activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px] rounded-xl border-2 hover:border-primary transition-colors">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl border-2 hover:border-primary transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-0 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg shadow-red-500/25">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${Number(expenseChange) > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {Number(expenseChange) > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {Math.abs(Number(expenseChange))}%
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${(totals?.totalExpenses || 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Expenses</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/25">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-emerald-500">
                <ArrowUpRight className="h-4 w-4" />
                12%
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${(totals?.totalIncome || 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Income</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${(totals?.netSavings || 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Net Savings</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Expense Trend Chart */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Expense Trend</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Expenses']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500">
                <PieChart className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No expense data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Comparison */}
        <Card className="glass-card border-0 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Monthly Comparison</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Expenses']}
                  />
                  <Bar 
                    dataKey="expenses" 
                    fill="#3b82f6" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Performance */}
      {budgetProgress && (budgetProgress as any[]).length > 0 && (
        <Card className="glass-card border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">Budget Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {(budgetProgress as any[]).map((item: any, index: number) => {
                const percentage = Math.min((item.spent / parseFloat(item.budget.amount)) * 100, 100);
                const isOverBudget = percentage >= 100;
                const isWarning = percentage >= 80 && percentage < 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">{item.category.name}</span>
                      <span className={`text-sm font-medium ${isOverBudget ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>
                        ${item.spent.toLocaleString()} / ${parseFloat(item.budget.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOverBudget ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                          isWarning ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                          'bg-gradient-to-r from-emerald-500 to-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
