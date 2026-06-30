export type ThreadStatus = 'idle' | 'running' | 'blocked' | 'done';

export type EnginePhase = 'idle' | 'running' | 'paused' | 'finished';

export type LoopFrame = {
  loopBlockIndex: number;
  bodyStart: number;
  bodyEnd: number;
  remaining: number;
};

export type ThreadState = {
  laneId: string;
  pc: number;
  status: ThreadStatus;
  loopStack: LoopFrame[];
};

export type EngineState = {
  variables: Record<string, number>;
  threads: Record<string, ThreadState>;
  tick: number;
  phase: EnginePhase;
};

export type SharedVariables = Record<string, number>;
