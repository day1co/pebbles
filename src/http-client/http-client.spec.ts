import axios from 'axios';
import { HttpClient } from './http-client';

describe('HttpClient', () => {
  const TEST_SERVER = 'http://localhost:9999';

  test('Base URL get/set', () => {
    const httpClient = new HttpClient();
    httpClient.baseUrl = TEST_SERVER;
    expect(httpClient.baseUrl).toBe(TEST_SERVER);
  });

  describe('Http communication', () => {
    beforeAll(() => jest.mock('axios'));

    const httpClient = new HttpClient(TEST_SERVER);

    it('Http GET test', async () => {
      axios.get = jest.fn().mockResolvedValue('get');
      const result = await httpClient.sendGetRequest('/');
      expect(result).toBe('get');
    });

    it('Http POST test', async () => {
      axios.post = jest.fn().mockResolvedValue('post');
      const result = await httpClient.sendPostRequest('/', {});
      expect(result).toBe('post');
    });

    it('Http PUT test', async () => {
      axios.put = jest.fn().mockResolvedValue('put');
      const result = await httpClient.sendPutRequest('/', {});
      expect(result).toBe('put');
    });

    it('Http PATCH test', async () => {
      axios.patch = jest.fn().mockResolvedValue('patch');
      const result = await httpClient.sendPatchRequest('/', {});
      expect(result).toBe('patch');
    });

    it('Http DELETE test', async () => {
      axios.delete = jest.fn().mockResolvedValue('delete');
      const result = await httpClient.sendDeleteRequest('/', {});
      expect(result).toBe('delete');
    });
  });
});
