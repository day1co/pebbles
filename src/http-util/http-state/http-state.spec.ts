import { HttpState } from './http-state';

describe('HttpState', () => {
  test('http state code number', () => {
    const OK = HttpState.OK;
    const CREATED = HttpState.CREATED;
    const ACCEPTED = HttpState.ACCEPTED;
    const NO_CONTENT = HttpState.NO_CONTENT;
    const BAD_REQUEST = HttpState.BAD_REQUEST;
    const UNAUTHORIZED = HttpState.UNAUTHORIZED;
    const FORBIDDEN = HttpState.FORBIDDEN;
    const NOT_FOUND = HttpState.NOT_FOUND;
    const TEAPOT = HttpState.TEAPOT;
    const INTERNAL_SERVER_ERROR = HttpState.INTERNAL_SERVER_ERROR;
    const CUSTOM_UNKNOWN_ERROR = HttpState.CUSTOM_UNKNOWN_ERROR;

    expect(OK).toBe(200);
    expect(CREATED).toBe(201);
    expect(ACCEPTED).toBe(202);
    expect(NO_CONTENT).toBe(204);
    expect(BAD_REQUEST).toBe(400);
    expect(UNAUTHORIZED).toBe(401);
    expect(FORBIDDEN).toBe(403);
    expect(NOT_FOUND).toBe(404);
    expect(TEAPOT).toBe(418);
    expect(INTERNAL_SERVER_ERROR).toBe(500);
    expect(CUSTOM_UNKNOWN_ERROR).toBe(520);
  });
});
