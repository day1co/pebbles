import http from 'http';
import { HttpClient } from './http-client';

describe('HttpClient', () => {
  const httpClient = new HttpClient();
  const testPort = 9999;
  const server = http.createServer((req, res) => {
    res.end(JSON.stringify('HttpClient test is OK'));
  });

  test('Base URL get/set', () => {
    httpClient.baseUrl = 'http://localhost:9999';
    expect(httpClient.baseUrl === 'http://localhost:9999').toBe(true);
  });

  describe('Http communication', () => {
    beforeAll((done) => {
      server.listen(testPort, done);
      server.on('clientError', (err, socket) => {
        socket.end();
      });
    });

    afterAll((done) => {
      server.close(done);
    });

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
