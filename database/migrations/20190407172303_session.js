exports.up = knex => knex.schema.createTable('session', (table) => {
  table.string('sid').primary();
  table.json('sess').notNullable();
  table.timestamp('expire', 6);
});

exports.down = knex => knex.schema.dropTable('session');
