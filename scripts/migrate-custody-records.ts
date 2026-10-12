import 'dotenv/config';
import { readFile, readFileSync } from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error('Set SUPABASE_DB_URL to the Supabase Session Pooler connection string.');
}

const databaseUrl = new URL(connectionString);
if (!databaseUrl.hostname.endsWith('.pooler.supabase.com')) {
  throw new Error('SUPABASE_DB_URL must use the Supabase Session Pooler host.');
}

const migrationPath = path.resolve(
  'supabase/migrations/20261012000000_create_custody_records.sql',
);
const migrationSql = readFileSync(migrationPath, 'utf8');
const sslRootCertPath = process.env.SUPABASE_DB_SSL_ROOT_CERT;
const ssl = sslRootCertPath
  ? {
      ca: readFileSync(path.resolve(sslRootCertPath), 'utf8'),
      rejectUnauthorized: true,
    }
  : { rejectUnauthorized: true };
const pool = new Pool({
  connectionString,
  ssl,
  max: 1,
});

try {
  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query(migrationSql);
    await client.query('commit');
    console.log('Custody records migration completed successfully.');
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
} finally {
  await pool.end();
}
