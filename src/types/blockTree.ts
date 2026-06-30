import type { Block, ConditionBlockData, LoopBlockData } from './blocks';

export type BlockContainer = ConditionBlockData | LoopBlockData;

export type ConditionBranch = 'then' | 'else';

export function blockHasChildren(block: Block): block is BlockContainer {
  return block.type === 'condition' || block.type === 'loop';
}

function mapConditionBlock(
  block: ConditionBlockData,
  mapper: (block: Block) => Block,
): ConditionBlockData {
  return {
    ...block,
    children: mapBlockTree(block.children, mapper),
    elseChildren: mapBlockTree(block.elseChildren, mapper),
  };
}

export function mapBlockTree(
  blocks: Block[],
  mapper: (block: Block) => Block,
): Block[] {
  return blocks.map((block) => {
    const next = mapper(block);
    if (next.type === 'condition') {
      return mapConditionBlock(next, mapper);
    }
    if (next.type === 'loop') {
      return {
        ...next,
        children: mapBlockTree(next.children, mapper),
      };
    }
    return next;
  });
}

function updateInBlockList(
  blocks: Block[],
  blockId: string,
  updater: (block: Block) => Block,
): Block[] | null {
  let updated = false;

  const next = blocks.map((block) => {
    if (block.id === blockId) {
      updated = true;
      return updater(block);
    }
    if (block.type === 'condition') {
      const childResult = updateInBlockList(block.children, blockId, updater);
      if (childResult) {
        updated = true;
        return { ...block, children: childResult };
      }
      const elseResult = updateInBlockList(
        block.elseChildren,
        blockId,
        updater,
      );
      if (elseResult) {
        updated = true;
        return { ...block, elseChildren: elseResult };
      }
    } else if (block.type === 'loop') {
      const childResult = updateInBlockList(block.children, blockId, updater);
      if (childResult) {
        updated = true;
        return { ...block, children: childResult };
      }
    }
    return block;
  });

  return updated ? next : null;
}

export function updateBlockInTree(
  blocks: Block[],
  blockId: string,
  updater: (block: Block) => Block,
): Block[] {
  return updateInBlockList(blocks, blockId, updater) ?? blocks;
}

function removeFromBlockList(
  blocks: Block[],
  blockId: string,
): { blocks: Block[]; removed: Block | null } {
  let removed: Block | null = null;

  const next = blocks.flatMap((block) => {
    if (block.id === blockId) {
      removed = block;
      return [];
    }
    if (block.type === 'condition') {
      const childResult = removeFromBlockList(block.children, blockId);
      if (childResult.removed) {
        removed = childResult.removed;
        return [{ ...block, children: childResult.blocks }];
      }
      const elseResult = removeFromBlockList(block.elseChildren, blockId);
      if (elseResult.removed) {
        removed = elseResult.removed;
        return [{ ...block, elseChildren: elseResult.blocks }];
      }
    } else if (block.type === 'loop') {
      const childResult = removeFromBlockList(block.children, blockId);
      if (childResult.removed) {
        removed = childResult.removed;
        return [{ ...block, children: childResult.blocks }];
      }
    }
    return [block];
  });

  return { blocks: next, removed };
}

export function removeBlockFromTree(
  blocks: Block[],
  blockId: string,
): { blocks: Block[]; removed: Block | null } {
  return removeFromBlockList(blocks, blockId);
}

