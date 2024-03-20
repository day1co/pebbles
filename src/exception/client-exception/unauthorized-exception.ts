import { HttpState } from '../../http-client';
import { ClientException } from './client-exception';

export class UnauthorizedException extends ClientException {
  constructor(message = 'UNAUTHORIZED', cause?: Error) {
    super(HttpState.UNAUTHORIZED, message, cause);
  }
}
