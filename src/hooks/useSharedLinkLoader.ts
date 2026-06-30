import { useEffect, useRef, useState } from 'react';
import { parseShareLinkFromWindow, resolveShareLink } from '../share/url';
import { useProgram } from './useProgram';

type SharedLinkState = {
  isSharedLink: boolean;
  shareError: string | null;
};

type InitialShareState = SharedLinkState & {
  shouldEnter: boolean;
  resolved: ReturnType<typeof resolveShareLink>;
};

function readInitialShareState(): InitialShareState {
  const parsed = parseShareLinkFromWindow(window.location);
  if (!parsed) {
    return {
      isSharedLink: false,
      shareError: null,
      shouldEnter: false,
      resolved: null,
    };
  }

  const resolved = resolveShareLink(parsed);
  if (!resolved) {
    return {
      isSharedLink: false,
      shareError: 'Ce lien de partage est invalide ou incomplet.',
      shouldEnter: false,
      resolved: null,
    };
  }

  return {
    isSharedLink: true,
    shareError: null,
    shouldEnter: true,
    resolved,
  };
}

export function useSharedLinkLoader(onEnter: () => void): SharedLinkState {
  const { loadScenario } = useProgram();
  const [initialShareState] = useState(readInitialShareState);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!initialShareState.shouldEnter || !initialShareState.resolved) {
      return;
    }

    if (loadedRef.current) {
      return;
    }

    loadedRef.current = true;
    const { lanes, scenarioId, title } = initialShareState.resolved;
    loadScenario(lanes, scenarioId, title);
    onEnter();
  }, [initialShareState, loadScenario, onEnter]);

  return {
    isSharedLink: initialShareState.isSharedLink,
    shareError: initialShareState.shareError,
  };
}
