import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Participant } from "@shared/schema";
import { Swords } from "lucide-react";

interface InitiativeTrackerProps {
  participants: Participant[];
  currentTurnIndex: number;
}

export default function InitiativeTracker({ participants, currentTurnIndex }: InitiativeTrackerProps) {
  const sortedParticipants = [...participants].sort((a, b) => b.initiative - a.initiative);

  const getFactionColor = (faction: string) => {
    switch (faction) {
      case "player": return "text-faction-player border-faction-player";
      case "npc": return "text-faction-npc border-faction-npc";
      case "boss": return "text-faction-boss border-faction-boss";
      default: return "";
    }
  };

  return (
    <Card className="p-4 space-y-2" data-testid="initiative-tracker">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <Swords className="h-4 w-4 text-ring" />
        <h3 className="font-semibold text-sm">Инициатива</h3>
      </div>

      <div className="space-y-1">
        {sortedParticipants.map((participant, index) => {
          const isActive = sortedParticipants[currentTurnIndex]?.id === participant.id;
          
          return (
            <div
              key={participant.id}
              className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-ring/10 border-2 border-ring animate-pulse-slow' 
                  : 'hover-elevate'
              }`}
              data-testid={`initiative-item-${participant.id}`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Badge
                  variant="outline"
                  className={`${getFactionColor(participant.faction)} shrink-0`}
                >
                  {participant.initiative}
                </Badge>
                <span className="text-sm font-medium truncate">{participant.name}</span>
              </div>
              
              {participant.isDead && (
                <span className="text-xs text-chart-3">Мёртв</span>
              )}
              {participant.isUnconscious && !participant.isDead && (
                <span className="text-xs text-muted-foreground">Без сознания</span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
