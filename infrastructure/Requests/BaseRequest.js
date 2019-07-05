import Joi from 'joi';
import getSlug from 'speakingurl';

import ResponseTrait from '../Traits/ResponseTrait';

class BaseRequest {
  validate(key) {
    return async (req, res, next) => {
      if (this[`${key}Request`]) {
        const schema = await this[`${key}Request`](req.body, req.params);
        const callback = err => (err ? res.json(ResponseTrait.badRequest(err.details)) : next());
        return Joi.validate(req.body, schema, { abortEarly: false, allowUnknown: true }, callback);
      }

      return res.json(ResponseTrait.notFound('REQUEST_SCHEMA_NOT_FOUND'));
    };
  }

  countForeignKey(Repository, value) {
    return value instanceof Array
      ? Repository.getRepository().count(query => query.whereIn('id', value))
      : 0;
  }

  async getExistSlug(Repository, value, id) {
    let condition = { slug: getSlug(value) };

    if (id) {
      condition = q => q.whereNot('id', id).where('slug', getSlug(value));
    }

    const element = await Repository.getRepository().getBy(condition, ['slug']);

    return element ? element.slug : undefined;
  }

  async getExistSlugInCurrentDay(Repository, value) {
    const condition = { slug: getSlug(value) };
    const element = await Repository.getRepository().getExistSlugInDate(condition, new Date());

    return element ? element.slug : undefined;
  }

  async getExistSlugByElement(Repository, value, id) {
    const condition = q => q.whereNot('id', id).where('slug', getSlug(value));
    let element = await Repository.getRepository().getById(id, ['createdAt']);
    element = await Repository.getRepository().getExistSlugInDate(condition, element.createdAt);

    return element ? element.slug : undefined;
  }

  deleteRequest() {
    return Joi.object().keys({
      ids: Joi.array().items(Joi.number().required()).required(),
    });
  }
}

export default BaseRequest;
