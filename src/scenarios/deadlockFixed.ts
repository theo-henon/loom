import type { Scenario } from './types';
import { scenarioLane } from './buildScenario';

export const deadlockFixedScenario: Scenario = {
  id: 'deadlock-fixed',
  title: 'Deadlock corrigé',
  description:
    'Comme le scénario Deadlock (lockA, lockB), mais les deux threads les prennent dans le même ordre. etapes atteint 2 et les threads terminent.',
  concept: 'Deadlock',
  lanes: [
    scenarioLane('fixed-deadlock-a', 0, 'Thread A', [
      {
        id: 'fixed-deadlock-a-init',
        type: 'variable',
        name: 'etapes',
        value: 0,
      },
      {
        id: 'fixed-deadlock-a-check-a',
        type: 'condition',
        variable: 'lockA',
        comparator: '==',
        value: 0,
        children: [
          {
            id: 'fixed-deadlock-a-acquire-a',
            type: 'variable',
            name: 'lockA',
            value: 1,
          },
        ],
        hasElse: false,
        elseChildren: [],
      },
      {
        id: 'fixed-deadlock-a-check-b',
        type: 'condition',
        variable: 'lockB',
        comparator: '==',
        value: 0,
        children: [
          {
            id: 'fixed-deadlock-a-acquire-b',
            type: 'variable',
            name: 'lockB',
            value: 1,
          },
        ],
        hasElse: false,
        elseChildren: [],
      },
      {
        id: 'fixed-deadlock-a-step',
        type: 'operation',
        targetVariable: 'etapes',
        operator: '+',
        operand: 1,
      },
    ]),
    scenarioLane('fixed-deadlock-b', 1, 'Thread B', [
      {
        id: 'fixed-deadlock-b-check-a',
        type: 'condition',
        variable: 'lockA',
        comparator: '==',
        value: 0,
        children: [
          {
            id: 'fixed-deadlock-b-acquire-a',
            type: 'variable',
            name: 'lockA',
            value: 1,
          },
        ],
        hasElse: false,
        elseChildren: [],
      },
      {
        id: 'fixed-deadlock-b-check-b',
        type: 'condition',
        variable: 'lockB',
        comparator: '==',
        value: 0,
        children: [
          {
            id: 'fixed-deadlock-b-acquire-b',
            type: 'variable',
            name: 'lockB',
            value: 1,
          },
        ],
        hasElse: false,
        elseChildren: [],
      },
      {
        id: 'fixed-deadlock-b-step',
        type: 'operation',
        targetVariable: 'etapes',
        operator: '+',
        operand: 1,
      },
    ]),
  ],
};
