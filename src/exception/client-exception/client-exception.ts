import { HttpState } from '../../http-client';
import { CustomException } from '../custom-exception';

export class ClientException extends CustomException {
  constructor(code = HttpState.BAD_REQUEST, message = 'CLIENT_ERROR', cause?: Error) {
    super(code, message, cause);
  }
}
