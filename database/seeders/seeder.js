const truncateTables = require('./initialization/TruncateTables');
const dropMongoDB = require('./initialization/DropMongoDB');
const seedStudents = require('./initialization/StudentsSeeder');
const seedTutors = require('./initialization/TutorsSeeder');

exports.seed = async function (knex) {
  await truncateTables(knex);
  await dropMongoDB(knex);
  await seedStudents(knex);
  await seedTutors(knex);
};
