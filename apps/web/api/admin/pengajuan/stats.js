import { getPool, initDb, setCors } from '../../_db.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await initDb();
    const pool = getPool();

    const total = parseInt((await pool.query('SELECT COUNT(*) FROM pengajuans')).rows[0].count);
    const diproses = parseInt((await pool.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Diproses'")).rows[0].count);
    const ditandatangani = parseInt((await pool.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Ditandatangani'")).rows[0].count);
    const selesai = parseInt((await pool.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Selesai'")).rows[0].count);
    const ditolak = parseInt((await pool.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Ditolak'")).rows[0].count);
    const hariIni = parseInt((await pool.query("SELECT COUNT(*) FROM pengajuans WHERE created_at >= CURRENT_DATE")).rows[0].count);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = days[d.getDay()];
      const countRes = await pool.query(
        "SELECT COUNT(*) FROM pengajuans WHERE created_at >= CURRENT_DATE - ($1 || ' days')::INTERVAL AND created_at < CURRENT_DATE - (($1 - 1) || ' days')::INTERVAL",
        [i]
      );
      weekly.push({
        date: dayStr,
        count: parseInt(countRes.rows[0]?.count || 0)
      });
    }

    const recent = await pool.query('SELECT * FROM pengajuans ORDER BY updated_at DESC LIMIT 4');
    const activities = recent.rows.map(item => {
      let action = `mengirim pengajuan baru: ${item.jenis_berkas}`;
      let icon = 'description';
      let iconColor = 'text-blue-500';
      let bgColor = 'bg-blue-500/10';
      let user = item.nama;

      if (item.status === 'Selesai') {
        user = 'Admin';
        action = `menyelesaikan pengajuan ${item.jenis_berkas} milik ${item.nama}`;
        icon = 'check_circle';
        iconColor = 'text-[#10b981]';
        bgColor = 'bg-[#10b981]/10';
      } else if (item.status === 'Ditandatangani') {
        user = 'Dekan Fakultas Sains';
        action = `menandatangani berkas ${item.jenis_berkas} milik ${item.nama}`;
        icon = 'edit';
        iconColor = 'text-primary';
        bgColor = 'bg-primary/10';
      } else if (item.status === 'Ditolak') {
        user = 'Admin';
        action = `menolak pengajuan ${item.jenis_berkas} milik ${item.nama}`;
        icon = 'error';
        iconColor = 'text-error';
        bgColor = 'bg-error/10';
      }

      return {
        user,
        action,
        time: 'Baru saja',
        icon,
        iconColor,
        bgColor
      };
    });

    return res.status(200).json({
      total,
      diproses,
      ditandatangani,
      selesai,
      ditolak,
      hari_ini: hariIni,
      perhatian: diproses,
      weekly,
      activities
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
