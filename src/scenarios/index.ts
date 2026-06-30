import { deadlockScenario } from './deadlock';
import { parallelSimpleScenario } from './parallelSimple';
import { raceConditionFixedScenario } from './raceConditionFixed';
import { raceConditionScenario } from './raceCondition';
import type { Scenario, ScenarioId } from './types';
import { createLane } from '../types/lane';

export const SCENARIOS: Scenario[] = [
  parallelSimpleScenario,
  raceConditionScenario,
  raceConditionFixedScenario,
  deadlockScenario,
];

export function getScenarioById(id: ScenarioId): Scenario | undefined {
  return SCENARIOS.find((scenario) => scenario.id === id);
}

export function createBlankProgramLanes() {
  return [createLane(1), createLane(2)];
}

export type { Scenario, ScenarioId } from './types';
