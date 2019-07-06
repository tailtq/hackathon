import ResponseHelper from '../Traits/ResponseTrait';
import { loopParseHashids, decode, encode } from '../Helpers/Core/HashidsHelper';
import BadRequestException from '../Exceptions/BadRequestException';

export const decodeParams = (req, res, next, value, key) => {
  try {
    req.params[key] = decode(value);

    if (typeof req.params[key] !== 'string' || /[a-zA-Z]/.test(req.params[key]) || isNaN(parseInt(req.params[key], 10))) {
      throw new BadRequestException('INVALID_ID');
    }

    return next();
  } catch (e) {
    return res.json(ResponseHelper.error(e.message, e.code));
  }
};

export const decodeBody = (req, res, next) => {
  try {
    req.body = loopParseHashids(req.body);

    return next();
  } catch (e) {
    return res.json(ResponseHelper.error(e.message, e.code));
  }
};
