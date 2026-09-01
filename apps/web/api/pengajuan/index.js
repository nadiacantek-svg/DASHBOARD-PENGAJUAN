import { getPool, initDb, setCors } from '../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await initDb();
    const pool = getPool();

    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM pengajuans ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string' && body.length > 0) {
        try { body = JSON.parse(body); } catch(e) {}
      }
      const { nama, nim, jenis_berkas, keterangan } = body || {};
      const insertRes = await pool.query(
        `INSERT INTO pengajuans (nama, nim, jenis_berkas, keterangan, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 'Diproses', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [nama, nim, jenis_berkas, keterangan || '']
      );
      return res.status(200).json({
        message: 'Pengajuan berhasil dikirim',
        data: insertRes.rows[0]
      });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Pengajuan API error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
