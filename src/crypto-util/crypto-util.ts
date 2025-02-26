import { EzwelCrypto } from './ezwel-seed';
import type { webcrypto } from 'crypto';

const crypto = (globalThis as any).crypto as typeof webcrypto;
const ezwelCrypto = new EzwelCrypto();

export const sha256 = async (data: string | Uint8Array): Promise<Uint8Array> => {
  if (typeof data === 'string') {
    data = new TextEncoder().encode(data);
  }
  return new Uint8Array(await crypto.subtle.digest('SHA-256', data));
};

export const createRandomBytes = (bytes: number): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(bytes));
};

export const createAesKey = async (length: 128 | 192 | 256): Promise<Uint8Array> => {
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: length,
    },
    true,
    ['encrypt', 'decrypt']
  );
  return new Uint8Array(await crypto.subtle.exportKey('raw', key));
};

export const encodeBase64 = (data: Uint8Array | string): string => {
  if (typeof data === 'string') {
    data = new TextEncoder().encode(data);
  }
  return btoa(String.fromCharCode.apply(null, Array.from(data)));
};

export const decodeBase64 = (data: string): Uint8Array => {
  return Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
};

export const encodeSeedString = (data: string, { seedKey }: { seedKey: string }): string => {
  return encodeBase64(ezwelCrypto.encrypt(data, seedKey));
};

export const decodeSeedString = (hash: string, { seedKey }: { seedKey: string }): string => {
  const decrypted = ezwelCrypto.decrypt(decodeBase64(hash), seedKey);
  return new TextDecoder().decode(decrypted);
};
