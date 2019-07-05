import BaseAuthorize from './BaseAuthorize';
import NotFoundException from '../Exceptions/NotFoundException';

class ElementAuthorize extends BaseAuthorize {
  async authorizeUpdatingElement(req, res, next) {
    const { id } = req.params;
    const module = await this.repository.getById(id, ['id']);

    if (!module) {
      return next(new NotFoundException());
    }

    return next();
  }

  async authorizeDeletingElements(req, res, next) {
    const { ids } = req.body;
    const total = await this.repository.count(q => q.whereIn('id', ids));

    if (total !== ids.length) {
      return next(new NotFoundException());
    }

    return next();
  }

  async authorizeDeletingElement(req, res, next) {
    const { id } = req.params;
    const element = await this.repository.getById(id, ['id']);

    if (!element) {
      return next(new NotFoundException());
    }

    return next();
  }
}

export default ElementAuthorize;
