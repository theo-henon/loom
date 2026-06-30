import { useProgram } from '../../hooks/useProgram';
import {
  BLOCK_HELP_TEXT,
  BLOCK_TYPE_LABELS,
  type BlockType,
} from '../../types/blocks';
import { BlockTypeLabel } from '../blocks/BlockTypeLabel';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { setBlockTypeDragData } from './drag';

const BLOCK_TYPES: BlockType[] = [
  'variable',
  'operation',
  'condition',
  'if',
  'loop',
  'mutex',
];

export function BlockPalette() {
  const { addBlockToSelectedLane } = useProgram();

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">
        Cliquez ou glissez un bloc vers une lane.
      </p>
      {BLOCK_TYPES.map((blockType) => (
        <Tooltip
          key={blockType}
          content={BLOCK_HELP_TEXT[blockType]}
          className="w-full"
        >
          <Button
            variant="secondary"
            className="flex w-full cursor-grab items-center gap-2 text-left active:cursor-grabbing"
            draggable
            aria-label={`Ajouter bloc ${BLOCK_TYPE_LABELS[blockType]}`}
            onDragStart={(event) =>
              setBlockTypeDragData(event.dataTransfer, blockType)
            }
            onClick={() => {
              if (blockType !== 'condition') {
                addBlockToSelectedLane(blockType);
              }
            }}
          >
            <BlockTypeLabel type={blockType} showTooltip={false} />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
