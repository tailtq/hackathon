require('dotenv/config');
const mongoose = require('mongoose');

module.exports = async function () {
  const conn = mongoose.createConnection(process.env.DB_MONGODB_URL, { useNewUrlParser: true });
  await conn.dropCollection('messages');
};
