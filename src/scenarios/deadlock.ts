import type { Scenario } from './types';
import { scenarioCondition } from './blockHelpers';
import { scenarioLane } from './buildScenario';

export const deadlockScenario: Scenario = {
  id: 'deadlock',
  title: 'Deadlock',
  description:
    "Deux threads s'emparent chacun d'une ressource puis attendent l'autre — blocage mutuel permanent.",
  concept: 'Deadlock',
  lanes: [
    scenarioLane('deadlock-lane-a', 0, 'Thread A', [
      {
        id: 'deadlock-a-check-a',
        type: 'if',
        condition: [scenarioCondition('deadlock-a-cond-a', 'lockA', '==', 0)],
        children: [
          {
            id: 'deadlock-a-acquire-a',
            type: 'variable',
            name: 'lockA',
            value: 1,
          },
        ],
        hasElse: false,
        elseChildren: [],
      },
      {
        id: 'deadlock-a-check-b',
        type: 'if',
        condition: [scenarioCondition('deadlock-a-cond-b', 'lockB', '==', 0)],
        children: [
          {
            id: 'deadlock-a-acquire-b',
            type: 'variable',
            name: 'lockB',
            value: 1,
          },
        ],
        hasElse: false,
        elseChildren: [],
      },
    ]),
    scenarioLane('deadlock-lane-b', 1, 'Thread B', [
      {
        id: 'deadlock-b-check-b',
        type: 'if',
        condition: [scenarioCondition('deadlock-b-cond-b', 'lockB', '==', 0)],
        children: [
          {
            id: 'deadlock-b-acquire-b',
            type: 'variable',
            name: 'lockB',
            value: 1,
          },
        ],
        hasElse: false,
        elseChildren: [],
      },
      {
        id: 'deadlock-b-check-a',
        type: 'if',
        condition: [scenarioCondition('deadlock-b-cond-a', 'lockA', '==', 0)],
        children: [
          {
            id: 'deadlock-b-acquire-a',
            type: 'variable',
            name: 'lockA',
            value: 1,
          },
        ],
        hasElse: false,
        elseChildren: [],
      },
    ]),
  ],
};
