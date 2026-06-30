import { SCENARIOS } from '../scenarios';
import type { ScenarioId } from '../scenarios/types';
import type { Lane } from '../types/lane';
import { lanesStructureEqual } from './normalize';
import { decodeSharedProgram, encodeSharedProgram } from './serialize';
import type { SharedProgramPayload } from './validate';

const BUILTIN_SCENARIO_IDS = new Set<ScenarioId>(
  SCENARIOS.map((scenario) => scenario.id),
);

export type ParsedShareLink =
  | { kind: 'builtin'; scenarioId: ScenarioId }
  | { kind: 'program'; payload: SharedProgramPayload };

export function findMatchingBuiltInScenarioId(
  lanes: Lane[],
): ScenarioId | null {
  for (const scenario of SCENARIOS) {
    if (lanesStructureEqual(lanes, scenario.lanes)) {
      return scenario.id;
    }
  }

  return null;
}

export function parseShareHash(hash: string): ParsedShareLink | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) {
    return null;
  }

  if (raw.startsWith('s=')) {
    const scenarioId = raw.slice(2) as ScenarioId;
    if (!BUILTIN_SCENARIO_IDS.has(scenarioId)) {
      return null;
    }

    return { kind: 'builtin', scenarioId };
  }

  if (raw.startsWith('p=')) {
    const payload = decodeSharedProgram(raw.slice(2));
    if (!payload) {
      return null;
    }

    return { kind: 'program', payload };
  }

  return null;
}

export function parseShareLinkFromWindow(
  location: Pick<Location, 'hash'>,
): ParsedShareLink | null {
  return parseShareHash(location.hash);
}

type BuildShareUrlParams = {
  lanes: Lane[];
  activeScenarioId: ScenarioId | null;
  programTitle?: string | null;
  baseUrl: string;
};

export function buildShareUrl({
  lanes,
  activeScenarioId,
  programTitle,
  baseUrl,
}: BuildShareUrlParams): string | null {
  const matchingBuiltInId = findMatchingBuiltInScenarioId(lanes);
  const normalizedBaseUrl = baseUrl.replace(/#.*$/, '');

  if (
    matchingBuiltInId &&
    !programTitle &&
    (activeScenarioId === null || activeScenarioId === matchingBuiltInId)
  ) {
    return `${normalizedBaseUrl}#s=${matchingBuiltInId}`;
  }

  const encoded = encodeSharedProgram(lanes, programTitle ?? undefined);
  if (!encoded) {
    return null;
  }

  return `${normalizedBaseUrl}#p=${encoded}`;
}

export function resolveShareLink(link: ParsedShareLink): {
  lanes: Lane[];
  scenarioId: ScenarioId | null;
  title: string | null;
} | null {
  if (link.kind === 'builtin') {
    const scenario = SCENARIOS.find((entry) => entry.id === link.scenarioId);
    if (!scenario) {
      return null;
    }

    return {
      lanes: structuredClone(scenario.lanes),
      scenarioId: scenario.id,
      title: null,
    };
  }

  return {
    lanes: structuredClone(link.payload.lanes),
    scenarioId: null,
    title: link.payload.title ?? null,
  };
}
