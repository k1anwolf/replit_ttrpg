import HPBar from '../HPBar';

export default function HPBarExample() {
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg max-w-xs">
      <HPBar current={80} max={100} />
      <HPBar current={45} max={100} />
      <HPBar current={15} max={100} />
      <HPBar current={120} max={200} isBoss />
    </div>
  );
}
