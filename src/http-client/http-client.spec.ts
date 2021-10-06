import { HttpClient } from './http-client';

describe('HttpClient', () => {
  it('Base URL get/set', () => {
    const httpClient = new HttpClient();
    httpClient.baseUrl = 'baseUrl';
    expect(httpClient.baseUrl === 'baseUrl').toBe(true);
  });
});
