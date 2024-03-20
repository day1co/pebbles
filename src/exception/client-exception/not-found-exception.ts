import { HttpState } from '../../http-client';
import { ClientException } from './client-exception';

export class NotFoundException extends ClientException {
  constructor(message = 'NOT_FOUND', cause?: Error) {
    super(HttpState.NOT_FOUND, message, cause);
  }
}
