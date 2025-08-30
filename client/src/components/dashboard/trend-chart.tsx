import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function TrendChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set proper canvas dimensions for high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Sample data for demonstration
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    const expenseData = [2100, 2350, 2800, 2650, 2400, 2750, 2900, 2450, 2650, 2550, 2847];
    const budgetData = [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3500];

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;

    const maxValue = Math.max(...expenseData, ...budgetData);
    const minValue = 0;
    const valueRange = maxValue - minValue;

    // Draw grid lines
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Draw expense line
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    expenseData.forEach((value, index) => {
      const x = padding + (chartWidth / (expenseData.length - 1)) * index;
      const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw budget line (dashed)
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    budgetData.forEach((value, index) => {
      const x = padding + (chartWidth / (budgetData.length - 1)) * index;
      const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw data points for expenses
    ctx.fillStyle = '#3B82F6';
    expenseData.forEach((value, index) => {
      const x = padding + (chartWidth / (expenseData.length - 1)) * index;
      const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw month labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    months.forEach((month, index) => {
      const x = padding + (chartWidth / (months.length - 1)) * index;
      ctx.fillText(month, x, rect.height - 10);
    });

    // Draw value labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (valueRange / 5) * (5 - i);
      const y = padding + (chartHeight / 5) * i + 4;
      ctx.fillText(`$${value}`, padding - 10, y);
    }

  }, []);

  return (
    <Card data-testid="card-trend-chart">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Monthly Spending Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative h-64">
            <canvas
              ref={chartRef}
              className="w-full h-full"
              data-testid="canvas-trend-chart"
            />
          </div>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-green-500" style={{ borderTop: '2px dashed' }}></div>
              <span>Budget</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
