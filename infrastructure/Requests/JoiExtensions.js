import getSlug from 'speakingurl';

import { encodeIds } from '../Helpers/HashidsHelper';

export function checkForeignKeys(Joi) {
  return {
    name: 'array',
    base: Joi.array(),
    language: {
      checkForeignKeys: '{{value}} are invalid',
    },
    rules: [{
      name: 'checkForeignKeys',
      params: {
        valueLength: Joi.number().required(),
      },
      validate(params, value, state, options) {
        if (params.valueLength !== value.length) {
          return this.createError('array.checkForeignKeys', { value: encodeIds(value) }, state, options);
        }

        return value;
      },
    }],
  };
}

export function isDuplicated(Joi) {
  return {
    name: 'string',
    base: Joi.string(),
    language: {
      isDuplicated: '{{value}} is duplicated',
    },
    rules: [{
      name: 'isDuplicated',
      params: {
        value: Joi.string(),
      },
      validate(params, value, state, options) {
        if (getSlug(value) === params.value) {
          return this.createError('string.isDuplicated', { value }, state, options);
        }

        return value;
      },
    }],
  };
}
