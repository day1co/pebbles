import { HttpStateCode } from './http-state.enum';

describe('HttpState', () => {
  test('http state code number', () => {
    const OK: HttpStateCode = HttpStateCode.OK;
    const CREATED: HttpStateCode = HttpStateCode.CREATED;
    const ACCEPTED: HttpStateCode = HttpStateCode.ACCEPTED;
    const NO_CONTENT: HttpStateCode = HttpStateCode.NO_CONTENT;
    const BAD_REQUEST: HttpStateCode = HttpStateCode.BAD_REQUEST;
    const UNAUTHORIZED: HttpStateCode = HttpStateCode.UNAUTHORIZED;
    const FORBIDDEN: HttpStateCode = HttpStateCode.FORBIDDEN;
    const NOT_FOUND: HttpStateCode = HttpStateCode.NOT_FOUND;
    const TEAPOT: HttpStateCode = HttpStateCode.TEAPOT;
    const INTERNAL_SERVER_ERROR: HttpStateCode = HttpStateCode.INTERNAL_SERVER_ERROR;
    const CUSTOM_UNKNOWN_ERROR: HttpStateCode = HttpStateCode.CUSTOM_UNKNOWN_ERROR;

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
    expect(CUSTOM_UNKNOWN_ERROR).toEqual(520);
  });
});
