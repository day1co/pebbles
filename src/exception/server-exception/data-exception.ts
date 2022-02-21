import { ServerException } from './server-exception';
import { HttpState } from '../../http-client';

export class DataException extends ServerException {
  constructor(message = 'DATA_ERROR', cause?: Error) {
    super(HttpState.INTERNAL_SERVER_ERROR, message, cause);
  }
}
