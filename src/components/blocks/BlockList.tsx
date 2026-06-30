import type { Block, BlockType } from '../../types/blocks';
import type { ContainerBranch } from '../../types/blockTree';
import type { ThreadStatus } from '../../types/execution';
import { useProgram } from '../../hooks/useProgram';
import { parseBlockDragData, parseDroppedBlockType } from '../palette/drag';
import { BlockRenderer } from './BlockRenderer';

type BlockListProps = {
  laneId: string;
  blocks: Block[];
  parentBlockId: string | null;
  parentBranch?: ContainerBranch;
  allowedBlockTypes?: BlockType[];
  activeBlockId: string | null;
  threadColor: string;
  threadStatus: ThreadStatus;
  isRunning: boolean;
  getMutexOwnerLabel: (mutexName: string) => string | null;
  emptyLabel?: string;
  appendLabel?: string;
};

export function BlockList({
  laneId,
  blocks,
  parentBlockId,
  parentBranch = 'then',
  allowedBlockTypes,
  activeBlockId,
  threadColor,
  threadStatus,
  isRunning,
  getMutexOwnerLabel,
  emptyLabel = 'Glissez des blocs ici.',
  appendLabel = 'Déposer ici pour ajouter en bas',
}: BlockListProps) {
  const { addBlock, updateBlock, removeBlock, moveBlock } = useProgram();

  const canAcceptBlockType = (blockType: BlockType) =>
    !allowedBlockTypes || allowedBlockTypes.includes(blockType);

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const blockType = parseDroppedBlockType(event.dataTransfer);
    if (blockType) {
      if (!canAcceptBlockType(blockType)) {
        return;
      }
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

  const handleAppendDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (parentBranch === 'condition' && blocks.length >= 1) {
      return;
    }
    handleDrop(event, blocks.length);
  };

  const showAppendZone =
    appendLabel.length > 0 &&
    !(parentBranch === 'condition' && blocks.length >= 1);

  if (blocks.length === 0) {
    return (
      <div
        className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-3"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleAppendDrop}
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
      {showAppendZone ? (
        <div
          className="rounded-lg border border-dashed border-transparent p-3 transition-colors hover:border-gray-300 hover:bg-gray-50/50"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleAppendDrop}
        >
          <p className="text-center text-xs text-gray-400">{appendLabel}</p>
        </div>
      ) : null}
    </div>
  );
}

export type NestedBlockListProps = Omit<
  BlockListProps,
  'laneId' | 'blocks' | 'parentBlockId' | 'emptyLabel' | 'appendLabel'
>;
