import { ClientException } from './client-exception';
import { HttpState } from '../../http-client';

export class UserRegistrationException extends ClientException {
  constructor(message = 'USER_REGISTRATION_ERROR', cause?: Error) {
    super(HttpState.INTERNAL_SERVER_ERROR, message, cause);
  }
}
