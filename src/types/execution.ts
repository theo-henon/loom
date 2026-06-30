import type { Block } from './blocks';
import type { TimelineSegment } from './timeline';

export type ThreadStatus = 'idle' | 'running' | 'blocked' | 'done';

export type EnginePhase = 'idle' | 'running' | 'paused' | 'finished';

export type FrameKind =
  'root' | 'loop-body' | 'condition-body' | 'condition-else-body';

export type ExecutionFrame = {
  blocks: Block[];
  pc: number;
  kind: FrameKind;
};

export type LoopFrame = {
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
  status: ThreadStatus;
  frames: ExecutionFrame[];
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
