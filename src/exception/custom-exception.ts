import { HttpState } from '../http-client';

export class CustomException extends Error {
  readonly code: HttpState;
  override readonly cause: Error | undefined;

  constructor(code = HttpState.CUSTOM_UNKNOWN_ERROR, message = 'UNKNOWN_ERROR', cause?: Error) {
    super();

    this.code = code;
    this.message = message;
    this.cause = cause;
  }
}
