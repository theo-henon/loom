import type { ReactNode } from 'react';

type PanelProps = {
  title: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function Panel({
  title,
  children,
  className = '',
  contentClassName = 'overflow-auto',
}: PanelProps) {
  return (
    <section
      className={`flex min-h-0 flex-col border border-gray-200 bg-white ${className}`}
      aria-label={title}
      role="region"
    >
      <header className="border-b border-gray-200 px-4 py-2">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </header>
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col p-4 ${contentClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
