export type ExecutionSpeed = 'slow' | 'normal' | 'fast';

export type ExecutionSpeedOption = {
  id: ExecutionSpeed;
  label: string;
  intervalMs: number;
};

export const EXECUTION_SPEED_OPTIONS: ExecutionSpeedOption[] = [
  { id: 'slow', label: 'Lente', intervalMs: 1200 },
  { id: 'normal', label: 'Normale', intervalMs: 600 },
  { id: 'fast', label: 'Rapide', intervalMs: 200 },
];

export function getTickIntervalMs(speed: ExecutionSpeed): number {
  const option = EXECUTION_SPEED_OPTIONS.find((entry) => entry.id === speed);
  return option?.intervalMs ?? EXECUTION_SPEED_OPTIONS[1].intervalMs;
}
