import type { Comparator, ConditionPredicateBlockData } from '../types/blocks';

export function scenarioCondition(
  id: string,
  variable: string,
  comparator: Comparator,
  value: number,
): ConditionPredicateBlockData {
  return { id, type: 'condition', variable, comparator, value };
}
