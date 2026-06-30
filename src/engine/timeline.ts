import { BLOCK_TYPE_LABELS } from '../types/blocks';
import type { Lane } from '../types/lane';
import type { ThreadState } from '../types/execution';
import type { TimelineSegment } from '../types/timeline';
import { getActiveBlockIdFromThread } from './activeBlock';

function getExecutedBlockId(
  before: ThreadState,
  after: ThreadState,
): string | null {
  if (before.status === 'done') {
    return null;
  }

  const beforeId = getActiveBlockIdFromThread(before);
  const afterId = getActiveBlockIdFromThread(after);

  if (before.status === 'blocked') {
    if (after.status === 'running' && afterId !== beforeId) {
      return beforeId;
    }
    return null;
  }

  if (before.status === 'idle' || before.status === 'running') {
    if (after.status === 'blocked' && afterId === beforeId) {
      return beforeId;
    }

    if (afterId !== beforeId) {
      return beforeId;
    }
  }

  return null;
}

function getTimelineBlockId(
  before: ThreadState,
  after: ThreadState,
): string | null {
  const executed = getExecutedBlockId(before, after);
  if (executed) {
    return executed;
  }

  if (
    before.status === 'blocked' &&
    after.status === 'blocked' &&
    getActiveBlockIdFromThread(before) === getActiveBlockIdFromThread(after)
  ) {
    return getActiveBlockIdFromThread(before);
  }

  return null;
}

function appendSegment(
  timeline: TimelineSegment[],
  segment: TimelineSegment,
): TimelineSegment[] {
  const lastForLane = [...timeline]
    .reverse()
    .find((entry) => entry.laneId === segment.laneId);

  if (
    lastForLane &&
    lastForLane.blockId === segment.blockId &&
    lastForLane.endTick === segment.startTick
  ) {
    return timeline.map((entry) =>
      entry === lastForLane ? { ...entry, endTick: segment.endTick } : entry,
    );
  }

  return [...timeline, segment];
}

export function appendTimelineForTick(
  timeline: TimelineSegment[],
  tick: number,
  lanes: Lane[],
  beforeThreads: Record<string, ThreadState>,
  afterThreads: Record<string, ThreadState>,
): TimelineSegment[] {
  let nextTimeline = timeline;

  for (const lane of lanes) {
    const before = beforeThreads[lane.id];
    const after = afterThreads[lane.id];
    if (!before || !after) {
      continue;
    }

    const blockId = getTimelineBlockId(before, after);
    if (!blockId) {
      continue;
    }

    const block = findBlockById(lane.blocks, blockId);
    const blockType = block?.type ?? 'variable';

    nextTimeline = appendSegment(nextTimeline, {
      laneId: lane.id,
      blockId,
      blockLabel: BLOCK_TYPE_LABELS[blockType],
      startTick: tick,
      endTick: tick + 1,
    });
  }

  return nextTimeline;
}

export const TIMELINE_TICK_WIDTH = 28;
export const TIMELINE_ROW_HEIGHT = 28;
export const TIMELINE_LABEL_WIDTH = 72;

function findBlockById(
  blocks: Lane['blocks'],
  blockId: string,
): Lane['blocks'][number] | undefined {
  for (const block of blocks) {
    if (block.id === blockId) {
      return block;
    }
    if (block.type === 'if') {
      const nested =
        findBlockById(block.condition, blockId) ??
        findBlockById(block.children, blockId) ??
        findBlockById(block.elseChildren, blockId);
      if (nested) {
        return nested;
      }
    }
    if (block.type === 'loop') {
      const nested =
        findBlockById(block.condition, blockId) ??
        findBlockById(block.children, blockId);
      if (nested) {
        return nested;
      }
    }
  }
  return undefined;
}
