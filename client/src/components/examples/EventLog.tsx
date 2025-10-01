import EventLog from '../EventLog';
import type { EventLog as EventLogType } from '@shared/schema';

export default function EventLogExample() {
  const events: EventLogType[] = [
    { id: '1', timestamp: Date.now() - 10000, message: 'Начало раунда 1', type: 'round' },
    { id: '2', timestamp: Date.now() - 8000, message: 'Ход Арагорна', type: 'turn' },
    { id: '3', timestamp: Date.now() - 6000, message: 'Арагорн атакует орка: 15 урона', type: 'damage' },
    { id: '4', timestamp: Date.now() - 4000, message: 'Орк получает статус "Раненый"', type: 'status' },
    { id: '5', timestamp: Date.now() - 2000, message: 'Гэндальф лечит Арагорна: +10 HP', type: 'heal' },
  ];

  return (
    <div className="h-96">
      <EventLog events={events} onClear={() => console.log('Clear log')} />
    </div>
  );
}
