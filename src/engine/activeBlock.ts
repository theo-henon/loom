import type { ThreadState } from '../types/execution';

export function getActiveBlockIdFromThread(
  thread: ThreadState | undefined,
): string | null {
  if (!thread) {
    return null;
  }

  if (thread.status === 'done') {
    return null;
  }

  const frame = thread.frames[thread.frames.length - 1];
  if (!frame || frame.pc >= frame.blocks.length) {
    return null;
  }

  return frame.blocks[frame.pc]?.id ?? null;
}
