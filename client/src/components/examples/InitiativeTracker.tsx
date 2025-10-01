import InitiativeTracker from '../InitiativeTracker';
import type { Participant } from '@shared/schema';

export default function InitiativeTrackerExample() {
  const participants: Participant[] = [
    {
      id: '1',
      name: 'Арагорн',
      initiative: 18,
      faction: 'player',
      hpMax: 100,
      hpCurr: 80,
      mpMax: 50,
      mpCurr: 30,
      ac: 16,
      skills: [],
      characteristics: { strength: 16, dexterity: 14, constitution: 15, intelligence: 10, wisdom: 12, charisma: 14 },
      attacks: [],
      abilities: [],
      spells: [],
      statuses: [],
      isDead: false,
      isUnconscious: false,
    },
    {
      id: '2',
      name: 'Орк',
      initiative: 12,
      faction: 'npc',
      hpMax: 60,
      hpCurr: 30,
      mpMax: 0,
      mpCurr: 0,
      ac: 14,
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
      name: 'Дракон',
      initiative: 20,
      faction: 'boss',
      hpMax: 300,
      hpCurr: 250,
      mpMax: 150,
      mpCurr: 100,
      ac: 20,
      skills: [],
      characteristics: { strength: 20, dexterity: 12, constitution: 20, intelligence: 16, wisdom: 14, charisma: 18 },
      attacks: [],
      abilities: [],
      spells: [],
      statuses: [],
      isDead: false,
      isUnconscious: false,
    },
  ];

  return (
    <div className="max-w-sm">
      <InitiativeTracker participants={participants} currentTurnIndex={0} />
    </div>
  );
}
