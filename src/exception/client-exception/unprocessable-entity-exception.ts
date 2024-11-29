import { HttpState } from '../../http-client';
import { ClientException } from './client-exception';

export class UnprocessableEntityException extends ClientException {
  constructor(message = 'UNPROCESSABLE ENTITY', cause?: Error) {
    super(HttpState.UNPROCESSABLE_ENTITY, message, cause);
  }
}
