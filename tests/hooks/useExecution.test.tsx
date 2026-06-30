import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExecutionProvider } from '../../src/hooks/ExecutionProvider';
import { ProgramProvider } from '../../src/hooks/ProgramProvider';
import {
  useExecution,
  useExecutionController,
} from '../../src/hooks/useExecution';

function ExecutionHarness({ children }: { children: ReactNode }) {
  const execution = useExecutionController();
  return <ExecutionProvider value={execution}>{children}</ExecutionProvider>;
}

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ProgramProvider>
        <ExecutionHarness>{children}</ExecutionHarness>
      </ProgramProvider>
    );
  };
}

describe('useExecution speed', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('defaults to normal speed', () => {
    const { result } = renderHook(() => useExecution(), {
      wrapper: createWrapper(),
    });

    expect(result.current.speed).toBe('normal');
  });

  it('advances ticks faster when speed is fast', () => {
    const { result } = renderHook(() => useExecution(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSpeed('fast');
      result.current.play();
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.state.tick).toBe(1);
  });

  it('advances ticks slower when speed is slow', () => {
    const { result } = renderHook(() => useExecution(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSpeed('slow');
      result.current.play();
    });

    act(() => {
      vi.advanceTimersByTime(1199);
    });
    expect(result.current.state.tick).toBe(0);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.state.tick).toBe(1);
  });
});
