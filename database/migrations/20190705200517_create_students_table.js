exports.up = knex => knex.schema.createTable('students', (table) => {
  table.increments('id').primary();
  table.string('name', 120).notNullable();
  table.string('email', 100).notNullable();
  table.string('password', 100);
  table.string('description');
  table.specificType('gender', 'smallint');
  table.string('phone', 20);
  table.date('birthday');
  table.string('address');
  table.string('avatar');
  table.string('resetPasswordToken', 50);
  table.specificType('status', 'smallint').defaultTo(0); // 0: offline, 1: online
  table.dateTime('tokenExpiredAt');
  table.string('slug', 100).notNullable();
  table.timestamp('createdAt').defaultTo(knex.fn.now());
  table.timestamp('updatedAt').defaultTo(knex.fn.now());
  table.dateTime('deletedAt');
});

exports.down = knex => knex.schema.dropTable('students');
