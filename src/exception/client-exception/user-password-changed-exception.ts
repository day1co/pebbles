import { ClientException } from './client-exception';
import { HttpState } from '../../http-client';

export class UserPasswordChangedException extends ClientException {
  constructor(message = 'USER_PASSWORD_UPDATE_ERROR', cause?: Error) {
    super(HttpState.INTERNAL_SERVER_ERROR, message, cause);
  }
}
