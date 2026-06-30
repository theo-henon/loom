import { useCallback } from 'react';
import { getActiveBlockId } from '../../engine/engine';
import { useEditorLayout } from '../../hooks/editorLayoutContext';
import { useExecution } from '../../hooks/useExecution';
import { usePointerResize } from '../../hooks/usePointerResize';
import { useProgram } from '../../hooks/useProgram';
import { getLaneWidth } from '../../types/editorLayout';
import type { Lane as LaneData } from '../../types/lane';
import type { ThreadStatus } from '../../types/execution';
import { BlockRenderer } from '../blocks/BlockRenderer';
import {
  parseBlockDragData,
  parseDroppedBlockType,
  parseLaneDragData,
  setLaneDragData,
} from '../palette/drag';
import { ResizeHandle } from '../layout/ResizeHandle';
import { RemoveButton } from '../ui/RemoveButton';
import { ThreadDot } from '../visualization/ThreadDot';

type LaneProps = {
  lane: LaneData;
  laneIndex: number;
  isSelected: boolean;
};

const STATUS_LABELS: Record<ThreadStatus, string> = {
  idle: 'En attente',
  running: 'En cours',
  blocked: 'Bloqué',
  done: 'Terminé',
};

export function Lane({ lane, laneIndex, isSelected }: LaneProps) {
  const {
    state: programState,
    selectLane,
    renameLane,
    removeLane,
    addBlock,
    updateBlock,
    removeBlock,
    reorderLanes,
    moveBlock,
  } = useProgram();
  const { layout, adjustLaneWidth } = useEditorLayout();
  const { state: engineState, isRunning } = useExecution();

  const thread = engineState.threads[lane.id];
  const activeBlockId = getActiveBlockId(lane, thread);
  const threadStatus = thread?.status ?? 'idle';
  const laneWidth = getLaneWidth(layout, lane.id);

  const resizeLane = usePointerResize({
    axis: 'x',
    onResize: useCallback(
      (delta) => adjustLaneWidth(lane.id, delta),
      [adjustLaneWidth, lane.id],
    ),
  });

  const handlePaletteDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const blockType = parseDroppedBlockType(event.dataTransfer);
    if (blockType) {
      addBlock(lane.id, blockType);
      return;
    }

    const blockDrag = parseBlockDragData(event.dataTransfer);
    if (blockDrag) {
      moveBlock(
        blockDrag.blockId,
        blockDrag.laneId,
        lane.id,
        lane.blocks.length,
      );
    }
  };

  const handleBlockDrop = (
    event: React.DragEvent<HTMLDivElement>,
    toIndex: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const blockDrag = parseBlockDragData(event.dataTransfer);
    if (blockDrag) {
      moveBlock(blockDrag.blockId, blockDrag.laneId, lane.id, toIndex);
    }
  };

  const handleLaneHeaderDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const draggedLaneId = parseLaneDragData(event.dataTransfer);
    if (!draggedLaneId || draggedLaneId === lane.id) {
      return;
    }

    const fromIndex = programState.lanes.findIndex(
      (entry) => entry.id === draggedLaneId,
    );
    if (fromIndex === -1) {
      return;
    }

    reorderLanes(fromIndex, laneIndex);
  };

  return (
    <section
      className={`relative flex h-full min-h-0 shrink-0 flex-col rounded-lg border bg-gray-50 ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-200'
          : 'border-gray-200'
      }`}
      style={{ width: laneWidth }}
      onClick={() => selectLane(lane.id)}
      aria-label={`Lane ${lane.name}`}
    >
      <header
        className="flex flex-col gap-1 border-b border-gray-200 p-3"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleLaneHeaderDrop}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cursor-grab touch-none rounded px-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 active:cursor-grabbing"
            draggable={!isRunning}
            aria-label={`Déplacer ${lane.name}`}
            onClick={(event) => event.stopPropagation()}
            onDragStart={(event) => {
              setLaneDragData(event.dataTransfer, lane.id);
            }}
          >
            ⠿
          </button>
          <ThreadDot color={lane.color} status={threadStatus} size="sm" />
          <input
            className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm font-medium"
            value={lane.name}
            onChange={(event) => renameLane(lane.id, event.target.value)}
            onClick={(event) => event.stopPropagation()}
            aria-label="Nom de la lane"
            disabled={isRunning}
          />
          <RemoveButton
            label="Supprimer la lane"
            disabled={isRunning}
            onClick={(event) => {
              event.stopPropagation();
              removeLane(lane.id);
            }}
          />
        </div>
        <span className="text-xs text-gray-500">
          {STATUS_LABELS[threadStatus]}
        </span>
      </header>

      <div
        className="flex flex-1 flex-col gap-3 overflow-y-auto p-3"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handlePaletteDrop}
      >
        {lane.blocks.length === 0 ? (
          <p className="text-center text-xs text-gray-400">
            Déposez ou ajoutez des blocs ici.
          </p>
        ) : (
          lane.blocks.map((block, blockIndex) => (
            <div
              key={block.id}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleBlockDrop(event, blockIndex)}
            >
              <BlockRenderer
                block={block}
                laneId={lane.id}
                onChange={(updated) => updateBlock(lane.id, updated)}
                onRemove={() => removeBlock(lane.id, block.id)}
                isActive={activeBlockId === block.id}
                threadColor={lane.color}
                threadStatus={threadStatus}
                draggable={!isRunning}
              />
            </div>
          ))
        )}
      </div>

      <div className="absolute bottom-0 right-0 top-0 flex w-2 translate-x-1/2 items-stretch">
        <ResizeHandle
          orientation="vertical"
          label={`Redimensionner ${lane.name}`}
          onPointerDown={resizeLane}
        />
      </div>
    </section>
  );
}
