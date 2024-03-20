import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export type HttpReqConfig = AxiosRequestConfig;
export type HttpResponse<T, D = any> = AxiosResponse<T, D>;

/** @deprecated */
export type HttpRes<T, D = any> = HttpResponse<T, D>;

export type HttpError<T, D> = AxiosError<T, D>;
