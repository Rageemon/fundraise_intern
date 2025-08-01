import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface RewardCardProps {
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  isUnlocked: boolean;
  className?: string;
}

export const RewardCard = ({ 
  title, 
  description, 
  target, 
  current, 
  reward, 
  isUnlocked,
  className 
}: RewardCardProps) => {
  const progress = Math.min((current / target) * 100, 100);
  
  return (
    <Card className={cn(
      "overflow-hidden border-border/50 backdrop-blur-sm transition-smooth hover:scale-105",
      isUnlocked ? "bg-gradient-warning shadow-warning" : "bg-gradient-card hover:shadow-card",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "text-lg",
            isUnlocked ? "text-warning-foreground" : "text-foreground"
          )}>
            {title}
          </CardTitle>
          <Badge 
            variant={isUnlocked ? "default" : "secondary"}
            className={isUnlocked ? "bg-warning-glow text-warning-foreground" : ""}
          >
            {isUnlocked ? "Unlocked!" : "Locked"}
          </Badge>
        </div>
        <p className={cn(
          "text-sm",
          isUnlocked ? "text-warning-foreground/80" : "text-muted-foreground"
        )}>
          {description}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className={isUnlocked ? "text-warning-foreground/80" : "text-muted-foreground"}>
              Progress
            </span>
            <span className={cn(
              "font-medium",
              isUnlocked ? "text-warning-foreground" : "text-foreground"
            )}>
              ${current.toLocaleString()} / ${target.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-2",
              isUnlocked ? "bg-warning-foreground/20" : ""
            )}
          />
        </div>
        
        <div className={cn(
          "p-3 rounded-lg border",
          isUnlocked 
            ? "bg-warning-foreground/10 border-warning-foreground/20" 
            : "bg-muted/20 border-border/50"
        )}>
          <div className="flex items-center justify-between">
            <span className={cn(
              "text-sm font-medium",
              isUnlocked ? "text-warning-foreground" : "text-muted-foreground"
            )}>
              Reward:
            </span>
            <span className={cn(
              "text-sm font-bold",
              isUnlocked ? "text-warning-foreground" : "text-foreground"
            )}>
              {reward}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};