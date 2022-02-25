import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpReqConfig = AxiosRequestConfig;
export type HttpRes<T> = AxiosResponse<T>;
