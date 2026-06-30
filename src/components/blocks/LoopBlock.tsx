import type { LoopBlockData } from '../../types/blocks';
import { BlockList, type NestedBlockListProps } from './BlockList';

type LoopBlockProps = {
  block: LoopBlockData;
  laneId: string;
  nestedListProps: NestedBlockListProps;
};

export function LoopBlock({ block, laneId, nestedListProps }: LoopBlockProps) {
  return (
    <div className="space-y-1.5 text-xs">
      <div>
        <p className="mb-1 font-medium text-gray-500">Tant que</p>
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

      <div>
        <p className="mb-1 font-medium text-gray-500">Corps</p>
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
