const truncateTables = require('./initialization/TruncateTables');

exports.seed = async function (knex) {
  await truncateTables(knex);
};
