import { neon } from '@neondatabase/serverless';

const DB_URL = 'postgresql://neondb_owner:npg_GoIKUr16dpEP@ep-plain-truth-aeehjd5q.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DB_URL);

export const getAdminStats = async () => {
  try {
    const total = parseInt((await sql.query('SELECT COUNT(*) FROM pengajuans'))[0]?.count || 0);
    const diproses = parseInt((await sql.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Diproses'"))[0]?.count || 0);
    const ditandatangani = parseInt((await sql.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Ditandatangani'"))[0]?.count || 0);
    const selesai = parseInt((await sql.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Selesai'"))[0]?.count || 0);
    const ditolak = parseInt((await sql.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Ditolak'"))[0]?.count || 0);
    const hariIni = parseInt((await sql.query("SELECT COUNT(*) FROM pengajuans WHERE created_at >= CURRENT_DATE"))[0]?.count || 0);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = days[d.getDay()];
      const countRes = await sql.query(
        `SELECT COUNT(*) FROM pengajuans WHERE created_at >= CURRENT_DATE - INTERVAL '${i} day' AND created_at < CURRENT_DATE - INTERVAL '${i - 1} day'`
      );
      weekly.push({
        date: dayStr,
        count: parseInt(countRes[0]?.count || 0)
      });
    }

    const recent = await sql.query('SELECT * FROM pengajuans ORDER BY updated_at DESC LIMIT 4');
    const activities = recent.map(item => {
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

    return {
      total,
      diproses,
      ditandatangani,
      selesai,
      ditolak,
      hari_ini: hariIni,
      perhatian: diproses,
      weekly,
      activities
    };
  } catch (err) {
    console.error('Neon stats error:', err);
    throw err;
  }
};

export const getAdminPengajuans = async (search = '', status = '') => {
  try {
    let queryStr = 'SELECT * FROM pengajuans WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      queryStr += ` AND (nama ILIKE $${params.length} OR nim ILIKE $${params.length} OR jenis_berkas ILIKE $${params.length})`;
    }
    if (status) {
      params.push(status);
      queryStr += ` AND status = $${params.length}`;
    }

    queryStr += ' ORDER BY created_at DESC';
    const rows = await sql.query(queryStr, params);
    return rows;
  } catch (err) {
    console.error('Neon get admin pengajuans error:', err);
    return [];
  }
};

export const updatePengajuanProgress = async (id, status, catatan_admin) => {
  try {
    const res = await sql.query(
      `UPDATE pengajuans 
       SET status = COALESCE($1, status),
           catatan_admin = COALESCE($2, catatan_admin),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, catatan_admin, id]
    );
    return res[0];
  } catch (err) {
    console.error('Neon update progress error:', err);
    throw err;
  }
};

export const deletePengajuan = async (id) => {
  try {
    await sql.query('DELETE FROM pengajuans WHERE id = $1', [id]);
    return true;
  } catch (err) {
    console.error('Neon delete error:', err);
    throw err;
  }
};
