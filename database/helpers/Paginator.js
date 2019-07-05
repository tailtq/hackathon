import KnexQueryBuilder from 'knex/lib/query/builder';

import { PER_PAGE } from '../../infrastructure/Constants/CommonConstants';

export default function (knex) {
  KnexQueryBuilder.prototype.paginate = function callback(page = '1', perPage = PER_PAGE) {
    const offset = (page - 1) * perPage;
    const promises = [
      this.clone()
        .clearSelect()
        .clearOrder()
        .count('* as total')
        .first(),
      this.offset(offset).limit(perPage),
    ];

    return Promise.all(promises).then(([{ total }, result]) => ({
      result,
      total: parseInt(total, 10),
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
    }));
  };

  knex.queryBuilder = function queryBuilder() {
    return new KnexQueryBuilder(knex.client);
  };
}
