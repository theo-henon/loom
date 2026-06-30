import { createBlock, type Block, type BlockType } from '../types/blocks';
import {
  getConditionBranchLength,
  insertBlockInTree,
  removeBlockFromTree,
  updateBlockInTree,
  type ConditionBranch,
} from '../types/blockTree';
import { createLane, type Lane } from '../types/lane';
import type { ScenarioId } from '../scenarios/types';

export type ProgramState = {
  lanes: Lane[];
  selectedLaneId: string | null;
  activeScenarioId: ScenarioId | null;
};

export type ProgramAction =
  | { type: 'ADD_LANE' }
  | { type: 'REMOVE_LANE'; laneId: string }
  | { type: 'RENAME_LANE'; laneId: string; name: string }
  | { type: 'SELECT_LANE'; laneId: string | null }
  | {
      type: 'ADD_BLOCK';
      laneId: string;
      blockType: BlockType;
      parentBlockId?: string | null;
      parentBranch?: ConditionBranch;
      index?: number;
    }
  | { type: 'REMOVE_BLOCK'; laneId: string; blockId: string }
  | { type: 'UPDATE_BLOCK'; laneId: string; block: Block }
  | {
      type: 'LOAD_SCENARIO';
      lanes: Lane[];
      scenarioId: ScenarioId | null;
    }
  | { type: 'REORDER_LANES'; fromIndex: number; toIndex: number }
  | {
      type: 'MOVE_BLOCK';
      blockId: string;
      fromLaneId: string;
      toLaneId: string;
      toParentBlockId: string | null;
      toParentBranch?: ConditionBranch;
      toIndex: number;
    };

function reorderItems<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) {
    return items;
  }

  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function getChildCountForParent(
  blocks: Block[],
  parentBlockId: string | null,
  branch: ConditionBranch = 'then',
): number {
  if (parentBlockId === null) {
    return blocks.length;
  }

  for (const block of blocks) {
    if (block.id === parentBlockId && block.type === 'condition') {
      return getConditionBranchLength(block, branch);
    }
    if (block.id === parentBlockId && block.type === 'loop') {
      return block.children.length;
    }
    if (block.type === 'condition') {
      const nested = getChildCountForParent(
        block.children,
        parentBlockId,
        branch,
      );
      if (nested !== -1) {
        return nested;
      }
      const nestedElse = getChildCountForParent(
        block.elseChildren,
        parentBlockId,
        branch,
      );
      if (nestedElse !== -1) {
        return nestedElse;
      }
    } else if (block.type === 'loop') {
      const nested = getChildCountForParent(
        block.children,
        parentBlockId,
        branch,
      );
      if (nested !== -1) {
        return nested;
      }
    }
  }

  return -1;
}

export const initialProgramState: ProgramState = {
  lanes: [createLane(1), createLane(2)],
  selectedLaneId: null,
  activeScenarioId: null,
};

export function programReducer(
  state: ProgramState,
  action: ProgramAction,
): ProgramState {
  switch (action.type) {
    case 'ADD_LANE': {
      const lane = createLane(state.lanes.length + 1);
      return {
        ...state,
        lanes: [...state.lanes, lane],
        selectedLaneId: lane.id,
      };
    }
    case 'REMOVE_LANE': {
      const lanes = state.lanes.filter((lane) => lane.id !== action.laneId);
      const selectedLaneId =
        state.selectedLaneId === action.laneId
          ? (lanes[0]?.id ?? null)
          : state.selectedLaneId;
      return { ...state, lanes, selectedLaneId };
    }
    case 'RENAME_LANE':
      return {
        ...state,
        lanes: state.lanes.map((lane) =>
          lane.id === action.laneId ? { ...lane, name: action.name } : lane,
        ),
      };
    case 'SELECT_LANE':
      return { ...state, selectedLaneId: action.laneId };
    case 'ADD_BLOCK':
      return {
        ...state,
        lanes: state.lanes.map((lane) => {
          if (lane.id !== action.laneId) {
            return lane;
          }

          const parentBlockId = action.parentBlockId ?? null;
          const branch = action.parentBranch ?? 'then';
          const childCount = getChildCountForParent(
            lane.blocks,
            parentBlockId,
            branch,
          );
          if (childCount === -1) {
            return lane;
          }

          const insertAt = action.index ?? childCount;

          return {
            ...lane,
            blocks: insertBlockInTree(
              lane.blocks,
              parentBlockId,
              insertAt,
              createBlock(action.blockType),
              branch,
            ),
          };
        }),
        selectedLaneId: action.laneId,
      };
    case 'REMOVE_BLOCK':
      return {
        ...state,
        lanes: state.lanes.map((lane) =>
          lane.id === action.laneId
            ? {
                ...lane,
                blocks: removeBlockFromTree(lane.blocks, action.blockId).blocks,
              }
            : lane,
        ),
      };
    case 'UPDATE_BLOCK':
      return {
        ...state,
        lanes: state.lanes.map((lane) =>
          lane.id === action.laneId
            ? {
                ...lane,
                blocks: updateBlockInTree(
                  lane.blocks,
                  action.block.id,
                  () => action.block,
                ),
              }
            : lane,
        ),
      };
    case 'LOAD_SCENARIO':
      return {
        lanes: action.lanes,
        selectedLaneId: action.lanes[0]?.id ?? null,
        activeScenarioId: action.scenarioId,
      };
    case 'REORDER_LANES':
      return {
        ...state,
        lanes: reorderItems(state.lanes, action.fromIndex, action.toIndex),
      };
    case 'MOVE_BLOCK': {
      const fromLane = state.lanes.find(
        (lane) => lane.id === action.fromLaneId,
      );
      if (!fromLane) {
        return state;
      }

      const { blocks: withoutBlock, removed } = removeBlockFromTree(
        fromLane.blocks,
        action.blockId,
      );
      if (!removed) {
        return state;
      }

      const lanesWithoutBlock = state.lanes.map((lane) =>
        lane.id === action.fromLaneId
          ? { ...lane, blocks: withoutBlock }
          : lane,
      );

      return {
        ...state,
        lanes: lanesWithoutBlock.map((lane) => {
          if (lane.id !== action.toLaneId) {
            return lane;
          }

          return {
            ...lane,
            blocks: insertBlockInTree(
              lane.blocks,
              action.toParentBlockId,
              action.toIndex,
              removed,
              action.toParentBranch ?? 'then',
            ),
          };
        }),
        selectedLaneId: action.toLaneId,
      };
    }
  }
}
