import { useContext } from 'react';
import { ProgramContext } from './programContext';

export function useProgram() {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error('useProgram must be used within ProgramProvider');
  }
  return context;
}
