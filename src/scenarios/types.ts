import type { Lane } from '../types/lane';

export type ScenarioId =
  | 'parallel-simple'
  | 'race-condition'
  | 'race-condition-fixed'
  | 'deadlock'
  | 'deadlock-fixed';

export type Scenario = {
  id: ScenarioId;
  title: string;
  description: string;
  concept: string;
  lanes: Lane[];
};
