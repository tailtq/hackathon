exports.up = knex => knex.schema.createTable('majors', (table) => {
  table.increments('id').primary();
  table.string('name', 120).notNullable();
  table.string('description');
  table.timestamp('createdAt').defaultTo(knex.fn.now());
  table.timestamp('updatedAt').defaultTo(knex.fn.now());
  table.dateTime('deletedAt');
});

exports.down = knex => knex.schema.dropTable('majors');
