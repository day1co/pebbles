import http from 'http';
import { HttpClient } from './http-client';

describe('HttpClient', () => {
  const TEST_SERVER = 'http://localhost:9999';
  const TEST_PORT = 9999;
  const server = http.createServer((req, res) => {
    res.end(JSON.stringify('HttpClient test is OK'));
  });

  test('Base URL get/set', () => {
    const httpClient = new HttpClient();
    httpClient.baseUrl = TEST_SERVER;
    expect(httpClient.baseUrl === TEST_SERVER).toBe(true);
  });

  describe('Http communication', () => {
    beforeAll((done) => {
      server.listen(TEST_PORT, done);
      server.on('clientError', (err, socket) => {
        socket.end();
      });
    });

    afterAll((done) => {
      server.close(done);
    });

    const httpClient = new HttpClient(TEST_SERVER);

    it('Http GET test', async () => {
      const result = await httpClient.sendGetRequest('/');
      expect(result.status).toBe(200);
      expect(result.data).toBe('HttpClient test is OK');
    });

    it('Http POST test', async () => {
      const result = await httpClient.sendPostRequest('/', {});
      expect(result.status).toBe(200);
      expect(result.data).toBe('HttpClient test is OK');
    });

    it('Http PUT test', async () => {
      const result = await httpClient.sendPutRequest('/', {});
      expect(result.status).toBe(200);
      expect(result.data).toBe('HttpClient test is OK');
    });

    it('Http DELETE test', async () => {
      const result = await httpClient.sendDeleteRequest('/', {});
      expect(result.status).toBe(200);
      expect(result.data).toBe('HttpClient test is OK');
    });
  });
});
