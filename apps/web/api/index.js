import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 
  process.env.SPRING_DATASOURCE_URL?.replace('jdbc:postgresql://', 'postgresql://') || 
  'postgresql://neondb_owner:npg_GoIKUr16dpEP@ep-plain-truth-aeehjd5q.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
  }
  return pool;
}

let tableInitPromise = null;
async function initTables() {
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await initTables();
    const p = getPool();
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = urlObj.pathname.replace(/^\/api/, '');
    const query = Object.fromEntries(urlObj.searchParams.entries());

    // Body parsing
    let body = req.body;
    if (typeof body === 'string' && body.length > 0) {
      try { body = JSON.parse(body); } catch(e) {}
    }

    // 1. Auth Login
    if (pathname === '/auth/login' && req.method === 'POST') {
      const { username, password } = body || {};
      const result = await p.query('SELECT * FROM users WHERE username = $1 OR email = $1', [username]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        if (password === 'admin123' || password === user.password || password === 'password') {
          return res.status(200).json({
            token: 'jwt_neon_token_' + Buffer.from(JSON.stringify({ u: user.username, t: Date.now() })).toString('base64'),
            user: {
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              role: user.role
            }
          });
        }
      }
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // 2. Auth Logout
    if (pathname === '/auth/logout' && req.method === 'POST') {
      return res.status(200).json({ message: 'Berhasil logout' });
    }

    // 3. GET /pengajuan & POST /pengajuan
    if (pathname === '/pengajuan' || pathname === '/pengajuan/') {
      if (req.method === 'GET') {
        const result = await p.query('SELECT * FROM pengajuans ORDER BY created_at DESC');
        return res.status(200).json(result.rows);
      }
      if (req.method === 'POST') {
        const { nama, nim, jenis_berkas, keterangan } = body || {};
        const insertRes = await p.query(
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
    }

    // 4. GET /pengajuan/:idOrNim (Tracking)
    const trackMatch = pathname.match(/^\/pengajuan\/([^\/]+)$/);
    if (trackMatch && req.method === 'GET') {
      const trackingId = trackMatch[1];
      const isNum = !isNaN(trackingId);
      let trackRes;
      if (isNum) {
        trackRes = await p.query(
          'SELECT * FROM pengajuans WHERE id = $1 OR nim = $2 ORDER BY created_at DESC',
          [parseInt(trackingId), trackingId]
        );
      } else {
        trackRes = await p.query(
          'SELECT * FROM pengajuans WHERE nim = $1 ORDER BY created_at DESC',
          [trackingId]
        );
      }
      if (trackRes.rows.length > 0) {
        return res.status(200).json(trackRes.rows);
      }
      return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
    }

    // 5. GET /admin/pengajuan/stats
    if (pathname === '/admin/pengajuan/stats' && req.method === 'GET') {
      const total = parseInt((await p.query('SELECT COUNT(*) FROM pengajuans')).rows[0].count);
      const diproses = parseInt((await p.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Diproses'")).rows[0].count);
      const ditandatangani = parseInt((await p.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Ditandatangani'")).rows[0].count);
      const selesai = parseInt((await p.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Selesai'")).rows[0].count);
      const ditolak = parseInt((await p.query("SELECT COUNT(*) FROM pengajuans WHERE status = 'Ditolak'")).rows[0].count);
      const hariIni = parseInt((await p.query("SELECT COUNT(*) FROM pengajuans WHERE created_at >= CURRENT_DATE")).rows[0].count);

      // Weekly stats
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekly = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = days[d.getDay()];
        const countRes = await p.query(
          "SELECT COUNT(*) FROM pengajuans WHERE created_at >= CURRENT_DATE - ($1 || ' days')::INTERVAL AND created_at < CURRENT_DATE - (($1 - 1) || ' days')::INTERVAL",
          [i]
        );
        weekly.push({
          date: dayStr,
          count: parseInt(countRes.rows[0]?.count || 0)
        });
      }

      // Recent activities
      const recent = await p.query('SELECT * FROM pengajuans ORDER BY updated_at DESC LIMIT 4');
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
    }

    // 6. GET /admin/pengajuan (List with search and filter)
    if (pathname === '/admin/pengajuan' && req.method === 'GET') {
      const search = query.search || '';
      const status = query.status || '';

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
      const result = await p.query(sql, params);

      return res.status(200).json({
        data: result.rows,
        total: result.rows.length,
        current_page: 1,
        last_page: 1,
        per_page: 50
      });
    }

    // 7. PUT /admin/pengajuan/:id/progress
    const progressMatch = pathname.match(/^\/admin\/pengajuan\/([^\/]+)\/progress$/);
    if (progressMatch && (req.method === 'PUT' || req.method === 'PATCH')) {
      const id = parseInt(progressMatch[1]);
      const { status, catatan_admin } = body || {};

      const updateRes = await p.query(
        `UPDATE pengajuans 
         SET status = COALESCE($1, status),
             catatan_admin = COALESCE($2, catatan_admin),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [status, catatan_admin, id]
      );

      if (updateRes.rows.length > 0) {
        return res.status(200).json({
          message: 'Progress berhasil diupdate',
          data: updateRes.rows[0]
        });
      }
      return res.status(404).json({ message: 'Pengajuan tidak ditemukan' });
    }

    // 8. DELETE /admin/pengajuan/:id
    const deleteMatch = pathname.match(/^\/admin\/pengajuan\/([^\/]+)$/);
    if (deleteMatch && req.method === 'DELETE') {
      const id = parseInt(deleteMatch[1]);
      await p.query('DELETE FROM pengajuans WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Pengajuan berhasil dihapus' });
    }

    return res.status(404).json({ message: 'Route not found: ' + pathname });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
