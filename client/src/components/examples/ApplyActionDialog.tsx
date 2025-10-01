import { useState } from 'react';
import ApplyActionDialog from '../ApplyActionDialog';
import { Button } from '@/components/ui/button';
import type { Action, Participant } from '@shared/schema';

export default function ApplyActionDialogExample() {
  const [open, setOpen] = useState(false);

  const action: Action = {
    id: '1',
    name: 'Огненный шар',
    type: 'spell',
    cooldown: 3,
    currentCooldown: 0,
    description: 'Метает огненный шар, наносящий урон всем врагам в области',
    effects: [
      { id: 'e1', type: 'damage', value: 30 },
      { id: 'e2', type: 'addStatus', statusName: 'Горение', statusDuration: 2, statusDurationType: 'rounds' },
    ],
  };

  const caster: Participant = {
    id: '1',
    name: 'Гэндальф',
    initiative: 15,
    faction: 'player',
    hpMax: 80,
    hpCurr: 70,
    mpMax: 100,
    mpCurr: 60,
    ac: 14,
    skills: [],
    characteristics: { strength: 10, dexterity: 12, constitution: 14, intelligence: 18, wisdom: 16, charisma: 15 },
    attacks: [],
    abilities: [],
    spells: [],
    statuses: [],
    isDead: false,
    isUnconscious: false,
  };

  const targets: Participant[] = [
    {
      id: '2',
      name: 'Орк 1',
      initiative: 12,
      faction: 'npc',
      hpMax: 60,
      hpCurr: 60,
      mpMax: 0,
      mpCurr: 0,
      ac: 13,
      skills: [],
      characteristics: { strength: 14, dexterity: 10, constitution: 16, intelligence: 8, wisdom: 8, charisma: 6 },
      attacks: [],
      abilities: [],
      spells: [],
      statuses: [],
      isDead: false,
      isUnconscious: false,
    },
    {
      id: '3',
      name: 'Орк 2',
      initiative: 11,
      faction: 'npc',
      hpMax: 60,
      hpCurr: 45,
      mpMax: 0,
      mpCurr: 0,
      ac: 13,
      skills: [],
      characteristics: { strength: 14, dexterity: 10, constitution: 16, intelligence: 8, wisdom: 8, charisma: 6 },
      attacks: [],
      abilities: [],
      spells: [],
      statuses: [],
      isDead: false,
      isUnconscious: false,
    },
  ];

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Открыть применение действия
      </Button>
      <ApplyActionDialog
        open={open}
        onOpenChange={setOpen}
        action={action}
        caster={caster}
        targets={targets}
        onApply={(targetIds, customValues) => console.log('Apply to:', targetIds, customValues)}
      />
    </div>
  );
}
