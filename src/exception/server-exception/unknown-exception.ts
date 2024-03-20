import { HttpState } from '../../http-client';
import { CustomException } from '../custom-exception';

export class UnknownException extends CustomException {
  constructor(code = HttpState.CUSTOM_UNKNOWN_ERROR, message = 'UNKNOWN_ERROR', cause?: Error) {
    super(code, message, cause);
  }
}
