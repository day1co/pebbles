import { ClientException } from './client-exception';
import { HttpState } from '../../http-client';

export class UserDuplicatedException extends ClientException {
  constructor(message = 'USER_DUPLICATED_ERROR', cause?: Error) {
    super(HttpState.BAD_REQUEST, message, cause);
  }
}
