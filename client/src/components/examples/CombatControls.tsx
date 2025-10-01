import CombatControls from '../CombatControls';

export default function CombatControlsExample() {
  return (
    <div className="max-w-sm">
      <CombatControls
        currentRound={3}
        currentTurnIndex={1}
        totalParticipants={5}
        onPreviousTurn={() => console.log('Previous turn')}
        onNextTurn={() => console.log('Next turn')}
        onResetCombat={() => console.log('Reset combat')}
        onShortRest={() => console.log('Short rest')}
        onLongRest={() => console.log('Long rest')}
        onViewHistory={() => console.log('View history')}
      />
    </div>
  );
}
