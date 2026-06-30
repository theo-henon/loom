import type { Block } from '../types/blocks';
import type { Lane } from '../types/lane';

export function normalizeBlocks(blocks: Block[]): unknown[] {
  return blocks.map((block) => {
    switch (block.type) {
      case 'variable':
        return {
          type: block.type,
          name: block.name,
          value: block.value,
        };
      case 'operation':
        return {
          type: block.type,
          targetVariable: block.targetVariable,
          operator: block.operator,
          operand: block.operand,
        };
      case 'condition':
        return {
          type: block.type,
          variable: block.variable,
          comparator: block.comparator,
          value: block.value,
        };
      case 'if':
        return {
          type: block.type,
          hasElse: block.hasElse,
          condition: normalizeBlocks(block.condition),
          children: normalizeBlocks(block.children),
          elseChildren: normalizeBlocks(block.elseChildren),
        };
      case 'loop':
        return {
          type: block.type,
          condition: normalizeBlocks(block.condition),
          children: normalizeBlocks(block.children),
        };
      case 'mutex':
        return {
          type: block.type,
          name: block.name,
        };
    }
  });
}

export function normalizeProgram(lanes: Lane[]) {
  return lanes.map((lane) => ({
    name: lane.name,
    color: lane.color,
    blocks: normalizeBlocks(lane.blocks),
  }));
}

export function lanesStructureEqual(a: Lane[], b: Lane[]): boolean {
  return (
    JSON.stringify(normalizeProgram(a)) === JSON.stringify(normalizeProgram(b))
  );
}
