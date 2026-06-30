import type { Block } from '../types/blocks';
import type { Lane } from '../types/lane';
import type {
  EnginePhase,
  EngineState,
  LoopFrame,
  MutexFrame,
  MutexRegistry,
  ThreadState,
} from '../types/execution';
import { appendTimelineForTick } from './timeline';
import { evaluateCondition, executeBlock } from './blockSemantics';
import { createMutexRegistry, releaseMutex, tryAcquireMutex } from './mutex';

function createThreadState(laneId: string): ThreadState {
  return {
    laneId,
    pc: 0,
    status: 'idle',
    loopStack: [],
    mutexStack: [],
  };
}

function cloneMutexRegistry(registry: MutexRegistry): MutexRegistry {
  return Object.fromEntries(
    Object.entries(registry).map(([name, entry]) => [
      name,
      {
        ownerLaneId: entry.ownerLaneId,
        waitingLaneIds: [...entry.waitingLaneIds],
      },
    ]),
  );
}

export function createEngineState(lanes: Lane[]): EngineState {
  const threads: Record<string, ThreadState> = {};
  for (const lane of lanes) {
    threads[lane.id] = createThreadState(lane.id);
  }

  return {
    variables: {},
    threads,
    mutexes: createMutexRegistry(),
    tick: 0,
    phase: 'idle',
    timeline: [],
  };
}

function handleLoopEnd(thread: ThreadState, blocksLength: number): ThreadState {
  const frame = thread.loopStack[thread.loopStack.length - 1];
  if (!frame) {
    return { ...thread, status: 'done' };
  }

  const remaining = frame.remaining - 1;
  if (remaining > 0) {
    const updatedFrame: LoopFrame = { ...frame, remaining };
    return {
      ...thread,
      pc: frame.bodyStart,
      loopStack: [...thread.loopStack.slice(0, -1), updatedFrame],
    };
  }

  const nextThread = {
    ...thread,
    pc: frame.bodyEnd,
    loopStack: thread.loopStack.slice(0, -1),
  };

  if (nextThread.pc >= blocksLength) {
    return { ...nextThread, status: 'done' };
  }

  return nextThread;
}

function handleMutexEnd(
  thread: ThreadState,
  blocksLength: number,
  mutexes: MutexRegistry,
): ThreadState {
  const frame = thread.mutexStack[thread.mutexStack.length - 1];
  if (!frame) {
    return thread;
  }

  releaseMutex(mutexes, frame.mutexName, thread.laneId);

  const nextThread: ThreadState = {
    ...thread,
    pc: frame.bodyEnd,
    mutexStack: thread.mutexStack.slice(0, -1),
  };

  if (nextThread.pc >= blocksLength) {
    return handleLoopEnd(nextThread, blocksLength);
  }

  const loopFrame = nextThread.loopStack[nextThread.loopStack.length - 1];
  if (loopFrame && nextThread.pc === loopFrame.bodyEnd) {
    return handleLoopEnd(nextThread, blocksLength);
  }

  return nextThread;
}

function afterAdvance(
  thread: ThreadState,
  blocks: Block[],
  mutexes: MutexRegistry,
): ThreadState {
  const mutexFrame = thread.mutexStack[thread.mutexStack.length - 1];
  if (mutexFrame && thread.pc === mutexFrame.bodyEnd) {
    return handleMutexEnd(thread, blocks.length, mutexes);
  }

  if (thread.pc >= blocks.length) {
    return handleLoopEnd(thread, blocks.length);
  }

  const loopFrame = thread.loopStack[thread.loopStack.length - 1];
  if (loopFrame && thread.pc === loopFrame.bodyEnd) {
    return handleLoopEnd(thread, blocks.length);
  }

  return thread;
}

function enterMutex(
  thread: ThreadState,
  block: Extract<Block, { type: 'mutex' }>,
  blocks: Block[],
  mutexes: MutexRegistry,
): ThreadState {
  const frame: MutexFrame = {
    mutexBlockIndex: thread.pc,
    bodyStart: thread.pc + 1,
    bodyEnd: blocks.length,
    mutexName: block.name,
  };

  if (frame.bodyStart >= frame.bodyEnd) {
    releaseMutex(mutexes, block.name, thread.laneId);
    return afterAdvance({ ...thread, pc: thread.pc + 1 }, blocks, mutexes);
  }

  return afterAdvance(
    {
      ...thread,
      pc: frame.bodyStart,
      mutexStack: [...thread.mutexStack, frame],
    },
    blocks,
    mutexes,
  );
}

