import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const ArsipPage = () => {
  const [arsipData, setArsipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchArsip = async () => {
      try {
        const response = await fetch(`${API_URL}/api/pengajuan`, {
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          setArsipData(data);
        }
      } catch (error) {
        console.error('Error fetching arsip', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArsip();
  }, []);

  const filteredData = arsipData.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jenis_berkas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Selesai': return 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30';
      case 'Ditolak': return 'bg-error/20 text-error border-error/30';
      default: return 'bg-primary-container/20 text-on-primary-container border-primary-container/30';
    }
  };

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-xl">
      <div className="text-center mb-xl">
        <span className="material-symbols-outlined text-primary text-5xl mb-sm" style={{ fontVariationSettings: '"FILL" 1' }}>inventory_2</span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Arsip Pengajuan</h1>
        <p className="font-body-md text-body-md text-secondary mt-xs max-w-xl mx-auto">
          Riwayat seluruh pengajuan berkas persuratan akademik yang pernah diajukan.
        </p>
      </div>

      <div className="mb-lg">
        <div className="relative max-w-md mx-auto">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary">search</span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-sm py-sm pl-10 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors"
            placeholder="Cari berdasarkan nama, NIM, atau jenis berkas..."
            type="text"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-xl">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
          <p className="text-secondary mt-sm">Memuat data...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-xl bg-surface-container-lowest border border-outline/10 rounded-xl">
          <span className="material-symbols-outlined text-secondary text-5xl mb-sm">folder_off</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">Belum ada data pengajuan</p>
          <p className="text-secondary mt-xs">Pengajuan yang telah dibuat akan muncul di sini.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-surface-container-lowest border border-outline/10 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-high/50 border-b border-outline/10">
                  <th className="text-left font-label-lg text-label-lg text-on-surface px-md py-sm">Nama</th>
                  <th className="text-left font-label-lg text-label-lg text-on-surface px-md py-sm">NIM</th>
                  <th className="text-left font-label-lg text-label-lg text-on-surface px-md py-sm">Jenis Berkas</th>
                  <th className="text-left font-label-lg text-label-lg text-on-surface px-md py-sm">Status</th>
                  <th className="text-left font-label-lg text-label-lg text-on-surface px-md py-sm">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-outline/5 hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-md py-sm font-body-md text-body-md text-on-surface font-medium">{item.nama}</td>
                    <td className="px-md py-sm font-body-md text-body-md text-secondary">{item.nim}</td>
                    <td className="px-md py-sm font-body-md text-body-md text-secondary">{item.jenis_berkas}</td>
                    <td className="px-md py-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(item.status)}`}>{item.status}</span>
                    </td>
                    <td className="px-md py-sm font-body-md text-body-md text-secondary">{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-sm">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-surface-container-lowest border border-outline/10 rounded-xl p-md shadow-sm">
                <div className="flex justify-between items-start mb-sm">
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface font-medium">{item.nama}</p>
                    <p className="font-body-sm text-body-sm text-secondary">NIM: {item.nim}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(item.status)}`}>{item.status}</span>
                </div>
                <p className="font-body-md text-body-md text-secondary">{item.jenis_berkas}</p>
                <p className="font-body-sm text-body-sm text-secondary mt-xs flex items-center gap-xs">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-lg text-center text-sm text-secondary">
        Total: {filteredData.length} pengajuan
      </div>
    </main>
  );
};

export default ArsipPage;
