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
import { Trash2, Plus, Edit } from "lucide-react";
import type { Participant, EquipmentSlot, EquipmentItem, Status } from "@shared/schema";

interface EquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: Participant;
  onUpdate: (participant: Participant) => void;
}

const EQUIPMENT_SLOTS: { key: EquipmentSlot; label: string }[] = [
  { key: "head", label: "Голова" },
  { key: "chest", label: "Торс" },
  { key: "legs", label: "Ноги" },
  { key: "feet", label: "Ступни" },
  { key: "hands", label: "Руки" },
  { key: "weapon", label: "Оружие" },
  { key: "offhand", label: "Второе оружие/Щит" },
  { key: "accessory1", label: "Аксессуар 1" },
  { key: "accessory2", label: "Аксессуар 2" },
];

export default function EquipmentDialog({ open, onOpenChange, participant, onUpdate }: EquipmentDialogProps) {
  const [editingSlot, setEditingSlot] = useState<EquipmentSlot | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [bonuses, setBonuses] = useState<Status[]>([]);
  const [editingBonusIndex, setEditingBonusIndex] = useState<number | null>(null);
  const [bonusName, setBonusName] = useState("");
  const [bonusDescription, setBonusDescription] = useState("");

  const equipment = participant.equipment || {};

  const startEditingSlot = (slot: EquipmentSlot) => {
    const existing = equipment[slot];
    setEditingSlot(slot);
    setItemName(existing?.name || "");
    setItemDescription(existing?.description || "");
    setBonuses(existing?.bonuses || []);
    setEditingBonusIndex(null);
  };

  const cancelEditingSlot = () => {
    setEditingSlot(null);
    setItemName("");
    setItemDescription("");
    setBonuses([]);
    setEditingBonusIndex(null);
  };

  const saveSlot = () => {
    if (!editingSlot) return;

    const newEquipment = { ...equipment };
    
    if (itemName.trim()) {
      newEquipment[editingSlot] = {
        id: equipment[editingSlot]?.id || `eq-${Date.now()}`,
        name: itemName,
        slot: editingSlot,
        bonuses: bonuses,
        description: itemDescription || undefined,
      };
    } else {
      delete newEquipment[editingSlot];
    }

    syncEquipmentBonusesToStatuses(newEquipment);
    cancelEditingSlot();
  };

  const removeEquipment = (slot: EquipmentSlot) => {
    const newEquipment = { ...equipment };
    delete newEquipment[slot];
    syncEquipmentBonusesToStatuses(newEquipment);
  };

  const syncEquipmentBonusesToStatuses = (newEquipment: Record<string, EquipmentItem>) => {
    const nonEquipmentStatuses = participant.statuses.filter(
      (s) => !s.description?.startsWith("[Снаряжение]")
    );

    const equipmentStatuses: Status[] = [];
    Object.values(newEquipment).forEach((item) => {
      item.bonuses.forEach((bonus) => {
        equipmentStatuses.push({
          ...bonus,
          id: `${item.id}-${bonus.id}`,
          description: `[Снаряжение: ${item.name}] ${bonus.description || ""}`,
          durationType: "untilRemoved",
        });
      });
    });

    onUpdate({
      ...participant,
      equipment: newEquipment,
      statuses: [...nonEquipmentStatuses, ...equipmentStatuses],
    });
  };

  const startAddingBonus = () => {
    setEditingBonusIndex(-1);
    setBonusName("");
    setBonusDescription("");
  };

  const startEditingBonus = (index: number) => {
    const bonus = bonuses[index];
    setEditingBonusIndex(index);
    setBonusName(bonus.name);
    setBonusDescription(bonus.description || "");
  };

  const saveBonus = () => {
    if (!bonusName.trim()) return;

    const newBonus: Status = {
      id: editingBonusIndex !== null && editingBonusIndex >= 0 
        ? bonuses[editingBonusIndex].id 
        : `bonus-${Date.now()}`,
      name: bonusName,
      duration: 0,
      durationType: "untilRemoved",
      description: bonusDescription || undefined,
    };

    if (editingBonusIndex === -1) {
      setBonuses([...bonuses, newBonus]);
    } else if (editingBonusIndex !== null) {
      const updated = [...bonuses];
      updated[editingBonusIndex] = newBonus;
      setBonuses(updated);
    }

    setEditingBonusIndex(null);
    setBonusName("");
    setBonusDescription("");
  };

  const removeBonus = (index: number) => {
    setBonuses(bonuses.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dialog-equipment">
        <DialogHeader>
          <DialogTitle>Снаряжение: {participant.name}</DialogTitle>
          <DialogDescription>
            Управляйте снаряжением персонажа. Бонусы автоматически добавляются как статусы.
          </DialogDescription>
        </DialogHeader>

        {editingSlot === null ? (
          <div className="space-y-2">
            {EQUIPMENT_SLOTS.map(({ key, label }) => {
              const item = equipment[key];
              return (
                <div key={key} className="flex items-center gap-2 p-2 border border-border rounded-md">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-muted-foreground">{label}</div>
                    {item ? (
                      <div>
                        <div className="text-sm font-semibold">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        )}
                        {item.bonuses.length > 0 && (
                          <div className="text-xs text-primary">
                            Бонусы: {item.bonuses.map((b) => b.name).join(", ")}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic">Не экипировано</div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => startEditingSlot(key)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {item && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeEquipment(key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Название предмета</Label>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Например: Шлем защитника"
              />
            </div>

            <div className="space-y-2">
              <Label>Описание</Label>
              <Input
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="Описание предмета"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Бонусы</Label>
                <Button variant="outline" size="sm" onClick={startAddingBonus}>
                  <Plus className="h-3 w-3 mr-1" />
                  Добавить бонус
                </Button>
              </div>

              {editingBonusIndex !== null ? (
                <div className="p-3 border border-primary rounded-md space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Название бонуса</Label>
                    <Input
                      value={bonusName}
                      onChange={(e) => setBonusName(e.target.value)}
                      placeholder="Например: +2 AC"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Описание</Label>
                    <Input
                      value={bonusDescription}
                      onChange={(e) => setBonusDescription(e.target.value)}
                      placeholder="Описание бонуса"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveBonus}>
                      Сохранить
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setEditingBonusIndex(null);
                      setBonusName("");
                      setBonusDescription("");
                    }}>
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {bonuses.map((bonus, index) => (
                    <div key={bonus.id} className="flex items-center gap-2 p-2 border border-border rounded-md">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{bonus.name}</div>
                        {bonus.description && (
                          <div className="text-xs text-muted-foreground">{bonus.description}</div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => startEditingBonus(index)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeBonus(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={cancelEditingSlot}>
                Отмена
              </Button>
              <Button onClick={saveSlot}>
                Сохранить
              </Button>
            </DialogFooter>
          </div>
        )}

        {editingSlot === null && (
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
