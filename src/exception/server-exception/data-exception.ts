import { HttpState } from '../../http-client';
import { ServerException } from './server-exception';

export class DataException extends ServerException {
  constructor(message = 'DATA_ERROR', cause?: Error) {
    super(HttpState.INTERNAL_SERVER_ERROR, message, cause);
  }
}
