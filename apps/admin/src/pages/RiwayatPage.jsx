import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const RiwayatPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token || token === 'demo-token') {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/pengajuan?status=Selesai`, {
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
        const json = await res.json();
        setData(json.data || json);
      }
    } catch (err) {
      console.error('Error fetching riwayat', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Item Terkirim & Selesai</h1>
        <p className="text-secondary font-body-md mt-xs">Riwayat seluruh dokumen pengajuan yang telah selesai diproses dan terkirim</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline/10 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-xl">
            <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
            <p className="text-secondary mt-sm">Memuat riwayat...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-xl text-secondary">
            <span className="material-symbols-outlined text-5xl mb-sm block opacity-40">task</span>
            <span>Belum ada dokumen yang selesai diproses.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/40 border-b border-outline/10 text-secondary text-xs uppercase font-label-lg">
                <th className="py-sm px-md">Penerima (NIM / Nama)</th>
                <th className="py-sm px-md">Jenis Berkas</th>
                <th className="py-sm px-md">Tanggal Selesai</th>
                <th className="py-sm px-md">Status Akhir</th>
                <th className="py-sm px-md text-right">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5 text-sm">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-sm px-md font-semibold text-on-surface">
                    <div>{item.nama}</div>
                    <div className="text-xs text-secondary font-normal">{item.nim}</div>
                  </td>
                  <td className="py-sm px-md text-on-surface">{item.jenis_berkas}</td>
                  <td className="py-sm px-md text-secondary text-xs">
                    {new Date(item.updated_at || item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-sm px-md">
                    <span className="bg-[#10b981]/20 text-[#10b981] px-2.5 py-1 rounded-md text-xs font-bold border border-[#10b981]/30">Selesai</span>
                  </td>
                  <td className="py-sm px-md text-right text-xs text-secondary">{item.catatan_admin || 'Telah disetujui'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RiwayatPage;
