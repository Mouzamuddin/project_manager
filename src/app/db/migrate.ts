import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';
import { config } from 'dotenv';
config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql, { schema });

async function runMigrate() {
  console.log('⏳ Running migrations...');

  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('✅ Migrations completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed');
    console.error(error);
    process.exit(1);
  }
}

runMigrate();