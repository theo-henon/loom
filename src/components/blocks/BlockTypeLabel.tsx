import { BLOCK_HELP_TEXT, BLOCK_TYPE_LABELS, type BlockType } from '../../types/blocks';
import { Tooltip } from '../ui/Tooltip';
import { BlockTypeIcon } from './BlockTypeIcon';

type BlockTypeLabelProps = {
  type: BlockType;
  className?: string;
  showTooltip?: boolean;
  compact?: boolean;
};

export function BlockTypeLabel({
  type,
  className = '',
  showTooltip = true,
  compact = false,
}: BlockTypeLabelProps) {
  const helpText = BLOCK_HELP_TEXT[type];
  const label = (
    <span
      tabIndex={showTooltip ? 0 : undefined}
      className={`flex min-w-0 items-center font-medium text-gray-700 ${compact ? 'gap-1 text-xs' : 'gap-2'} ${showTooltip ? 'cursor-help rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-400' : ''} ${className}`}
    >
      <BlockTypeIcon type={type} compact={compact} />
      <span className="truncate">{BLOCK_TYPE_LABELS[type]}</span>
    </span>
  );

  if (!showTooltip) {
    return label;
  }

  return <Tooltip content={helpText}>{label}</Tooltip>;
}
