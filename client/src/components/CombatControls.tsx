import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, RotateCcw, Moon, Sun, History } from "lucide-react";

interface CombatControlsProps {
  currentRound: number;
  currentTurnIndex: number;
  totalParticipants: number;
  onPreviousTurn: () => void;
  onNextTurn: () => void;
  onResetCombat: () => void;
  onShortRest: () => void;
  onLongRest: () => void;
  onViewHistory: () => void;
}

export default function CombatControls({
  currentRound,
  currentTurnIndex,
  totalParticipants,
  onPreviousTurn,
  onNextTurn,
  onResetCombat,
  onShortRest,
  onLongRest,
  onViewHistory,
}: CombatControlsProps) {
  return (
    <Card className="p-4 space-y-4" data-testid="combat-controls">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Раунд</div>
          <div className="text-2xl font-bold text-ring">{currentRound}</div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPreviousTurn}
            data-testid="button-previous-turn"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={onNextTurn}
            data-testid="button-next-turn"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Ход</span>
        <span className="font-medium">
          {currentTurnIndex + 1} / {totalParticipants}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={onShortRest}
          data-testid="button-short-rest"
        >
          <Moon className="h-4 w-4" />
          Короткий отдых
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={onLongRest}
          data-testid="button-long-rest"
        >
          <Sun className="h-4 w-4" />
          Длинный отдых
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={onViewHistory}
          data-testid="button-view-history"
        >
          <History className="h-4 w-4" />
          История
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onResetCombat}
          data-testid="button-reset-combat"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
