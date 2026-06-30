import { describe, it, expect } from 'vitest';
import {
  EXECUTION_SPEED_OPTIONS,
  getTickIntervalMs,
} from '../../src/types/executionSpeed';

describe('executionSpeed', () => {
  it('exposes three speed presets', () => {
    expect(EXECUTION_SPEED_OPTIONS).toHaveLength(3);
    expect(EXECUTION_SPEED_OPTIONS.map((option) => option.label)).toEqual([
      'Lente',
      'Normale',
      'Rapide',
    ]);
  });

  it('maps speed ids to tick intervals', () => {
    expect(getTickIntervalMs('slow')).toBe(1200);
    expect(getTickIntervalMs('normal')).toBe(600);
    expect(getTickIntervalMs('fast')).toBe(200);
  });
});
