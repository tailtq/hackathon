import { check, validationResult } from 'express-validator/check';
import BadRequestException from '../Exceptions/BadRequestException';
import ResponseHelper from '../Helpers/ResponseHelper';
import { loopHashids } from '../Helpers/HashidsHelper';

class BaseRequest {
  constructor() {
    this.repository = null;
  }

  deleteElementsRequest() {
    return [
      check('ids').isArray().not().isEmpty(),
      check('ids[*]').isInt().not().isEmpty(),
      this.validate,
    ];
  }

  validate(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    if (req.headers['content-type'] === 'application/json'
      || req.headers['x-requested-with'] === 'XMLHttpRequest') {
      return res.json(ResponseHelper.error(errors.mapped(), 400));
    }
    req.flash('oldValue', loopHashids(req.body));
    req.flash('errors', errors.mapped());

    return res.redirectBack();
  }

  async verifyExistedData(clauses) {
    const validate = await this.repository.checkExist(clauses);
    if (validate) {
      return Promise.reject(new BadRequestException());
    }

    return Promise.resolve();
  }
}

export default BaseRequest;
