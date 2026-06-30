import { getActiveBlockId } from '../../engine/engine';
import { useExecution } from '../../hooks/useExecution';
import { useProgram } from '../../hooks/useProgram';
import type { Lane as LaneData } from '../../types/lane';
import type { ThreadStatus } from '../../types/execution';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { RemoveButton } from '../ui/RemoveButton';
import { ThreadDot } from '../visualization/ThreadDot';
import { parseDroppedBlockType } from '../palette/drag';

type LaneProps = {
  lane: LaneData;
  isSelected: boolean;
};

const STATUS_LABELS: Record<ThreadStatus, string> = {
  idle: 'En attente',
  running: 'En cours',
  blocked: 'Bloqué',
  done: 'Terminé',
};

export function Lane({ lane, isSelected }: LaneProps) {
  const {
    selectLane,
    renameLane,
    removeLane,
    addBlock,
    updateBlock,
    removeBlock,
  } = useProgram();
  const { state: engineState, isRunning } = useExecution();

  const thread = engineState.threads[lane.id];
  const activeBlockId = getActiveBlockId(lane, thread);
  const threadStatus = thread?.status ?? 'idle';

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const blockType = parseDroppedBlockType(event.dataTransfer);
    if (blockType) {
      addBlock(lane.id, blockType);
    }
  };

  return (
    <section
      className={`flex w-64 shrink-0 flex-col rounded-lg border bg-gray-50 ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-200'
          : 'border-gray-200'
      }`}
      onClick={() => selectLane(lane.id)}
      aria-label={`Lane ${lane.name}`}
    >
      <header className="flex flex-col gap-1 border-b border-gray-200 p-3">
        <div className="flex items-center gap-2">
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
        onDrop={handleDrop}
      >
        {lane.blocks.length === 0 ? (
          <p className="text-center text-xs text-gray-400">
            Déposez ou ajoutez des blocs ici.
          </p>
        ) : (
          lane.blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              onChange={(updated) => updateBlock(lane.id, updated)}
              onRemove={() => removeBlock(lane.id, block.id)}
              isActive={activeBlockId === block.id}
              threadColor={lane.color}
              threadStatus={threadStatus}
            />
          ))
        )}
      </div>
    </section>
  );
}
