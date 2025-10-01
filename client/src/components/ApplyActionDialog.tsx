import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Action, Participant, Effect, HitCheck } from "@shared/schema";

interface ApplyActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: Action | null;
  caster: Participant;
  targets: Participant[];
  onApply: (
    targetIds: string[],
    customValues: Record<string, number>,
    hitChecks: Record<string, HitCheck>
  ) => void;
}

export default function ApplyActionDialog({
  open,
  onOpenChange,
  action,
  caster,
  targets,
  onApply,
}: ApplyActionDialogProps) {
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());
  const [customValues, setCustomValues] = useState<Record<string, number>>({});
  const [hitChecks, setHitChecks] = useState<Record<string, HitCheck>>({});

  if (!action) return null;

  const toggleTarget = (targetId: string) => {
    const newSet = new Set(selectedTargets);
    if (newSet.has(targetId)) {
      newSet.delete(targetId);
    } else {
      newSet.add(targetId);
    }
    setSelectedTargets(newSet);
  };

  const handleApply = () => {
    onApply(Array.from(selectedTargets), customValues, hitChecks);
    setSelectedTargets(new Set());
    setCustomValues({});
    setHitChecks({});
    onOpenChange(false);
  };

  const getHitCheckLabel = (check: HitCheck) => {
    switch (check) {
      case "success":
        return "Успех";
      case "fail":
        return "Провал";
      case "critSuccess":
        return "Крит успех";
      case "critFail":
        return "Крит провал";
      default:
        return check;
    }
  };

  const getEffectDescription = (effect: Effect) => {
    switch (effect.type) {
      case "damage":
        return `${effect.value} урона`;
      case "heal":
        return `+${effect.value} HP`;
      case "restoreMP":
        return `+${effect.value} MP`;
      case "addStatus":
        return `Наложить: ${effect.statusName} (${effect.statusDuration} ${effect.statusDurationType === "rounds" ? "р" : "х"})`;
      case "removeStatus":
        return `Снять: ${effect.statusName}`;
      case "customDamage":
        return "Урон (ввести вручную)";
      case "customHeal":
        return "Лечение (ввести вручную)";
      default:
        return effect.type;
    }
  };

  const hasCustomEffects = action.effects.some(
    (e) => e.type === "customDamage" || e.type === "customHeal"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dialog-apply-action">
        <DialogHeader>
          <DialogTitle>Применить: {action.name}</DialogTitle>
          <DialogDescription>
            {caster.name} использует {action.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {action.description && (
            <Card className="p-3">
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </Card>
          )}

          <div className="space-y-2">
            <Label>Эффекты</Label>
            <div className="flex flex-wrap gap-1">
              {action.effects.map((effect) => (
                <Badge key={effect.id} variant="secondary">
                  {getEffectDescription(effect)}
                </Badge>
              ))}
            </div>
          </div>

          {hasCustomEffects && (
            <div className="space-y-2">
              <Label>Значения эффектов</Label>
              {action.effects
                .filter((e) => e.type === "customDamage" || e.type === "customHeal")
                .map((effect) => (
                  <div key={effect.id} className="flex items-center gap-2">
                    <Label className="w-32 text-sm">
                      {effect.type === "customDamage" ? "Урон:" : "Лечение:"}
                    </Label>
                    <Input
                      type="number"
                      value={customValues[effect.id] || 0}
                      onChange={(e) =>
                        setCustomValues({
                          ...customValues,
                          [effect.id]: Number(e.target.value),
                        })
                      }
                      className="h-8"
                      data-testid={`input-custom-value-${effect.id}`}
                    />
                  </div>
                ))}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Выберите цели</Label>
              {action.isAOE && selectedTargets.size > 0 && (
                <Badge variant="secondary">AOE режим</Badge>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {targets.map((target) => (
                <Card
                  key={target.id}
                  className="p-3"
                  data-testid={`target-card-${target.id}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedTargets.has(target.id)}
                        onCheckedChange={() => toggleTarget(target.id)}
                        data-testid={`checkbox-target-${target.id}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{target.name}</span>
                          <Badge
                            variant="outline"
                            className={
                              target.faction === "player"
                                ? "text-faction-player border-faction-player"
                                : target.faction === "npc"
                                ? "text-faction-npc border-faction-npc"
                                : "text-faction-boss border-faction-boss"
                            }
                          >
                            {target.faction === "player"
                              ? "Игрок"
                              : target.faction === "npc"
                              ? "НПС"
                              : "Босс"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {target.faction === "boss" ? (
                            `Урон: ${target.damageDealt || 0}`
                          ) : (
                            <>
                              HP: {target.hpCurr}/{target.hpMax}
                              {target.mpMax > 0 && ` | MP: ${target.mpCurr}/${target.mpMax}`}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedTargets.has(target.id) && (
                      <div className="ml-9 flex items-center gap-2">
                        <Label className="text-sm w-32">Проверка попадания:</Label>
                        <Select
                          value={hitChecks[target.id] || "success"}
                          onValueChange={(value) =>
                            setHitChecks({ ...hitChecks, [target.id]: value as HitCheck })
                          }
                        >
                          <SelectTrigger className="h-8" data-testid={`hit-check-${target.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="success">Успех</SelectItem>
                            <SelectItem value="fail">Провал</SelectItem>
                            <SelectItem value="critSuccess">Крит успех</SelectItem>
                            <SelectItem value="critFail">Крит провал</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-apply">
            Отмена
          </Button>
          <Button
            onClick={handleApply}
            disabled={selectedTargets.size === 0}
            data-testid="button-confirm-apply"
          >
            Применить ({selectedTargets.size})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
