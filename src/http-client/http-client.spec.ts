import { constants } from 'http2';
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

    expect(OK).toEqual(constants.HTTP_STATUS_OK);
    expect(CREATED).toEqual(constants.HTTP_STATUS_CREATED);
    expect(ACCEPTED).toEqual(constants.HTTP_STATUS_ACCEPTED);
    expect(NO_CONTENT).toEqual(constants.HTTP_STATUS_NO_CONTENT);
    expect(BAD_REQUEST).toEqual(constants.HTTP_STATUS_BAD_REQUEST);
    expect(UNAUTHORIZED).toEqual(constants.HTTP_STATUS_UNAUTHORIZED);
    expect(FORBIDDEN).toEqual(constants.HTTP_STATUS_FORBIDDEN);
    expect(NOT_FOUND).toEqual(constants.HTTP_STATUS_NOT_FOUND);
    expect(TEAPOT).toEqual(constants.HTTP_STATUS_TEAPOT);
    expect(INTERNAL_SERVER_ERROR).toEqual(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
    expect(SERVICE_UNAVAILABLE).toEqual(constants.HTTP_STATUS_SERVICE_UNAVAILABLE);
    expect(CUSTOM_UNKNOWN_ERROR).toEqual(520);
  });
});
