import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    diproses: 0,
    selesai: 0,
    hariIni: 0,
    perhatian: 0
  });

  const [weeklyTrend, setWeeklyTrend] = useState([
    { day: 'Senin', height: '10%', active: false },
    { day: 'Selasa', height: '10%', active: false },
    { day: 'Rabu', height: '10%', active: false },
    { day: 'Kamis', height: '10%', active: false },
    { day: 'Jumat', height: '10%', active: false },
    { day: 'Sabtu', height: '10%', active: false },
    { day: 'Minggu', height: '10%', active: false },
  ]);

  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Ada 3 pengajuan berkas baru hari ini', read: false },
    { id: 2, text: 'Dokumen mahasiswa Rina selesai diproses', read: true },
    { id: 3, text: 'Verifikasi berkas NIM 12345 ditolak', read: true },
  ]);

  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');
  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  const filteredActivities = activities.filter(act => 
    act.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token || token === 'demo-token') {
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/admin/pengajuan/stats`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('admin_token');
          window.location.href = '/login';
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setStats({
            total: data.total || 0,
            diproses: data.diproses || 0,
            selesai: data.selesai || 0,
            hariIni: data.hari_ini || 0,
            perhatian: data.perhatian || 0
          });

          if (data.weekly && data.weekly.length > 0) {
            const counts = data.weekly.map(w => w.count);
            const maxCount = Math.max(...counts, 1);
            const trend = data.weekly.map((w, idx) => {
              const heightPercent = `${Math.round((w.count / maxCount) * 80) + 15}%`;
              return {
                day: w.date,
                height: heightPercent,
                active: idx === data.weekly.length - 1
              };
            });
            setWeeklyTrend(trend);
          }

          if (data.activities && data.activities.length > 0) {
            setActivities(data.activities);
            const newNotifs = data.activities.map((act, index) => ({
              id: index + 1,
              text: `${act.user} ${act.action}`,
              read: false
            }));
            setNotifications(newNotifs);
          }
        }
      } catch (e) {
        console.error('Error fetching stats:', e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-md">
      {/* Search and Top Profile Bar (matching screenshot header) */}
      <div className="flex justify-between items-center bg-surface border-b border-outline/10 pb-md mb-xs relative">
        <div className="relative w-80">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berkas atau aktivitas..."
            className="w-full bg-surface-container-low border border-outline/10 rounded-lg px-sm py-xs pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary-container"
          />
        </div>
        <div className="flex items-center gap-md">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="text-secondary hover:text-on-surface relative p-1 rounded-full hover:bg-surface-container-low transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error border-2 border-surface rounded-full"></span>
              )}
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-xs w-72 bg-surface-container-lowest border border-outline/10 rounded-xl shadow-lg py-xs z-50 animate-fade-in">
                <div className="px-md py-sm border-b border-outline/10 font-bold text-xs text-on-surface flex justify-between items-center">
                  <span>Notifikasi Terbaru</span>
                  <button
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                    className="text-primary text-[10px] hover:underline"
                  >
                    Tandai semua dibaca
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-outline/5">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item))}
                      className={`px-md py-sm text-xs cursor-pointer transition-colors hover:bg-surface-container-low/60 ${!n.read ? 'bg-primary-container/5 font-semibold text-on-surface border-l-2 border-l-primary' : 'text-secondary'}`}
                    >
                      {n.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help Center */}
          <button
            onClick={() => setHelpOpen(true)}
            className="text-secondary hover:text-on-surface p-1 rounded-full hover:bg-surface-container-low transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined text-xl">help</span>
          </button>

        </div>
      </div>

      {/* Grid of Stat Cards matching reference */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
        {/* Card 1: Total Permohonan */}
        <div className="bg-surface-container-lowest border border-outline/10 p-md rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-secondary text-xs font-label-lg font-bold">Total Permohonan</span>
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>folder</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-on-surface leading-none">{stats.total.toLocaleString('id-ID')}</p>
            <p className="text-[10px] text-primary font-bold mt-1 flex items-center gap-xs">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span>+12% dari bulan lalu</span>
            </p>
          </div>
        </div>

        {/* Card 2: Diproses */}
        <div className="bg-surface-container-lowest border border-outline/10 p-md rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-secondary text-xs font-label-lg font-bold">Diproses</span>
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>assignment</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-on-surface leading-none">{stats.diproses}</p>
            <p className="text-[10px] text-secondary font-bold mt-1 uppercase tracking-wider">DIPROSES Diproses</p>
          </div>
        </div>

        {/* Card 3: Selesai */}
        <div className="bg-surface-container-lowest border border-outline/10 p-md rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-secondary text-xs font-label-lg font-bold">Selesai</span>
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>check_box</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-on-surface leading-none">{stats.selesai}</p>
            <p className="text-[10px] text-[#10b981] font-bold mt-1 flex items-center gap-xs">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span>+5% minggu ini</span>
            </p>
          </div>
        </div>

        {/* Card 4: Hari Ini (Brand Color Dark Accent) */}
        <div className="bg-primary text-white p-md rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-white/80 text-xs font-label-lg font-bold">Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>calendar_today</span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-black leading-none">{stats.hariIni}</p>
            <p className="text-[10px] text-white/90 font-bold mt-1 flex items-center gap-xs">
              <span className="material-symbols-outlined text-xs text-primary-container">warning</span>
              <span>{stats.perhatian} perlu perhatian segera</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Section: Chart (Left) & Activity Log (Right) */}
      <div className="flex flex-col lg:flex-row gap-md">
        {/* Left Column: Bar Chart */}
        <div className="flex-1 bg-surface-container-lowest border border-outline/10 rounded-xl p-lg shadow-sm">
          <div className="flex justify-between items-center mb-xl">
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Tren Berkas (7 Hari Terakhir)</h2>
            <span className="text-xs font-bold text-secondary bg-surface-container-low px-2 py-1 rounded">Minggu Ini</span>
          </div>

          <div className="h-64 flex items-end justify-between px-md pb-md relative border-b border-outline/10">
            {weeklyTrend.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-sm flex-1 group">
                {/* Bar */}
                <div
                  className={`w-12 rounded-t-md transition-all duration-500 cursor-pointer ${
                    item.active
                      ? 'bg-primary shadow-[0_0_15px_rgba(128,86,0,0.4)]'
                      : 'bg-primary-container/30 hover:bg-primary-container/60'
                  }`}
                  style={{ height: item.height }}
                ></div>
                {/* Day label */}
                <span className="text-xs font-label-md text-secondary">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Activity Log */}
        <div className="w-full lg:w-96 bg-surface-container-lowest border border-outline/10 rounded-xl p-lg shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-lg">Riwayat Aktivitas</h2>
            <div className="space-y-md">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-md text-secondary text-xs font-semibold">
                  Belum ada aktivitas terbaru yang cocok
                </div>
              ) : (
                filteredActivities.map((act, idx) => (
                  <div key={idx} className="flex gap-sm items-start">
                    <div className={`w-8 h-8 rounded-full ${act.bgColor} flex-shrink-0 flex items-center justify-center`}>
                      <span className={`material-symbols-outlined text-sm ${act.iconColor}`} style={{ fontVariationSettings: '"FILL" 1' }}>
                        {act.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface font-semibold leading-snug">
                        <strong className="text-on-surface">{act.user}</strong> {act.action}
                      </p>
                      <span className="text-[10px] text-secondary font-medium">{act.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => alert('Fitur semua aktivitas dalam pengembangan')}
            className="w-full mt-lg border border-outline/30 text-secondary hover:text-on-surface font-label-lg font-bold py-sm rounded-lg hover:bg-surface-variant transition-colors text-xs text-center"
          >
            Lihat Semua Aktivitas
          </button>
        </div>
      </div>

      {/* Help Center Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/45 backdrop-blur-xs flex items-center justify-center p-md">
          <div className="bg-surface-container-lowest border border-outline/10 rounded-2xl shadow-2xl w-full max-w-md p-xl relative animate-fade-in">
            <div className="flex justify-between items-center mb-md border-b border-outline/10 pb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary">help</span>
                <span>Pusat Bantuan Admin</span>
              </h3>
              <button
                onClick={() => setHelpOpen(false)}
                className="text-secondary hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-md text-sm text-secondary">
              <p>Selamat datang di Dashboard Kelola Pengajuan Surat Akademik Fakultas Sains.</p>
              <ul className="list-disc pl-5 space-y-xs">
                <li><strong>Dasbor:</strong> Memantau total pengajuan secara real-time, tren mingguan, dan riwayat aktivitas terbaru.</li>
                <li><strong>Kotak Masuk:</strong> Memvalidasi berkas masuk, mengubah status kemajuan, dan menambahkan catatan admin.</li>
                <li><strong>Item Terkirim:</strong> Melihat arsip dokumen yang telah selesai diproses.</li>
              </ul>
              <p className="border-t border-outline/10 pt-sm text-xs">Untuk bantuan teknis lebih lanjut, silakan hubungi tim IT Support Fakultas.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
