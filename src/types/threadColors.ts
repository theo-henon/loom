export const THREAD_COLORS = [
  '#6366F1',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#3B82F6',
  '#8B5CF6',
  '#EF4444',
  '#14B8A6',
] as const;

export function getThreadColor(index: number): string {
  return THREAD_COLORS[index % THREAD_COLORS.length];
}
