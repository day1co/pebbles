import { ClientException } from './client-exception';
import { HttpState } from '../../http-client';

export class ForbiddenException extends ClientException {
  constructor(message = 'FORBIDDEN', cause?: Error) {
    super(HttpState.FORBIDDEN, message, cause);
  }
}
