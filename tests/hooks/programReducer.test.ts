import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  initialProgramState,
  programReducer,
} from '../../src/hooks/programReducer';

describe('programReducer', () => {
  beforeEach(() => {
    let id = 0;
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => `test-uuid-${id++}`),
    });
  });

  it('starts with two lanes', () => {
    expect(initialProgramState.lanes).toHaveLength(2);
  });

  it('adds a block to a lane', () => {
    const laneId = initialProgramState.lanes[0].id;
    const next = programReducer(initialProgramState, {
      type: 'ADD_BLOCK',
      laneId,
      blockType: 'variable',
    });

    expect(next.lanes[0].blocks).toHaveLength(1);
    expect(next.lanes[0].blocks[0].type).toBe('variable');
    expect(next.selectedLaneId).toBe(laneId);
  });

  it('adds multiple blocks to the same lane', () => {
    const laneId = initialProgramState.lanes[0].id;
    let state = programReducer(initialProgramState, {
      type: 'ADD_BLOCK',
      laneId,
      blockType: 'variable',
      parentBlockId: null,
    });
    state = programReducer(state, {
      type: 'ADD_BLOCK',
      laneId,
      blockType: 'operation',
      parentBlockId: null,
    });

    expect(state.lanes[0].blocks).toHaveLength(2);
    expect(state.lanes[0].blocks.map((block) => block.type)).toEqual([
      'variable',
      'operation',
    ]);
  });

  it('adds multiple blocks inside an if branch', () => {
    const laneId = initialProgramState.lanes[0].id;
    let state = programReducer(initialProgramState, {
      type: 'ADD_BLOCK',
      laneId,
      blockType: 'if',
      parentBlockId: null,
    });
    const ifId = state.lanes[0].blocks[0].id;

    state = programReducer(state, {
      type: 'ADD_BLOCK',
      laneId,
      blockType: 'variable',
      parentBlockId: ifId,
      parentBranch: 'then',
    });
    state = programReducer(state, {
      type: 'ADD_BLOCK',
      laneId,
      blockType: 'operation',
      parentBlockId: ifId,
      parentBranch: 'then',
    });

    const ifBlock = state.lanes[0].blocks[0];
    expect(ifBlock.type).toBe('if');
    if (ifBlock.type === 'if') {
      expect(ifBlock.children).toHaveLength(2);
      expect(ifBlock.children.map((block) => block.type)).toEqual([
        'variable',
        'operation',
      ]);
    }
  });

  it('rejects adding a condition block at lane root', () => {
    const laneId = initialProgramState.lanes[0].id;
    const next = programReducer(initialProgramState, {
      type: 'ADD_BLOCK',
      laneId,
      blockType: 'condition',
      parentBlockId: null,
    });

    expect(next.lanes[0].blocks).toHaveLength(0);
  });

  it('renames a lane', () => {
    const laneId = initialProgramState.lanes[0].id;
    const next = programReducer(initialProgramState, {
      type: 'RENAME_LANE',
      laneId,
      name: 'Worker A',
    });

    expect(next.lanes[0].name).toBe('Worker A');
  });

  it('removes a lane and reselects the first remaining lane', () => {
    const laneId = initialProgramState.lanes[0].id;
    const next = programReducer(
      { ...initialProgramState, selectedLaneId: laneId },
      { type: 'REMOVE_LANE', laneId },
    );

    expect(next.lanes).toHaveLength(1);
    expect(next.selectedLaneId).toBe(next.lanes[0].id);
  });

  it('loads a scenario and replaces lanes', () => {
    const scenarioLanes = [
      {
        ...initialProgramState.lanes[0],
        name: 'Scénario',
        blocks: [{ id: 'b1', type: 'variable' as const, name: 'x', value: 0 }],
      },
    ];

    const next = programReducer(initialProgramState, {
      type: 'LOAD_SCENARIO',
      lanes: scenarioLanes,
      scenarioId: 'deadlock',
    });

    expect(next.lanes).toHaveLength(1);
    expect(next.lanes[0].name).toBe('Scénario');
    expect(next.activeScenarioId).toBe('deadlock');
    expect(next.selectedLaneId).toBe(scenarioLanes[0].id);
  });

  it('reorders lanes', () => {
    const laneA = { ...initialProgramState.lanes[0], name: 'A' };
    const laneB = { ...initialProgramState.lanes[1], name: 'B' };
    const state = { ...initialProgramState, lanes: [laneA, laneB] };

    const next = programReducer(state, {
      type: 'REORDER_LANES',
      fromIndex: 0,
      toIndex: 1,
    });

    expect(next.lanes.map((lane) => lane.name)).toEqual(['B', 'A']);
  });

  it('moves a block to another lane', () => {
    const block = { id: 'b1', type: 'variable' as const, name: 'x', value: 0 };
    const laneA = { ...initialProgramState.lanes[0], blocks: [block] };
    const laneB = { ...initialProgramState.lanes[1], blocks: [] };
    const state = { ...initialProgramState, lanes: [laneA, laneB] };

    const next = programReducer(state, {
      type: 'MOVE_BLOCK',
      blockId: 'b1',
      fromLaneId: laneA.id,
      toLaneId: laneB.id,
      toParentBlockId: null,
      toIndex: 0,
    });

    expect(next.lanes[0].blocks).toHaveLength(0);
    expect(next.lanes[1].blocks).toHaveLength(1);
    expect(next.lanes[1].blocks[0].id).toBe('b1');
  });
});
