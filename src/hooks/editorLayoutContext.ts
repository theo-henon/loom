import { createContext, useContext } from 'react';
import type { EditorLayout } from '../types/editorLayout';

export type EditorLayoutContextValue = {
  layout: EditorLayout;
  setPaletteWidth: (width: number) => void;
  setVisualizationWidth: (width: number) => void;
  setLaneWidth: (laneId: string, width: number) => void;
  saveLayout: () => void;
  restoreDefaultLayout: () => void;
  layoutSaved: boolean;
};

export const EditorLayoutContext =
  createContext<EditorLayoutContextValue | null>(null);

export function useEditorLayout() {
  const context = useContext(EditorLayoutContext);
  if (!context) {
    throw new Error('useEditorLayout must be used within EditorLayoutProvider');
  }
  return context;
}
