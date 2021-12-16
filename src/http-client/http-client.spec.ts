import { HttpClient } from './http-client';
import { HttpState } from './http-state.enum';

describe('HttpClient', () => {
  test('Base URL get/set', () => {
    const httpClient = new HttpClient();
    httpClient.baseUrl = 'baseUrl';
    expect(httpClient.baseUrl === 'baseUrl').toBe(true);
  });
});

describe('HttpState', () => {
  test('http state code number', () => {
    const OK: HttpState = HttpState.OK;
    const CREATED: HttpState = HttpState.CREATED;
    const ACCEPTED: HttpState = HttpState.ACCEPTED;
    const NO_CONTENT: HttpState = HttpState.NO_CONTENT;
    const BAD_REQUEST: HttpState = HttpState.BAD_REQUEST;
    const UNAUTHORIZED: HttpState = HttpState.UNAUTHORIZED;
    const FORBIDDEN: HttpState = HttpState.FORBIDDEN;
    const NOT_FOUND: HttpState = HttpState.NOT_FOUND;
    const TEAPOT: HttpState = HttpState.TEAPOT;
    const INTERNAL_SERVER_ERROR: HttpState = HttpState.INTERNAL_SERVER_ERROR;
    const SERVICE_UNAVAILABLE: HttpState = HttpState.SERVICE_UNAVAILABLE;
    const CUSTOM_UNKNOWN_ERROR: HttpState = HttpState.CUSTOM_UNKNOWN_ERROR;

    expect(OK).toEqual(200);
    expect(CREATED).toEqual(201);
    expect(ACCEPTED).toEqual(202);
    expect(NO_CONTENT).toEqual(204);
    expect(BAD_REQUEST).toEqual(400);
    expect(UNAUTHORIZED).toEqual(401);
    expect(FORBIDDEN).toEqual(403);
    expect(NOT_FOUND).toEqual(404);
    expect(TEAPOT).toEqual(418);
    expect(INTERNAL_SERVER_ERROR).toEqual(500);
    expect(SERVICE_UNAVAILABLE).toEqual(503);
    expect(CUSTOM_UNKNOWN_ERROR).toEqual(520);
  });
});
