import type { ReactNode } from 'react';
import { ExecutionContext } from './executionContext';
import type { ExecutionContextValue } from './executionContext.types';

export function ExecutionProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: ExecutionContextValue;
}) {
  return (
    <ExecutionContext.Provider value={value}>
      {children}
    </ExecutionContext.Provider>
  );
}
