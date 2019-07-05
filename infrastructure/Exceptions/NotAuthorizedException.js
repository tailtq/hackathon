import BaseException from './BaseException';

class NotAuthorizedException extends BaseException {
  constructor(message = 'NOT_AUTHORIZED_FOR_THIS_URI', code = 403) {
    super(message, code);
  }
}

export default NotAuthorizedException;
