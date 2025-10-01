interface MPBarProps {
  current: number;
  max: number;
}

export default function MPBar({ current, max }: MPBarProps) {
  if (max === 0) return null;
  
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  return (
    <div className="space-y-1" data-testid="mp-bar">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">MP</span>
        <span className="font-medium">
          {current}/{max}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full transition-all bg-chart-5"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
