import { ClientException } from './client-exception';
import { HttpState } from '../../http-client';

export class UserUncertifiedEmailException extends ClientException {
  constructor(message = 'USER_UNCERTIFIED_EMAIL_ERROR', cause?: Error) {
    super(HttpState.UNAUTHORIZED, message, cause);
  }
}
