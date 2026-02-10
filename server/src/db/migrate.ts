import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { pool } from '../config/database.js';

async function migrate() {
  console.log('Running migrations...');

  try {
    // Create migrations tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const migrationsDir = resolve(import.meta.dirname, 'migrations');
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const migrationFile of files) {
      const { rows } = await pool.query(
        'SELECT name FROM migrations WHERE name = $1',
        [migrationFile]
      );

      if (rows.length > 0) {
        console.log(`Migration ${migrationFile} already executed, skipping`);
      } else {
        const sql = readFileSync(resolve(migrationsDir, migrationFile), 'utf-8');
        await pool.query(sql);
        await pool.query('INSERT INTO migrations (name) VALUES ($1)', [migrationFile]);
        console.log(`Migration ${migrationFile} executed successfully`);
      }
    }

    console.log('Migrations complete');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
