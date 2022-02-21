import { ClientException } from './client-exception';
import { HttpState } from '../../http-client';

export class NotFoundException extends ClientException {
  constructor(message = 'NOT_FOUND', cause?: Error) {
    super(HttpState.NOT_FOUND, message, cause);
  }
}
