import type { Block, BlockContainer } from '../types/blocks';
import { getContainerPredicate } from '../types/blocks';
import type { Lane } from '../types/lane';
import type {
  EnginePhase,
  EngineState,
  ExecutionFrame,
  FrameKind,
  MutexRegistry,
  ThreadState,
} from '../types/execution';
import { appendTimelineForTick } from './timeline';
import { evaluateCondition, executeBlock } from './blockSemantics';
import { createMutexRegistry, releaseMutex, tryAcquireMutex } from './mutex';
import { getActiveBlockIdFromThread } from './activeBlock';

function createThreadState(laneId: string, blocks: Block[]): ThreadState {
  return {
    laneId,
    status: 'idle',
    frames: [{ blocks, pc: 0, kind: 'root' }],
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
    threads[lane.id] = createThreadState(lane.id, lane.blocks);
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

function currentFrame(thread: ThreadState): ExecutionFrame {
  return thread.frames[thread.frames.length - 1];
}

function pushFrame(
  thread: ThreadState,
  blocks: Block[],
  kind: FrameKind,
): ThreadState {
  return {
    ...thread,
    frames: [...thread.frames, { blocks, pc: 0, kind }],
  };
}

function updateTopFrame(
  thread: ThreadState,
  patch: Partial<ExecutionFrame>,
): ThreadState {
  const frames = [...thread.frames];
  const top = frames[frames.length - 1];
  frames[frames.length - 1] = { ...top, ...patch };
  return { ...thread, frames };
}

function evaluateContainerCondition(
  block: BlockContainer,
  variables: Record<string, number>,
): boolean | null {
  const predicate = getContainerPredicate(block);
  if (!predicate) {
    return null;
  }
  return evaluateCondition(predicate, variables);
}

function handleLoopBodyEnd(
  thread: ThreadState,
  variables: Record<string, number>,
  mutexes: MutexRegistry,
): ThreadState {
  const loopBodyFrame = currentFrame(thread);
  const parentFrames = thread.frames.slice(0, -1);
  const parent = parentFrames[parentFrames.length - 1];
  const loopBlock = parent.blocks[parent.pc];

  if (loopBlock?.type !== 'loop') {
    return { ...thread, status: 'done' };
  }

  const conditionResult = evaluateContainerCondition(loopBlock, variables);
  if (conditionResult === true) {
    return {
      ...thread,
      frames: [...parentFrames, { ...loopBodyFrame, pc: 0 }],
    };
  }

  const updated: ThreadState = {
    ...thread,
    loopStack: thread.loopStack.slice(0, -1),
    frames: [...parentFrames.slice(0, -1), { ...parent, pc: parent.pc + 1 }],
  };
  const frame = currentFrame(updated);
  if (frame.pc >= frame.blocks.length) {
    return handleFrameComplete(updated, variables, mutexes);
  }
  return updated;
}

function handleConditionBranchEnd(
  thread: ThreadState,
  variables: Record<string, number>,
  mutexes: MutexRegistry,
): ThreadState {
  const parentFrames = thread.frames.slice(0, -1);
  const parent = parentFrames[parentFrames.length - 1];
  const updated: ThreadState = {
    ...thread,
    frames: [...parentFrames.slice(0, -1), { ...parent, pc: parent.pc + 1 }],
  };
  const frame = currentFrame(updated);
  if (frame.pc >= frame.blocks.length) {
    return handleFrameComplete(updated, variables, mutexes);
  }
  return updated;
}

function handleConditionBodyEnd(
  thread: ThreadState,
  variables: Record<string, number>,
  mutexes: MutexRegistry,
): ThreadState {
  return handleConditionBranchEnd(thread, variables, mutexes);
}

function handleConditionElseBodyEnd(
  thread: ThreadState,
  variables: Record<string, number>,
  mutexes: MutexRegistry,
): ThreadState {
  return handleConditionBranchEnd(thread, variables, mutexes);
}

function handleFrameComplete(
  thread: ThreadState,
  variables: Record<string, number>,
  mutexes: MutexRegistry,
): ThreadState {
  const frame = currentFrame(thread);

  if (frame.kind === 'loop-body') {
    return handleLoopBodyEnd(thread, variables, mutexes);
  }

  if (frame.kind === 'condition-body') {
    return handleConditionBodyEnd(thread, variables, mutexes);
  }

  if (frame.kind === 'condition-else-body') {
    return handleConditionElseBodyEnd(thread, variables, mutexes);
  }

  return { ...thread, status: 'done' };
}

function handleMutexEnd(
  thread: ThreadState,
  mutexes: MutexRegistry,
  variables: Record<string, number>,
): ThreadState {
  const frame = thread.mutexStack[thread.mutexStack.length - 1];
  if (!frame) {
    return thread;
  }

  releaseMutex(mutexes, frame.mutexName, thread.laneId);

  return afterAdvance(
    updateTopFrame(
      {
        ...thread,
        mutexStack: thread.mutexStack.slice(0, -1),
      },
      { pc: frame.bodyEnd },
    ),
    mutexes,
    variables,
  );
}

function afterAdvance(
  thread: ThreadState,
  mutexes: MutexRegistry,
  variables: Record<string, number>,
): ThreadState {
  const frame = currentFrame(thread);
  const mutexFrame = thread.mutexStack[thread.mutexStack.length - 1];

  if (mutexFrame && frame.pc === mutexFrame.bodyEnd) {
    return handleMutexEnd(thread, mutexes, variables);
  }

  if (frame.pc >= frame.blocks.length) {
    return handleFrameComplete(thread, variables, mutexes);
  }

  return thread;
}

function advanceInFrame(
  thread: ThreadState,
  mutexes: MutexRegistry,
  variables: Record<string, number>,
): ThreadState {
  return afterAdvance(
    updateTopFrame(thread, { pc: currentFrame(thread).pc + 1 }),
    mutexes,
    variables,
  );
}

function enterMutex(
  thread: ThreadState,
  block: Extract<Block, { type: 'mutex' }>,
  blocks: Block[],
  mutexes: MutexRegistry,
  variables: Record<string, number>,
): ThreadState {
  const pc = currentFrame(thread).pc;
  const frame: (typeof thread.mutexStack)[number] = {
    mutexBlockIndex: pc,
    bodyStart: pc + 1,
    bodyEnd: blocks.length,
    mutexName: block.name,
  };

  if (frame.bodyStart >= frame.bodyEnd) {
    releaseMutex(mutexes, block.name, thread.laneId);
    return advanceInFrame(thread, mutexes, variables);
  }

  return afterAdvance(
    {
      ...thread,
      mutexStack: [...thread.mutexStack, frame],
      frames: [
        ...thread.frames.slice(0, -1),
        { ...currentFrame(thread), pc: frame.bodyStart },
      ],
    },
    mutexes,
    variables,
  );
}

function enterIfBody(
  thread: ThreadState,
  block: Extract<Block, { type: 'if' }>,
  mutexes: MutexRegistry,
  variables: Record<string, number>,
): ThreadState {
  if (block.children.length === 0) {
    return advanceInFrame(thread, mutexes, variables);
  }

  return pushFrame(thread, block.children, 'condition-body');
}

function enterIfElseBody(
  thread: ThreadState,
  block: Extract<Block, { type: 'if' }>,
  mutexes: MutexRegistry,
  variables: Record<string, number>,
): ThreadState {
  if (block.elseChildren.length === 0) {
    return advanceInFrame(thread, mutexes, variables);
  }

  return pushFrame(thread, block.elseChildren, 'condition-else-body');
}

function handleIfBlock(
  thread: ThreadState,
  block: Extract<Block, { type: 'if' }>,
  variables: Record<string, number>,
  mutexes: MutexRegistry,
): ThreadState {
  const conditionResult = evaluateContainerCondition(block, variables);
  if (conditionResult === null) {
    return { ...thread, status: 'blocked' };
  }
  if (conditionResult) {
    return enterIfBody(thread, block, mutexes, variables);
  }
  if (block.hasElse) {
    return enterIfElseBody(thread, block, mutexes, variables);
  }
  return { ...thread, status: 'blocked' };
}

function enterLoopBody(
  thread: ThreadState,
  block: Extract<Block, { type: 'loop' }>,
  variables: Record<string, number>,
  mutexes: MutexRegistry,
): ThreadState {
  const conditionResult = evaluateContainerCondition(block, variables);
  if (conditionResult === null) {
    return { ...thread, status: 'blocked' };
  }
  if (!conditionResult) {
    return advanceInFrame(thread, mutexes, variables);
  }
  if (block.children.length === 0) {
    return {
      ...pushFrame(thread, block.children, 'loop-body'),
      loopStack: [...thread.loopStack, {}],
    };
  }

  return {
    ...pushFrame(thread, block.children, 'loop-body'),
    loopStack: [...thread.loopStack, {}],
  };
}

function stepRunningThread(
  thread: ThreadState,
  variables: Record<string, number>,
  mutexes: MutexRegistry,
): ThreadState {
  const frame = currentFrame(thread);
  const { blocks, pc } = frame;

  if (blocks.length === 0) {
    return { ...thread, status: 'done' };
  }

  if (pc >= blocks.length) {
    return handleFrameComplete(thread, variables, mutexes);
  }

  const block = blocks[pc];

  if (block.type === 'if') {
    return handleIfBlock(thread, block, variables, mutexes);
  }

  if (block.type === 'mutex') {
    if (tryAcquireMutex(mutexes, block.name, thread.laneId)) {
      return enterMutex(thread, block, blocks, mutexes, variables);
    }
    return { ...thread, status: 'blocked' };
  }

  if (block.type === 'loop') {
    return enterLoopBody(thread, block, variables, mutexes);
  }

  executeBlock(block, variables);
  return advanceInFrame(thread, mutexes, variables);
}

export function stepThread(
  thread: ThreadState,
  laneBlocks: Block[],
  variables: Record<string, number>,
  mutexes: MutexRegistry,
): ThreadState {
  if (thread.status === 'done') {
    return thread;
  }

  const threadWithBlocks =
    thread.frames[0]?.blocks === laneBlocks
      ? thread
      : {
          ...thread,
          frames: [
            { ...thread.frames[0], blocks: laneBlocks },
            ...thread.frames.slice(1),
          ],
        };

  if (threadWithBlocks.status === 'idle') {
    return stepRunningThread(
      { ...threadWithBlocks, status: 'running' },
      variables,
      mutexes,
    );
  }

  if (threadWithBlocks.status === 'blocked') {
    const block =
      currentFrame(threadWithBlocks).blocks[currentFrame(threadWithBlocks).pc];

    if (block?.type === 'if') {
      return handleIfBlock(
        { ...threadWithBlocks, status: 'running' },
        block,
        variables,
        mutexes,
      );
    }

    if (
      block?.type === 'mutex' &&
      tryAcquireMutex(mutexes, block.name, threadWithBlocks.laneId)
    ) {
      return enterMutex(
        { ...threadWithBlocks, status: 'running' },
        block,
        currentFrame(threadWithBlocks).blocks,
        mutexes,
        variables,
      );
    }

    return threadWithBlocks;
  }

  return stepRunningThread(threadWithBlocks, variables, mutexes);
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
    const current = threads[lane.id] ?? createThreadState(lane.id, lane.blocks);
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
  _lane: Lane,
  thread: ThreadState | undefined,
): string | null {
  return getActiveBlockIdFromThread(thread);
}
