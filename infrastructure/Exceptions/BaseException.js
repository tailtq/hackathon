class BaseException extends Error {
  constructor(message, code) {
    super();
    this.message = message;
    this.code = code;
  }
}

export default BaseException;
