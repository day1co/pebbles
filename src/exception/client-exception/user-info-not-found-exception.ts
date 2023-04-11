import { ClientException } from './client-exception';
import { HttpState } from '../../http-client';

export class UserInfoNotFoundException extends ClientException {
  constructor(message = 'USER_INFO_UPDATE_FAILED', cause?: Error) {
    super(HttpState.INTERNAL_SERVER_ERROR, message, cause);
  }
}
