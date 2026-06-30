import { describe, it, expect } from 'vitest';
import { getThreadColor, THREAD_COLORS } from '../../src/types/threadColors';
import { createLane } from '../../src/types/lane';

describe('threadColors', () => {
  it('assigns distinct colors to lanes at creation', () => {
    const lane1 = createLane(1);
    const lane2 = createLane(2);

    expect(lane1.color).toBe(THREAD_COLORS[0]);
    expect(lane2.color).toBe(THREAD_COLORS[1]);
    expect(lane1.color).not.toBe(lane2.color);
  });

  it('cycles through the palette', () => {
    expect(getThreadColor(THREAD_COLORS.length)).toBe(THREAD_COLORS[0]);
  });
});
