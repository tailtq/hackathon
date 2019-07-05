import primaryKnex from 'knex';
const Mongoose = require('mongoose')
// import setupPaginator from '../database/Helpers/Paginator';

const knex = primaryKnex({
  client: 'pg',
  connection: process.env.DB_URL,
  asyncStackTraces: true,
});
const username = ""
const password = ""
const mghost = 'localhost';
const mgport = '27017';
const mgDBname = 'hackathon';
const dbURI = "mongodb://" +
  username + ":" +
  password + "@" +
  mghost + ":" +
  mgport + "/" +
  mgDBname;



Mongoose.connect(dbURI, {
  useNewUrlParser: true
});

// Throw an error if the connection fails
Mongoose.connection.on('error', function (err) {
  if (err) throw err;
});
// setupPaginator(knex);

export default knex;