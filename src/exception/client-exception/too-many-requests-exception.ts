import { HttpState } from '../../http-client';
import { ClientException } from './client-exception';

export class TooManyRequestsException extends ClientException {
  constructor(message = 'TOO_MANY_REQUESTS', cause?: Error) {
    super(HttpState.TOO_MANY_REQUESTS, message, cause);
  }
}
