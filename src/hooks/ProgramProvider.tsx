import { useReducer, type ReactNode } from 'react';
import type { BlockType } from '../types/blocks';
import { ProgramContext, type ProgramContextValue } from './programContext';
import { initialProgramState, programReducer } from './programReducer';

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(programReducer, initialProgramState);

  const value: ProgramContextValue = {
    state,
    dispatch,
    addLane: () => dispatch({ type: 'ADD_LANE' }),
    removeLane: (laneId) => dispatch({ type: 'REMOVE_LANE', laneId }),
    renameLane: (laneId, name) =>
      dispatch({ type: 'RENAME_LANE', laneId, name }),
    selectLane: (laneId) => dispatch({ type: 'SELECT_LANE', laneId }),
    addBlock: (laneId, blockType, parentBlockId = null, index, parentBranch) =>
      dispatch({
        type: 'ADD_BLOCK',
        laneId,
        blockType,
        parentBlockId,
        parentBranch,
        index,
      }),
    removeBlock: (laneId, blockId) =>
      dispatch({ type: 'REMOVE_BLOCK', laneId, blockId }),
    updateBlock: (laneId, block) =>
      dispatch({ type: 'UPDATE_BLOCK', laneId, block }),
    loadScenario: (lanes, scenarioId) =>
      dispatch({ type: 'LOAD_SCENARIO', lanes, scenarioId }),
    reorderLanes: (fromIndex, toIndex) =>
      dispatch({ type: 'REORDER_LANES', fromIndex, toIndex }),
    moveBlock: (
      blockId,
      fromLaneId,
      toLaneId,
      toParentBlockId,
      toIndex,
      toParentBranch,
    ) =>
      dispatch({
        type: 'MOVE_BLOCK',
        blockId,
        fromLaneId,
        toLaneId,
        toParentBlockId,
        toParentBranch,
        toIndex,
      }),
    addBlockToSelectedLane: (blockType: BlockType) => {
      const laneId = state.selectedLaneId ?? state.lanes[0]?.id ?? null;
      if (laneId) {
        dispatch({ type: 'ADD_BLOCK', laneId, blockType, parentBlockId: null });
      }
    },
  };

  return (
    <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>
  );
}