function insertInBlockList(
  blocks: Block[],
  parentBlockId: string,
  index: number,
  block: Block,
  branch: ConditionBranch,
): Block[] | null {
  let inserted = false;

  const next = blocks.map((entry) => {
    if (entry.id === parentBlockId && entry.type === 'condition') {
      inserted = true;
      const target =
        branch === 'else' ? [...entry.elseChildren] : [...entry.children];
      target.splice(Math.max(0, Math.min(index, target.length)), 0, block);
      return branch === 'else'
        ? { ...entry, elseChildren: target }
        : { ...entry, children: target };
    }
    if (entry.type === 'condition') {
      const childResult = insertInBlockList(
        entry.children,
        parentBlockId,
        index,
        block,
        branch,
      );
      if (childResult) {
        inserted = true;
        return { ...entry, children: childResult };
      }
      const elseResult = insertInBlockList(
        entry.elseChildren,
        parentBlockId,
        index,
        block,
        branch,
      );
      if (elseResult) {
        inserted = true;
        return { ...entry, elseChildren: elseResult };
      }
    } else if (entry.type === 'loop') {
      const childResult = insertInBlockList(
        entry.children,
        parentBlockId,
        index,
        block,
        branch,
      );
      if (childResult) {
        inserted = true;
        return { ...entry, children: childResult };
      }
    }
    return entry;
  });

  return inserted ? next : null;
}

export function insertBlockInTree(
  blocks: Block[],
  parentBlockId: string | null,
  index: number,
  block: Block,
  branch: ConditionBranch = 'then',
): Block[] {
  if (parentBlockId === null) {
    const next = [...blocks];
    next.splice(Math.max(0, Math.min(index, next.length)), 0, block);
    return next;
  }

  const inserted = insertInBlockList(
    blocks,
    parentBlockId,
    index,
    block,
    branch,
  );
  if (inserted) {
    return inserted;
  }

  return blocks.map((entry) => {
    if (entry.id === parentBlockId && entry.type === 'loop') {
      const children = [...entry.children];
      children.splice(Math.max(0, Math.min(index, children.length)), 0, block);
      return { ...entry, children };
    }
    if (entry.type === 'condition') {
      return {
        ...entry,
        children: insertBlockInTree(
          entry.children,
          parentBlockId,
          index,
          block,
          branch,
        ),
        elseChildren: insertBlockInTree(
          entry.elseChildren,
          parentBlockId,
          index,
          block,
          branch,
        ),
      };
    }
    if (entry.type === 'loop') {
      return {
        ...entry,
        children: insertBlockInTree(
          entry.children,
          parentBlockId,
          index,
          block,
          branch,
        ),
      };
    }
    return entry;
  });
}

function findInBlockList(blocks: Block[], blockId: string): Block | undefined {
  for (const block of blocks) {
    if (block.id === blockId) {
      return block;
    }
    if (block.type === 'condition') {
      const nested =
        findInBlockList(block.children, blockId) ??
        findInBlockList(block.elseChildren, blockId);
      if (nested) {
        return nested;
      }
    } else if (block.type === 'loop') {
      const nested = findInBlockList(block.children, blockId);
      if (nested) {
        return nested;
      }
    }
  }
  return undefined;
}

export function findBlockInTree(
  blocks: Block[],
  blockId: string,
): Block | undefined {
  return findInBlockList(blocks, blockId);
}

function findParentInBlockList(
  blocks: Block[],
  blockId: string,
  parentId: string | null,
): string | null | undefined {
  for (const block of blocks) {
    if (block.id === blockId) {
      return parentId;
    }
    if (block.type === 'condition') {
      const inThen = findParentInBlockList(block.children, blockId, block.id);
      if (inThen !== undefined) {
        return inThen;
      }
      const inElse = findParentInBlockList(
        block.elseChildren,
        blockId,
        block.id,
      );
      if (inElse !== undefined) {
        return inElse;
      }
    } else if (block.type === 'loop') {
      const nested = findParentInBlockList(block.children, blockId, block.id);
      if (nested !== undefined) {
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
  return findParentInBlockList(blocks, blockId, parentId);
}

export function getConditionBranchLength(
  block: ConditionBlockData,
  branch: ConditionBranch,
): number {
  return branch === 'else' ? block.elseChildren.length : block.children.length;
}

export function countBlocksInTree(blocks: Block[]): number {
  return blocks.reduce((total, block) => {
    if (block.type === 'condition') {
      return (
        total +
        1 +
        countBlocksInTree(block.children) +
        countBlocksInTree(block.elseChildren)
      );
    }
    if (block.type === 'loop') {
      return total + 1 + countBlocksInTree(block.children);
    }
    return total + 1;
  }, 0);
}
