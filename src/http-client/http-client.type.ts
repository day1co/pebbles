import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpReqConfig = AxiosRequestConfig;
export type HttpResponse<T, D = any> = AxiosResponse<T, D>;
export type HttpError<T = unknown, D = any> = AxiosError<T, D>;
