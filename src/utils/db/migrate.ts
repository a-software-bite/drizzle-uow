import { db, pgClient } from '@/db';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

export const runMigrations = async () => {
  await pgClient.connect();
  // Run migrations on the database (skipping the ones already applied)
  await migrate(db, { migrationsFolder: 'src/migrations' });
  await pgClient.end();
};

if (require.main === module) {
  void (async () => {
    try {
      await runMigrations();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })();
}
