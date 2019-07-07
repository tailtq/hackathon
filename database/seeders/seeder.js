const truncateTables = require('./initialization/TruncateTables');
const dropMongoDB = require('./initialization/DropMongoDB');
const seedMajors = require('./initialization/MajorsSeeder');
const seedStudents = require('./initialization/StudentsSeeder');
const seedTutors = require('./initialization/TutorsSeeder');

exports.seed = async function (knex) {
  await truncateTables(knex);
  await dropMongoDB(knex);
  await seedMajors(knex);
  await seedStudents(knex);
  await seedTutors(knex);
};
