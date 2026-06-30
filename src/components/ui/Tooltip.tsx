import type { ReactNode } from 'react';

type TooltipProps = {
  content: string;
  children: ReactNode;
  className?: string;
};

export function Tooltip({
  content,
  children,
  className = '',
}: TooltipProps) {
  return (
    <span
      className={`group/tooltip relative inline-flex max-w-full ${className}`}
    >
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-50 mb-1.5 w-56 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-normal leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}
