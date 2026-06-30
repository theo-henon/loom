import { describe, it, expect } from 'vitest';
import {
  evaluateCondition,
  applyOperation,
} from '../../src/engine/blockSemantics';

describe('blockSemantics', () => {
  it('evaluates numeric conditions', () => {
    const block = {
      id: '1',
      type: 'condition' as const,
      variable: 'x',
      comparator: '>=' as const,
      value: 5,
    };

    expect(evaluateCondition(block, { x: 5 })).toBe(true);
    expect(evaluateCondition(block, { x: 2 })).toBe(false);
  });

  it('applies arithmetic operations', () => {
    const variables = { x: 10 };
    applyOperation('x', '+', 3, variables);
    expect(variables.x).toBe(13);

    applyOperation('x', '/', 4, variables);
    expect(variables.x).toBe(3);
  });
});
