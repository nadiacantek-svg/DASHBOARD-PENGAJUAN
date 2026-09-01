import React, { useState } from 'react';
import { API_URL } from '../config';
import { submitPengajuan, trackPengajuan } from '../services/dataService';

const MainContent = ({ onTrackResult }) => {
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    jenis_berkas: '',
    keterangan: ''
  });
  const [trackingId, setTrackingId] = useState('');
  const [trackingResults, setTrackingResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [customJenisBerkas, setCustomJenisBerkas] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        jenis_berkas: formData.jenis_berkas === 'Lain-lain' ? customJenisBerkas : formData.jenis_berkas
      };
      
      // Try direct Neon connection first
      await submitPengajuan(dataToSend);
      setSubmitSuccess(true);
      setFormData({ nama: '', nim: '', jenis_berkas: '', keterangan: '' });
      setCustomJenisBerkas('');
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form, trying fetch fallback', error);
      try {
        const response = await fetch(`${API_URL}/api/pengajuan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          setSubmitSuccess(true);
          setFormData({ nama: '', nim: '', jenis_berkas: '', keterangan: '' });
          setCustomJenisBerkas('');
          setTimeout(() => setSubmitSuccess(false), 5000);
        }
      } catch (e2) {
        console.error('Final fallback error:', e2);
      }
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackingError('');
    setTrackingResults([]);
    setSelectedResult(null);
    try {
      const results = await trackPengajuan(trackingId);
      if (results && results.length > 0) {
        setTrackingResults(results);
        setSelectedResult(results[0]);
        if (onTrackResult) onTrackResult(results[0]);
      } else {
        setTrackingError('Berkas tidak ditemukan');
        if (onTrackResult) onTrackResult(null);
      }
    } catch (error) {
      setTrackingError('Terjadi kesalahan jaringan');
    }
  };

  const handleSelectResult = (result) => {
    setSelectedResult(result);
    if (onTrackResult) onTrackResult(result);
  };

  return (
    <main className="flex-grow flex flex-col max-w-7xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-lg gap-lg relative">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <img alt="" className="w-full h-full object-cover object-center" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKNL-LASNNy_3nMV0S31Xe3oXUWmPJnKqj3BRmscNjT1d4W7yKPxTSE5dDsXInOtbK-LLjQ24TI2zVbp06VAfWNIUwX5dD3anTtoaGktzoq4hSmWnDHD-5hkOLqebzr62rHX0CfthxTfgQuTjLKoufzZmw8qPCaFyu_3exfXinRL9E6KSPTklhraf3mXkuWuUHRXcI1Bt810bA3G7IFn-dIev1is-yMFtcj2rynamY5Zp3kkpaWIU6Obq9tqdgq8MQhM9uPAL6bg" />
      </div>
      <div className="w-full text-center mb-lg relative z-10">
        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter text-[#191c1d] font-body-md">
          Lacak Pengajuan Suratmu <br />
          <span className="inline-block bg-[#ffb000] px-2 py-0 mt-1 -skew-x-6">Tanpa Ke Loket.</span>
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-lg w-full">
        <section className="flex-1 border border-surface-variant p-lg shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative overflow-hidden border-t-4 border-t-primary-container rounded-xl bg-surface-container-lowest">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2 relative z-10">Pengajuan Berkas Baru</h1>
          <p className="font-body-md text-body-md text-secondary mb-lg relative z-10">Silakan lengkapi formulir di bawah ini untuk memulai proses administrasi persuratan akademik Anda.</p>
          
          {submitSuccess && (
            <div className="bg-[#10b981]/20 text-[#10b981] p-3 rounded mb-4 relative z-10 font-bold border border-[#10b981]/30">
              Pengajuan berhasil dikirim!
            </div>
          )}

          <form className="space-y-md relative z-10" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-xs" htmlFor="nama">Nama Lengkap</label>
              <input required value={formData.nama} onChange={handleInputChange} className="w-full bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" id="nama" placeholder="Masukkan nama lengkap" type="text" />
            </div>
            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-xs" htmlFor="nim">NIM (Nomor Induk Mahasiswa)</label>
              <input required value={formData.nim} onChange={handleInputChange} className="w-full bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" id="nim" placeholder="Contoh: 123456789" type="text" />
            </div>
            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-xs" htmlFor="jenis_berkas">Jenis Berkas</label>
              <div className="relative">
                <select required value={formData.jenis_berkas} onChange={handleInputChange} className="w-full bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none appearance-none transition-colors" id="jenis_berkas">
                  <option value="">Pilih jenis surat/berkas</option>
                  <option value="Surat Rekomendasi Beasiswa">Surat Rekomendasi Beasiswa</option>
                  <option value="Surat Keterangan Mahasiswa Aktif">Surat Keterangan Mahasiswa Aktif</option>
                  <option value="Izin Penelitian (Skripsi)">Izin Penelitian (Skripsi)</option>
                  <option value="Permohonan Cuti Akademik">Permohonan Cuti Akademik</option>
                  <option value="Legalisir Dokumen">Legalisir Dokumen</option>
                  <option value="Lain-lain">Lain-lain (Tulis Manual)</option>
                </select>
                <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-secondary pointer-events-none">expand_more</span>
              </div>
            </div>

            {formData.jenis_berkas === 'Lain-lain' && (
              <div className="animate-fade-in">
                <label className="block font-label-lg text-label-lg text-on-surface mb-xs" htmlFor="custom_jenis_berkas">Tuliskan Jenis/Nama Berkas</label>
                <input
                  required
                  value={customJenisBerkas}
                  onChange={(e) => setCustomJenisBerkas(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors"
                  id="custom_jenis_berkas"
                  placeholder="Contoh: Surat Dispensasi Kegiatan"
                  type="text"
                />
              </div>
            )}
            <div>
              <label className="block font-label-lg text-label-lg text-on-surface mb-xs" htmlFor="keterangan">Keterangan Tambahan (Opsional)</label>
              <textarea value={formData.keterangan} onChange={handleInputChange} className="w-full bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" id="keterangan" placeholder="Tambahkan catatan khusus jika diperlukan" rows={3}></textarea>
            </div>
            <div className="pt-sm">
              <button className="w-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-bold py-sm rounded hover:bg-primary-fixed-dim transition-colors flex justify-center items-center gap-sm" type="submit">
                <span>Kirim Pengajuan</span>
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </form>
        </section>
        
        <section className="flex-1 dark:bg-surface-dim border border-outline/10 p-lg flex flex-col relative overflow-hidden border-t-4 border-t-primary-container rounded-xl pt-lg bg-surface-container-lowest">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -ml-24 -mb-24"></div>
          <div className="text-center relative z-10 mb-lg">
            <span className="material-symbols-outlined text-primary text-5xl mb-sm" style={{ fontVariationSettings: '"FILL" 1' }}>find_in_page</span>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Lacak Status Berkas</h2>
            <p className="font-body-md text-body-md text-secondary">Ajukan berkas persuratan akademik secara mandiri dan pantau status tanda tangan Dekan secara real-time dari mana saja</p>
          </div>
          <div className="relative z-10 w-full max-w-md mx-auto">
            <form className="flex gap-sm" onSubmit={handleTrack}>
              <input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} required className="flex-grow bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" placeholder="Masukkan NIM atau Nama Pemilik" type="text" />
              <button type="submit" className="bg-surface-container-highest border border-outline/20 text-on-surface px-md py-sm rounded font-label-lg text-label-lg font-bold hover:bg-surface-variant transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined">search</span>
              </button>
            </form>
            
            {trackingError && (
               <div className="mt-4 text-error text-center font-bold">{trackingError}</div>
            )}

            {trackingResults.length > 0 && (
              <div className="mt-lg space-y-sm">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-xs">
                  Ditemukan {trackingResults.length} berkas pengajuan (Klik untuk memilih):
                </p>
                {trackingResults.map((item, index) => {
                  const isSelected = selectedResult && selectedResult.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectResult(item)}
                      className={`p-md border rounded-xl space-y-sm cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-surface-container-low border-primary-container shadow-md ring-1 ring-primary-container'
                          : 'bg-surface-container-lowest border-outline/10 hover:bg-surface-container-low shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start border-b border-outline/10 pb-sm">
                        <div>
                          <p className="font-label-lg text-label-lg text-on-surface font-semibold">{item.jenis_berkas}</p>
                          <p className="font-label-md text-label-md text-secondary">
                            Pemilik: {item.nama} ({item.nim})
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${
                          item.status === 'Selesai' ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30' :
                          item.status === 'Ditolak' ? 'bg-error/20 text-error border-error/30' :
                          item.status === 'Ditandatangani' ? 'bg-blue-500/20 text-blue-600 border-blue-500/30' :
                          'bg-primary-container/20 text-on-primary-container border-primary-container/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      {isSelected && item.catatan_admin && (
                        <div className="p-sm bg-surface-container-low border border-outline/20 rounded-lg text-sm">
                          <p className="font-bold text-on-surface text-xs mb-0.5 flex items-center gap-xs">
                            <span className="material-symbols-outlined text-sm text-primary">chat_bubble_outline</span>
                            <span>Catatan dari Admin:</span>
                          </p>
                          <p className="text-secondary font-medium pl-5">{item.catatan_admin}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs text-secondary pt-xs">
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span>Tanggal: {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <span className="text-[10px] text-secondary font-semibold bg-surface-container-low px-2 py-0.5 rounded">
                          Berkas #{trackingResults.length - index}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default MainContent;
