require('dotenv').config();

const config = {
  client: process.env.DB_CONNECTION,
  connection: {
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: 'database/migrations',
    tableName: 'migrations',
  },
  seeds: {
    directory: 'database/seeders',
  },
};

module.exports = {
  development: config,
  staging: config,
  production: config,
};
