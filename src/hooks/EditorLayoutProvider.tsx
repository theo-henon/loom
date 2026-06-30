import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_EDITOR_LAYOUT,
  clampLaneWidth,
  clampPanelWidth,
  type EditorLayout,
} from '../types/editorLayout';
import {
  clearEditorLayout,
  getInitialEditorLayout,
  loadEditorLayout,
  saveEditorLayout,
} from './editorLayoutStorage';
import {
  EditorLayoutContext,
  type EditorLayoutContextValue,
} from './editorLayoutContext';

export function EditorLayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useState<EditorLayout>(getInitialEditorLayout);
  const [layoutSaved, setLayoutSaved] = useState(
    () => loadEditorLayout() !== null,
  );

  const setPaletteWidth = useCallback((width: number) => {
    setLayoutSaved(false);
    setLayout((current) => ({
      ...current,
      panelWidths: {
        ...current.panelWidths,
        palette: clampPanelWidth(width),
      },
    }));
  }, []);

  const setVisualizationWidth = useCallback((width: number) => {
    setLayoutSaved(false);
    setLayout((current) => ({
      ...current,
      panelWidths: {
        ...current.panelWidths,
        visualization: clampPanelWidth(width),
      },
    }));
  }, []);

  const setLaneWidth = useCallback((laneId: string, width: number) => {
    setLayoutSaved(false);
    setLayout((current) => ({
      ...current,
      laneWidths: {
        ...current.laneWidths,
        [laneId]: clampLaneWidth(width),
      },
    }));
  }, []);

  const saveLayout = useCallback(() => {
    saveEditorLayout(layout);
    setLayoutSaved(true);
  }, [layout]);

  const restoreDefaultLayout = useCallback(() => {
    clearEditorLayout();
    setLayout(DEFAULT_EDITOR_LAYOUT);
    setLayoutSaved(false);
  }, []);

  const value = useMemo<EditorLayoutContextValue>(
    () => ({
      layout,
      setPaletteWidth,
      setVisualizationWidth,
      setLaneWidth,
      saveLayout,
      restoreDefaultLayout,
      layoutSaved,
    }),
    [
      layout,
      setPaletteWidth,
      setVisualizationWidth,
      setLaneWidth,
      saveLayout,
      restoreDefaultLayout,
      layoutSaved,
    ],
  );

  return (
    <EditorLayoutContext.Provider value={value}>
      {children}
    </EditorLayoutContext.Provider>
  );
}
