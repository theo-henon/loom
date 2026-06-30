import type { Scenario } from './types';
import { scenarioLane } from './buildScenario';

export const deadlockScenario: Scenario = {
  id: 'deadlock',
  title: 'Deadlock',
  description:
    'Deux threads s\'emparent chacun d\'une ressource puis attendent l\'autre — blocage mutuel permanent.',
  concept: 'Deadlock',
  lanes: [
    scenarioLane('deadlock-lane-a', 0, 'Thread A', [
      {
        id: 'deadlock-a-check-a',
        type: 'condition',
        variable: 'lockA',
        comparator: '==',
        value: 0,
      },
      { id: 'deadlock-a-acquire-a', type: 'variable', name: 'lockA', value: 1 },
      {
        id: 'deadlock-a-check-b',
        type: 'condition',
        variable: 'lockB',
        comparator: '==',
        value: 0,
      },
      { id: 'deadlock-a-acquire-b', type: 'variable', name: 'lockB', value: 1 },
    ]),
    scenarioLane('deadlock-lane-b', 1, 'Thread B', [
      {
        id: 'deadlock-b-check-b',
        type: 'condition',
        variable: 'lockB',
        comparator: '==',
        value: 0,
      },
      { id: 'deadlock-b-acquire-b', type: 'variable', name: 'lockB', value: 1 },
      {
        id: 'deadlock-b-check-a',
        type: 'condition',
        variable: 'lockA',
        comparator: '==',
        value: 0,
      },
      { id: 'deadlock-b-acquire-a', type: 'variable', name: 'lockA', value: 1 },
    ]),
  ],
};
