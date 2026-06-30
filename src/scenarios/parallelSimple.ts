import type { Scenario } from './types';
import { scenarioLane } from './buildScenario';

export const parallelSimpleScenario: Scenario = {
  id: 'parallel-simple',
  title: 'Parallélisme simple',
  description:
    'Deux threads incrémentent chacun leur propre compteur en parallèle, sans partager de variable.',
  concept: 'Parallélisme',
  lanes: [
    scenarioLane('parallel-lane-a', 0, 'Compteur A', [
      { id: 'parallel-a-var', type: 'variable', name: 'a', value: 0 },
      { id: 'parallel-a-loop', type: 'loop', iterations: 3 },
      {
        id: 'parallel-a-op',
        type: 'operation',
        targetVariable: 'a',
        operator: '+',
        operand: 1,
      },
    ]),
    scenarioLane('parallel-lane-b', 1, 'Compteur B', [
      { id: 'parallel-b-var', type: 'variable', name: 'b', value: 0 },
      { id: 'parallel-b-loop', type: 'loop', iterations: 3 },
      {
        id: 'parallel-b-op',
        type: 'operation',
        targetVariable: 'b',
        operator: '+',
        operand: 1,
      },
    ]),
  ],
};
