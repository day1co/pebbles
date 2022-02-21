import { ServerException } from './server-exception';
import { HttpState } from '../../http-client';

export class InternalServerException extends ServerException {
  constructor(message = 'INTERNAL_SERVER_ERROR', cause?: Error) {
    super(HttpState.INTERNAL_SERVER_ERROR, message, cause);
  }
}
