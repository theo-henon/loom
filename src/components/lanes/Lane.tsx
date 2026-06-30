import { useProgram } from '../../hooks/useProgram';
import type { Lane as LaneData } from '../../types/lane';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { Button } from '../ui/Button';
import { parseDroppedBlockType } from '../palette/drag';

type LaneProps = {
  lane: LaneData;
  isSelected: boolean;
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
      <header className="flex items-center gap-2 border-b border-gray-200 p-3">
        <input
          className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm font-medium"
          value={lane.name}
          onChange={(event) => renameLane(lane.id, event.target.value)}
          onClick={(event) => event.stopPropagation()}
          aria-label="Nom de la lane"
        />
        <Button
          variant="ghost"
          className="shrink-0 text-xs"
          onClick={(event) => {
            event.stopPropagation();
            removeLane(lane.id);
          }}
        >
          Suppr.
        </Button>
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
            />
          ))
        )}
      </div>
    </section>
  );
}
