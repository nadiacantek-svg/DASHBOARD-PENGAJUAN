import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 
  process.env.SPRING_DATASOURCE_URL?.replace('jdbc:postgresql://', 'postgresql://') || 
  'postgresql://neondb_owner:npg_GoIKUr16dpEP@ep-plain-truth-aeehjd5q.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

let pool;
export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

let tableInitPromise = null;
export async function initDb() {
  if (!tableInitPromise) {
    tableInitPromise = (async () => {
      const p = getPool();
      await p.query(`
        CREATE TABLE IF NOT EXISTS pengajuans (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(255) NOT NULL,
          nim VARCHAR(255) NOT NULL,
          jenis_berkas VARCHAR(255) NOT NULL,
          keterangan TEXT,
          status VARCHAR(255) DEFAULT 'Diproses',
          catatan_admin TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(255) DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      const userCheck = await p.query('SELECT id FROM users WHERE username = $1', ['admin']);
      if (userCheck.rows.length === 0) {
        await p.query(`
          INSERT INTO users (name, username, email, password, role)
          VALUES ('Admin Fakultas', 'admin', 'admin@example.com', 'admin123', 'admin')
        `);
      }
    })();
  }
  return tableInitPromise;
}

export function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');
}
