import type { webcrypto } from 'crypto';

declare global {
  namespace globalThis {
    // eslint-disable-next-line no-var
    var crypto: typeof webcrypto;
  }
}

const crypto = globalThis.crypto;

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
}
