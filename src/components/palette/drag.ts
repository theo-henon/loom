import type { BlockType } from '../../types/blocks';

export const LOOM_BLOCK_TYPE_MIME = 'application/loom-block-type';
export const LOOM_BLOCK_MIME = 'application/loom-block';
export const LOOM_LANE_MIME = 'application/loom-lane';

const BLOCK_TYPES: BlockType[] = [
  'variable',
  'operation',
  'condition',
  'loop',
  'mutex',
];

export type BlockDragPayload = {
  blockId: string;
  laneId: string;
};

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

export function setBlockDragData(
  dataTransfer: DataTransfer,
  payload: BlockDragPayload,
) {
  dataTransfer.setData(LOOM_BLOCK_MIME, JSON.stringify(payload));
  dataTransfer.effectAllowed = 'move';
}

export function parseBlockDragData(
  dataTransfer: DataTransfer,
): BlockDragPayload | null {
  const raw = dataTransfer.getData(LOOM_BLOCK_MIME);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as BlockDragPayload;
    if (parsed.blockId && parsed.laneId) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setLaneDragData(dataTransfer: DataTransfer, laneId: string) {
  dataTransfer.setData(LOOM_LANE_MIME, laneId);
  dataTransfer.effectAllowed = 'move';
}

export function parseLaneDragData(dataTransfer: DataTransfer): string | null {
  const raw = dataTransfer.getData(LOOM_LANE_MIME);
  return raw || null;
}
