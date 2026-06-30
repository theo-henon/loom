import type { Block } from './blocks';
import { getThreadColor } from './threadColors';

export type Lane = {
  id: string;
  name: string;
  color: string;
  blocks: Block[];
};

export function createLane(index: number): Lane {
  return {
    id: crypto.randomUUID(),
    name: `Thread ${index}`,
    color: getThreadColor(index - 1),
    blocks: [],
  };
}
