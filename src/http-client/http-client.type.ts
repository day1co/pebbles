import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export type HttpReqConfig = AxiosRequestConfig;
export type HttpResponse<T> = AxiosResponse<T>;

/** @deprecated */
export type HttpRes<T> = HttpResponse<T>;

export type AxiosErrorType = AxiosError;
export type AxiosResponseType = AxiosResponse<{ data: { name: string; message: string } }>;
