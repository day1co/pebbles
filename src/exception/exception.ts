import { HttpState } from '../http-client';

export class CustomException extends Error {
  public code;
  public cause;

  constructor(code = HttpState.CUSTOM_UNKNOWN_ERROR, message = 'UNKNOWN_ERROR', cause?: string) {
    super();
    this.code = code;
    this.message = message;
    this.cause = cause;
  }
}
export class ClientException extends CustomException {
  constructor(code = HttpState.BAD_REQUEST, message = 'CLIENT_ERROR', cause?: string) {
    super(code, message, cause);
  }
}

export class BadRequestException extends ClientException {
  constructor(message = 'BAD_REQUEST', cause?: string) {
    super(HttpState.BAD_REQUEST, message, cause);
  }
}

export class NotFoundException extends ClientException {
  constructor(message = 'NOT_FOUND', cause?: string) {
    super(HttpState.NOT_FOUND, message, cause);
  }
}

export class UnauthorizedException extends ClientException {
  constructor(message = 'UNAUTHORIZED', cause?: string) {
    super(HttpState.UNAUTHORIZED, message, cause);
  }
}

export class CredentialChangedException extends ClientException {
  constructor(message = 'CREDENTIAL_CHANGED', cause?: string) {
    super(HttpState.UNAUTHORIZED, message, cause);
  }
}

export class ForbiddenException extends ClientException {
  constructor(message = 'FORBIDDEN', cause?: string) {
    super(HttpState.FORBIDDEN, message, cause);
  }
}

export class ServerException extends CustomException {
  constructor(message = 'INTERNAL_SERVER_ERROR', cause?: string) {
    super(HttpState.INTERNAL_SERVER_ERROR, message, cause);
  }
}

export class DataException extends CustomException {
  constructor(message = 'DATA_ERROR', cause?: string) {
    super(HttpState.INTERNAL_SERVER_ERROR, message, cause);
  }
}
