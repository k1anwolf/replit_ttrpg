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
import { Plus, Trash2, Edit } from "lucide-react";
import type { Status } from "@shared/schema";

interface StatusManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statuses: Status[];
  onAdd: (status: Status) => void;
  onUpdate: (status: Status) => void;
  onRemove: (statusId: string) => void;
}

export default function StatusManager({
  open,
  onOpenChange,
  statuses,
  onAdd,
  onUpdate,
  onRemove,
}: StatusManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("1");
  const [durationType, setDurationType] = useState<"rounds" | "turns">("rounds");
  const [description, setDescription] = useState("");

  const handleEdit = (status: Status) => {
    setEditingStatus(status);
    setName(status.name);
    setDuration(status.duration.toString());
    setDurationType(status.durationType);
    setDescription(status.description || "");
    setShowForm(true);
  };

  const handleSave = () => {
    if (!name) return;

    const status: Status = {
      id: editingStatus?.id || Date.now().toString(),
      name,
      duration: Number(duration),
      durationType,
      description,
    };

    if (editingStatus) {
      onUpdate(status);
    } else {
      onAdd(status);
    }

    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingStatus(null);
    setName("");
    setDuration("1");
    setDurationType("rounds");
    setDescription("");
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dialog-status-manager">
        <DialogHeader>
          <DialogTitle>Управление статусами</DialogTitle>
          <DialogDescription>
            Добавляйте, редактируйте или удаляйте статусы участника
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showForm ? (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowForm(true)}
                data-testid="button-add-status"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить статус
              </Button>

              <div className="space-y-2">
                {statuses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Нет активных статусов
                  </p>
                ) : (
                  statuses.map((status) => (
                    <Card key={status.id} className="p-3" data-testid={`status-card-${status.id}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{status.name}</span>
                            <span className="text-sm text-muted-foreground">
                              ({status.duration} {status.durationType === "rounds" ? "раунда" : "хода"})
                            </span>
                          </div>
                          {status.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {status.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(status)}
                            data-testid={`button-edit-status-${status.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onRemove(status.id)}
                            data-testid={`button-remove-status-${status.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </>
          ) : (
            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status-name">Название</Label>
                <Input
                  id="status-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Отравление"
                  data-testid="input-status-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status-duration">Длительность</Label>
                  <Input
                    id="status-duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    data-testid="input-status-duration"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status-duration-type">Тип</Label>
                  <Select value={durationType} onValueChange={(v) => setDurationType(v as "rounds" | "turns")}>
                    <SelectTrigger id="status-duration-type" data-testid="select-status-duration-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rounds">Раунды</SelectItem>
                      <SelectItem value="turns">Ходы</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-description">Описание</Label>
                <Textarea
                  id="status-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Описание эффекта статуса..."
                  rows={2}
                  data-testid="input-status-description"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel} data-testid="button-cancel-status">
                  Отмена
                </Button>
                <Button onClick={handleSave} data-testid="button-save-status">
                  {editingStatus ? "Обновить" : "Добавить"}
                </Button>
              </div>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-close-status-manager">
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
