import type { CSSProperties } from 'react';
import type { Block } from '../../types/blocks';
import type { ThreadStatus } from '../../types/execution';
import { setBlockDragData } from '../palette/drag';
import { RemoveButton } from '../ui/RemoveButton';
import { ThreadDot } from '../visualization/ThreadDot';
import { ConditionBlock } from './ConditionBlock';
import { LoopBlock } from './LoopBlock';
import { OperationBlock } from './OperationBlock';
import { VariableBlock } from './VariableBlock';

type BlockRendererProps = {
  block: Block;
  laneId: string;
  onChange: (block: Block) => void;
  onRemove: () => void;
  isActive?: boolean;
  threadColor?: string;
  threadStatus?: ThreadStatus;
  draggable?: boolean;
};

export function BlockRenderer({
  block,
  laneId,
  onChange,
  onRemove,
  isActive = false,
  threadColor,
  threadStatus = 'idle',
  draggable = true,
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
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          className="cursor-grab touch-none rounded px-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
          draggable={draggable}
          disabled={!draggable}
          aria-label="Déplacer le bloc"
          onDragStart={(event) => {
            setBlockDragData(event.dataTransfer, {
              blockId: block.id,
              laneId,
            });
          }}
        >
          ⠿
        </button>
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
