import { useState } from 'react';
import StatusManager from '../StatusManager';
import { Button } from '@/components/ui/button';
import type { Status } from '@shared/schema';

export default function StatusManagerExample() {
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([
    { id: '1', name: 'Отравление', duration: 3, durationType: 'rounds', description: 'Получает 5 урона в начале каждого хода' },
    { id: '2', name: 'Благословение', duration: 5, durationType: 'turns', description: 'Бонус +2 к броскам атаки' },
  ]);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Открыть менеджер статусов
      </Button>
      <StatusManager
        open={open}
        onOpenChange={setOpen}
        statuses={statuses}
        onAdd={(status) => {
          setStatuses([...statuses, status]);
          console.log('Added:', status);
        }}
        onUpdate={(status) => {
          setStatuses(statuses.map((s) => (s.id === status.id ? status : s)));
          console.log('Updated:', status);
        }}
        onRemove={(id) => {
          setStatuses(statuses.filter((s) => s.id !== id));
          console.log('Removed:', id);
        }}
      />
    </div>
  );
}
