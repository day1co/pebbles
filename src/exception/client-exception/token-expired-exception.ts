import { ClientException } from './client-exception';
import { HttpState } from '../../http-client';

export class TokenExpiredException extends ClientException {
  constructor(message = 'TOKEN_EXPIRED', cause?: Error) {
    super(HttpState.UNAUTHORIZED, message, cause);
  }
}
