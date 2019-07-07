const getSlug = require('speakingurl');
const faker = require('faker');
const bcrypt = require('bcryptjs');

const avatars = [
  'https://gitlab.cs.washington.edu/uploads/-/system/user/avatar/511/mernst-headshot-200307-1-square-med.jpg',
  'https://www.indiana.edu/~collfac/profiles/psychological-brain-sciences/images/headshots/brown.jpg',
  'https://www.onlinepictureproof.com/media/resize/1000/1000/media/gallery/1201-graham-easton-16April15-9108s-square-74f4.jpg',
  'https://static1.squarespace.com/static/592738c58419c2fe84fbdb81/t/5a894dbe24a694d707c028b7/1518948008812/DwayneBrownStudio_Tamara_Student_LinkedIn_Portraits.jpg',
  'http://www.traceysalazar.com/wp-content/uploads/2018/02/portrait-cover-portfolio.jpg',
  'https://sebastiaanrood.eu/wp-content/uploads/2016/09/Avatar.jpg',
  'https://verfassungsblog.de/wp-content/uploads/2016/04/Hjalte-Lokdam_avatar_1461496615-512x512.jpg',
  'https://www.flocktory.com/wp-content/uploads/2016/03/L1003894-e1459853813645.jpg',
  'https://www.ciccarelli.com/wp-content/uploads/2018/06/TIm-Kraeer-01.jpg',
];
const salt = bcrypt.genSaltSync(10);
const tutorGmail = 'tutor@gmail.com';
const UKPhoneFormat = '+44 #### ### ###';

const data = [
  {
    majorIds: [1, 2],
    name: faker.name.findName(undefined, undefined, undefined),
    email: tutorGmail,
    password: bcrypt.hashSync('123123123', salt),
    phone: faker.phone.phoneNumber(UKPhoneFormat),
    address: faker.address.streetAddress(true),
    avatar: avatars[0],
    description: faker.lorem.words(25),
    profession: 'Professor at Stanford University',
    slug: getSlug(tutorGmail),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

module.exports = async function (knex) {
  for (let i = 1; i < avatars.length; i++) {
    const email = faker.internet.email();

    data.push({
      majorIds: [i, i + 1],
      name: faker.name.findName(undefined, undefined, undefined),
      email,
      password: bcrypt.hashSync('123123123', salt),
      phone: faker.phone.phoneNumber(UKPhoneFormat),
      address: faker.address.streetAddress(true),
      avatar: avatars[i],
      description: faker.lorem.words(25),
      profession: 'Professor at Stanford University',
      slug: getSlug(email),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return knex('tutors').insert(data);
};
