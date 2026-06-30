import type { Scenario } from './types';
import { scenarioCondition } from './blockHelpers';
import { scenarioLane } from './buildScenario';

export const raceConditionScenario: Scenario = {
  id: 'race-condition',
  title: 'Race condition',
  description:
    'Deux threads modifient la même variable partagée sans coordination — le résultat dépend de leur entrelacement.',
  concept: 'Race condition',
  lanes: [
    scenarioLane('race-lane-a', 0, 'Thread 1', [
      { id: 'race-a-var', type: 'variable', name: 'x', value: 0 },
      { id: 'race-a-i', type: 'variable', name: 'iA', value: 0 },
      {
        id: 'race-a-loop',
        type: 'loop',
        condition: [scenarioCondition('race-a-cond', 'iA', '<', 3)],
        children: [
          {
            id: 'race-a-op-x',
            type: 'operation',
            targetVariable: 'x',
            operator: '+',
            operand: 1,
          },
          {
            id: 'race-a-op-i',
            type: 'operation',
            targetVariable: 'iA',
            operator: '+',
            operand: 1,
          },
        ],
      },
    ]),
    scenarioLane('race-lane-b', 1, 'Thread 2', [
      { id: 'race-b-i', type: 'variable', name: 'iB', value: 0 },
      {
        id: 'race-b-loop',
        type: 'loop',
        condition: [scenarioCondition('race-b-cond', 'iB', '<', 3)],
        children: [
          {
            id: 'race-b-op-x',
            type: 'operation',
            targetVariable: 'x',
            operator: '+',
            operand: 1,
          },
          {
            id: 'race-b-op-i',
            type: 'operation',
            targetVariable: 'iB',
            operator: '+',
            operand: 1,
          },
        ],
      },
    ]),
  ],
};
