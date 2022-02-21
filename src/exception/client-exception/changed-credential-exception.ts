import { ClientException } from './client-exception';
import { HttpState } from '../../http-client';

export class ChangedCredentialException extends ClientException {
  constructor(message = 'CREDENTIAL_CHANGED', cause?: Error) {
    super(HttpState.UNAUTHORIZED, message, cause);
  }
}
