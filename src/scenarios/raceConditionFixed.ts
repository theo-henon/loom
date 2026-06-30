import type { Scenario } from './types';
import { scenarioLane } from './buildScenario';

export const raceConditionFixedScenario: Scenario = {
  id: 'race-condition-fixed',
  title: 'Race condition corrigée',
  description:
    'Même programme que la race condition, avec un mutex autour de l’incrément — le résultat est toujours prévisible.',
  concept: 'Mutex',
  lanes: [
    scenarioLane('fixed-lane-a', 0, 'Thread 1', [
      { id: 'fixed-a-var', type: 'variable', name: 'x', value: 0 },
      {
        id: 'fixed-a-loop',
        type: 'loop',
        iterations: 3,
        children: [
          { id: 'fixed-a-mutex', type: 'mutex', name: 'compteur' },
          {
            id: 'fixed-a-op',
            type: 'operation',
            targetVariable: 'x',
            operator: '+',
            operand: 1,
          },
        ],
      },
    ]),
    scenarioLane('fixed-lane-b', 1, 'Thread 2', [
      {
        id: 'fixed-b-loop',
        type: 'loop',
        iterations: 3,
        children: [
          { id: 'fixed-b-mutex', type: 'mutex', name: 'compteur' },
          {
            id: 'fixed-b-op',
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
