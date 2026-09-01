import React, { useState, useEffect } from 'react';
import { getAdminPengajuans, updatePengajuanProgress, deletePengajuan } from '../services/dataService';

const KotakMasukPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState('Diproses');
  const [catatan, setCatatan] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [search, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      const rows = await getAdminPengajuans(search, filterStatus);
      setData(rows || []);
    } catch (err) {
      console.error('Error fetching admin pengajuans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setNewStatus(item.status);
    setCatatan(item.catatan_admin || '');
  };

  const handleSaveProgress = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    setUpdating(true);

    try {
      await updatePengajuanProgress(selectedItem.id, newStatus, catatan);
      setMessage('Status pengajuan berhasil diperbarui');
      setSelectedItem(null);
      fetchData();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Error updating progress:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus berkas pengajuan ini?')) return;
    try {
      await deletePengajuan(id);
      setMessage('Berkas pengajuan berhasil dihapus');
      fetchData();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Error deleting pengajuan:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selesai':
        return <span className="bg-[#10b981]/20 text-[#10b981] px-2.5 py-1 rounded-md text-xs font-bold border border-[#10b981]/30">Selesai</span>;
      case 'Ditandatangani':
        return <span className="bg-blue-500/20 text-blue-600 px-2.5 py-1 rounded-md text-xs font-bold border border-blue-500/30">Ditandatangani</span>;
      case 'Ditolak':
        return <span className="bg-error/20 text-error px-2.5 py-1 rounded-md text-xs font-bold border border-error/30">Ditolak</span>;
      default:
        return <span className="bg-primary-container/20 text-on-primary-container px-2.5 py-1 rounded-md text-xs font-bold border border-primary-container/30">Diproses</span>;
    }
  };

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Kotak Masuk Pengajuan</h1>
        <p className="text-secondary font-body-md mt-xs">Tinjau, kelola, dan edit progress pengajuan surat masuk dari mahasiswa/client</p>
      </div>

      {message && (
        <div className="bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 p-sm rounded-lg font-bold flex items-center gap-xs">
          <span className="material-symbols-outlined">check_circle</span>
          <span>{message}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest border border-outline/10 rounded-xl p-md shadow-sm flex flex-col md:flex-row justify-between gap-md items-center">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIM, atau berkas..."
            className="w-full bg-surface border border-outline/30 rounded-lg px-sm py-sm pl-10 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors"
          />
        </div>

        <div className="flex gap-sm w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-surface border border-outline/30 rounded-lg px-sm py-sm focus:border-primary-container outline-none text-sm font-semibold text-on-surface"
          >
            <option value="">Semua Status</option>
            <option value="Diproses">Diproses</option>
            <option value="Ditandatangani">Ditandatangani</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest border border-outline/10 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-xl">
            <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
            <p className="text-secondary mt-sm">Memuat data pengajuan...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-xl text-secondary">Tidak ada pengajuan ditemukan.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/40 border-b border-outline/10 text-secondary text-xs uppercase font-label-lg">
                <th className="py-sm px-md">Pemilik (Nama / NIM)</th>
                <th className="py-sm px-md">Jenis Berkas</th>
                <th className="py-sm px-md">Keterangan</th>
                <th className="py-sm px-md">Tanggal Masuk</th>
                <th className="py-sm px-md">Status Progress</th>
                <th className="py-sm px-md text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5 text-sm">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-sm px-md font-semibold text-on-surface">
                    <div>{item.nama}</div>
                    <div className="text-xs text-secondary font-normal">NIM: {item.nim}</div>
                  </td>
                  <td className="py-sm px-md text-on-surface font-medium">{item.jenis_berkas}</td>
                  <td className="py-sm px-md text-secondary max-w-xs truncate">{item.keterangan || '-'}</td>
                  <td className="py-sm px-md text-secondary text-xs">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-sm px-md">{getStatusBadge(item.status)}</td>
                  <td className="py-sm px-md text-right space-x-xs">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="bg-primary-container/20 text-on-primary-container px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-container transition-colors inline-flex items-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      <span>Edit Progress</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-error hover:bg-error-container/20 p-1.5 rounded-lg transition-colors inline-flex items-center"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Progress Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-xs flex items-center justify-center p-md">
          <div className="bg-surface-container-lowest border border-outline/10 rounded-2xl shadow-2xl w-full max-w-lg p-xl relative animate-fade-in">
            <div className="flex justify-between items-center mb-md border-b border-outline/10 pb-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                <span>Edit Progress Pengajuan</span>
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-secondary hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mb-md bg-surface-container-low p-sm rounded-lg text-sm space-y-xs">
              <p><span className="text-secondary">Pemilik:</span> <strong className="text-on-surface">{selectedItem.nama}</strong> ({selectedItem.nim})</p>
              <p><span className="text-secondary">Berkas:</span> <strong className="text-on-surface">{selectedItem.jenis_berkas}</strong></p>
            </div>

            <form onSubmit={handleSaveProgress} className="space-y-md">
              <div>
                <label className="block font-label-lg text-label-lg text-on-surface mb-xs">Ubah Status Progress</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-surface border border-outline/30 rounded-lg px-sm py-sm font-semibold text-on-surface outline-none focus:border-primary-container"
                >
                  <option value="Diproses">⏳ Diproses (Dalam Antrean/Verifikasi)</option>
                  <option value="Ditandatangani">✍️ Ditandatangani Dekan</option>
                  <option value="Selesai">✅ Selesai (Siap Diambil/Selesai)</option>
                  <option value="Ditolak">❌ Ditolak (Berkas Tidak Lengkap/Sesuai)</option>
                </select>
              </div>

              <div>
                <label className="block font-label-lg text-label-lg text-on-surface mb-xs">Catatan Admin (Opsional)</label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tambahkan catatan khusus untuk pengaju (misal: Berkas sudah dapat diambil di ruang TU)..."
                  rows={3}
                  className="w-full bg-surface border border-outline/30 rounded-lg px-sm py-sm outline-none focus:border-primary-container text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end gap-sm pt-sm border-t border-outline/10">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-md py-sm rounded-lg border border-outline/30 font-label-lg text-secondary hover:bg-surface-variant transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-md py-sm rounded-lg bg-primary-container text-on-primary-container font-label-lg font-bold hover:bg-primary-fixed-dim transition-colors flex items-center gap-xs shadow-sm"
                >
                  {updating ? (
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">save</span>
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KotakMasukPage;
