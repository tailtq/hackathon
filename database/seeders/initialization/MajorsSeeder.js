const getSlug = require('speakingurl');
const faker = require('faker');

const data = [];

module.exports = async function (knex) {
  for (let i = 0; i < 10; i++) {
    const name = faker.lorem.words(2);
    data.push({
      name,
      slug: getSlug(name),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  return knex('majors').insert(data);
};
