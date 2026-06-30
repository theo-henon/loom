import type { ReactNode } from 'react';

export const blockInputClassName =
  'min-w-0 flex-1 rounded border border-gray-300 px-1.5 py-0.5 text-xs';

type BlockFieldRowProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

export function BlockFieldRow({
  label,
  children,
  className = '',
}: BlockFieldRowProps) {
  return (
    <label
      className={`flex min-w-0 items-center gap-1.5 text-xs ${className}`}
    >
      <span className="shrink-0 text-gray-500">{label}</span>
      {children}
    </label>
  );
}
