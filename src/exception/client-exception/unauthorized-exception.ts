import { ClientException } from './client-exception';
import { HttpState } from '../../http-client';

export class UnauthorizedException extends ClientException {
  constructor(message = 'UNAUTHORIZED', cause?: Error) {
    super(HttpState.UNAUTHORIZED, message, cause);
  }
}
