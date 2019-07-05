import moment from 'moment';

import { PER_PAGE } from '../Constants/CommonConstants';
import knex from '../../config/database';
import BadRequestException from '../Exceptions/BadRequestException';

class BaseRepository {
  constructor() {
    this.tableName = this.getTableName();
  }

  getTableName() {
    throw new BadRequestException('TABLE_NOT_FOUND');
  }

  cloneQuery() {
    return knex(this.tableName).clone();
  }

  async listBy(clauses = {}, columns = ['*'], options = {}) {
    const { page = '1', perPage } = options;
    let query = this.cloneQuery().select(columns).orderBy('createdAt', 'desc');
    query = this.handleConditions(query, clauses, true);

    return query.paginate(page, perPage || PER_PAGE);
  }

  async getAllBy(clauses = {}, columns = ['*'], hasDeletedAt = true) {
    let query = this.cloneQuery().select(columns).orderBy('createdAt');
    query = this.handleConditions(query, clauses, hasDeletedAt);

    return query;
  }

  async count(clauses = {}, columns = ['*']) {
    let query = this.cloneQuery();
    query = this.handleConditions(query, clauses, true);

    return parseInt((await query.count(columns).first()).count, 10);
  }

  getBy(clauses, columns = ['*'], hasDeletedAt = true) {
    let query = this.cloneQuery().select(columns);
    query = this.handleConditions(query, clauses, hasDeletedAt);

    return query.first();
  }

  getById(id, columns = ['*'], hasDeletedAt = true) {
    return this.getBy({ id }, columns, hasDeletedAt);
  }

  checkExist(clauses, hasDeletedAt = true) {
    let query = this.cloneQuery().select(1);
    query = this.handleConditions(query, clauses, hasDeletedAt);

    return query.first();
  }

  transactionListBy(trx, clauses, columns = ['*'], hasDeletedAt = true) {
    const query = trx.table(this.tableName).select(columns);

    return this.handleConditions(query, clauses, hasDeletedAt);
  }

  transactionGetBy(trx, clauses, columns = ['*'], hasDeletedAt = true) {
    let query = trx.table(this.tableName).select(columns);
    query = this.handleConditions(query, clauses, hasDeletedAt);

    return query.first();
  }

  transactionGetById(trx, id, columns = ['*'], hasDeletedAt = true) {
    return this.transactionGetBy(trx, { id }, columns, hasDeletedAt);
  }

  handleConditions(query, clauses, hasDeletedAt, tableName = null) {
    if (typeof clauses === 'function') {
      query = clauses(query);
    } else {
      query = query.where(clauses);
    }

    if (hasDeletedAt) {
      const table = tableName || this.tableName;
      query = query.whereNull(`${table}.deletedAt`);
    }

    return query;
  }

  async create(attributes, trx, returningColumn = 'id') {
    attributes.createdAt = new Date();
    attributes.updatedAt = new Date();

    return (await trx.table(this.tableName).insert(attributes).returning(returningColumn))[0];
  }

  async update(clauses, attributes, trx, returning = ['id']) {
    const query = this.getQueryFromTransaction(trx, clauses, false);
    attributes.updatedAt = new Date();

    return (await query.update(attributes, returning))[0];
  }

  async updateById(id, attributes, trx, returning = ['id']) {
    const query = this.getQueryFromTransaction(trx, { id }, false);
    attributes.updatedAt = new Date();

    return (await query.update(attributes, returning))[0];
  }

  delete(clauses, trx, hasDeletedAt = true) {
    const query = this.getQueryFromTransaction(trx, clauses, hasDeletedAt);

    if (hasDeletedAt) {
      return query.update({ deletedAt: new Date() });
    }

    return query.delete();
  }

  deleteByIds(ids, trx, hasDeletedAt = true) {
    ids = (typeof ids === 'number') ? [ids] : ids;

    return this.delete(q => q.whereIn('id', ids), trx, hasDeletedAt);
  }

  getAllRelationsBy(clauses, table, columns = ['*'], hasDeletedAt = false) {
    const query = knex.table(table).select(columns);

    return this.handleConditions(query, clauses, hasDeletedAt, table);
  }

  forceDeleteRelations(clauses, table, trx) {
    return this.getQueryFromTransaction(trx, clauses, false, table).delete();
  }

  /**
   * @param trx
   * @param clauses
   * @param hasDeletedAt
   * @param tableName
   * @returns {Knex.QueryBuilder | Objection.QueryBuilder<QM, RM, RV> | *}
   */
  getQueryFromTransaction(trx, clauses, hasDeletedAt, tableName = null) {
    const query = trx.table(tableName || this.tableName);

    return this.handleConditions(query, clauses, hasDeletedAt, tableName);
  }

  /**
   * @param clauses
   * @param attributes
   * @param trx
   * @returns {*|Knex.QueryBuilder|void}
   */
  increment(clauses, attributes, trx) {
    const query = this.getQueryFromTransaction(trx, clauses, false);

    return query.increment(attributes);
  }

  getExistSlugInDate(clauses, date, hasDeletedAt = true) {
    const start = moment(date).utc().startOf('day');
    const end = moment(date).utc().endOf('day');
    const condition = (q) => {
      q = (typeof clauses === 'function') ? clauses(q) : q.where(clauses);
      return q.whereBetween('createdAt', [start, end]);
    };

    return this.getBy(condition, ['slug'], hasDeletedAt);
  }
}

export default BaseRepository;
