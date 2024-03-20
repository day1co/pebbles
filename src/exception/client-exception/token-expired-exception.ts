import { HttpState } from '../../http-client';
import { ClientException } from './client-exception';

export class TokenExpiredException extends ClientException {
  constructor(message = 'TOKEN_EXPIRED', cause?: Error) {
    super(HttpState.UNAUTHORIZED, message, cause);
  }
}
