import type { ReactElement } from 'react';
import type { BlockType } from '../../types/blocks';

type BlockTypeIconProps = {
  type: BlockType;
  className?: string;
};

const ICON_STYLES: Record<BlockType, string> = {
  variable: 'bg-indigo-100 text-indigo-700',
  operation: 'bg-emerald-100 text-emerald-700',
  condition: 'bg-amber-100 text-amber-800',
  loop: 'bg-violet-100 text-violet-700',
};

function VariableIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path fill="currentColor" d="M4 3h8v2H9v8H7V5H4V3zm2 8h4v2H6v-2z" />
    </svg>
  );
}

function OperationIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
        d="M8 4v8M4 8h8"
      />
    </svg>
  );
}

function ConditionIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8 3 13 8 8 13 3 8 8 3zM5 8h6"
      />
    </svg>
  );
}

function LoopIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11 4.5A4.5 4.5 0 0 0 5.5 9H4M5 11.5A4.5 4.5 0 0 0 10.5 7H12M4 6.5V9h2.5M12 9.5V7H9.5"
      />
    </svg>
  );
}

const ICONS: Record<BlockType, () => ReactElement> = {
  variable: VariableIcon,
  operation: OperationIcon,
  condition: ConditionIcon,
  loop: LoopIcon,
};

export function BlockTypeIcon({ type, className = '' }: BlockTypeIconProps) {
  const Icon = ICONS[type];

  return (
    <span
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded ${ICON_STYLES[type]} ${className}`}
      aria-hidden
    >
      <Icon />
    </span>
  );
}
