// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const crypto: any = globalThis.crypto;

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
