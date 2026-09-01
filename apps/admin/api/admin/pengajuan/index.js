import { getPool, initDb, setCors } from '../../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await initDb();
    const pool = getPool();
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const search = urlObj.searchParams.get('search') || '';
    const status = urlObj.searchParams.get('status') || '';

    let sql = 'SELECT * FROM pengajuans WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (nama ILIKE $${params.length} OR nim ILIKE $${params.length} OR jenis_berkas ILIKE $${params.length})`;
    }
    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC';
    const result = await pool.query(sql, params);

    return res.status(200).json({
      data: result.rows,
      total: result.rows.length,
      current_page: 1,
      last_page: 1,
      per_page: 50
    });
  } catch (error) {
    console.error('Admin pengajuan list error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
