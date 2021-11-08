import {
  BadRequestException,
  CustomException,
  ClientException,
  CredentialChangedException,
  DataException,
  ForbiddenException,
  NotFoundException,
  ServerException,
  UnauthorizedException,
} from './exception';

describe('exception', () => {
  describe('CustomException', () => {
    test('default properties', () => {
      const customException = new CustomException();
      expect(customException).toBeInstanceOf(Error);
      expect(customException.code).toBe(520);
      expect(customException.message).toBe('UNKNOWN_ERROR');
      expect(customException.cause).toBeUndefined();
    });

    test('custom properties', () => {
      const customException = new CustomException(520, 'foo', 'bar');
      expect(customException.message).toBe('foo');
      expect(customException.cause).toBe('bar');
    });
  });

  describe('ClientException', () => {
    test('default properties', () => {
      const clientException = new ClientException();
      expect(clientException).toBeInstanceOf(Error);
      expect(clientException).toBeInstanceOf(CustomException);
      expect(clientException.code).toBe(400);
      expect(clientException.message).toBe('CLIENT_ERROR');
      expect(clientException.cause).toBeUndefined();
    });

    test('custom properties', () => {
      const clientException = new ClientException(400, 'foo', 'bar');
      expect(clientException.message).toBe('foo');
      expect(clientException.cause).toBe('bar');
    });
  });

  describe('BadRequestException', () => {
    test('default properties', () => {
      const badRequestException = new BadRequestException();
      expect(badRequestException).toBeInstanceOf(Error);
      expect(badRequestException).toBeInstanceOf(CustomException);
      expect(badRequestException).toBeInstanceOf(ClientException);
      expect(badRequestException.code).toBe(400);
      expect(badRequestException.message).toBe('BAD_REQUEST');
      expect(badRequestException.cause).toBeUndefined();
    });

    test('custom properties', () => {
      const badRequestException = new BadRequestException('foo', 'bar');
      expect(badRequestException.message).toBe('foo');
      expect(badRequestException.cause).toBe('bar');
    });
  });

  describe('CredentialChangedException', () => {
    test('default properties', () => {
      const credentialChangedException = new CredentialChangedException();
      expect(credentialChangedException).toBeInstanceOf(Error);
      expect(credentialChangedException).toBeInstanceOf(CustomException);
      expect(credentialChangedException).toBeInstanceOf(ClientException);
      expect(credentialChangedException.code).toBe(401);
      expect(credentialChangedException.message).toBe('CREDENTIAL_CHANGED');
      expect(credentialChangedException.cause).toBeUndefined();
    });

    test('custom properties', () => {
      const credentialChangedException = new CredentialChangedException('foo', 'bar');
      expect(credentialChangedException.message).toBe('foo');
      expect(credentialChangedException.cause).toBe('bar');
    });
  });

  describe('DataException', () => {
    test('default properties', () => {
      const dataException = new DataException();
      expect(dataException).toBeInstanceOf(Error);
      expect(dataException).toBeInstanceOf(CustomException);
      expect(dataException.code).toBe(500);
      expect(dataException.message).toBe('DATA_ERROR');
      expect(dataException.cause).toBeUndefined();
    });

    test('custom properties', () => {
      const dataException = new DataException('foo', 'bar');
      expect(dataException.message).toBe('foo');
      expect(dataException.cause).toBe('bar');
    });
  });

  describe('ForbiddenException', () => {
    test('properties with message parameter', () => {
      const forbiddenException = new ForbiddenException('forbidden!!');
      expect(forbiddenException).toBeInstanceOf(Error);
      expect(forbiddenException).toBeInstanceOf(CustomException);
      expect(forbiddenException).toBeInstanceOf(ClientException);
      expect(forbiddenException.code).toBe(403);
      expect(forbiddenException.message).toBe('forbidden!!');
      expect(forbiddenException.cause).toBeUndefined();
    });

    test('custom properties', () => {
      const forbiddenException = new ForbiddenException('foo', 'bar');
      expect(forbiddenException.message).toBe('foo');
      expect(forbiddenException.cause).toBe('bar');
    });
  });

  describe('NotFoundException', () => {
    test('default properties', () => {
      const notFoundException = new NotFoundException();
      expect(notFoundException).toBeInstanceOf(Error);
      expect(notFoundException).toBeInstanceOf(CustomException);
      expect(notFoundException).toBeInstanceOf(ClientException);
      expect(notFoundException.code).toBe(404);
      expect(notFoundException.message).toBe('NOT_FOUND');
      expect(notFoundException.cause).toBeUndefined();
    });

    test('custom properties', () => {
      const notFoundException = new NotFoundException('foo', 'bar');
      expect(notFoundException.message).toBe('foo');
      expect(notFoundException.cause).toBe('bar');
    });
  });

  describe('ServerException', () => {
    test('default properties', () => {
      const serverException = new ServerException();
      expect(serverException).toBeInstanceOf(Error);
      expect(serverException).toBeInstanceOf(CustomException);
      expect(serverException.code).toBe(500);
      expect(serverException.message).toBe('INTERNAL_SERVER_ERROR');
      expect(serverException.cause).toBeUndefined();
    });

    test('custom properties', () => {
      const serverException = new ServerException('foo', 'bar');
      expect(serverException.message).toBe('foo');
      expect(serverException.cause).toBe('bar');
    });
  });

  describe('UnauthorizedException', () => {
    test('default properties', () => {
      const unauthorizedException = new UnauthorizedException();
      expect(unauthorizedException).toBeInstanceOf(Error);
      expect(unauthorizedException).toBeInstanceOf(CustomException);
      expect(unauthorizedException).toBeInstanceOf(ClientException);
      expect(unauthorizedException.code).toBe(401);
      expect(unauthorizedException.message).toBe('UNAUTHORIZED');
      expect(unauthorizedException.cause).toBeUndefined();
    });

    test('custom properties', () => {
      const unauthorizedException = new UnauthorizedException('foo', 'bar');
      expect(unauthorizedException.message).toBe('foo');
      expect(unauthorizedException.cause).toBe('bar');
    });
  });
});
