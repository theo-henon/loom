import { createContext, type Dispatch } from 'react';
import type { Block, BlockType } from '../types/blocks';
import type { ProgramAction, ProgramState } from './programReducer';

export type ProgramContextValue = {
  state: ProgramState;
  dispatch: Dispatch<ProgramAction>;
  addLane: () => void;
  removeLane: (laneId: string) => void;
  renameLane: (laneId: string, name: string) => void;
  selectLane: (laneId: string | null) => void;
  addBlock: (laneId: string, blockType: BlockType) => void;
  removeBlock: (laneId: string, blockId: string) => void;
  updateBlock: (laneId: string, block: Block) => void;
  addBlockToSelectedLane: (blockType: BlockType) => void;
};

export const ProgramContext = createContext<ProgramContextValue | null>(null);
