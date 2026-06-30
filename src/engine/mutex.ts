import type { MutexRegistry } from '../types/execution';

export function createMutexRegistry(): MutexRegistry {
  return {};
}

function getEntry(registry: MutexRegistry, name: string) {
  if (!registry[name]) {
    registry[name] = { ownerLaneId: null, waitingLaneIds: [] };
  }
  return registry[name];
}

export function tryAcquireMutex(
  registry: MutexRegistry,
  name: string,
  laneId: string,
): boolean {
  const entry = getEntry(registry, name);

  if (entry.ownerLaneId === null) {
    entry.ownerLaneId = laneId;
    entry.waitingLaneIds = entry.waitingLaneIds.filter((id) => id !== laneId);
    return true;
  }

  if (entry.ownerLaneId === laneId) {
    return true;
  }

  if (!entry.waitingLaneIds.includes(laneId)) {
    entry.waitingLaneIds.push(laneId);
  }

  return false;
}

export function releaseMutex(
  registry: MutexRegistry,
  name: string,
  laneId: string,
): void {
  const entry = registry[name];
  if (!entry || entry.ownerLaneId !== laneId) {
    return;
  }

  entry.ownerLaneId = null;
}

export function getMutexOwnerLaneId(
  registry: MutexRegistry,
  name: string,
): string | null {
  return registry[name]?.ownerLaneId ?? null;
}
