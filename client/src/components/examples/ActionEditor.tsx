import { useState } from 'react';
import ActionEditor from '../ActionEditor';
import { Button } from '@/components/ui/button';

export default function ActionEditorExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Открыть редактор действий
      </Button>
      <ActionEditor
        open={open}
        onOpenChange={setOpen}
        actionType="spell"
        onSave={(action) => console.log('Saved:', action)}
      />
    </div>
  );
}
