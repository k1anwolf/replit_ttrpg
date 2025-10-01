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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { Action, Effect, EffectType } from "@shared/schema";

interface ActionEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: Action;
  onSave: (action: Action) => void;
  actionType: "attack" | "ability" | "spell";
}

export default function ActionEditor({
  open,
  onOpenChange,
  action,
  onSave,
  actionType,
}: ActionEditorProps) {
  const [name, setName] = useState(action?.name || "");
  const [description, setDescription] = useState(action?.description || "");
  const [cooldown, setCooldown] = useState(action?.cooldown.toString() || "0");
  const [effects, setEffects] = useState<Effect[]>(action?.effects || []);

  const getActionTypeLabel = () => {
    switch (actionType) {
      case "attack": return "Атака";
      case "ability": return "Умение";
      case "spell": return "Заклинание";
    }
  };

  const addEffect = () => {
    const newEffect: Effect = {
      id: Date.now().toString(),
      type: "damage",
      value: 0,
    };
    setEffects([...effects, newEffect]);
  };

  const removeEffect = (id: string) => {
    setEffects(effects.filter((e) => e.id !== id));
  };

  const updateEffect = (id: string, updates: Partial<Effect>) => {
    setEffects(effects.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const getEffectTypeLabel = (type: EffectType) => {
    switch (type) {
      case "damage": return "Урон";
      case "heal": return "Лечение";
      case "restoreMP": return "Восстановление MP";
      case "addStatus": return "Наложить статус";
      case "removeStatus": return "Снять статус";
      case "customDamage": return "Урон (ручной ввод)";
      case "customHeal": return "Лечение (ручной ввод)";
    }
  };

  const handleSave = () => {
    const savedAction: Action = {
      id: action?.id || Date.now().toString(),
      name: name || `Новое действие`,
      type: actionType,
      cooldown: Number(cooldown),
      currentCooldown: action?.currentCooldown || 0,
      description,
      effects,
    };
    onSave(savedAction);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    if (!action) {
      setName("");
      setDescription("");
      setCooldown("0");
      setEffects([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dialog-action-editor">
        <DialogHeader>
          <DialogTitle>
            {action ? `Редактировать ${getActionTypeLabel()}` : `Создать ${getActionTypeLabel()}`}
          </DialogTitle>
          <DialogDescription>
            Настройте параметры и эффекты действия
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action-name">Название</Label>
            <Input
              id="action-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Огненный шар"
              data-testid="input-action-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action-cooldown">Перезарядка (раундов)</Label>
            <Input
              id="action-cooldown"
              type="number"
              value={cooldown}
              onChange={(e) => setCooldown(e.target.value)}
              data-testid="input-action-cooldown"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action-description">Описание</Label>
            <Textarea
              id="action-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание действия..."
              rows={2}
              data-testid="input-action-description"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Эффекты</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addEffect}
                data-testid="button-add-effect"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить эффект
              </Button>
            </div>

            <div className="space-y-2">
              {effects.map((effect) => (
                <Card key={effect.id} className="p-3 space-y-3" data-testid={`effect-card-${effect.id}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Тип эффекта</Label>
                          <Select
                            value={effect.type}
                            onValueChange={(v) => updateEffect(effect.id, { type: v as EffectType })}
                          >
                            <SelectTrigger className="h-8" data-testid={`select-effect-type-${effect.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="damage">Урон</SelectItem>
                              <SelectItem value="heal">Лечение</SelectItem>
                              <SelectItem value="restoreMP">Восстановление MP</SelectItem>
                              <SelectItem value="addStatus">Наложить статус</SelectItem>
                              <SelectItem value="removeStatus">Снять статус</SelectItem>
                              <SelectItem value="customDamage">Урон (ручной)</SelectItem>
                              <SelectItem value="customHeal">Лечение (ручное)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(effect.type === "damage" || 
                          effect.type === "heal" || 
                          effect.type === "restoreMP") && (
                          <div className="space-y-1">
                            <Label className="text-xs">Значение</Label>
                            <Input
                              type="number"
                              value={effect.value || 0}
                              onChange={(e) => updateEffect(effect.id, { value: Number(e.target.value) })}
                              className="h-8"
                              data-testid={`input-effect-value-${effect.id}`}
                            />
                          </div>
                        )}
                      </div>

                      {effect.type === "addStatus" && (
                        <div className="space-y-2">
                          <Input
                            placeholder="Название статуса"
                            value={effect.statusName || ""}
                            onChange={(e) => updateEffect(effect.id, { statusName: e.target.value })}
                            className="h-8"
                            data-testid={`input-status-name-${effect.id}`}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              placeholder="Длительность"
                              value={effect.statusDuration || 0}
                              onChange={(e) => updateEffect(effect.id, { statusDuration: Number(e.target.value) })}
                              className="h-8"
                              data-testid={`input-status-duration-${effect.id}`}
                            />
                            <Select
                              value={effect.statusDurationType || "rounds"}
                              onValueChange={(v) => updateEffect(effect.id, { statusDurationType: v as "rounds" | "turns" })}
                            >
                              <SelectTrigger className="h-8" data-testid={`select-status-duration-type-${effect.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rounds">Раунды</SelectItem>
                                <SelectItem value="turns">Ходы</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            placeholder="Описание статуса"
                            value={effect.statusDescription || ""}
                            onChange={(e) => updateEffect(effect.id, { statusDescription: e.target.value })}
                            className="h-8"
                            data-testid={`input-status-description-${effect.id}`}
                          />
                        </div>
                      )}

                      {effect.type === "removeStatus" && (
                        <Input
                          placeholder="Название статуса для снятия"
                          value={effect.statusName || ""}
                          onChange={(e) => updateEffect(effect.id, { statusName: e.target.value })}
                          className="h-8"
                          data-testid={`input-remove-status-name-${effect.id}`}
                        />
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => removeEffect(effect.id)}
                      data-testid={`button-remove-effect-${effect.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}

              {effects.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Нет эффектов. Добавьте эффект для создания действия.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-action">
            Отмена
          </Button>
          <Button onClick={handleSave} data-testid="button-save-action">
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
