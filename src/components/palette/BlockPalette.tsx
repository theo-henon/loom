import { useProgram } from '../../hooks/useProgram';
import { BLOCK_TYPE_LABELS, type BlockType } from '../../types/blocks';
import { BlockTypeIcon } from '../blocks/BlockTypeIcon';
import { Button } from '../ui/Button';
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
        <Button
          key={blockType}
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
          disabled={blockType === 'condition'}
          title={
            blockType === 'condition'
              ? 'Glissez ce bloc dans un Si...Alors ou une Boucle'
              : undefined
          }
        >
          <BlockTypeIcon type={blockType} />
          {BLOCK_TYPE_LABELS[blockType]}
        </Button>
      ))}
    </div>
  );
}
