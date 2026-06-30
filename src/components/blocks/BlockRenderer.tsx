import type { CSSProperties } from 'react';
import type { Block } from '../../types/blocks';
import type { ThreadStatus } from '../../types/execution';
import { RemoveButton } from '../ui/RemoveButton';
import { ThreadDot } from '../visualization/ThreadDot';
import { ConditionBlock } from './ConditionBlock';
import { LoopBlock } from './LoopBlock';
import { OperationBlock } from './OperationBlock';
import { VariableBlock } from './VariableBlock';

type BlockRendererProps = {
  block: Block;
  onChange: (block: Block) => void;
  onRemove: () => void;
  isActive?: boolean;
  threadColor?: string;
  threadStatus?: ThreadStatus;
};

export function BlockRenderer({
  block,
  onChange,
  onRemove,
  isActive = false,
  threadColor,
  threadStatus = 'idle',
}: BlockRendererProps) {
  return (
    <div
      className={`relative rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow duration-300 ${
        isActive && threadColor ? 'shadow-md' : ''
      }`}
      style={
        isActive && threadColor
          ? ({ boxShadow: `0 0 0 2px ${threadColor}` } as CSSProperties)
          : undefined
      }
    >
      {isActive && threadColor && (
        <div
          className="absolute -left-1.5 -top-1.5 z-10 transition-transform duration-300 ease-in-out"
          data-testid="thread-dot"
        >
          <ThreadDot
            color={threadColor}
            status={threadStatus === 'blocked' ? 'blocked' : 'running'}
          />
        </div>
      )}
      <div className="mb-2 flex justify-end">
        <RemoveButton label="Supprimer le bloc" onClick={onRemove} />
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
