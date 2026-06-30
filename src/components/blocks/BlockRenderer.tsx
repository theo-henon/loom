import type { Block } from '../../types/blocks';
import { Button } from '../ui/Button';
import { ConditionBlock } from './ConditionBlock';
import { LoopBlock } from './LoopBlock';
import { OperationBlock } from './OperationBlock';
import { VariableBlock } from './VariableBlock';

type BlockRendererProps = {
  block: Block;
  onChange: (block: Block) => void;
  onRemove: () => void;
  isActive?: boolean;
  isBlocked?: boolean;
};

export function BlockRenderer({
  block,
  onChange,
  onRemove,
  isActive = false,
  isBlocked = false,
}: BlockRendererProps) {
  const highlightClass = isBlocked
    ? 'ring-2 ring-amber-400'
    : isActive
      ? 'ring-2 ring-indigo-400'
      : '';

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-3 shadow-sm ${highlightClass}`}
    >
      <div className="mb-2 flex justify-end">
        <Button variant="ghost" className="text-xs" onClick={onRemove}>
          Supprimer
        </Button>
      </div>
      {block.type === 'variable' && (
        <VariableBlock block={block} onChange={onChange} />
      )}
      {block.type === 'operation' && (
        <OperationBlock block={block} onChange={onChange} />
      )}
      {block.type === 'condition' && (
        <ConditionBlock block={block} onChange={onChange} />
      )}
      {block.type === 'loop' && <LoopBlock block={block} onChange={onChange} />}
    </div>
  );
}
