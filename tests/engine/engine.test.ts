import { describe, it, expect } from 'vitest';
import { createBlock } from '../../src/types/blocks';
import { createLane } from '../../src/types/lane';
import {
  createEngineState,
  resetEngine,
  runTick,
} from '../../src/engine/engine';

function createIfBlock(
  overrides: Partial<
    Extract<ReturnType<typeof createBlock>, { type: 'if' }>
  > & {
    predicate?: ReturnType<typeof createBlock>;
  } = {},
) {
  const base = createBlock('if') as Extract<
    ReturnType<typeof createBlock>,
    { type: 'if' }
  >;
  const { predicate, ...rest } = overrides;
  return {
    ...base,
    ...rest,
    condition: predicate ? [predicate] : (rest.condition ?? base.condition),
  };
}

function createWhileLoop(
  overrides: Partial<
    Extract<ReturnType<typeof createBlock>, { type: 'loop' }>
  > & {
    predicate?: ReturnType<typeof createBlock>;
  } = {},
) {
  const base = createBlock('loop') as Extract<
    ReturnType<typeof createBlock>,
    { type: 'loop' }
  >;
  const { predicate, ...rest } = overrides;
  return {
    ...base,
    ...rest,
    condition: predicate ? [predicate] : (rest.condition ?? base.condition),
  };
}

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

  it('blocks a thread when an if condition is false', () => {
    const lane = {
      ...createLane(1),
      blocks: [
        { ...createBlock('variable'), name: 'x', value: 1 },
        createIfBlock({
          predicate: {
            ...createBlock('condition'),
            variable: 'x',
            comparator: '==',
            value: 0,
          },
        }),
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
    expect(state.threads[lane.id].frames[0].pc).toBe(1);
  });

  it('repeats a while loop while the condition stays true', () => {
    const lane = {
      ...createLane(1),
      blocks: [
        { ...createBlock('variable'), name: 'x', value: 0 },
        { ...createBlock('variable'), name: 'i', value: 0 },
        createWhileLoop({
          predicate: {
            ...createBlock('condition'),
            variable: 'i',
            comparator: '<',
            value: 2,
          },
          children: [
            {
              ...createBlock('operation'),
              targetVariable: 'x',
              operator: '+',
              operand: 1,
            },
            {
              ...createBlock('operation'),
              targetVariable: 'i',
              operator: '+',
              operand: 1,
            },
          ],
        }),
      ],
    };

    let state = createEngineState([lane]);

    for (let tick = 0; tick < 20; tick += 1) {
      state = runTick(state, [lane]);
      if (state.phase === 'finished') {
        break;
      }
    }

    expect(state.variables.x).toBe(2);
    expect(state.threads[lane.id].status).toBe('done');
  });

  it('executes else branch when if condition is false and hasElse is enabled', () => {
    const lane = {
      ...createLane(1),
      blocks: [
        { ...createBlock('variable'), name: 'x', value: 0 },
        createIfBlock({
          hasElse: true,
          predicate: {
            ...createBlock('condition'),
            variable: 'x',
            comparator: '==',
            value: 1,
          },
          children: [
            {
              ...createBlock('operation'),
              targetVariable: 'x',
              operator: '+',
              operand: 10,
            },
          ],
          elseChildren: [
            {
              ...createBlock('operation'),
              targetVariable: 'x',
              operator: '+',
              operand: 1,
            },
          ],
        }),
      ],
    };

    let state = createEngineState([lane]);
    state = runTick(state, [lane]);
    expect(state.variables.x).toBe(0);

    state = runTick(state, [lane]);
    expect(state.variables.x).toBe(0);

    state = runTick(state, [lane]);
    expect(state.variables.x).toBe(1);
    expect(state.threads[lane.id].status).toBe('done');
  });

  it('blocks a thread when a mutex is already held', () => {
    const lane1 = {
      ...createLane(1),
      blocks: [
        { ...createBlock('mutex'), name: 'm' },
        {
          ...createBlock('operation'),
          targetVariable: 'x',
          operator: '+',
          operand: 1,
        },
      ],
    };

    const lane2 = {
      ...createLane(2),
      blocks: [
        { ...createBlock('mutex'), name: 'm' },
        {
          ...createBlock('operation'),
          targetVariable: 'x',
          operator: '+',
          operand: 1,
        },
      ],
    };

    let state = createEngineState([lane1, lane2]);
    state = runTick(state, [lane1, lane2]);

    expect(state.threads[lane1.id].status).toBe('running');
    expect(state.threads[lane2.id].status).toBe('blocked');
    expect(state.mutexes.m?.ownerLaneId).toBe(lane1.id);
  });

  it('serializes critical sections with the same mutex name', () => {
    const lane1 = {
      ...createLane(1),
      blocks: [
        { ...createBlock('variable'), name: 'x', value: 0 },
        { ...createBlock('variable'), name: 'i1', value: 0 },
        createWhileLoop({
          predicate: {
            ...createBlock('condition'),
            variable: 'i1',
            comparator: '<',
            value: 2,
          },
          children: [
            { ...createBlock('mutex'), name: 'm' },
            {
              ...createBlock('operation'),
              targetVariable: 'x',
              operator: '+',
              operand: 1,
            },
            {
              ...createBlock('operation'),
              targetVariable: 'i1',
              operator: '+',
              operand: 1,
            },
          ],
        }),
      ],
    };

    const lane2 = {
      ...createLane(2),
      blocks: [
        { ...createBlock('variable'), name: 'i2', value: 0 },
        createWhileLoop({
          predicate: {
            ...createBlock('condition'),
            variable: 'i2',
            comparator: '<',
            value: 2,
          },
          children: [
            { ...createBlock('mutex'), name: 'm' },
            {
              ...createBlock('operation'),
              targetVariable: 'x',
              operator: '+',
              operand: 1,
            },
            {
              ...createBlock('operation'),
              targetVariable: 'i2',
              operator: '+',
              operand: 1,
            },
          ],
        }),
      ],
    };

    let state = createEngineState([lane1, lane2]);

    for (let tick = 0; tick < 30; tick += 1) {
      state = runTick(state, [lane1, lane2]);
      if (state.phase === 'finished') {
        break;
      }
    }

    expect(state.variables.x).toBe(4);
    expect(state.phase).toBe('finished');
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
