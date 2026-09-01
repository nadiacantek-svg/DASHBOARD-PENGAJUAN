import { getPool, initDb, setCors } from '../../../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await initDb();
    const pool = getPool();
    const { id } = req.query;

    let body = req.body;
    if (typeof body === 'string' && body.length > 0) {
      try { body = JSON.parse(body); } catch(e) {}
    }

    const { status, catatan_admin } = body || {};

    const updateRes = await pool.query(
      `UPDATE pengajuans 
       SET status = COALESCE($1, status),
           catatan_admin = COALESCE($2, catatan_admin),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, catatan_admin, parseInt(id)]
    );

    if (updateRes.rows.length > 0) {
      return res.status(200).json({
        message: 'Progress berhasil diupdate',
        data: updateRes.rows[0]
      });
    }
    return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
  } catch (error) {
    console.error('Update progress error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
