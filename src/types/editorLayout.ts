export const EDITOR_LAYOUT_VERSION = 1 as const;

export const DEFAULT_LANE_WIDTH = 256;
export const MIN_LANE_WIDTH = 200;
export const MAX_LANE_WIDTH = 480;

export const DEFAULT_PALETTE_WIDTH = 240;
export const DEFAULT_VISUALIZATION_WIDTH = 320;
export const MIN_PANEL_WIDTH = 180;
export const MAX_PANEL_WIDTH = 480;

export type EditorLayout = {
  version: typeof EDITOR_LAYOUT_VERSION;
  panelWidths: {
    palette: number;
    visualization: number;
  };
  laneWidths: Record<string, number>;
};

export const DEFAULT_EDITOR_LAYOUT: EditorLayout = {
  version: EDITOR_LAYOUT_VERSION,
  panelWidths: {
    palette: DEFAULT_PALETTE_WIDTH,
    visualization: DEFAULT_VISUALIZATION_WIDTH,
  },
  laneWidths: {},
};

export function clampLaneWidth(width: number): number {
  return Math.min(MAX_LANE_WIDTH, Math.max(MIN_LANE_WIDTH, width));
}

export function clampPanelWidth(width: number): number {
  return Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, width));
}

export function getLaneWidth(layout: EditorLayout, laneId: string): number {
  const stored = layout.laneWidths[laneId];
  return stored ? clampLaneWidth(stored) : DEFAULT_LANE_WIDTH;
}
