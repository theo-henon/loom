import type { Lane } from '../types/lane';
import {
  parseSharedProgramPayload,
  SHARE_FORMAT_VERSION,
  type SharedProgramPayload,
} from './validate';

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlToBytes(encoded: string): Uint8Array | null {
  const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded =
    padding === 0 ? normalized : normalized + '='.repeat(4 - padding);

  try {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  } catch {
    return null;
  }
}

export function serializeProgram(
  lanes: Lane[],
  title?: string,
): SharedProgramPayload {
  return {
    v: SHARE_FORMAT_VERSION,
    ...(title ? { title } : {}),
    lanes: structuredClone(lanes),
  };
}

export function encodeSharedProgram(
  lanes: Lane[],
  title?: string,
): string | null {
  const payload = serializeProgram(lanes, title);
  const json = JSON.stringify(payload);

  if (json.length > 16_000) {
    return null;
  }

  return bytesToBase64Url(new TextEncoder().encode(json));
}

export function decodeSharedProgram(
  encoded: string,
): SharedProgramPayload | null {
  const bytes = base64UrlToBytes(encoded);
  if (!bytes) {
    return null;
  }

  try {
    const json = new TextDecoder().decode(bytes);
    const parsed: unknown = JSON.parse(json);
    return parseSharedProgramPayload(parsed);
  } catch {
    return null;
  }
}
