import { BLOCK_TYPE_LABELS } from '../types/blocks';
import type { Lane } from '../types/lane';
import type { ThreadState } from '../types/execution';
import type { TimelineSegment } from '../types/timeline';

function getExecutedBlockId(
  lane: Lane,
  before: ThreadState,
  after: ThreadState,
): string | null {
  if (before.status === 'done') {
    return null;
  }

  if (before.status === 'blocked') {
    if (after.status === 'running' && after.pc > before.pc) {
      return lane.blocks[before.pc]?.id ?? null;
    }
    return null;
  }

  if (before.status === 'idle' || before.status === 'running') {
    if (after.status === 'blocked' && after.pc === before.pc) {
      return lane.blocks[before.pc]?.id ?? null;
    }

    if (after.pc !== before.pc) {
      return lane.blocks[before.pc]?.id ?? null;
    }
  }

  return null;
}

function getTimelineBlockId(
  lane: Lane,
  before: ThreadState,
  after: ThreadState,
): string | null {
  const executed = getExecutedBlockId(lane, before, after);
  if (executed) {
    return executed;
  }

  if (
    before.status === 'blocked' &&
    after.status === 'blocked' &&
    before.pc === after.pc
  ) {
    return lane.blocks[before.pc]?.id ?? null;
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
      entry === lastForLane
        ? { ...entry, endTick: segment.endTick }
        : entry,
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

    const blockId = getTimelineBlockId(lane, before, after);
    if (!blockId) {
      continue;
    }

    const block = lane.blocks.find((entry) => entry.id === blockId);
    if (!block) {
      continue;
    }

    nextTimeline = appendSegment(nextTimeline, {
      laneId: lane.id,
      blockId,
      blockLabel: BLOCK_TYPE_LABELS[block.type],
      startTick: tick,
      endTick: tick + 1,
    });
  }

  return nextTimeline;
}

export const TIMELINE_TICK_WIDTH = 28;
export const TIMELINE_ROW_HEIGHT = 28;
export const TIMELINE_LABEL_WIDTH = 72;
