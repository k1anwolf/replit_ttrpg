import { useState } from 'react';
import ParticipantRow from '../ParticipantRow';
import type { Participant } from '@shared/schema';

export default function ParticipantRowExample() {
  const [participant, setParticipant] = useState<Participant>({
    id: '1',
    name: 'Арагорн',
    initiative: 18,
    faction: 'player',
    hpMax: 100,
    hpCurr: 65,
    mpMax: 50,
    mpCurr: 30,
    ac: 16,
    skills: ['Скрытность', 'Атлетика'],
    characteristics: {
      strength: 16,
      dexterity: 14,
      constitution: 15,
      intelligence: 10,
      wisdom: 12,
      charisma: 14,
    },
    attacks: [
      { id: 'a1', name: 'Удар мечом', type: 'attack', cooldown: 0, currentCooldown: 0, effects: [{ id: 'e1', type: 'damage', value: 15 }] },
    ],
    abilities: [
      { id: 'ab1', name: 'Второе дыхание', type: 'ability', cooldown: 3, currentCooldown: 0, effects: [{ id: 'e2', type: 'heal', value: 20 }] },
    ],
    spells: [],
    statuses: [
      { id: 's1', name: 'Благословение', duration: 5, durationType: 'turns' },
    ],
    isDead: false,
    isUnconscious: false,
  });

  const allParticipants: Participant[] = [
    participant,
    {
      id: '2',
      name: 'Орк',
      initiative: 12,
      faction: 'npc',
      hpMax: 60,
      hpCurr: 40,
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
    <div className="max-w-2xl">
      <ParticipantRow
        participant={participant}
        index={0}
        isActive={true}
        allParticipants={allParticipants}
        onUpdate={setParticipant}
        onDelete={() => console.log('Delete')}
        onQuickDamage={(amt) => {
          setParticipant(p => ({ ...p, hpCurr: Math.max(0, p.hpCurr - amt) }));
          console.log(`Damage: ${amt}`);
        }}
        onQuickHeal={(amt) => {
          setParticipant(p => ({ ...p, hpCurr: Math.min(p.hpMax, p.hpCurr + amt) }));
          console.log(`Heal: ${amt}`);
        }}
        onApplyAction={(action, targetIds, customValues) => {
          console.log('Apply action:', action.name, 'to targets:', targetIds, customValues);
        }}
      />
    </div>
  );
}
