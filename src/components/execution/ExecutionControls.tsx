import { useExecution } from '../../hooks/useExecution';
import { Button } from '../ui/Button';

export function ExecutionControls() {
  const { state, play, pause, step, reset, isRunning } = useExecution();

  const isFinished = state.phase === 'finished';

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Tick {state.tick}</span>
      {isRunning ? (
        <Button variant="secondary" onClick={pause}>
          Pause
        </Button>
      ) : (
        <Button variant="primary" onClick={play} disabled={isFinished}>
          Play
        </Button>
      )}
      <Button
        variant="secondary"
        onClick={step}
        disabled={isRunning || isFinished}
      >
        Step
      </Button>
      <Button variant="ghost" onClick={reset}>
        Reset
      </Button>
    </div>
  );
}
