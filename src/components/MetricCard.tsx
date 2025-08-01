import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  className?: string;
  gradient?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className,
  gradient = "bg-gradient-card" 
}: MetricCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden border-border/50 backdrop-blur-sm hover:shadow-card transition-smooth hover:scale-105",
      gradient,
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-1">
          {value}
        </div>
        {trend && (
          <p className="text-xs text-success-glow">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};