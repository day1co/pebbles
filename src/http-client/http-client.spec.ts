import axios from 'axios';
import { HttpClient } from './http-client';
import { HttpState } from './http-state.enum';

jest.mock('axios');

describe('HttpClient', () => {
  const TEST_SERVER = 'http://localhost:9999';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Base URL get/set', () => {
    const httpClient = new HttpClient();
    httpClient.baseUrl = TEST_SERVER;
    expect(httpClient.baseUrl).toBe(TEST_SERVER);
  });

  test('Base URL in constructor', () => {
    const httpClient = new HttpClient(TEST_SERVER);
    expect(httpClient.baseUrl).toBe(TEST_SERVER);
  });

  test('Constructor with undefined baseUrl', () => {
    const httpClient = new HttpClient(undefined);
    expect(httpClient.baseUrl).toBe('');
  });

  describe('URL handling', () => {
    test('URL without base URL', () => {
      const httpClient = new HttpClient();
      (axios.get as jest.Mock).mockResolvedValue({ data: 'data' });
      
      httpClient.sendGetRequest('/path');
      expect(axios.get).toHaveBeenCalledWith('/path', undefined);
    });
    
    test('URL with base URL', () => {
      const httpClient = new HttpClient(TEST_SERVER);
      (axios.get as jest.Mock).mockResolvedValue({ data: 'data' });
      
      httpClient.sendGetRequest('/path');
      expect(axios.get).toHaveBeenCalledWith(`${TEST_SERVER}/path`, undefined);
    });
    
    test('Absolute URL with base URL', () => {
      const httpClient = new HttpClient(TEST_SERVER);
      (axios.get as jest.Mock).mockResolvedValue({ data: 'data' });
      const absoluteUrl = 'https://example.com/api';
      
      httpClient.sendGetRequest(absoluteUrl);
      expect(axios.get).toHaveBeenCalledWith(`${TEST_SERVER}${absoluteUrl}`, undefined);
    });
  });

  describe('Http communication', () => {
    const httpClient = new HttpClient(TEST_SERVER);
    const mockResponse = { data: 'response data', status: HttpState.OK };
    const mockError = new Error('Network error');
    const mockConfig = { timeout: 5000, headers: { 'Content-Type': 'application/json' } };
    const mockData = { key: 'value' };

    it('Http GET test', async () => {
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);
      const result = await httpClient.sendGetRequest('/');
      expect(result).toBe(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(`${TEST_SERVER}/`, undefined);
    });

    it('Http GET with config test', async () => {
      (axios.get as jest.Mock).mockResolvedValue(mockResponse);
      const result = await httpClient.sendGetRequest('/', mockConfig);
      expect(result).toBe(mockResponse);
      expect(axios.get).toHaveBeenCalledWith(`${TEST_SERVER}/`, mockConfig);
    });

    it('Http GET error handling', async () => {
      (axios.get as jest.Mock).mockRejectedValue(mockError);
      
      await expect(httpClient.sendGetRequest('/')).rejects.toThrow('Network error');
      expect(axios.get).toHaveBeenCalledWith(`${TEST_SERVER}/`, undefined);
    });

    it('Http POST test', async () => {
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);
      const result = await httpClient.sendPostRequest('/', mockData);
      expect(result).toBe(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(`${TEST_SERVER}/`, mockData, undefined);
    });

    it('Http POST with config test', async () => {
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);
      const result = await httpClient.sendPostRequest('/', mockData, mockConfig);
      expect(result).toBe(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(`${TEST_SERVER}/`, mockData, mockConfig);
    });

    it('Http POST error handling', async () => {
      (axios.post as jest.Mock).mockRejectedValue(mockError);
      
      await expect(httpClient.sendPostRequest('/', mockData)).rejects.toThrow('Network error');
      expect(axios.post).toHaveBeenCalledWith(`${TEST_SERVER}/`, mockData, undefined);
    });

    it('Http PUT test', async () => {
      (axios.put as jest.Mock).mockResolvedValue(mockResponse);
      const result = await httpClient.sendPutRequest('/', mockData);
      expect(result).toBe(mockResponse);
      expect(axios.put).toHaveBeenCalledWith(`${TEST_SERVER}/`, mockData, undefined);
    });

    it('Http PUT with config test', async () => {
      (axios.put as jest.Mock).mockResolvedValue(mockResponse);
      const result = await httpClient.sendPutRequest('/', mockData, mockConfig);
      expect(result).toBe(mockResponse);
      expect(axios.put).toHaveBeenCalledWith(`${TEST_SERVER}/`, mockData, mockConfig);
    });

    it('Http PUT error handling', async () => {
      (axios.put as jest.Mock).mockRejectedValue(mockError);
      
      await expect(httpClient.sendPutRequest('/', mockData)).rejects.toThrow('Network error');
      expect(axios.put).toHaveBeenCalledWith(`${TEST_SERVER}/`, mockData, undefined);
    });

    it('Http PATCH test', async () => {
      (axios.patch as jest.Mock).mockResolvedValue(mockResponse);
      const result = await httpClient.sendPatchRequest('/', mockData);
      expect(result).toBe(mockResponse);
      expect(axios.patch).toHaveBeenCalledWith(`${TEST_SERVER}/`, mockData, undefined);
    });

    it('Http PATCH with config test', async () => {
      (axios.patch as jest.Mock).mockResolvedValue(mockResponse);
      const result = await httpClient.sendPatchRequest('/', mockData, mockConfig);
      expect(result).toBe(mockResponse);
      expect(axios.patch).toHaveBeenCalledWith(`${TEST_SERVER}/`, mockData, mockConfig);
    });

    it('Http PATCH error handling', async () => {
      (axios.patch as jest.Mock).mockRejectedValue(mockError);
      
      await expect(httpClient.sendPatchRequest('/', mockData)).rejects.toThrow('Network error');
      expect(axios.patch).toHaveBeenCalledWith(`${TEST_SERVER}/`, mockData, undefined);
    });

    it('Http DELETE test', async () => {
      (axios.delete as jest.Mock).mockResolvedValue(mockResponse);
      const result = await httpClient.sendDeleteRequest('/');
      expect(result).toBe(mockResponse);
      expect(axios.delete).toHaveBeenCalledWith(`${TEST_SERVER}/`, undefined);
    });

    it('Http DELETE with config test', async () => {
      (axios.delete as jest.Mock).mockResolvedValue(mockResponse);
      const result = await httpClient.sendDeleteRequest('/', mockConfig);
      expect(result).toBe(mockResponse);
      expect(axios.delete).toHaveBeenCalledWith(`${TEST_SERVER}/`, mockConfig);
    });

    it('Http DELETE error handling', async () => {
      (axios.delete as jest.Mock).mockRejectedValue(mockError);
      
      await expect(httpClient.sendDeleteRequest('/')).rejects.toThrow('Network error');
      expect(axios.delete).toHaveBeenCalledWith(`${TEST_SERVER}/`, undefined);
    });
  });
  
  describe('Response type handling', () => {
    const httpClient = new HttpClient(TEST_SERVER);
    
    it('should handle typed responses correctly', async () => {
      interface User {
        id: number;
        name: string;
      }
      
      const mockUserResponse = { 
        data: { id: 1, name: 'Test User' },
        status: HttpState.OK
      };
      
      (axios.get as jest.Mock).mockResolvedValue(mockUserResponse);
      
      const result = await httpClient.sendGetRequest<User>('/users/1');
      expect(result.data.id).toBe(1);
      expect(result.data.name).toBe('Test User');
    });
  });
});
