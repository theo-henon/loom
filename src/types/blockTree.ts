import type { Block, ConditionBlockData, LoopBlockData } from './blocks';

export type BlockContainer = ConditionBlockData | LoopBlockData;

export function blockHasChildren(block: Block): block is BlockContainer {
  return block.type === 'condition' || block.type === 'loop';
}

export function mapBlockTree(
  blocks: Block[],
  mapper: (block: Block) => Block,
): Block[] {
  return blocks.map((block) => {
    const next = mapper(block);
    if (blockHasChildren(next)) {
      return {
        ...next,
        children: mapBlockTree(next.children, mapper),
      };
    }
    return next;
  });
}

export function updateBlockInTree(
  blocks: Block[],
  blockId: string,
  updater: (block: Block) => Block,
): Block[] {
  return blocks.map((block) => {
    if (block.id === blockId) {
      return updater(block);
    }
    if (blockHasChildren(block)) {
      return {
        ...block,
        children: updateBlockInTree(block.children, blockId, updater),
      };
    }
    return block;
  });
}

export function removeBlockFromTree(
  blocks: Block[],
  blockId: string,
): { blocks: Block[]; removed: Block | null } {
  let removed: Block | null = null;

  const next = blocks.flatMap((block) => {
    if (block.id === blockId) {
      removed = block;
      return [];
    }
    if (blockHasChildren(block)) {
      const result = removeBlockFromTree(block.children, blockId);
      if (result.removed) {
        removed = result.removed;
        return [{ ...block, children: result.blocks }];
      }
    }
    return [block];
  });

  return { blocks: next, removed };
}

export function insertBlockInTree(
  blocks: Block[],
  parentBlockId: string | null,
  index: number,
  block: Block,
): Block[] {
  if (parentBlockId === null) {
    const next = [...blocks];
    next.splice(Math.max(0, Math.min(index, next.length)), 0, block);
    return next;
  }

  return blocks.map((entry) => {
    if (entry.id === parentBlockId && blockHasChildren(entry)) {
      const children = [...entry.children];
      children.splice(Math.max(0, Math.min(index, children.length)), 0, block);
      return { ...entry, children };
    }
    if (blockHasChildren(entry)) {
      return {
        ...entry,
        children: insertBlockInTree(
          entry.children,
          parentBlockId,
          index,
          block,
        ),
      };
    }
    return entry;
  });
}

export function findBlockInTree(
  blocks: Block[],
  blockId: string,
): Block | undefined {
  for (const block of blocks) {
    if (block.id === blockId) {
      return block;
    }
    if (blockHasChildren(block)) {
      const nested = findBlockInTree(block.children, blockId);
      if (nested) {
        return nested;
      }
    }
  }
  return undefined;
}

export function findBlockParentId(
  blocks: Block[],
  blockId: string,
  parentId: string | null = null,
): string | null | undefined {
  for (const block of blocks) {
    if (block.id === blockId) {
      return parentId;
    }
    if (blockHasChildren(block)) {
      const nested = findBlockParentId(block.children, blockId, block.id);
      if (nested !== undefined) {
        return nested;
      }
    }
  }
  return undefined;
}

export function countBlocksInTree(blocks: Block[]): number {
  return blocks.reduce((total, block) => {
    if (blockHasChildren(block)) {
      return total + 1 + countBlocksInTree(block.children);
    }
    return total + 1;
  }, 0);
}
