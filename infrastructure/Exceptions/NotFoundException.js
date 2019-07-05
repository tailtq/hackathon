import BaseException from './BaseException';

class NotFoundException extends BaseException {
  constructor(message = 'RESOURCE_NOT_FOUND', code = 404) {
    super(message, code);
  }
}

export default NotFoundException;
