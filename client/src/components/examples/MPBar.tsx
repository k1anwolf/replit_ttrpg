import MPBar from '../MPBar';

export default function MPBarExample() {
  return (
    <div className="space-y-4 p-4 bg-card rounded-lg max-w-xs">
      <MPBar current={50} max={100} />
      <MPBar current={25} max={50} />
      <MPBar current={0} max={0} />
    </div>
  );
}
