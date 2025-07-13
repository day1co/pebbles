import { HttpState } from '../../http-client';
import { CustomException } from '../custom-exception';

export class ServerException extends CustomException {
  constructor(
    code = HttpState.INTERNAL_SERVER_ERROR,
    message = 'INTERNAL_SERVER_ERROR',
    cause?: Error
  ) {
    super(code, message, cause);
  }
}
