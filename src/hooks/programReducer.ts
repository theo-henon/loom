import { createBlock, type Block, type BlockType } from '../types/blocks';
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
  | { type: 'ADD_BLOCK'; laneId: string; blockType: BlockType }
  | { type: 'REMOVE_BLOCK'; laneId: string; blockId: string }
  | { type: 'UPDATE_BLOCK'; laneId: string; block: Block }
  | {
      type: 'LOAD_SCENARIO';
      lanes: Lane[];
      scenarioId: ScenarioId | null;
    };

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
        lanes: state.lanes.map((lane) =>
          lane.id === action.laneId
            ? {
                ...lane,
                blocks: [...lane.blocks, createBlock(action.blockType)],
              }
            : lane,
        ),
        selectedLaneId: action.laneId,
      };
    case 'REMOVE_BLOCK':
      return {
        ...state,
        lanes: state.lanes.map((lane) =>
          lane.id === action.laneId
            ? {
                ...lane,
                blocks: lane.blocks.filter(
                  (block) => block.id !== action.blockId,
                ),
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
                blocks: lane.blocks.map((block) =>
                  block.id === action.block.id ? action.block : block,
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
  }
}
