import type { Block, BlockType } from '../types/blocks';
import type { Lane } from '../types/lane';

export const SHARE_FORMAT_VERSION = 1 as const;
export const MAX_SHARED_LANES = 8;
export const MAX_BLOCKS_PER_LANE = 64;

export type SharedProgramPayload = {
  v: typeof SHARE_FORMAT_VERSION;
  title?: string;
  lanes: Lane[];
};

const BLOCK_TYPES = new Set<BlockType>([
  'variable',
  'operation',
  'condition',
  'if',
  'loop',
  'mutex',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidBlock(value: unknown, depth = 0): value is Block {
  if (depth > 12 || !isRecord(value) || typeof value.type !== 'string') {
    return false;
  }

  if (!BLOCK_TYPES.has(value.type as BlockType)) {
    return false;
  }

  switch (value.type) {
    case 'variable':
      return (
        typeof value.id === 'string' &&
        typeof value.name === 'string' &&
        typeof value.value === 'number'
      );
    case 'operation':
      return (
        typeof value.id === 'string' &&
        typeof value.targetVariable === 'string' &&
        typeof value.operator === 'string' &&
        typeof value.operand === 'number'
      );
    case 'condition':
      return (
        typeof value.id === 'string' &&
        typeof value.variable === 'string' &&
        typeof value.comparator === 'string' &&
        typeof value.value === 'number'
      );
    case 'if':
      return (
        typeof value.id === 'string' &&
        typeof value.hasElse === 'boolean' &&
        Array.isArray(value.condition) &&
        value.condition.every((block) => isValidBlock(block, depth + 1)) &&
        Array.isArray(value.children) &&
        value.children.every((block) => isValidBlock(block, depth + 1)) &&
        Array.isArray(value.elseChildren) &&
        value.elseChildren.every((block) => isValidBlock(block, depth + 1))
      );
    case 'loop':
      return (
        typeof value.id === 'string' &&
        Array.isArray(value.condition) &&
        value.condition.every((block) => isValidBlock(block, depth + 1)) &&
        Array.isArray(value.children) &&
        value.children.every((block) => isValidBlock(block, depth + 1))
      );
    case 'mutex':
      return typeof value.id === 'string' && typeof value.name === 'string';
    default:
      return false;
  }
}

function isValidLane(value: unknown): value is Lane {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.color === 'string' &&
    Array.isArray(value.blocks) &&
    value.blocks.length <= MAX_BLOCKS_PER_LANE &&
    value.blocks.every((block) => isValidBlock(block))
  );
}

export function parseSharedProgramPayload(
  value: unknown,
): SharedProgramPayload | null {
  if (!isRecord(value) || value.v !== SHARE_FORMAT_VERSION) {
    return null;
  }

  if (!Array.isArray(value.lanes) || value.lanes.length === 0) {
    return null;
  }

  if (
    value.lanes.length > MAX_SHARED_LANES ||
    !value.lanes.every((lane) => isValidLane(lane))
  ) {
    return null;
  }

  if (value.title !== undefined && typeof value.title !== 'string') {
    return null;
  }

  return {
    v: SHARE_FORMAT_VERSION,
    title: value.title,
    lanes: value.lanes as Lane[],
  };
}
