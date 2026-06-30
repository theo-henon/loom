import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  createEngineState,
  pauseEngine,
  resumeEngine,
  runTick,
} from '../engine/engine';
import type { EngineState } from '../types/execution';
import type { ExecutionSpeed } from '../types/executionSpeed';
import { getTickIntervalMs } from '../types/executionSpeed';
import { ExecutionContext } from './executionContext';
import { useProgram } from './useProgram';

export function useExecutionController() {
  const { state: programState } = useProgram();
  const lanes = programState.lanes;

  const [engineState, setEngineState] = useState<EngineState>(() =>
    createEngineState(lanes),
  );
  const [speed, setSpeed] = useState<ExecutionSpeed>('normal');

  const intervalRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const step = useCallback(() => {
    setEngineState((current) => runTick(current, lanes));
  }, [lanes]);

  const reset = useCallback(() => {
    clearTimer();
    setEngineState(createEngineState(lanes));
  }, [clearTimer, lanes]);

  const pause = useCallback(() => {
    clearTimer();
    setEngineState((current) => pauseEngine(current));
  }, [clearTimer]);

  const play = useCallback(() => {
    setEngineState((current) => {
      if (current.phase === 'finished') {
        return current;
      }
      return resumeEngine(current);
    });
  }, []);

  useEffect(() => {
    if (engineState.phase !== 'running') {
      clearTimer();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setEngineState((current) => runTick(current, lanes));
    }, getTickIntervalMs(speed));

    return clearTimer;
  }, [engineState.phase, clearTimer, lanes, speed]);

  useEffect(() => {
    if (engineState.phase === 'finished') {
      clearTimer();
    }
  }, [engineState.phase, clearTimer]);

  const isRunning = engineState.phase === 'running';

  return {
    state: engineState,
    play,
    pause,
    step,
    reset,
    isRunning,
    speed,
    setSpeed,
  };
}

export function useExecution() {
  const context = useContext(ExecutionContext);
  if (!context) {
    throw new Error('useExecution must be used within ExecutionProvider');
  }
  return context;
}

export function getLanesSignature(
  lanes: ReturnType<typeof useProgram>['state']['lanes'],
): string {
  return lanes
    .map(
      (lane) => `${lane.id}:${lane.blocks.map((block) => block.id).join('-')}`,
    )
    .join('|');
}
