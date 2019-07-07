const getSlug = require('speakingurl');
const faker = require('faker');

const data = [
  {
    name: 'Math',
    slug: 'math',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Chemistry',
    slug: 'chemistry',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'English',
    slug: 'english',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

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
