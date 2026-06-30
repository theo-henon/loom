import { BLOCK_TYPE_LABELS, type BlockType } from '../../types/blocks';
import { BlockTypeIcon } from './BlockTypeIcon';

type BlockTypeLabelProps = {
  type: BlockType;
  className?: string;
};

export function BlockTypeLabel({ type, className = '' }: BlockTypeLabelProps) {
  return (
    <p
      className={`flex items-center gap-2 font-medium text-gray-700 ${className}`}
    >
      <BlockTypeIcon type={type} />
      {BLOCK_TYPE_LABELS[type]}
    </p>
  );
}
