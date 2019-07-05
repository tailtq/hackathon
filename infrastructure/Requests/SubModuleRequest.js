import getSlug from 'speakingurl';
import { check } from 'express-validator/check';

import BaseRequest from './BaseRequest';
import BadRequestException from '../Exceptions/BadRequestException';

class SubModuleRequest extends BaseRequest {
  static getCreatingRules(repository) {
    return [
      check('name').trim().not().isEmpty().isString().isLength({ min: 1, max: 100 })
        .custom(async name => SubModuleRequest.verifyData({ name }, repository)),
      check('slug').optional().trim().isLength({ min: 1, max: 90 }).isString()
        .custom(async (slug, { req }) => SubModuleRequest.verifyData({
          slug: getSlug(slug || req.body.name),
        }, repository)),
      this.validate,
    ];
  }

  static getUpdatingRules(repository) {
    return [
      check('name').trim().optional().isString().isLength({ min: 1, max: 100 })
        .custom(async (name, { req }) => SubModuleRequest.verifyData(
          query => query.where('name', name).whereNot('id', req.params.id),
          repository,
        )),
      check('slug').trim().optional().isLength({ min: 1, max: 90 }).isString()
        .custom(async (slug, { req }) => SubModuleRequest.verifyData(
          query => query.where('slug', getSlug(slug || req.body.name)).whereNot('id', req.params.id),
          repository,
        )),
      this.validate,
    ];
  }
}

export default SubModuleRequest;
