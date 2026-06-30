import type { TimelineSegment } from './timeline';

export type ThreadStatus = 'idle' | 'running' | 'blocked' | 'done';

export type EnginePhase = 'idle' | 'running' | 'paused' | 'finished';

export type LoopFrame = {
  loopBlockIndex: number;
  bodyStart: number;
  bodyEnd: number;
  remaining: number;
};

export type MutexFrame = {
  mutexBlockIndex: number;
  bodyStart: number;
  bodyEnd: number;
  mutexName: string;
};

export type MutexEntry = {
  ownerLaneId: string | null;
  waitingLaneIds: string[];
};

export type MutexRegistry = Record<string, MutexEntry>;

export type ThreadState = {
  laneId: string;
  pc: number;
  status: ThreadStatus;
  loopStack: LoopFrame[];
  mutexStack: MutexFrame[];
};

export type EngineState = {
  variables: Record<string, number>;
  threads: Record<string, ThreadState>;
  mutexes: MutexRegistry;
  tick: number;
  phase: EnginePhase;
  timeline: TimelineSegment[];
};

export type SharedVariables = Record<string, number>;
