import type { ThreadStatus } from '../../types/execution';

type ThreadDotProps = {
  color: string;
  status: Extract<ThreadStatus, 'running' | 'blocked' | 'done' | 'idle'>;
  size?: 'sm' | 'md';
};

const sizeClasses = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
};

export function ThreadDot({ color, status, size = 'md' }: ThreadDotProps) {
  const isBlocked = status === 'blocked';
  const isDone = status === 'done';
  const isIdle = status === 'idle';

  return (
    <span
      className={`inline-block shrink-0 rounded-full transition-all duration-300 ease-in-out ${sizeClasses[size]} ${
        isBlocked ? 'animate-pulse ring-2 ring-amber-400 ring-offset-1' : ''
      } ${isDone ? 'opacity-40' : ''} ${isIdle ? 'opacity-60' : ''} thread-dot-active`}
      style={{ backgroundColor: isDone ? '#9CA3AF' : color }}
      title={
        isBlocked ? 'Thread bloqué' : isDone ? 'Thread terminé' : 'Thread actif'
      }
      aria-hidden
    />
  );
}
