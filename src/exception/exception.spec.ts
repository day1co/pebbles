import {
  BadRequestException,
  CredentialChangedException,
  ClientException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from './client-exception';
import { CustomException } from './custom-exception';
import { DataException, InternalServerException, ServerException } from './server-exception';

const error = new Error();

describe('error', () => {
  describe('CustomException', () => {
    test('should have default property', () => {
      const e = new CustomException();
      expect(e).toBeInstanceOf(CustomException);
      expect(e).toBeInstanceOf(Error);
      expect(e.code).toBe(520);
      expect(e.message).toBe('UNKNOWN_ERROR');
      expect(e.cause).toBeUndefined();
    });
    test('should have specified property', () => {
      const e = new CustomException(123, 'hello', error);
      expect(e).toBeInstanceOf(CustomException);
      expect(e).toBeInstanceOf(Error);
      expect(e.code).toBe(123);
      expect(e.message).toBe('hello');
      expect(e.cause).toBe(error);
    });
  });
  describe('ClientException', () => {
    test('should have default property', () => {
      const e = new ClientException();
      expect(e).toBeInstanceOf(ClientException);
      expect(e).toBeInstanceOf(CustomException);
      expect(e).toBeInstanceOf(Error);
      expect(e.code).toBe(400);
      expect(e.message).toBe('CLIENT_ERROR');
      expect(e.cause).toBeUndefined();
    });
    test('should have specified property', () => {
      const e = new ClientException(123, 'hello', error);
      expect(e).toBeInstanceOf(ClientException);
      expect(e).toBeInstanceOf(CustomException);
      expect(e).toBeInstanceOf(Error);
      expect(e.code).toBe(123);
      expect(e.message).toBe('hello');
      expect(e.cause).toBe(error);
    });
  });
  describe('BadRequestException', () => {
    // test('should have default property', () => {
    const e = new BadRequestException();
    expect(e).toBeInstanceOf(BadRequestException);
    expect(e).toBeInstanceOf(ClientException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(400);
    expect(e.message).toBe('BAD_REQUEST');
    expect(e.cause).toBeUndefined();
  });
  test('should have specified property', () => {
    const e = new BadRequestException('hello', error);
    expect(e).toBeInstanceOf(BadRequestException);
    expect(e).toBeInstanceOf(ClientException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(400);
    expect(e.message).toBe('hello');
    expect(e.cause).toBe(error);
  });
});
describe('NotFoundException', () => {
  test('should have default property', () => {
    const e = new NotFoundException();
    expect(e).toBeInstanceOf(NotFoundException);
    expect(e).toBeInstanceOf(ClientException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(404);
    expect(e.message).toBe('NOT_FOUND');
    expect(e.cause).toBeUndefined();
  });
  test('should have specified property', () => {
    const e = new NotFoundException('hello', error);
    expect(e).toBeInstanceOf(NotFoundException);
    expect(e).toBeInstanceOf(ClientException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(404);
    expect(e.message).toBe('hello');
    expect(e.cause).toBe(error);
  });
});
describe('UnauthorizedException', () => {
  test('should have default property', () => {
    const e = new UnauthorizedException();
    expect(e).toBeInstanceOf(UnauthorizedException);
    expect(e).toBeInstanceOf(ClientException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(401);
    expect(e.message).toBe('UNAUTHORIZED');
    expect(e.cause).toBeUndefined();
  });
  test('should have specified property', () => {
    const e = new UnauthorizedException('hello', error);
    expect(e).toBeInstanceOf(UnauthorizedException);
    expect(e).toBeInstanceOf(ClientException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(401);
    expect(e.message).toBe('hello');
    expect(e.cause).toBe(error);
  });
});
describe('CredentialChangedException', () => {
  test('should have default property', () => {
    const e = new CredentialChangedException();
    expect(e).toBeInstanceOf(CredentialChangedException);
    expect(e).toBeInstanceOf(ClientException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(401);
    expect(e.message).toBe('CREDENTIAL_CHANGED');
    expect(e.cause).toBeUndefined();
  });
  test('should have specified property', () => {
    const e = new CredentialChangedException('hello', error);
    expect(e).toBeInstanceOf(CredentialChangedException);
    expect(e).toBeInstanceOf(ClientException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(401);
    expect(e.message).toBe('hello');
    expect(e.cause).toBe(error);
  });
});
describe('ForbiddenException', () => {
  test('should have default property', () => {
    const e = new ForbiddenException();
    expect(e).toBeInstanceOf(ForbiddenException);
    expect(e).toBeInstanceOf(ClientException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(403);
    expect(e.message).toBe('FORBIDDEN');
    expect(e.cause).toBeUndefined();
  });
  test('should have specified property', () => {
    const e = new ForbiddenException('hello', error);
    expect(e).toBeInstanceOf(ForbiddenException);
    expect(e).toBeInstanceOf(ClientException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(403);
    expect(e.message).toBe('hello');
    expect(e.cause).toBe(error);
  });
});
describe('ServerException', () => {
  test('should have default property', () => {
    const e = new ServerException();
    expect(e).toBeInstanceOf(ServerException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(500);
    expect(e.message).toBe('INTERNAL_SERVER_ERROR');
    expect(e.cause).toBeUndefined();
  });
  test('should have specified property', () => {
    const e = new ServerException(123, 'hello', error);
    expect(e).toBeInstanceOf(ServerException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(123);
    expect(e.message).toBe('hello');
    expect(e.cause).toBe(error);
  });
});
describe('InternalServerException', () => {
  test('should have default property', () => {
    const e = new InternalServerException();
    expect(e).toBeInstanceOf(InternalServerException);
    expect(e).toBeInstanceOf(ServerException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(500);
    expect(e.message).toBe('INTERNAL_SERVER_ERROR');
    expect(e.cause).toBeUndefined();
  });
  test('should have specified property', () => {
    const e = new InternalServerException('hello', error);
    expect(e).toBeInstanceOf(InternalServerException);
    expect(e).toBeInstanceOf(ServerException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(500);
    expect(e.message).toBe('hello');
    expect(e.cause).toBe(error);
  });
});
describe('DataException', () => {
  test('should have default property', () => {
    const e = new DataException();
    expect(e).toBeInstanceOf(DataException);
    expect(e).toBeInstanceOf(ServerException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(500);
    expect(e.message).toBe('DATA_ERROR');
    expect(e.cause).toBeUndefined();
  });
  test('should have specified property', () => {
    const e = new DataException('hello', error);
    expect(e).toBeInstanceOf(DataException);
    expect(e).toBeInstanceOf(ServerException);
    expect(e).toBeInstanceOf(CustomException);
    expect(e).toBeInstanceOf(Error);
    expect(e.code).toBe(500);
    expect(e.message).toBe('hello');
    expect(e.cause).toBe(error);
  });
});
