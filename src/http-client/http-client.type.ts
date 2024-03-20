import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export type HttpReqConfig = AxiosRequestConfig;
export type HttpResponse<T, D> = AxiosResponse<T, D>;

/** @deprecated */
export type HttpRes<T, D> = HttpResponse<T, D>;

export type HttpError<T, D> = AxiosError<T, D>;
