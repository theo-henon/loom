import type { Block } from '../types/blocks';
import type { Lane } from '../types/lane';
import { getThreadColor } from '../types/threadColors';

export function scenarioLane(
  id: string,
  index: number,
  name: string,
  blocks: Block[],
): Lane {
  return {
    id,
    name,
    color: getThreadColor(index),
    blocks,
  };
}
