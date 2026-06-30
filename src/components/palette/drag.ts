import type { BlockType } from '../../types/blocks';

export const LOOM_BLOCK_TYPE_MIME = 'application/loom-block-type';

const BLOCK_TYPES: BlockType[] = ['variable', 'operation', 'condition', 'loop'];

export function setBlockTypeDragData(
  dataTransfer: DataTransfer,
  blockType: BlockType,
) {
  dataTransfer.setData(LOOM_BLOCK_TYPE_MIME, blockType);
  dataTransfer.effectAllowed = 'copy';
}

export function parseDroppedBlockType(
  dataTransfer: DataTransfer,
): BlockType | null {
  const raw = dataTransfer.getData(LOOM_BLOCK_TYPE_MIME);
  if (raw && BLOCK_TYPES.includes(raw as BlockType)) {
    return raw as BlockType;
  }
  return null;
}
