import { neon } from '@neondatabase/serverless';

const DB_URL = 'postgresql://neondb_owner:npg_GoIKUr16dpEP@ep-plain-truth-aeehjd5q.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DB_URL);

export const submitPengajuan = async (formData) => {
  const { nama, nim, jenis_berkas, keterangan } = formData;
  try {
    const res = await sql.query(
      `INSERT INTO pengajuans (nama, nim, jenis_berkas, keterangan, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'Diproses', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [nama, nim, jenis_berkas, keterangan || '']
    );
    return { ok: true, data: res[0] };
  } catch (err) {
    console.error('Neon direct insert error:', err);
    throw err;
  }
};

export const getPengajuans = async () => {
  try {
    const rows = await sql.query('SELECT * FROM pengajuans ORDER BY created_at DESC');
    return rows;
  } catch (err) {
    console.error('Neon direct get error:', err);
    return [];
  }
};

export const trackPengajuan = async (queryStr) => {
  try {
    if (!queryStr || !queryStr.trim()) return [];
    const trimmed = queryStr.trim();
    const isNum = !isNaN(trimmed) && !isNaN(parseFloat(trimmed));
    let rows;
    if (isNum) {
      rows = await sql.query(
        'SELECT * FROM pengajuans WHERE id = $1 OR nim ILIKE $2 OR nama ILIKE $2 ORDER BY created_at DESC',
        [parseInt(trimmed), `%${trimmed}%`]
      );
    } else {
      rows = await sql.query(
        'SELECT * FROM pengajuans WHERE nama ILIKE $1 OR nim ILIKE $1 ORDER BY created_at DESC',
        [`%${trimmed}%`]
      );
    }
    return rows;
  } catch (err) {
    console.error('Neon direct track error:', err);
    return [];
  }
};
