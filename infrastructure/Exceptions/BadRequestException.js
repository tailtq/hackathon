import BaseException from './BaseException';

class BadRequestException extends BaseException {
  constructor(message = 'BAD_REQUEST', code = 400) {
    super(message, code);
  }
}

export default BadRequestException;
