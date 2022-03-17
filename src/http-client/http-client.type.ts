import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpReqConfig = AxiosRequestConfig;
export type HttpResponse<T> = AxiosResponse<T>;

/** @deprecated */
export type HttpRes<T> = HttpResponse<T>;
