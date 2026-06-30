import { createContext, type Dispatch } from 'react';
import type { ConditionBranch } from '../types/blockTree';
import type { Block, BlockType } from '../types/blocks';
import type { Lane } from '../types/lane';
import type { ScenarioId } from '../scenarios/types';
import type { ProgramAction, ProgramState } from './programReducer';

export type ProgramContextValue = {
  state: ProgramState;
  dispatch: Dispatch<ProgramAction>;
  addLane: () => void;
  removeLane: (laneId: string) => void;
  renameLane: (laneId: string, name: string) => void;
  selectLane: (laneId: string | null) => void;
  addBlock: (
    laneId: string,
    blockType: BlockType,
    parentBlockId?: string | null,
    index?: number,
    parentBranch?: ConditionBranch,
  ) => void;
  removeBlock: (laneId: string, blockId: string) => void;
  updateBlock: (laneId: string, block: Block) => void;
  addBlockToSelectedLane: (blockType: BlockType) => void;
  loadScenario: (lanes: Lane[], scenarioId: ScenarioId | null) => void;
  reorderLanes: (fromIndex: number, toIndex: number) => void;
  moveBlock: (
    blockId: string,
    fromLaneId: string,
    toLaneId: string,
    toParentBlockId: string | null,
    toIndex: number,
    toParentBranch?: ConditionBranch,
  ) => void;
};

export const ProgramContext = createContext<ProgramContextValue | null>(null);
