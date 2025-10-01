import { useState } from 'react';
import DeathSaves from '../DeathSaves';

export default function DeathSavesExample() {
  const [deathSaves, setDeathSaves] = useState({ successes: 1, failures: 2 });

  return (
    <div className="p-4 bg-card rounded-lg max-w-xs">
      <DeathSaves deathSaves={deathSaves} onUpdate={setDeathSaves} />
    </div>
  );
}
