import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, ScrollText } from "lucide-react";
import type { EventLog as EventLogType } from "@shared/schema";

interface EventLogProps {
  events: EventLogType[];
  onClear?: () => void;
}

export default function EventLog({ events, onClear }: EventLogProps) {
  const getEventColor = (type: string) => {
    switch (type) {
      case "damage": return "text-chart-3";
      case "heal": return "text-chart-4";
      case "status": return "text-chart-2";
      case "turn": return "text-ring";
      case "round": return "text-primary";
      case "action": return "text-foreground";
      case "rest": return "text-chart-5";
      default: return "text-muted-foreground";
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Card className="p-4 h-full flex flex-col" data-testid="event-log">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-ring" />
          <h3 className="font-semibold text-sm">Лог событий</h3>
        </div>
        {onClear && events.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClear}
            data-testid="button-clear-log"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 mt-3">
        <div className="space-y-2">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Нет событий
            </p>
          ) : (
            [...events].reverse().map((event) => (
              <div
                key={event.id}
                className="text-sm p-2 rounded-md hover-elevate"
                data-testid={`event-${event.id}`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatTime(event.timestamp)}
                  </span>
                  <span className={getEventColor(event.type)}>{event.message}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
