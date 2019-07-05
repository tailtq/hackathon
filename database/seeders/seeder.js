const truncateTables = require('./initialization/TruncateTables');
const seedStudents = require('./initialization/StudentsSeeder');

exports.seed = async function (knex) {
  await truncateTables(knex);
  await seedStudents(knex);
};
