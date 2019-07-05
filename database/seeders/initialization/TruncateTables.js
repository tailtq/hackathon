module.exports = (knex) => {
  return knex.raw(
    `
      CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
      DECLARE
        statements CURSOR FOR
          SELECT tablename FROM pg_tables
          WHERE tableowner = username AND schemaname = 'public';
      BEGIN
        FOR stmt IN statements LOOP
          IF stmt.tablename != 'migrations' AND stmt.tablename != 'migrations_lock' THEN
            EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' RESTART IDENTITY CASCADE';
          END IF;
        END LOOP;
      END;
      $$ LANGUAGE plpgsql;
    `,
  ).then(() => knex.raw('SELECT truncate_tables(\'postgres\');'));
};
