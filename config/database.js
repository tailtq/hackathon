import primaryKnex from 'knex';
// import setupPaginator from '../database/Helpers/Paginator';

const knex = primaryKnex({
  client: 'pg',
  connection: process.env.DB_URL,
  asyncStackTraces: true,
});

// setupPaginator(knex);

export default knex;
