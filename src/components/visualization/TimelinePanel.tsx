import { useEffect, useMemo, useRef } from 'react';
import { useExecution } from '../../hooks/useExecution';
import { useProgram } from '../../hooks/useProgram';
import {
  TIMELINE_LABEL_WIDTH,
  TIMELINE_ROW_HEIGHT,
  TIMELINE_TICK_WIDTH,
} from '../../engine/timeline';
import type { TimelineSegment } from '../../types/timeline';
import { ThreadDot } from './ThreadDot';

function groupSegmentsByLane(
  segments: TimelineSegment[],
): Map<string, TimelineSegment[]> {
  const grouped = new Map<string, TimelineSegment[]>();

  for (const segment of segments) {
    const laneSegments = grouped.get(segment.laneId) ?? [];
    laneSegments.push(segment);
    grouped.set(segment.laneId, laneSegments);
  }

  return grouped;
}

export function TimelinePanel() {
  const { state, isRunning } = useExecution();
  const { state: programState } = useProgram();
  const scrollRef = useRef<HTMLDivElement>(null);

  const maxTick = useMemo(() => {
    if (state.timeline.length === 0) {
      return state.tick;
    }

    return Math.max(
      state.tick,
      ...state.timeline.map((segment) => segment.endTick),
    );
  }, [state.tick, state.timeline]);

  const groupedSegments = useMemo(
    () => groupSegmentsByLane(state.timeline),
    [state.timeline],
  );

  const trackWidth = Math.max(maxTick, 1) * TIMELINE_TICK_WIDTH;

  useEffect(() => {
    if (!isRunning || !scrollRef.current) {
      return;
    }

    scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [isRunning, state.tick]);

  if (programState.lanes.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Timeline
      </h3>

      {state.tick === 0 ? (
        <p className="text-sm text-gray-400">
          Lance l&apos;exécution pour voir l&apos;historique tick par tick.
        </p>
      ) : (
        <div
          ref={scrollRef}
          className="overflow-x-auto rounded border border-gray-200 bg-white"
          aria-label="Timeline d'exécution"
        >
          <div
            className="relative min-w-full"
            style={{ width: TIMELINE_LABEL_WIDTH + trackWidth }}
          >
            <div
              className="sticky top-0 z-10 flex border-b border-gray-200 bg-gray-50 text-[10px] text-gray-400"
              style={{ height: 20, paddingLeft: TIMELINE_LABEL_WIDTH }}
            >
              {Array.from({ length: maxTick }, (_, index) => (
                <span
                  key={index + 1}
                  className="shrink-0 text-center"
                  style={{ width: TIMELINE_TICK_WIDTH }}
                >
                  {index + 1}
                </span>
              ))}
            </div>

            {programState.lanes.map((lane) => {
              const laneSegments = groupedSegments.get(lane.id) ?? [];
              const thread = state.threads[lane.id];
              const status = thread?.status ?? 'idle';

              return (
                <div
                  key={lane.id}
                  className="flex items-center border-b border-gray-100 last:border-b-0"
                  style={{ height: TIMELINE_ROW_HEIGHT }}
                >
                  <div
                    className="sticky left-0 z-10 flex shrink-0 items-center gap-1.5 border-r border-gray-200 bg-white px-2 text-xs text-gray-600"
                    style={{ width: TIMELINE_LABEL_WIDTH }}
                  >
                    <ThreadDot color={lane.color} status={status} size="sm" />
                    <span className="truncate">{lane.name}</span>
                  </div>

                  <div
                    className="relative shrink-0"
                    style={{ width: trackWidth, height: TIMELINE_ROW_HEIGHT }}
                  >
                    {laneSegments.map((segment) => {
                      const left =
                        (segment.startTick - 1) * TIMELINE_TICK_WIDTH;
                      const width =
                        (segment.endTick - segment.startTick) *
                        TIMELINE_TICK_WIDTH;

                      return (
                        <div
                          key={`${segment.blockId}-${segment.startTick}`}
                          className="absolute top-1 rounded-sm border border-black/10 text-[10px] leading-none text-white shadow-sm"
                          style={{
                            left,
                            width: Math.max(width - 2, 4),
                            height: TIMELINE_ROW_HEIGHT - 8,
                            backgroundColor: lane.color,
                          }}
                          title={segment.blockLabel}
                        >
                          {width >= 36 ? (
                            <span className="block truncate px-1 pt-1">
                              {segment.blockLabel}
                            </span>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
