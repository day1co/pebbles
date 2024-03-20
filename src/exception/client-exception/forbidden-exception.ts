import { HttpState } from '../../http-client';
import { ClientException } from './client-exception';

export class ForbiddenException extends ClientException {
  constructor(message = 'FORBIDDEN', cause?: Error) {
    super(HttpState.FORBIDDEN, message, cause);
  }
}
