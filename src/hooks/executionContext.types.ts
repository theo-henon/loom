import type { EngineState } from '../types/execution';
import type { ExecutionSpeed } from '../types/executionSpeed';

export type ExecutionContextValue = {
  state: EngineState;
  play: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
  isRunning: boolean;
  speed: ExecutionSpeed;
  setSpeed: (speed: ExecutionSpeed) => void;
};
