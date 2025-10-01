import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Status } from "@shared/schema";

interface StatusChipProps {
  status: Status;
  onRemove?: () => void;
}

export default function StatusChip({ status, onRemove }: StatusChipProps) {
  return (
    <Badge
      variant="secondary"
      className="gap-1 text-xs"
      data-testid={`status-chip-${status.id}`}
    >
      <span>{status.name}</span>
      {status.duration > 0 && (
        <span className="text-muted-foreground">
          ({status.duration} {status.durationType === "rounds" ? "р" : "х"})
        </span>
      )}
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-3 w-3 p-0 hover:bg-transparent"
          onClick={onRemove}
          data-testid={`button-remove-status-${status.id}`}
        >
          <X className="h-2 w-2" />
        </Button>
      )}
    </Badge>
  );
}
