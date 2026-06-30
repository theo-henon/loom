import {
  DEFAULT_EDITOR_LAYOUT,
  EDITOR_LAYOUT_VERSION,
  clampLaneWidth,
  clampPanelWidth,
  type EditorLayout,
} from '../types/editorLayout';

const STORAGE_KEY = 'loom-editor-layout';

function sanitizeLayout(raw: unknown): EditorLayout | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const candidate = raw as Partial<EditorLayout>;
  if (candidate.version !== EDITOR_LAYOUT_VERSION) {
    return null;
  }

  const palette = candidate.panelWidths?.palette;
  const visualization = candidate.panelWidths?.visualization;

  if (typeof palette !== 'number' || typeof visualization !== 'number') {
    return null;
  }

  const laneWidths: Record<string, number> = {};
  if (candidate.laneWidths && typeof candidate.laneWidths === 'object') {
    for (const [laneId, width] of Object.entries(candidate.laneWidths)) {
      if (typeof width === 'number') {
        laneWidths[laneId] = clampLaneWidth(width);
      }
    }
  }

  return {
    version: EDITOR_LAYOUT_VERSION,
    panelWidths: {
      palette: clampPanelWidth(palette),
      visualization: clampPanelWidth(visualization),
    },
    laneWidths,
  };
}

export function loadEditorLayout(): EditorLayout | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return sanitizeLayout(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveEditorLayout(layout: EditorLayout): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
}

export function clearEditorLayout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getInitialEditorLayout(): EditorLayout {
  return loadEditorLayout() ?? DEFAULT_EDITOR_LAYOUT;
}
