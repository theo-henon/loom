import { describe, it, expect } from 'vitest';
import { createEngineState, runTick } from '../../src/engine/engine';
import { deadlockScenario } from '../../src/scenarios/deadlock';
import { parallelSimpleScenario } from '../../src/scenarios/parallelSimple';
import { raceConditionFixedScenario } from '../../src/scenarios/raceConditionFixed';
import { raceConditionScenario } from '../../src/scenarios/raceCondition';
import { SCENARIOS, getScenarioById } from '../../src/scenarios';

describe('scenarios', () => {
  it('exposes four built-in scenarios', () => {
    expect(SCENARIOS).toHaveLength(4);
    expect(getScenarioById('deadlock')?.title).toBe('Deadlock');
    expect(getScenarioById('race-condition-fixed')?.title).toBe(
      'Race condition corrigée',
    );
  });

  it('parallel-simple finishes with independent counters at 3', () => {
    const { lanes } = parallelSimpleScenario;
    let state = createEngineState(lanes);

    for (let tick = 0; tick < 20; tick += 1) {
      state = runTick(state, lanes);
      if (state.phase === 'finished') {
        break;
      }
    }

    expect(state.variables.a).toBe(3);
    expect(state.variables.b).toBe(3);
    expect(state.phase).toBe('finished');
  });

  it('race-condition increments shared x through interleaved execution', () => {
    const { lanes } = raceConditionScenario;
    let state = createEngineState(lanes);

    for (let tick = 0; tick < 20; tick += 1) {
      state = runTick(state, lanes);
      if (state.phase === 'finished') {
        break;
      }
    }

    expect(state.variables.x).toBeGreaterThan(0);
    expect(state.phase).toBe('finished');
  });

  it('race-condition-fixed always reaches x = 6 with mutex protection', () => {
    const { lanes } = raceConditionFixedScenario;
    let state = createEngineState(lanes);

    for (let tick = 0; tick < 40; tick += 1) {
      state = runTick(state, lanes);
      if (state.phase === 'finished') {
        break;
      }
    }

    expect(state.variables.x).toBe(6);
    expect(state.phase).toBe('finished');
  });

  it('deadlock leaves both threads blocked', () => {
    const { lanes } = deadlockScenario;
    let state = createEngineState(lanes);

    for (let tick = 0; tick < 10; tick += 1) {
      state = runTick(state, lanes);
    }

    expect(state.threads[lanes[0].id].status).toBe('blocked');
    expect(state.threads[lanes[1].id].status).toBe('blocked');
    expect(state.phase).not.toBe('finished');
  });
});
