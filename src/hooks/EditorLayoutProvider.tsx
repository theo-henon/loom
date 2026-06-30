import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_EDITOR_LAYOUT,
  clampLaneWidth,
  clampPanelWidth,
  getLaneWidth,
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

  const adjustPaletteWidth = useCallback((delta: number) => {
    setLayoutSaved(false);
    setLayout((current) => ({
      ...current,
      panelWidths: {
        ...current.panelWidths,
        palette: clampPanelWidth(current.panelWidths.palette + delta),
      },
    }));
  }, []);

  const adjustVisualizationWidth = useCallback((delta: number) => {
    setLayoutSaved(false);
    setLayout((current) => ({
      ...current,
      panelWidths: {
        ...current.panelWidths,
        visualization: clampPanelWidth(
          current.panelWidths.visualization + delta,
        ),
      },
    }));
  }, []);

  const adjustLaneWidth = useCallback((laneId: string, delta: number) => {
    setLayoutSaved(false);
    setLayout((current) => ({
      ...current,
      laneWidths: {
        ...current.laneWidths,
        [laneId]: clampLaneWidth(getLaneWidth(current, laneId) + delta),
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
      adjustPaletteWidth,
      adjustVisualizationWidth,
      adjustLaneWidth,
      saveLayout,
      restoreDefaultLayout,
      layoutSaved,
    }),
    [
      layout,
      adjustPaletteWidth,
      adjustVisualizationWidth,
      adjustLaneWidth,
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
