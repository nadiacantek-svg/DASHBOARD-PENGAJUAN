import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_GoIKUr16dpEP@ep-plain-truth-aeehjd5q.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require');

async function main() {
  await sql.query(`
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
  `);
  
  await sql.query(`
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

  const userCheck = await sql.query('SELECT id FROM users WHERE username = $1', ['admin']);
  if (userCheck.length === 0) {
    await sql.query(`
      INSERT INTO users (name, username, email, password, role)
      VALUES ('Admin Fakultas', 'admin', 'admin@example.com', 'admin123', 'admin')
    `);
    console.log('Seeded admin: admin / admin123');
  }

  const countRes = await sql.query('SELECT COUNT(*) FROM pengajuans');
  console.log('Neon Tables Initialized successfully! Total submissions in Neon:', countRes[0].count);
}

main().catch(console.error);
