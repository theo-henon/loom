import type { ReactNode } from 'react';

type PanelProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, children, className = '' }: PanelProps) {
  return (
    <section
      className={`flex flex-col border border-gray-200 bg-white ${className}`}
      aria-label={title}
    >
      <header className="border-b border-gray-200 px-4 py-2">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </header>
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </section>
  );
}
