import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  clearEditorLayout,
  loadEditorLayout,
  saveEditorLayout,
} from '../../src/hooks/editorLayoutStorage';
import { DEFAULT_EDITOR_LAYOUT } from '../../src/types/editorLayout';

function createStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe('editorLayoutStorage', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorageMock());
    clearEditorLayout();
  });

  afterEach(() => {
    clearEditorLayout();
    vi.unstubAllGlobals();
  });

  it('saves and loads a layout from localStorage', () => {
    const layout = {
      ...DEFAULT_EDITOR_LAYOUT,
      panelWidths: { palette: 280, visualization: 360 },
      laneWidths: { laneA: 300 },
    };

    saveEditorLayout(layout);
    expect(loadEditorLayout()).toEqual(layout);
  });

  it('clears saved layout', () => {
    saveEditorLayout(DEFAULT_EDITOR_LAYOUT);
    clearEditorLayout();
    expect(loadEditorLayout()).toBeNull();
  });
});
