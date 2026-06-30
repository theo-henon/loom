import type {
  ArithmeticOperator,
  Block,
  ConditionPredicateBlockData,
} from '../types/blocks';

export function evaluateCondition(
  block: ConditionPredicateBlockData,
  variables: Record<string, number>,
): boolean {
  const left = variables[block.variable] ?? 0;
  const right = block.value;

  switch (block.comparator) {
    case '==':
      return left === right;
    case '!=':
      return left !== right;
    case '<':
      return left < right;
    case '>':
      return left > right;
    case '<=':
      return left <= right;
    case '>=':
      return left >= right;
  }
}

export function applyOperation(
  targetVariable: string,
  operator: ArithmeticOperator,
  operand: number,
  variables: Record<string, number>,
): void {
  const current = variables[targetVariable] ?? 0;

  switch (operator) {
    case '+':
      variables[targetVariable] = current + operand;
      break;
    case '-':
      variables[targetVariable] = current - operand;
      break;
    case '*':
      variables[targetVariable] = current * operand;
      break;
    case '/':
      variables[targetVariable] =
        operand === 0 ? current : Math.trunc(current / operand);
      break;
  }
}

export function executeBlock(
  block: Block,
  variables: Record<string, number>,
): void {
  switch (block.type) {
    case 'variable':
      variables[block.name] = block.value;
      break;
    case 'operation':
      applyOperation(
        block.targetVariable,
        block.operator,
        block.operand,
        variables,
      );
      break;
    case 'condition':
    case 'if':
    case 'loop':
    case 'mutex':
      break;
  }
}
