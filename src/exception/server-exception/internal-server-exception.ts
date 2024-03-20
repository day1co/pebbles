import { HttpState } from '../../http-client';
import { ServerException } from './server-exception';

export class InternalServerException extends ServerException {
  constructor(message = 'INTERNAL_SERVER_ERROR', cause?: Error) {
    super(HttpState.INTERNAL_SERVER_ERROR, message, cause);
  }
}
