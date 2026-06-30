import type { Block } from './blocks';

export type Lane = {
  id: string;
  name: string;
  blocks: Block[];
};

export function createLane(index: number): Lane {
  return {
    id: crypto.randomUUID(),
    name: `Thread ${index}`,
    blocks: [],
  };
}
