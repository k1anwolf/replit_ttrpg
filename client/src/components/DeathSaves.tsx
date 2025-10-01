import { Circle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DeathSaves as DeathSavesType } from "@shared/schema";

interface DeathSavesProps {
  deathSaves: DeathSavesType;
  onUpdate?: (deathSaves: DeathSavesType) => void;
  onResurrect?: () => void;
  onPermanentDeath?: () => void;
}

export default function DeathSaves({ deathSaves, onUpdate, onResurrect, onPermanentDeath }: DeathSavesProps) {
  const addSuccess = () => {
    if (deathSaves.successes < 3 && onUpdate) {
      const newSuccesses = deathSaves.successes + 1;
      if (newSuccesses === 3 && onResurrect) {
        // Trigger resurrection with 1 HP
        onResurrect();
      } else {
        onUpdate({ ...deathSaves, successes: newSuccesses });
      }
    }
  };

  const addFailure = () => {
    if (deathSaves.failures < 3 && onUpdate) {
      const newFailures = deathSaves.failures + 1;
      if (newFailures === 3 && onPermanentDeath) {
        // Trigger permanent death
        onPermanentDeath();
      } else {
        onUpdate({ ...deathSaves, failures: newFailures });
      }
    }
  };

  const reset = () => {
    if (onUpdate) {
      onUpdate({ successes: 0, failures: 0 });
    }
  };

  return (
    <div className="space-y-2 p-2 border border-border rounded-md" data-testid="death-saves">
      <div className="text-xs font-medium text-muted-foreground">Спасброски от смерти</div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1 text-xs"
          onClick={addSuccess}
          data-testid="button-add-success"
        >
          <CheckCircle2 className="h-3 w-3 text-chart-4" />
          Успех
        </Button>
        <div className="flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            i < deathSaves.successes ? (
              <CheckCircle2 key={i} className="h-4 w-4 text-chart-4" />
            ) : (
              <Circle key={i} className="h-4 w-4 text-muted-foreground" />
            )
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1 text-xs"
          onClick={addFailure}
          data-testid="button-add-failure"
        >
          <XCircle className="h-3 w-3 text-chart-3" />
          Провал
        </Button>
        <div className="flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            i < deathSaves.failures ? (
              <XCircle key={i} className="h-4 w-4 text-chart-3" />
            ) : (
              <Circle key={i} className="h-4 w-4 text-muted-foreground" />
            )
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-6 w-full text-xs"
        onClick={reset}
        data-testid="button-reset-death-saves"
      >
        Сбросить
      </Button>
    </div>
  );
}
