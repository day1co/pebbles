import { HttpState } from '../../http-client';
import { ClientException } from './client-exception';

export class ConflictException extends ClientException {
  constructor(message = 'CONFLICT', cause?: Error) {
    super(HttpState.CONFLICT, message, cause);
  }
}
