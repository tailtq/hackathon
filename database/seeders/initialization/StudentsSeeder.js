const getSlug = require('speakingurl');
const faker = require('faker');
const bcrypt = require('bcryptjs');

const avatars = [
  'https://gitlab.cs.washington.edu/uploads/-/system/user/avatar/511/mernst-headshot-200307-1-square-med.jpg',
  'https://www.indiana.edu/~collfac/profiles/psychological-brain-sciences/images/headshots/brown.jpg',
  'https://www.onlinepictureproof.com/media/resize/1000/1000/media/gallery/1201-graham-easton-16April15-9108s-square-74f4.jpg',
  'https://static1.squarespace.com/static/592738c58419c2fe84fbdb81/t/5a894dbe24a694d707c028b7/1518948008812/DwayneBrownStudio_Tamara_Student_LinkedIn_Portraits.jpg',
  'http://www.traceysalazar.com/wp-content/uploads/2018/02/portrait-cover-portfolio.jpg',
];
const salt = bcrypt.genSaltSync(10);
const studentGmail = 'student@gmail.com';
const UKPhoneFormat = '+44 #### ### ###';

const data = [
  {
    name: faker.name.findName(undefined, undefined, undefined),
    email: studentGmail,
    password: bcrypt.hashSync('123123123', salt),
    phone: faker.phone.phoneNumber(UKPhoneFormat),
    address: faker.address.streetAddress(true),
    avatar: avatars[0],
    slug: getSlug(studentGmail),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

module.exports = async function (knex) {
  return knex('students').insert(data);
};
