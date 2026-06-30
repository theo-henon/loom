import { describe, it, expect } from 'vitest';
import { createBlock } from '../../src/types/blocks';
import { createLane } from '../../src/types/lane';
import {
  createEngineState,
  resetEngine,
  runTick,
} from '../../src/engine/engine';

describe('engine', () => {
  it('executes variable and operation blocks across two lanes in one tick', () => {
    const lane1 = {
      ...createLane(1),
      blocks: [{ ...createBlock('variable'), name: 'x', value: 10 }],
    };

    const lane2 = {
      ...createLane(2),
      blocks: [
        {
          ...createBlock('operation'),
          targetVariable: 'x',
          operator: '+',
          operand: 5,
        },
      ],
    };

    let state = createEngineState([lane1, lane2]);
    state = runTick(state, [lane1, lane2]);

    expect(state.variables.x).toBe(15);
    expect(state.threads[lane1.id].status).toBe('done');
    expect(state.threads[lane2.id].status).toBe('done');
    expect(state.tick).toBe(1);
  });

  it('blocks a thread when a condition is false', () => {
    const lane = {
      ...createLane(1),
      blocks: [
        { ...createBlock('variable'), name: 'x', value: 1 },
        {
          ...createBlock('condition'),
          variable: 'x',
          comparator: '==',
          value: 0,
        },
        {
          ...createBlock('operation'),
          targetVariable: 'x',
          operator: '+',
          operand: 9,
        },
      ],
    };

    let state = createEngineState([lane]);
    state = runTick(state, [lane]);
    expect(state.variables.x).toBe(1);

    state = runTick(state, [lane]);
    expect(state.threads[lane.id].status).toBe('blocked');
    expect(state.threads[lane.id].pc).toBe(1);
  });

  it('repeats loop body the requested number of times', () => {
    const lane = {
      ...createLane(1),
      blocks: [
        { ...createBlock('variable'), name: 'x', value: 0 },
        { ...createBlock('loop'), iterations: 2 },
        {
          ...createBlock('operation'),
          targetVariable: 'x',
          operator: '+',
          operand: 1,
        },
      ],
    };

    let state = createEngineState([lane]);

    state = runTick(state, [lane]);
    expect(state.variables.x).toBe(0);

    state = runTick(state, [lane]);
    state = runTick(state, [lane]);
    expect(state.variables.x).toBe(1);

    state = runTick(state, [lane]);
    expect(state.variables.x).toBe(2);
    expect(state.threads[lane.id].status).toBe('done');
  });

  it('resets engine state', () => {
    const lane = {
      ...createLane(1),
      blocks: [{ ...createBlock('variable'), name: 'x', value: 3 }],
    };

    let state = createEngineState([lane]);
    state = runTick(state, [lane]);
    expect(state.variables.x).toBe(3);

    state = resetEngine([lane]);
    expect(state.variables).toEqual({});
    expect(state.tick).toBe(0);
    expect(state.phase).toBe('idle');
  });
});
