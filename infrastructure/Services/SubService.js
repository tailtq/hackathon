import getSlug from 'speakingurl';

import knex from '../../config/database';
import BlogArticleService from '../../api/v1/BlogArticle/Services/BlogArticleService';
import NotFoundException from '../Exceptions/NotFoundException';

class SubService {
  constructor() {
    this.repository = null;
  }

  getBlogArticleService() {
    return BlogArticleService.getService();
  }

  list(options) {
    if (options.pagination === 'false') {
      return this.repository.getAllBy();
    }

    return this.repository.listBy({}, ['*'], true, options);
  }

  async getElement(unique, column, options) {
    const element = isNaN(unique)
      ? await this.repository.getBy({ slug: unique })
      : await this.repository.getById(unique);

    if (!element) {
      throw new NotFoundException();
    }

    const condition = q => q.where(knex.raw(`${element.id} = ANY("${column}")`));
    element.blogArticles = await this.getBlogArticleService().list(options, condition);

    return element;
  }

  createElement(input) {
    return knex.transaction(async (trx) => {
      input.slug = getSlug(input.slug || input.name);
      const id = await this.repository.create(input, trx);

      return this.repository.transactionGetById(trx, id);
    });
  }

  updateElement(id, input) {
    return knex.transaction(async (trx) => {
      if (input.slug || input.name) {
        input.slug = getSlug(input.slug || input.name);
      }

      await this.repository.update({ id }, input, trx);

      return this.repository.transactionGetById(trx, id);
    });
  }
}

export default SubService;
