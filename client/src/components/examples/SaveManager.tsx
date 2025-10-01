import { useState } from 'react';
import SaveManager from '../SaveManager';
import { Button } from '@/components/ui/button';
import type { SaveData } from '@shared/schema';

export default function SaveManagerExample() {
  const [open, setOpen] = useState(false);
  
  const mockSaves: SaveData[] = [
    {
      id: '1',
      name: 'Битва у Хельмовой Пади',
      description: 'Финальная битва с армией Сарумана',
      timestamp: Date.now() - 86400000,
      combatState: {
        participants: [],
        currentTurnIndex: 0,
        currentRound: 5,
        eventLog: [],
      },
      restSettings: {
        shortRest: { hpPercent: 50, mpPercent: 50 },
        longRest: { hpPercent: 100, mpPercent: 100 },
      },
    },
    {
      id: '2',
      name: 'Дракон в Одинокой горе',
      description: 'Встреча со Смаугом',
      timestamp: Date.now() - 172800000,
      combatState: {
        participants: [],
        currentTurnIndex: 0,
        currentRound: 1,
        eventLog: [],
      },
      restSettings: {
        shortRest: { hpPercent: 50, mpPercent: 50 },
        longRest: { hpPercent: 100, mpPercent: 100 },
      },
    },
  ];

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Открыть менеджер сохранений
      </Button>
      <SaveManager
        open={open}
        onOpenChange={setOpen}
        saves={mockSaves}
        onLoad={(save) => console.log('Load:', save.name)}
        onDelete={(id) => console.log('Delete:', id)}
        onSave={(name, desc) => console.log('Save:', name, desc)}
        onExport={(save) => console.log('Export:', save.name)}
        onImport={() => console.log('Import')}
      />
    </div>
  );
}
