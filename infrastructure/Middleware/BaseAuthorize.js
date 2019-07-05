import { decode, loopParseHashids } from '../Helpers/HashidsHelper';
import ResponseTrait from '../Traits/ResponseTrait';
import PermissionHelper from '../Helpers/PermissionHelper';
import NotAuthorizedException from '../Exceptions/NotAuthorizedException';
import NotFoundException from '../Exceptions/NotFoundException';

class BaseAuthorize {
  routes = {};

  constructor() {
    this.repository = null;
  }

  handleAuthorization(route) {
    return async (req, res, next) => {
      try {
        let method = this.routes[route];
        method = this[`authorize${method}`];

        if (!method) {
          return next();
        }

        return await method.bind(this)(req, res, next);
      } catch (e) {
        return res.json(ResponseTrait.error(e.message, e.code)).status(e.code);
      }
    };
  }

  static decodeParams(req, res, next) {
    try {
      const { unique } = req.params;

      if (unique && typeof decode(unique) === 'object') {
        return next();
      }

      req.params = loopParseHashids(req.params);

      return next();
    } catch (e) {
      return res.json(ResponseTrait.error(e.message, e.code));
    }
  }

  static decodeBody(req, res, next) {
    try {
      req.body = loopParseHashids(req.body);

      return next();
    } catch (e) {
      return res.json(ResponseTrait.error(e.message, e.code));
    }
  }

  async verifyElementById(id, shouldReturn = false) {
    let element;
    if (shouldReturn) {
      element = await this.repository.getById(id);
    } else {
      element = await this.repository.checkExist({ id });
    }

    if (!element) {
      throw new NotFoundException();
    }

    return element;
  }

  async authorizeDeleting(user, ids) {
    const elements = await this.repository.listBy(query => query.whereIn('id', ids), ['user_id'], false);
    if (elements.length !== ids.length) {
      throw new NotFoundException();
    }

    elements.forEach((element) => {
      if (!PermissionHelper.checkPermission(element, user)) {
        throw new NotAuthorizedException();
      }
    });

    return true;
  }

  verifyCommonRoles(user) {
    if (!PermissionHelper.hasCommonRoles(user)) {
      throw new NotAuthorizedException();
    }

    return true;
  }

  verifyManagementRole(user) {
    if (!PermissionHelper.hasManagementRole(user)) {
      throw new NotAuthorizedException();
    }

    return true;
  }
}

export default BaseAuthorize;
