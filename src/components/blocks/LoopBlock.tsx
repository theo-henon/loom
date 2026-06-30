import type { LoopBlockData } from '../../types/blocks';
import { BlockTypeLabel } from './BlockTypeLabel';
import { BlockList, type NestedBlockListProps } from './BlockList';

type LoopBlockProps = {
  block: LoopBlockData;
  laneId: string;
  nestedListProps: NestedBlockListProps;
};

export function LoopBlock({ block, laneId, nestedListProps }: LoopBlockProps) {
  return (
    <div className="space-y-2 text-sm">
      <BlockTypeLabel type="loop" />
      <p className="text-xs text-gray-400">
        Tant que la condition est vraie, les blocs du corps sont répétés.
      </p>

      <div className="mt-3">
        <p className="mb-2 text-xs font-medium text-gray-500">Tant que</p>
        <BlockList
          laneId={laneId}
          blocks={block.condition}
          parentBlockId={block.id}
          parentBranch="condition"
          allowedBlockTypes={['condition']}
          emptyLabel="Glissez un bloc Condition ici."
          appendLabel=""
          {...nestedListProps}
        />
      </div>

      <div className="mt-3">
        <p className="mb-2 text-xs font-medium text-gray-500">Corps</p>
        <BlockList
          laneId={laneId}
          blocks={block.children}
          parentBlockId={block.id}
          parentBranch="then"
          {...nestedListProps}
        />
      </div>
    </div>
  );
}
