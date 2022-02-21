import { ClientException } from './client-exception';
import { HttpState } from '../../http-client';

export class BadRequestException extends ClientException {
  constructor(message = 'BAD_REQUEST', cause?: Error) {
    super(HttpState.BAD_REQUEST, message, cause);
  }
}
