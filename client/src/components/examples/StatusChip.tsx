import StatusChip from '../StatusChip';

export default function StatusChipExample() {
  const statuses = [
    { id: '1', name: 'Отравлен', duration: 3, durationType: 'rounds' as const, description: '' },
    { id: '2', name: 'Благословение', duration: 5, durationType: 'turns' as const },
    { id: '3', name: 'Ослеплён', duration: 1, durationType: 'rounds' as const },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-card rounded-lg">
      {statuses.map(status => (
        <StatusChip
          key={status.id}
          status={status}
          onRemove={() => console.log('Remove', status.name)}
        />
      ))}
    </div>
  );
}
