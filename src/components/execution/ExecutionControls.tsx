import { useExecution } from '../../hooks/useExecution';
import { EXECUTION_SPEED_OPTIONS } from '../../types/executionSpeed';
import { Button } from '../ui/Button';

export function ExecutionControls() {
  const { state, play, pause, step, reset, isRunning, speed, setSpeed } =
    useExecution();

  const isFinished = state.phase === 'finished';

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-1 text-xs text-gray-500">
        Vitesse
        <select
          className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700"
          value={speed}
          onChange={(event) => setSpeed(event.target.value as typeof speed)}
          aria-label="Vitesse d'exécution"
        >
          {EXECUTION_SPEED_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
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
