import { useCallback } from 'react';
import { BlockPalettePanel } from '../palette/BlockPalettePanel';
import { VisualizationPanel } from '../visualization/VisualizationPanel';
import { LaneEditor } from '../lanes/LaneEditor';
import { Panel } from '../ui/Panel';
import { ResizeHandle } from './ResizeHandle';
import { useEditorLayout } from '../../hooks/editorLayoutContext';
import { usePointerResize } from '../../hooks/usePointerResize';

export function MainWorkspaceLayout() {
  const { layout, adjustPaletteWidth, adjustVisualizationWidth } =
    useEditorLayout();

  const resizePalette = usePointerResize({
    axis: 'x',
    onResize: adjustPaletteWidth,
  });

  const resizeVisualization = usePointerResize({
    axis: 'x',
    onResize: useCallback(
      (delta: number) => adjustVisualizationWidth(-delta),
      [adjustVisualizationWidth],
    ),
  });

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <BlockPalettePanel
        className="shrink-0"
        style={{ width: layout.panelWidths.palette }}
      />

      <ResizeHandle
        orientation="vertical"
        label="Redimensionner la palette"
        onPointerDown={resizePalette}
      />

      <Panel
        title="Éditeur de lanes"
        className="min-w-0 flex-1"
        contentClassName="overflow-hidden"
      >
        <LaneEditor />
      </Panel>

      <ResizeHandle
        orientation="vertical"
        label="Redimensionner la visualisation"
        onPointerDown={resizeVisualization}
      />

      <VisualizationPanel
        className="shrink-0"
        style={{ width: layout.panelWidths.visualization }}
      />
    </div>
  );
}
