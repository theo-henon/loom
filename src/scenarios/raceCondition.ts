import type { Scenario } from './types';
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
      {
        id: 'race-a-loop',
        type: 'loop',
        iterations: 3,
        children: [
          {
            id: 'race-a-op',
            type: 'operation',
            targetVariable: 'x',
            operator: '+',
            operand: 1,
          },
        ],
      },
    ]),
    scenarioLane('race-lane-b', 1, 'Thread 2', [
      {
        id: 'race-b-loop',
        type: 'loop',
        iterations: 3,
        children: [
          {
            id: 'race-b-op',
            type: 'operation',
            targetVariable: 'x',
            operator: '+',
            operand: 1,
          },
        ],
      },
    ]),
  ],
};
