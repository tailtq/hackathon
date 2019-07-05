import { check } from 'express-validator/check';

import BaseRequest from './BaseRequest';

class DeleteByIdsRequest extends BaseRequest {
  static rules() {
    return [
      check('ids').isArray().not().isEmpty(),
      check('ids[*]').isInt().not().isEmpty(),
      this.validate,
    ];
  }
}

export default DeleteByIdsRequest;
