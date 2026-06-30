import type { Block, BlockContainer } from './blocks';

export type ContainerBranch = 'then' | 'else' | 'condition';

export function blockHasChildren(block: Block): block is BlockContainer {
  return block.type === 'if' || block.type === 'loop';
}

export function getContainerBranchBlocks(
  block: BlockContainer,
  branch: ContainerBranch,
): Block[] {
  if (branch === 'condition') {
    return block.condition;
  }
  if (branch === 'else' && block.type === 'if') {
    return block.elseChildren;
  }
  return block.children;
}

function setContainerBranchBlocks(
  block: BlockContainer,
  branch: ContainerBranch,
  blocks: Block[],
): BlockContainer {
  if (branch === 'condition') {
    return { ...block, condition: blocks };
  }
  if (branch === 'else' && block.type === 'if') {
    return { ...block, elseChildren: blocks };
  }
  return { ...block, children: blocks };
}

function mapContainerBlock(
  block: BlockContainer,
  mapper: (block: Block) => Block,
): BlockContainer {
  return {
    ...block,
    condition: mapBlockTree(block.condition, mapper),
    children: mapBlockTree(block.children, mapper),
    ...(block.type === 'if'
      ? { elseChildren: mapBlockTree(block.elseChildren, mapper) }
      : {}),
  };
}

export function mapBlockTree(
  blocks: Block[],
  mapper: (block: Block) => Block,
): Block[] {
  return blocks.map((block) => {
    const next = mapper(block);
    if (next.type === 'if' || next.type === 'loop') {
      return mapContainerBlock(next, mapper);
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
    if (block.type === 'if' || block.type === 'loop') {
      for (const branch of ['condition', 'then', 'else'] as const) {
        if (branch === 'else' && block.type !== 'if') {
          continue;
        }
        const branchBlocks = getContainerBranchBlocks(block, branch);
        const branchResult = updateInBlockList(branchBlocks, blockId, updater);
        if (branchResult) {
          updated = true;
          return setContainerBranchBlocks(block, branch, branchResult);
        }
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
    if (block.type === 'if' || block.type === 'loop') {
      for (const branch of ['condition', 'then', 'else'] as const) {
        if (branch === 'else' && block.type !== 'if') {
          continue;
        }
        const branchBlocks = getContainerBranchBlocks(block, branch);
        const branchResult = removeFromBlockList(branchBlocks, blockId);
        if (branchResult.removed) {
          removed = branchResult.removed;
          return [setContainerBranchBlocks(block, branch, branchResult.blocks)];
        }
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
  branch: ContainerBranch,
): Block[] | null {
  let inserted = false;

  const next = blocks.map((entry) => {
    if (
      entry.id === parentBlockId &&
      (entry.type === 'if' || entry.type === 'loop')
    ) {
      inserted = true;
      if (branch === 'condition') {
        return { ...entry, condition: [block] };
      }
      const target = [...getContainerBranchBlocks(entry, branch)];
      target.splice(Math.max(0, Math.min(index, target.length)), 0, block);
      return setContainerBranchBlocks(entry, branch, target);
    }
    if (entry.type === 'if' || entry.type === 'loop') {
      for (const childBranch of ['condition', 'then', 'else'] as const) {
        if (childBranch === 'else' && entry.type !== 'if') {
          continue;
        }
        const childBlocks = getContainerBranchBlocks(entry, childBranch);
        const childResult = insertInBlockList(
          childBlocks,
          parentBlockId,
          index,
          block,
          branch,
        );
        if (childResult) {
          inserted = true;
          return setContainerBranchBlocks(entry, childBranch, childResult);
        }
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
  branch: ContainerBranch = 'then',
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
    if (entry.type === 'if' || entry.type === 'loop') {
      return {
        ...entry,
        condition: insertBlockInTree(
          entry.condition,
          parentBlockId,
          index,
          block,
          branch,
        ),
        children: insertBlockInTree(
          entry.children,
          parentBlockId,
          index,
          block,
          branch,
        ),
        ...(entry.type === 'if'
          ? {
              elseChildren: insertBlockInTree(
                entry.elseChildren,
                parentBlockId,
                index,
                block,
                branch,
              ),
            }
          : {}),
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
    if (block.type === 'if' || block.type === 'loop') {
      for (const branch of ['condition', 'then', 'else'] as const) {
        if (branch === 'else' && block.type !== 'if') {
          continue;
        }
        const nested = findInBlockList(
          getContainerBranchBlocks(block, branch),
          blockId,
        );
        if (nested) {
          return nested;
        }
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
    if (block.type === 'if' || block.type === 'loop') {
      for (const branch of ['condition', 'then', 'else'] as const) {
        if (branch === 'else' && block.type !== 'if') {
          continue;
        }
        const nested = findParentInBlockList(
          getContainerBranchBlocks(block, branch),
          blockId,
          block.id,
        );
        if (nested !== undefined) {
          return nested;
        }
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

export function getContainerBranchLength(
  block: BlockContainer,
  branch: ContainerBranch,
): number {
  return getContainerBranchBlocks(block, branch).length;
}

export function countBlocksInTree(blocks: Block[]): number {
  return blocks.reduce((total, block) => {
    if (block.type === 'if') {
      return (
        total +
        1 +
        countBlocksInTree(block.condition) +
        countBlocksInTree(block.children) +
        countBlocksInTree(block.elseChildren)
      );
    }
    if (block.type === 'loop') {
      return (
        total +
        1 +
        countBlocksInTree(block.condition) +
        countBlocksInTree(block.children)
      );
    }
    return total + 1;
  }, 0);
}
