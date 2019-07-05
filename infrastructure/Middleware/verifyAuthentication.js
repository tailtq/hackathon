import jwt from 'jsonwebtoken';

import NotAuthenticatedException from '../Exceptions/NotAuthenticatedException';
import { SECRET } from '../../config/jsonwebtoken';
import ResponseTrait from '../Traits/ResponseTrait';

export default async (req, res, next) => {
  let token = req.headers.authorization;

  try {
    if (!token) {
      throw new NotAuthenticatedException();
    }

    token = token.substr('Bearer '.length);
    req.user = jwt.verify(token, SECRET).user;

    return next();
  } catch (e) {
    return res.json(ResponseTrait.error(e.message, e.code));
  }
};
