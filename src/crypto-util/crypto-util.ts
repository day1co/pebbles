import { CryptoJS, buildHexString } from './ezwel-seed';
import type { webcrypto } from 'crypto';

const crypto = (globalThis as any).crypto as typeof webcrypto;

export namespace CryptoUtil {
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
    const encoded = CryptoJS.enc.Utf8.parse(data);
    const key = CryptoJS.enc.Hex.parse(buildHexString(seedKey));
    const encrypted = CryptoJS.SEED.encrypt(encoded, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding,
    });
    return encrypted.toString();
  };

  export const decodeSeedString = (hash: string, { seedKey }: { seedKey: string }): string => {
    const key = CryptoJS.enc.Hex.parse(buildHexString(seedKey));
    const decrypted = CryptoJS.SEED.decrypt(hash, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding,
    });
    const decoded = CryptoJS.enc.Utf8.stringify(decrypted);
    return decoded.replaceAll(/\x00/g, '');
  };
}
