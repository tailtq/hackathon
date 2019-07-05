const truncateTables = require('./initialization/TruncateTables');
const seedStudents = require('./initialization/StudentsSeeder');
const seedTutors = require('./initialization/TutorsSeeder');

exports.seed = async function (knex) {
  await truncateTables(knex);
  await seedStudents(knex);
  await seedTutors(knex);
};
