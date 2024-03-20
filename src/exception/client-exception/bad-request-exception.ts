import { HttpState } from '../../http-client';
import { ClientException } from './client-exception';

export class BadRequestException extends ClientException {
  constructor(message = 'BAD_REQUEST', cause?: Error) {
    super(HttpState.BAD_REQUEST, message, cause);
  }
}
