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

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate totals and angles
    const total = data.reduce((sum, item) => sum + item.total, 0);
    if (total === 0) return;

    const colors = [
      '#F59E0B', '#3B82F6', '#7C3AED', '#EF4444', '#10B981',
      '#F97316', '#06B6D4', '#8B5CF6', '#EC4899', '#84CC16'
    ];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    let currentAngle = -Math.PI / 2; // Start at top

    // Draw pie slices
    data.forEach((item, index) => {
      const sliceAngle = (item.total / total) * 2 * Math.PI;
      const color = colors[index % colors.length];

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

    // Draw center circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.stroke();

  }, [data]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card data-testid="card-category-chart">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!data || data.length === 0 ? (
          <div className="flex items-center justify-center h-64" data-testid="text-no-category-data">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No expense data available</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative h-64">
              <canvas
                ref={chartRef}
                width={300}
                height={300}
                className="mx-auto"
                data-testid="canvas-category-chart"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {data.map((item, index) => {
                const colors = [
                  '#F59E0B', '#3B82F6', '#7C3AED', '#EF4444', '#10B981',
                  '#F97316', '#06B6D4', '#8B5CF6', '#EC4899', '#84CC16'
                ];
                const color = colors[index % colors.length];
                
                return (
                  <div key={item.categoryId} className="flex items-center justify-between text-sm" data-testid={`legend-${item.categoryId}`}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <span>{item.categoryName}</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(item.total)}</span>
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
