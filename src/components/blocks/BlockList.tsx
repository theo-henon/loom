import type { Block } from '../../types/blocks';
import type { ConditionBranch } from '../../types/blockTree';
import type { ThreadStatus } from '../../types/execution';
import { useProgram } from '../../hooks/useProgram';
import { parseBlockDragData, parseDroppedBlockType } from '../palette/drag';
import { BlockRenderer } from './BlockRenderer';

type BlockListProps = {
  laneId: string;
  blocks: Block[];
  parentBlockId: string | null;
  parentBranch?: ConditionBranch;
  activeBlockId: string | null;
  threadColor: string;
  threadStatus: ThreadStatus;
  isRunning: boolean;
  getMutexOwnerLabel: (mutexName: string) => string | null;
  emptyLabel?: string;
};

export function BlockList({
  laneId,
  blocks,
  parentBlockId,
  parentBranch = 'then',
  activeBlockId,
  threadColor,
  threadStatus,
  isRunning,
  getMutexOwnerLabel,
  emptyLabel = 'Glissez des blocs ici.',
}: BlockListProps) {
  const { addBlock, updateBlock, removeBlock, moveBlock } = useProgram();

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const blockType = parseDroppedBlockType(event.dataTransfer);
    if (blockType) {
      addBlock(laneId, blockType, parentBlockId, index, parentBranch);
      return;
    }

    const blockDrag = parseBlockDragData(event.dataTransfer);
    if (blockDrag) {
      moveBlock(
        blockDrag.blockId,
        blockDrag.laneId,
        laneId,
        parentBlockId,
        index,
        parentBranch,
      );
    }
  };

  const handlePaletteDropAtEnd = (event: React.DragEvent<HTMLDivElement>) => {
    handleDrop(event, blocks.length);
  };

  if (blocks.length === 0) {
    return (
      <div
        className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-3"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handlePaletteDropAtEnd}
      >
        <p className="text-center text-xs text-gray-400">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, blockIndex) => (
        <div
          key={block.id}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDrop(event, blockIndex)}
        >
          <BlockRenderer
            block={block}
            laneId={laneId}
            onChange={(updated) => updateBlock(laneId, updated)}
            onRemove={() => removeBlock(laneId, block.id)}
            isActive={activeBlockId === block.id}
            threadColor={threadColor}
            threadStatus={threadStatus}
            draggable={!isRunning}
            mutexOwnerLabel={
              block.type === 'mutex' ? getMutexOwnerLabel(block.name) : null
            }
            nestedListProps={{
              activeBlockId,
              threadColor,
              threadStatus,
              isRunning,
              getMutexOwnerLabel,
            }}
          />
        </div>
      ))}
      <div
        className="h-2 rounded border border-dashed border-transparent hover:border-gray-300"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handlePaletteDropAtEnd}
        aria-hidden
      />
    </div>
  );
}

export type NestedBlockListProps = Omit<
  BlockListProps,
  'laneId' | 'blocks' | 'parentBlockId' | 'emptyLabel'
>;
