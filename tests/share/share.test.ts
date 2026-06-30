import { parallelSimpleScenario } from '../../src/scenarios/parallelSimple';
import {
  buildShareUrl,
  parseShareHash,
  resolveShareLink,
} from '../../src/share/url';
import {
  decodeSharedProgram,
  encodeSharedProgram,
  serializeProgram,
} from '../../src/share/serialize';
import { lanesStructureEqual } from '../../src/share/normalize';
import { describe, expect, it } from 'vitest';

describe('share serialization', () => {
  it('round-trips a built-in scenario payload', () => {
    const payload = serializeProgram(
      parallelSimpleScenario.lanes,
      'Mon scénario',
    );
    const encoded = encodeSharedProgram(
      parallelSimpleScenario.lanes,
      'Mon scénario',
    );

    expect(encoded).toBeTruthy();
    expect(decodeSharedProgram(encoded!)).toEqual(payload);
  });

  it('detects when lanes match a built-in scenario', () => {
    expect(
      lanesStructureEqual(
        parallelSimpleScenario.lanes,
        parallelSimpleScenario.lanes,
      ),
    ).toBe(true);
  });
});

describe('share urls', () => {
  it('builds a short link for unchanged built-in scenarios', () => {
    const url = buildShareUrl({
      lanes: parallelSimpleScenario.lanes,
      activeScenarioId: 'parallel-simple',
      programTitle: null,
      baseUrl: 'https://example.com/loom/',
    });

    expect(url).toBe('https://example.com/loom/#s=parallel-simple');
  });

  it('builds a full link for custom programs', () => {
    const lanes = structuredClone(parallelSimpleScenario.lanes);
    lanes[0].blocks.push({
      id: 'custom-block',
      type: 'variable',
      name: 'z',
      value: 1,
    });

    const url = buildShareUrl({
      lanes,
      activeScenarioId: 'parallel-simple',
      programTitle: null,
      baseUrl: 'https://example.com/loom/',
    });

    expect(url).toMatch(/^https:\/\/example.com\/loom\/#p=/);
  });

  it('parses and resolves a built-in share hash', () => {
    const parsed = parseShareHash('#s=race-condition');
    expect(parsed).toEqual({ kind: 'builtin', scenarioId: 'race-condition' });

    const resolved = resolveShareLink(parsed!);
    expect(resolved?.scenarioId).toBe('race-condition');
    expect(resolved?.lanes.length).toBeGreaterThan(0);
  });

  it('parses and resolves a program share hash', () => {
    const encoded = encodeSharedProgram(parallelSimpleScenario.lanes, 'Test');
    const parsed = parseShareHash(`#p=${encoded}`);
    expect(parsed?.kind).toBe('program');

    const resolved = resolveShareLink(parsed!);
    expect(resolved?.title).toBe('Test');
    expect(resolved?.scenarioId).toBeNull();
  });

  it('rejects invalid share hashes', () => {
    expect(parseShareHash('#s=unknown-scenario')).toBeNull();
    expect(parseShareHash('#p=not-valid')).toBeNull();
  });
});
