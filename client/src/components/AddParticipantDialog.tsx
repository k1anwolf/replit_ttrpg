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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Participant, Faction } from "@shared/schema";

interface AddParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (participant: Participant) => void;
}

export default function AddParticipantDialog({ open, onOpenChange, onAdd }: AddParticipantDialogProps) {
  const [name, setName] = useState("");
  const [initiative, setInitiative] = useState("10");
  const [faction, setFaction] = useState<Faction>("player");
  const [hp, setHp] = useState("50");
  const [mp, setMp] = useState("20");
  const [ac, setAc] = useState("15");

  const handleAdd = () => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: name || "Новый персонаж",
      initiative: Number(initiative),
      faction,
      hpMax: Number(hp),
      hpCurr: Number(hp),
      mpMax: Number(mp),
      mpCurr: Number(mp),
      ac: Number(ac),
      skills: [],
      characteristics: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      attacks: [],
      abilities: [],
      spells: [],
      statuses: [],
      isDead: false,
      isUnconscious: false,
      isPermanentlyDead: false,
      damageDealt: 0,
    };

    onAdd(newParticipant);
    setName("");
    setInitiative("10");
    setFaction("player");
    setHp("50");
    setMp("20");
    setAc("15");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-add-participant">
        <DialogHeader>
          <DialogTitle>Добавить участника</DialogTitle>
          <DialogDescription>
            Создайте нового участника боя
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя"
              data-testid="input-participant-name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initiative">Инициатива</Label>
              <Input
                id="initiative"
                type="number"
                value={initiative}
                onChange={(e) => setInitiative(e.target.value)}
                data-testid="input-participant-initiative"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faction">Фракция</Label>
              <Select value={faction} onValueChange={(v) => setFaction(v as Faction)}>
                <SelectTrigger id="faction" data-testid="select-participant-faction">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="player">Игрок</SelectItem>
                  <SelectItem value="npc">НПС</SelectItem>
                  <SelectItem value="boss">Босс</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hp">HP</Label>
              <Input
                id="hp"
                type="number"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                data-testid="input-participant-hp"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mp">MP</Label>
              <Input
                id="mp"
                type="number"
                value={mp}
                onChange={(e) => setMp(e.target.value)}
                data-testid="input-participant-mp"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ac">AC</Label>
              <Input
                id="ac"
                type="number"
                value={ac}
                onChange={(e) => setAc(e.target.value)}
                data-testid="input-participant-ac"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-add">
            Отмена
          </Button>
          <Button onClick={handleAdd} data-testid="button-confirm-add">
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
