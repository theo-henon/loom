import type { CSSProperties } from 'react';
import type { Block } from '../../types/blocks';
import type { ThreadStatus } from '../../types/execution';
import { setBlockDragData } from '../palette/drag';
import { RemoveButton } from '../ui/RemoveButton';
import { ThreadDot } from '../visualization/ThreadDot';
import { type NestedBlockListProps } from './BlockList';
import { BlockTypeLabel } from './BlockTypeLabel';
import { IfBlock } from './IfBlock';
import { LoopBlock } from './LoopBlock';
import { MutexBlock } from './MutexBlock';
import { OperationBlock } from './OperationBlock';
import { PredicateBlock } from './PredicateBlock';
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
  mutexOwnerLabel?: string | null;
  nestedListProps?: NestedBlockListProps;
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
  mutexOwnerLabel = null,
  nestedListProps,
}: BlockRendererProps) {
  const borderAccent =
    block.type === 'if'
      ? 'border-l-4 border-l-amber-200'
      : block.type === 'loop'
        ? 'border-l-4 border-l-violet-200'
        : block.type === 'condition'
          ? 'border-l-4 border-l-sky-200'
          : '';

  return (
    <div
      className={`relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm transition-shadow duration-300 ${
        isActive && threadColor ? 'shadow-md' : ''
      } ${borderAccent}`}
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
      <div className="mb-1 flex items-center gap-1">
        <button
          type="button"
          className="cursor-grab touch-none rounded px-0.5 text-xs leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
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
        <BlockTypeLabel type={block.type} compact className="min-w-0 flex-1" />
        {block.type === 'mutex' &&
          (mutexOwnerLabel ? (
            <span className="shrink-0 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-800">
              {mutexOwnerLabel}
            </span>
          ) : (
            <span className="shrink-0 text-[10px] text-gray-400">Libre</span>
          ))}
        <RemoveButton label="Supprimer le bloc" onClick={onRemove} />
      </div>
      {block.type === 'variable' && (
        <VariableBlock block={block} onChange={onChange} />
      )}
      {block.type === 'operation' && (
        <OperationBlock block={block} onChange={onChange} />
      )}
      {block.type === 'condition' && (
        <PredicateBlock block={block} onChange={onChange} />
      )}
      {block.type === 'if' && nestedListProps ? (
        <IfBlock
          block={block}
          onChange={onChange}
          laneId={laneId}
          nestedListProps={nestedListProps}
        />
      ) : null}
      {block.type === 'loop' && nestedListProps ? (
        <LoopBlock
          block={block}
          laneId={laneId}
          nestedListProps={nestedListProps}
        />
      ) : null}
      {block.type === 'mutex' && (
        <MutexBlock block={block} onChange={onChange} />
      )}
    </div>
  );
}
