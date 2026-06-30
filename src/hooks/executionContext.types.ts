import type { EngineState } from '../types/execution';

export type ExecutionContextValue = {
  state: EngineState;
  play: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
  isRunning: boolean;
};
