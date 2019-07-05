import BaseException from './BaseException';

class NotAuthenticatedException extends BaseException {
  constructor(message = 'NOT_AUTHENTICATED', code = 401) {
    super(message, code);
  }
}

export default NotAuthenticatedException;
