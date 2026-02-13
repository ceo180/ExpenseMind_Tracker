import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

interface CategoryChartProps {
  data?: Array<{
    categoryId: string;
    categoryName: string;
    total: number;
  }>;
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set proper canvas dimensions for high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calculate totals and angles
    const total = data.reduce((sum, item) => sum + item.total, 0);
    if (total === 0) return;

    const colors = [
      '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
      '#06B6D4', '#F97316', '#6366F1', '#14B8A6', '#EF4444'
    ];

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 30;

    let currentAngle = -Math.PI / 2; // Start at top

    // Draw pie slices with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    data.forEach((item, index) => {
      const sliceAngle = (item.total / total) * 2 * Math.PI;
      const color = colors[index % colors.length];

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      currentAngle += sliceAngle;
    });

    // Reset shadow for center
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Draw center circle for donut effect with gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.55);
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(1, '#F8FAFC');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.55, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

  }, [data]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const total = data?.reduce((sum, item) => sum + item.total, 0) || 0;

  return (
    <Card className="border-0 shadow-lg overflow-hidden" data-testid="card-category-chart">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <PieChart className="h-5 w-5 text-blue-500" />
          </div>
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!data || data.length === 0 ? (
          <div className="flex items-center justify-center h-64" data-testid="text-no-category-data">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <PieChart className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-muted-foreground font-medium">No expense data available</p>
              <p className="text-sm text-muted-foreground/70">Add expenses to see your breakdown</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative h-56 flex items-center justify-center">
              <canvas
                ref={chartRef}
                className="w-56 h-56"
                data-testid="canvas-category-chart"
              />
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(total)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Spent</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.map((item, index) => {
                const colors = [
                  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
                  '#06B6D4', '#F97316', '#6366F1', '#14B8A6', '#EF4444'
                ];
                const color = colors[index % colors.length];
                const percentage = total > 0 ? ((item.total / total) * 100).toFixed(0) : 0;
                
                return (
                  <div 
                    key={item.categoryId} 
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 stagger-item"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    data-testid={`legend-${item.categoryId}`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.categoryName}</div>
                      <div className="text-xs text-muted-foreground">{percentage}%</div>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(item.total)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
