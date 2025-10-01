import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Sword, Wand2, Scroll, ChevronDown, ChevronUp, Plus, Edit, Zap, Package, Skull, Heart } from "lucide-react";
import type { Participant, Action } from "@shared/schema";
import HPBar from "./HPBar";
import MPBar from "./MPBar";
import StatusChip from "./StatusChip";
import DeathSaves from "./DeathSaves";
import ActionEditor from "./ActionEditor";
import ApplyActionDialog from "./ApplyActionDialog";
import StatusManager from "./StatusManager";
import EquipmentDialog from "./EquipmentDialog";

interface ParticipantRowProps {
  participant: Participant;
  index: number;
  isActive: boolean;
  allParticipants: Participant[];
  onUpdate: (participant: Participant) => void;
  onDelete: () => void;
  onQuickDamage: (amount: number) => void;
  onQuickHeal: (amount: number) => void;
  onApplyAction: (action: Action, targetIds: string[], customValues: Record<string, number>, hitChecks: Record<string, import("@shared/schema").HitCheck>) => void;
}

export default function ParticipantRow({
  participant,
  index,
  isActive,
  allParticipants,
  onUpdate,
  onDelete,
  onQuickDamage,
  onQuickHeal,
  onApplyAction,
}: ParticipantRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [showActionEditor, setShowActionEditor] = useState(false);
  const [editingAction, setEditingAction] = useState<{ action?: Action; type: "attack" | "ability" | "spell" } | null>(null);
  const [showApplyAction, setShowApplyAction] = useState(false);
  const [applyingAction, setApplyingAction] = useState<Action | null>(null);
  const [showStatusManager, setShowStatusManager] = useState(false);
  const [showEquipmentDialog, setShowEquipmentDialog] = useState(false);
  const [editingStats, setEditingStats] = useState(false);

  const getFactionColor = () => {
    switch (participant.faction) {
      case "player": return "border-l-faction-player";
      case "npc": return "border-l-faction-npc";
      case "boss": return "border-l-faction-boss";
      default: return "";
    }
  };

  const handleAddAction = (type: "attack" | "ability" | "spell") => {
    setEditingAction({ type });
    setShowActionEditor(true);
  };

  const handleEditAction = (action: Action, type: "attack" | "ability" | "spell") => {
    setEditingAction({ action, type });
    setShowActionEditor(true);
  };

  const handleSaveAction = (action: Action) => {
    const type = editingAction?.type;
    if (!type) return;

    const field = type === "attack" ? "attacks" : type === "ability" ? "abilities" : "spells";
    const actions = participant[field];
    const existingIndex = actions.findIndex((a) => a.id === action.id);

    if (existingIndex >= 0) {
      onUpdate({
        ...participant,
        [field]: actions.map((a) => (a.id === action.id ? action : a)),
      });
    } else {
      onUpdate({
        ...participant,
        [field]: [...actions, action],
      });
    }

    setEditingAction(null);
  };

  const handleDeleteAction = (actionId: string, type: "attack" | "ability" | "spell") => {
    const field = type === "attack" ? "attacks" : type === "ability" ? "abilities" : "spells";
    onUpdate({
      ...participant,
      [field]: participant[field].filter((a) => a.id !== actionId),
    });
  };

  const handleUseAction = (action: Action) => {
    setApplyingAction(action);
    setShowApplyAction(true);
  };

  const handleApplyActionConfirm = (targetIds: string[], customValues: Record<string, number>, hitChecks: Record<string, import("@shared/schema").HitCheck>) => {
    if (applyingAction) {
      onApplyAction(applyingAction, targetIds, customValues, hitChecks);
    }
  };

  return (
    <>
      <div
        className={`border-l-4 ${getFactionColor()} bg-card p-4 rounded-md space-y-3 ${
          isActive ? 'ring-2 ring-ring' : ''
        }`}
        data-testid={`participant-row-${participant.id}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="shrink-0">
                {index + 1}
              </Badge>
              <Input
                value={participant.name}
                onChange={(e) => onUpdate({ ...participant, name: e.target.value })}
                className="h-8 font-medium"
                data-testid={`input-name-${participant.id}`}
              />
              <Input
                type="number"
                value={participant.initiative}
                onChange={(e) => onUpdate({ ...participant, initiative: Number(e.target.value) })}
                className="h-8 w-20"
                data-testid={`input-initiative-${participant.id}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                {editingStats && participant.faction !== 'boss' ? (
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">HP</label>
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        value={participant.hpCurr}
                        onChange={(e) => {
                          const value = Math.max(0, Number(e.target.value) || 0);
                          onUpdate({ ...participant, hpCurr: Math.min(value, participant.hpMax) });
                        }}
                        className="h-7 text-xs"
                      />
                      <span className="flex items-center text-xs">/</span>
                      <Input
                        type="number"
                        value={participant.hpMax}
                        onChange={(e) => {
                          const value = Math.max(1, Number(e.target.value) || 1);
                          onUpdate({ ...participant, hpMax: value, hpCurr: Math.min(participant.hpCurr, value) });
                        }}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <HPBar 
                    current={participant.hpCurr} 
                    max={participant.hpMax}
                    isBoss={participant.faction === 'boss'}
                    damageDealt={participant.damageDealt}
                  />
                )}
              </div>
              <div>
                {editingStats && participant.faction !== 'boss' ? (
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">MP</label>
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        value={participant.mpCurr}
                        onChange={(e) => {
                          const value = Math.max(0, Number(e.target.value) || 0);
                          onUpdate({ ...participant, mpCurr: Math.min(value, participant.mpMax) });
                        }}
                        className="h-7 text-xs"
                      />
                      <span className="flex items-center text-xs">/</span>
                      <Input
                        type="number"
                        value={participant.mpMax}
                        onChange={(e) => {
                          const value = Math.max(1, Number(e.target.value) || 1);
                          onUpdate({ ...participant, mpMax: value, mpCurr: Math.min(participant.mpCurr, value) });
                        }}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <MPBar current={participant.mpCurr} max={participant.mpMax} />
                )}
              </div>
            </div>

            {participant.isUnconscious && participant.deathSaves && (
              <DeathSaves
                deathSaves={participant.deathSaves}
                onUpdate={(ds) => onUpdate({ ...participant, deathSaves: ds })}
                onResurrect={() => {
                  // 3 successes = resurrect with 1 HP
                  onUpdate({
                    ...participant,
                    hpCurr: 1,
                    isUnconscious: false,
                    isDead: false,
                    deathSaves: { successes: 0, failures: 0 },
                  });
                }}
                onPermanentDeath={() => {
                  // 3 failures = permanent death
                  onUpdate({
                    ...participant,
                    hpCurr: 0,
                    isPermanentlyDead: true,
                    isDead: true,
                    isUnconscious: false,
                    deathSaves: { successes: 0, failures: 0 },
                  });
                }}
              />
            )}

            {participant.statuses.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {participant.statuses.map((status) => (
                  <StatusChip
                    key={status.id}
                    status={status}
                    onRemove={() => {
                      onUpdate({
                        ...participant,
                        statuses: participant.statuses.filter((s) => s.id !== status.id),
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setExpanded(!expanded)}
              data-testid={`button-expand-${participant.id}`}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditingStats(!editingStats)}
              data-testid={`button-edit-stats-${participant.id}`}
              className={editingStats ? 'bg-primary text-primary-foreground' : ''}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowStatusManager(true)}
              data-testid={`button-manage-statuses-${participant.id}`}
            >
              <Zap className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowEquipmentDialog(true)}
              data-testid={`button-manage-equipment-${participant.id}`}
            >
              <Package className="h-4 w-4" />
            </Button>
            {!participant.isDead && !participant.isPermanentlyDead ? (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  if (confirm(`Убить ${participant.name}?`)) {
                    onUpdate({
                      ...participant,
                      hpCurr: 0,
                      isDead: true,
                      isUnconscious: false,
                      deathSaves: undefined,
                    });
                  }
                }}
                data-testid={`button-kill-${participant.id}`}
              >
                <Skull className="h-4 w-4" />
              </Button>
            ) : !participant.isPermanentlyDead ? (
              <Button
                variant="outline"
                size="icon"
                className="text-chart-4"
                onClick={() => {
                  if (confirm(`Воскресить ${participant.name}?`)) {
                    onUpdate({
                      ...participant,
                      hpCurr: participant.hpMax,
                      isDead: false,
                      isUnconscious: false,
                      deathSaves: { successes: 0, failures: 0 },
                    });
                  }
                }}
                data-testid={`button-resurrect-${participant.id}`}
              >
                <Heart className="h-4 w-4" />
              </Button>
            ) : null}
            <Button
              variant="destructive"
              size="icon"
              onClick={onDelete}
              data-testid={`button-delete-${participant.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onQuickDamage(5)}
            data-testid={`button-damage-5-${participant.id}`}
          >
            -5 HP
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onQuickDamage(10)}
            data-testid={`button-damage-10-${participant.id}`}
          >
            -10 HP
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-chart-4"
            onClick={() => onQuickHeal(5)}
            data-testid={`button-heal-5-${participant.id}`}
          >
            +5 HP
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-chart-4"
            onClick={() => onQuickHeal(10)}
            data-testid={`button-heal-10-${participant.id}`}
          >
            +10 HP
          </Button>
        </div>

        {expanded && (
          <div className="space-y-3 pt-3 border-t border-border">
            {editingStats ? (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">AC</label>
                  <Input
                    type="number"
                    value={participant.ac}
                    onChange={(e) => onUpdate({ ...participant, ac: Math.max(0, Number(e.target.value) || 0) })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">СИЛ</label>
                  <Input
                    type="number"
                    value={participant.characteristics.strength}
                    onChange={(e) => onUpdate({ 
                      ...participant, 
                      characteristics: { ...participant.characteristics, strength: Math.max(0, Number(e.target.value) || 0) }
                    })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">ЛОВ</label>
                  <Input
                    type="number"
                    value={participant.characteristics.dexterity}
                    onChange={(e) => onUpdate({ 
                      ...participant, 
                      characteristics: { ...participant.characteristics, dexterity: Math.max(0, Number(e.target.value) || 0) }
                    })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">ТЕЛ</label>
                  <Input
                    type="number"
                    value={participant.characteristics.constitution}
                    onChange={(e) => onUpdate({ 
                      ...participant, 
                      characteristics: { ...participant.characteristics, constitution: Math.max(0, Number(e.target.value) || 0) }
                    })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">ИНТ</label>
                  <Input
                    type="number"
                    value={participant.characteristics.intelligence}
                    onChange={(e) => onUpdate({ 
                      ...participant, 
                      characteristics: { ...participant.characteristics, intelligence: Math.max(0, Number(e.target.value) || 0) }
                    })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">МДР</label>
                  <Input
                    type="number"
                    value={participant.characteristics.wisdom}
                    onChange={(e) => onUpdate({ 
                      ...participant, 
                      characteristics: { ...participant.characteristics, wisdom: Math.max(0, Number(e.target.value) || 0) }
                    })}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">ХАР</label>
                  <Input
                    type="number"
                    value={participant.characteristics.charisma}
                    onChange={(e) => onUpdate({ 
                      ...participant, 
                      characteristics: { ...participant.characteristics, charisma: Math.max(0, Number(e.target.value) || 0) }
                    })}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">AC:</span> {participant.ac}
                </div>
                <div>
                  <span className="text-muted-foreground">СИЛ:</span> {participant.characteristics.strength}
                </div>
                <div>
                  <span className="text-muted-foreground">ЛОВ:</span> {participant.characteristics.dexterity}
                </div>
                <div>
                  <span className="text-muted-foreground">ТЕЛ:</span> {participant.characteristics.constitution}
                </div>
                <div>
                  <span className="text-muted-foreground">ИНТ:</span> {participant.characteristics.intelligence}
                </div>
                <div>
                  <span className="text-muted-foreground">МДР:</span> {participant.characteristics.wisdom}
                </div>
                <div>
                  <span className="text-muted-foreground">ХАР:</span> {participant.characteristics.charisma}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sword className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Атаки</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 text-xs"
                  onClick={() => handleAddAction("attack")}
                  data-testid={`button-add-attack-${participant.id}`}
                >
                  <Plus className="h-3 w-3" />
                  Добавить
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {participant.attacks.map((attack) => (
                  <Badge
                    key={attack.id}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover-elevate"
                    onClick={() => handleUseAction(attack)}
                    data-testid={`badge-attack-${attack.id}`}
                  >
                    {attack.name}
                    <Edit
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAction(attack, "attack");
                      }}
                    />
                    <Trash2
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAction(attack.id, "attack");
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Умения</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 text-xs"
                  onClick={() => handleAddAction("ability")}
                  data-testid={`button-add-ability-${participant.id}`}
                >
                  <Plus className="h-3 w-3" />
                  Добавить
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {participant.abilities.map((ability) => (
                  <Badge
                    key={ability.id}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover-elevate"
                    onClick={() => handleUseAction(ability)}
                    data-testid={`badge-ability-${ability.id}`}
                  >
                    {ability.name}
                    <Edit
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAction(ability, "ability");
                      }}
                    />
                    <Trash2
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAction(ability.id, "ability");
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scroll className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Заклинания</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 text-xs"
                  onClick={() => handleAddAction("spell")}
                  data-testid={`button-add-spell-${participant.id}`}
                >
                  <Plus className="h-3 w-3" />
                  Добавить
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {participant.spells.map((spell) => (
                  <Badge
                    key={spell.id}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover-elevate"
                    onClick={() => handleUseAction(spell)}
                    data-testid={`badge-spell-${spell.id}`}
                  >
                    {spell.name}
                    <Edit
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAction(spell, "spell");
                      }}
                    />
                    <Trash2
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAction(spell.id, "spell");
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {editingAction && (
        <ActionEditor
          open={showActionEditor}
          onOpenChange={setShowActionEditor}
          action={editingAction.action}
          actionType={editingAction.type}
          onSave={handleSaveAction}
        />
      )}

      <ApplyActionDialog
        open={showApplyAction}
        onOpenChange={setShowApplyAction}
        action={applyingAction}
        caster={participant}
        targets={allParticipants.filter((p) => p.id !== participant.id && !p.isDead)}
        onApply={handleApplyActionConfirm}
      />

      <StatusManager
        open={showStatusManager}
        onOpenChange={setShowStatusManager}
        statuses={participant.statuses}
        onAdd={(status) => {
          onUpdate({
            ...participant,
            statuses: [...participant.statuses, status],
          });
        }}
        onUpdate={(status) => {
          onUpdate({
            ...participant,
            statuses: participant.statuses.map((s) => (s.id === status.id ? status : s)),
          });
        }}
        onRemove={(statusId) => {
          onUpdate({
            ...participant,
            statuses: participant.statuses.filter((s) => s.id !== statusId),
          });
        }}
      />

      <EquipmentDialog
        open={showEquipmentDialog}
        onOpenChange={setShowEquipmentDialog}
        participant={participant}
        onUpdate={onUpdate}
      />
    </>
  );
}
