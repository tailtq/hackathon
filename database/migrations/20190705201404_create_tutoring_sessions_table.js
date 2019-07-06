exports.up = knex => knex.schema.createTable('tutoring_sessions', (table) => {
  table.increments('id').primary();
  table.integer('tutorId').unsigned().notNullable();
  table.foreign('tutorId').references('id').on('tutors');
  table.integer('studentId').unsigned().notNullable();
  table.foreign('studentId').references('id').on('students');
  table.float('room').notNullable();
  table.dateTime('startedAt');
  table.integer('duration');
  table.specificType('rate', 'smallint');
  table.timestamp('createdAt').defaultTo(knex.fn.now());
  table.timestamp('updatedAt').defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable('tutoring_sessions');
