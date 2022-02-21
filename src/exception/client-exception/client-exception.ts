import { CustomException } from '../custom-exception';
import { HttpState } from '../../http-client';

export class ClientException extends CustomException {
  constructor(code = HttpState.BAD_REQUEST, message = 'CLIENT_ERROR', cause?: Error) {
    super(code, message, cause);
  }
}
