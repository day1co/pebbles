import axios from 'axios';
import type { HttpReqConfig, HttpRes } from './http-client.type';

export class HttpClient {
  private _baseUrl = '';

  get baseUrl(): string {
    return this._baseUrl;
  }

  set baseUrl(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  sendGetRequest<Type>(url: string, config?: HttpReqConfig): Promise<HttpRes<Type>> {
    const fullUrl = this.getFullUrl(url);
    return axios.get<Type, HttpRes<Type>>(fullUrl, config);
  }

  sendPostRequest<Type>(url: string, data: unknown, config?: HttpReqConfig): Promise<HttpRes<Type>> {
    const fullUrl = this.getFullUrl(url);
    return axios.post<Type, HttpRes<Type>>(fullUrl, data, config);
  }

  sendPutRequest<Type>(url: string, data: unknown, config?: HttpReqConfig): Promise<HttpRes<Type>> {
    const fullUrl = this.getFullUrl(url);
    return axios.put<Type, HttpRes<Type>>(fullUrl, data, config);
  }

  sendDeleteRequest<Type>(url: string, config?: HttpReqConfig): Promise<HttpRes<Type>> {
    const fullUrl = this.getFullUrl(url);
    return axios.delete<Type, HttpRes<Type>>(fullUrl, config);
  }

  private getFullUrl(url: string): string {
    return (this._baseUrl ?? '') + url;
  }
}
