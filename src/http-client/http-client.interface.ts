export interface HttpReqConfig {
  headers?: unknown;
  params?: unknown;
  paramsSerializer?: (params: unknown) => string;
  data?: unknown;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: unknown) => void;
  onDownloadProgress?: (progressEvent: unknown) => void;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  socketPath?: string | null;
  httpAgent?: unknown;
  httpsAgent?: unknown;
  decompress?: boolean;
}

export interface HttpRes<Type> {
  readonly data: Type;
  readonly status: number;
  readonly statusText: string;
  readonly headers: unknown;
  readonly config: HttpReqConfig;
  readonly request?: unknown;
}
