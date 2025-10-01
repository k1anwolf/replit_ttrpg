import { Progress } from "@/components/ui/progress";

interface HPBarProps {
  current: number;
  max: number;
  isBoss?: boolean;
  damageDealt?: number;
}

export default function HPBar({ current, max, isBoss = false, damageDealt = 0 }: HPBarProps) {
  const safeMax = Math.max(1, max);
  const safeCurrent = Math.max(0, current);
  let percentage = (safeCurrent / safeMax) * 100;
  
  if (!isFinite(percentage) || isNaN(percentage)) {
    percentage = 0;
  }
  percentage = Math.max(0, Math.min(100, percentage));
  
  const getColor = () => {
    if (isBoss) return "bg-faction-boss";
    if (percentage > 60) return "bg-chart-4";
    if (percentage > 30) return "bg-chart-2";
    return "bg-chart-3";
  };

  if (isBoss) {
    return (
      <div className="space-y-1" data-testid="hp-bar">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Урон</span>
          <span className="font-medium text-faction-boss">
            {damageDealt}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          (Босс: урон вместо HP)
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1" data-testid="hp-bar">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">HP</span>
        <span className="font-medium">
          {safeCurrent}/{safeMax}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full transition-all ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
