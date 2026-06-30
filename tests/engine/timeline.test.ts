import { describe, it, expect } from 'vitest';
import { createBlock, BLOCK_TYPE_LABELS } from '../../src/types/blocks';
import { createLane } from '../../src/types/lane';
import { appendTimelineForTick } from '../../src/engine/timeline';
import { createEngineState, runTick } from '../../src/engine/engine';
import type { ThreadState } from '../../src/types/execution';

describe('timeline', () => {
  it('records a segment when a block executes on tick 1', () => {
    const lane = {
      ...createLane(1),
      blocks: [{ ...createBlock('variable'), name: 'x', value: 1 }],
    };

    let state = createEngineState([lane]);
    state = runTick(state, [lane]);

    expect(state.timeline).toHaveLength(1);
    expect(state.timeline[0]).toMatchObject({
      laneId: lane.id,
      blockId: lane.blocks[0].id,
      blockLabel: BLOCK_TYPE_LABELS.variable,
      startTick: 1,
      endTick: 2,
    });
  });

  it('records parallel segments for two lanes on the same tick', () => {
    const lane1 = {
      ...createLane(1),
      blocks: [{ ...createBlock('variable'), name: 'a', value: 1 }],
    };
    const lane2 = {
      ...createLane(2),
      blocks: [{ ...createBlock('variable'), name: 'b', value: 2 }],
    };

    let state = createEngineState([lane1, lane2]);
    state = runTick(state, [lane1, lane2]);

    expect(state.timeline).toHaveLength(2);
    expect(state.timeline.map((segment) => segment.laneId).sort()).toEqual(
      [lane1.id, lane2.id].sort(),
    );
  });

  it('merges consecutive ticks on the same blocked if block', () => {
    const ifBlock = {
      ...(createBlock('if') as Extract<
        ReturnType<typeof createBlock>,
        { type: 'if' }
      >),
      condition: [
        {
          ...createBlock('condition'),
          variable: 'x',
          comparator: '==' as const,
          value: 0,
        },
      ],
    };
    const lane = {
      ...createLane(1),
      blocks: [{ ...createBlock('variable'), name: 'x', value: 1 }, ifBlock],
    };

    let state = createEngineState([lane]);
    state = runTick(state, [lane]);
    state = runTick(state, [lane]);
    state = runTick(state, [lane]);

    expect(state.timeline).toHaveLength(2);
    expect(state.timeline[1]).toMatchObject({
      blockLabel: BLOCK_TYPE_LABELS.if,
      startTick: 2,
      endTick: 4,
    });
  });

  it('appendTimelineForTick merges adjacent segments with the same block', () => {
    const ifBlock = {
      ...(createBlock('if') as Extract<
        ReturnType<typeof createBlock>,
        { type: 'if' }
      >),
      condition: [
        {
          ...createBlock('condition'),
          variable: 'x',
          comparator: '==' as const,
          value: 0,
        },
      ],
    };
    const lane = {
      ...createLane(1),
      blocks: [ifBlock],
    };
    const blockedThread: ThreadState = {
      laneId: lane.id,
      status: 'blocked',
      frames: [{ blocks: lane.blocks, pc: 0, kind: 'root' }],
      loopStack: [],
      mutexStack: [],
    };

    const first = appendTimelineForTick(
      [],
      1,
      [lane],
      { [lane.id]: blockedThread },
      { [lane.id]: blockedThread },
    );
    const second = appendTimelineForTick(
      first,
      2,
      [lane],
      { [lane.id]: blockedThread },
      { [lane.id]: blockedThread },
    );

    expect(second).toHaveLength(1);
    expect(second[0].startTick).toBe(1);
    expect(second[0].endTick).toBe(3);
  });

  it('resets timeline with engine reset', () => {
    const lane = {
      ...createLane(1),
      blocks: [{ ...createBlock('variable'), name: 'x', value: 1 }],
    };

    let state = createEngineState([lane]);
    state = runTick(state, [lane]);
    expect(state.timeline.length).toBeGreaterThan(0);

    state = createEngineState([lane]);
    expect(state.timeline).toEqual([]);
  });
});
