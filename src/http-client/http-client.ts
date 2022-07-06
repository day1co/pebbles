import axios from 'axios';
import type { HttpReqConfig, HttpResponse } from './http-client.type';

export class HttpClient {
  private _baseUrl = '';

  constructor(baseUrl?: string) {
    this._baseUrl = baseUrl ?? '';
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  set baseUrl(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  sendGetRequest<Type>(url: string, config?: Readonly<HttpReqConfig>): Promise<HttpResponse<Type>> {
    const fullUrl = this.getFullUrl(url);
    return axios.get<Type, HttpResponse<Type>>(fullUrl, config);
  }

  sendPostRequest<Type>(url: string, data: unknown, config?: Readonly<HttpReqConfig>): Promise<HttpResponse<Type>> {
    const fullUrl = this.getFullUrl(url);
    return axios.post<Type, HttpResponse<Type>>(fullUrl, data, config);
  }

  sendPutRequest<Type>(url: string, data: unknown, config?: Readonly<HttpReqConfig>): Promise<HttpResponse<Type>> {
    const fullUrl = this.getFullUrl(url);
    return axios.put<Type, HttpResponse<Type>>(fullUrl, data, config);
  }

  sendPatchRequest<Type>(url: string, data: unknown, config?: Readonly<HttpReqConfig>): Promise<HttpResponse<Type>> {
    const fullUrl = this.getFullUrl(url);
    return axios.patch<Type, HttpResponse<Type>>(fullUrl, data, config);
  }

  sendDeleteRequest<Type>(url: string, config?: Readonly<HttpReqConfig>): Promise<HttpResponse<Type>> {
    const fullUrl = this.getFullUrl(url);
    return axios.delete<Type, HttpResponse<Type>>(fullUrl, config);
  }

  private getFullUrl(url: string): string {
    return (this._baseUrl ?? '') + url;
  }
}