function stepRunningThread(
  thread: ThreadState,
  blocks: Block[],
  variables: Record<string, number>,
  mutexes: MutexRegistry,
): ThreadState {
  if (blocks.length === 0) {
    return { ...thread, status: 'done', pc: 0 };
  }

  if (thread.pc >= blocks.length) {
    return handleLoopEnd(thread, blocks.length);
  }

  const block = blocks[thread.pc];

  if (block.type === 'condition') {
    if (evaluateCondition(block, variables)) {
      return afterAdvance({ ...thread, pc: thread.pc + 1 }, blocks, mutexes);
    }
    return { ...thread, status: 'blocked' };
  }

  if (block.type === 'mutex') {
    if (tryAcquireMutex(mutexes, block.name, thread.laneId)) {
      return enterMutex(thread, block, blocks, mutexes);
    }
    return { ...thread, status: 'blocked' };
  }

  if (block.type === 'loop') {
    const frame: LoopFrame = {
      loopBlockIndex: thread.pc,
      bodyStart: thread.pc + 1,
      bodyEnd: blocks.length,
      remaining: block.iterations,
    };

    if (frame.bodyStart >= frame.bodyEnd) {
      return afterAdvance({ ...thread, pc: thread.pc + 1 }, blocks, mutexes);
    }

    return afterAdvance(
      {
        ...thread,
        pc: frame.bodyStart,
        loopStack: [...thread.loopStack, frame],
      },
      blocks,
      mutexes,
    );
  }

  executeBlock(block, variables);
  return afterAdvance({ ...thread, pc: thread.pc + 1 }, blocks, mutexes);
}

export function stepThread(
  thread: ThreadState,
  blocks: Block[],
  variables: Record<string, number>,
  mutexes: MutexRegistry,
): ThreadState {
  if (thread.status === 'done') {
    return thread;
  }

  if (thread.status === 'idle') {
    return stepRunningThread(
      { ...thread, status: 'running' },
      blocks,
      variables,
      mutexes,
    );
  }

  if (thread.status === 'blocked') {
    const block = blocks[thread.pc];
    if (block?.type === 'condition' && evaluateCondition(block, variables)) {
      return afterAdvance(
        { ...thread, status: 'running', pc: thread.pc + 1 },
        blocks,
        mutexes,
      );
    }

    if (
      block?.type === 'mutex' &&
      tryAcquireMutex(mutexes, block.name, thread.laneId)
    ) {
      return enterMutex(
        { ...thread, status: 'running' },
        block,
        blocks,
        mutexes,
      );
    }

    return thread;
  }

  return stepRunningThread(thread, blocks, variables, mutexes);
}

function resolvePhase(
  phase: EnginePhase,
  lanes: Lane[],
  threads: Record<string, ThreadState>,
): EnginePhase {
  const allDone = lanes.every((lane) => threads[lane.id]?.status === 'done');

  if (allDone) {
    return 'finished';
  }

  if (phase === 'idle') {
    return 'running';
  }

  return phase;
}

export function runTick(state: EngineState, lanes: Lane[]): EngineState {
  const variables = { ...state.variables };
  const beforeThreads = { ...state.threads };
  const threads = { ...state.threads };
  const mutexes = cloneMutexRegistry(state.mutexes);

  for (const lane of lanes) {
    const current = threads[lane.id] ?? createThreadState(lane.id);
    threads[lane.id] = stepThread(current, lane.blocks, variables, mutexes);
  }

  const tick = state.tick + 1;
  const timeline = appendTimelineForTick(
    state.timeline,
    tick,
    lanes,
    beforeThreads,
    threads,
  );

  const phase = resolvePhase(state.phase, lanes, threads);

  return {
    variables,
    threads,
    mutexes,
    tick,
    phase: phase === 'paused' ? 'paused' : phase,
    timeline,
  };
}

export function resetEngine(lanes: Lane[]): EngineState {
  return createEngineState(lanes);
}

export function pauseEngine(state: EngineState): EngineState {
  return { ...state, phase: 'paused' };
}

export function resumeEngine(state: EngineState): EngineState {
  if (state.phase === 'finished') {
    return state;
  }
  return { ...state, phase: 'running' };
}

export function getActiveBlockId(
  lane: Lane,
  thread: ThreadState | undefined,
): string | null {
  if (!thread) {
    return null;
  }

  if (thread.status !== 'running' && thread.status !== 'blocked') {
    return null;
  }

  if (thread.pc >= lane.blocks.length) {
    return null;
  }

  return lane.blocks[thread.pc]?.id ?? null;
}
