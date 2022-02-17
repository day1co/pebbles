export interface HttpReqConfig {
  readonly headers?: unknown;
  readonly params?: unknown;
  readonly paramsSerializer?: (params: unknown) => string;
  readonly data?: unknown;
  readonly timeout?: number;
  readonly timeoutErrorMessage?: string;
  readonly withCredentials?: boolean;
  readonly xsrfCookieName?: string;
  readonly xsrfHeaderName?: string;
  readonly onUploadProgress?: (progressEvent: unknown) => void;
  readonly onDownloadProgress?: (progressEvent: unknown) => void;
  readonly maxContentLength?: number;
  readonly validateStatus?: ((status: number) => boolean) | null;
  readonly maxBodyLength?: number;
  readonly maxRedirects?: number;
  readonly socketPath?: string | null;
  readonly httpAgent?: unknown;
  readonly httpsAgent?: unknown;
  readonly decompress?: boolean;
}

export interface HttpRes<Type> {
  readonly data: Type;
  readonly status: number;
  readonly statusText: string;
  readonly headers: unknown;
  readonly config: HttpReqConfig;
  readonly request?: unknown;
}
