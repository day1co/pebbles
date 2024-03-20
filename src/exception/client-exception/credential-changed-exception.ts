import { HttpState } from '../../http-client';
import { ClientException } from './client-exception';

export class CredentialChangedException extends ClientException {
  constructor(message = 'CREDENTIAL_CHANGED', cause?: Error) {
    super(HttpState.UNAUTHORIZED, message, cause);
  }
}
