import { createContext } from 'react';
import type { ExecutionContextValue } from './executionContext.types';

export const ExecutionContext = createContext<ExecutionContextValue | null>(
  null,
);
