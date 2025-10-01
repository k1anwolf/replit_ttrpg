import { useState } from 'react';
import AddParticipantDialog from '../AddParticipantDialog';
import { Button } from '@/components/ui/button';

export default function AddParticipantDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Открыть диалог
      </Button>
      <AddParticipantDialog
        open={open}
        onOpenChange={setOpen}
        onAdd={(p) => console.log('Added:', p)}
      />
    </div>
  );
}
