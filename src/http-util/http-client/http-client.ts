import axios from 'axios';
import type { HttpReqConfig, HttpRes } from './http-client.interface';
import { LoggerFactory } from '../../logger';
import type { Logger } from '../../logger';

export class HttpClient {
  private readonly logger: Logger;
  private _baseUrl = '';

  constructor() {
    this.logger = LoggerFactory.getLogger('util:http-client');
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  set baseUrl(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  sendGetRequest<Type>(url: string, config?: HttpReqConfig): Promise<HttpRes<Type>> {
    const fullUrl = this.getFullUrl(url);
    this.logger.debug(`getRequest to %s with config: %s`, fullUrl, JSON.stringify(config));
    return axios.get<Type, HttpRes<Type>>(fullUrl, config);
  }

  sendPostRequest<Type>(url: string, data: unknown, config?: HttpReqConfig): Promise<HttpRes<Type>> {
    const fullUrl = this.getFullUrl(url);
    this.logger.debug(
      `postRequest to %s with data: %s, config: %s `,
      fullUrl,
      JSON.stringify(data),
      JSON.stringify(config)
    );
    return axios.post<Type, HttpRes<Type>>(fullUrl, data, config);
  }

  sendPutRequest<Type>(url: string, data: unknown, config?: HttpReqConfig): Promise<HttpRes<Type>> {
    const fullUrl = this.getFullUrl(url);
    this.logger.debug(
      `putRequest to %s with data: %s, config: %s`,
      fullUrl,
      JSON.stringify(data),
      JSON.stringify(config)
    );
    return axios.put<Type, HttpRes<Type>>(fullUrl, data, config);
  }

  sendDeleteRequest<Type>(url: string, config?: HttpReqConfig): Promise<HttpRes<Type>> {
    const fullUrl = this.getFullUrl(url);
    this.logger.debug(`deleteRequest to %s with config: %s`, fullUrl, JSON.stringify(config));
    return axios.delete<Type, HttpRes<Type>>(fullUrl, config);
  }

  private getFullUrl(url: string): string {
    return (this._baseUrl ?? '') + url;
  }
}
