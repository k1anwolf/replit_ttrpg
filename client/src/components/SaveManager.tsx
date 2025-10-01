import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Save, Trash2, Download, Upload, Search } from "lucide-react";
import type { SaveData } from "@shared/schema";

interface SaveManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saves: SaveData[];
  onLoad: (save: SaveData) => void;
  onDelete: (id: string) => void;
  onSave: (name: string, description: string) => void;
  onExport: (save: SaveData) => void;
  onImport: () => void;
}

export default function SaveManager({
  open,
  onOpenChange,
  saves,
  onLoad,
  onDelete,
  onSave,
  onExport,
  onImport,
}: SaveManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [saveName, setSaveName] = useState("");
  const [saveDescription, setSaveDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredSaves = saves.filter((save) =>
    save.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    save.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    onSave(saveName || "Сохранение без названия", saveDescription);
    setSaveName("");
    setSaveDescription("");
    setShowCreateForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]" data-testid="dialog-save-manager">
        <DialogHeader>
          <DialogTitle>Менеджер сохранений</DialogTitle>
          <DialogDescription>
            Управляйте сохранениями боёв
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск сохранений..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-saves"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(!showCreateForm)}
              data-testid="button-new-save"
            >
              <Save className="h-4 w-4 mr-2" />
              Новое
            </Button>
            <Button
              variant="outline"
              onClick={onImport}
              data-testid="button-import-save"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>

          {showCreateForm && (
            <Card className="p-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="save-name">Название</Label>
                <Input
                  id="save-name"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Битва у Хельмовой Пади"
                  data-testid="input-save-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="save-description">Описание</Label>
                <Textarea
                  id="save-description"
                  value={saveDescription}
                  onChange={(e) => setSaveDescription(e.target.value)}
                  placeholder="Краткое описание боя..."
                  rows={2}
                  data-testid="input-save-description"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSave} data-testid="button-confirm-save">
                  Сохранить
                </Button>
              </div>
            </Card>
          )}

          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredSaves.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Нет сохранений
                </p>
              ) : (
                filteredSaves.map((save) => (
                  <Card key={save.id} className="p-4 hover-elevate" data-testid={`save-item-${save.id}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium">{save.name}</h4>
                        {save.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {save.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(save.timestamp).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onLoad(save)}
                          data-testid={`button-load-save-${save.id}`}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onExport(save)}
                          data-testid={`button-export-save-${save.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => onDelete(save.id)}
                          data-testid={`button-delete-save-${save.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
