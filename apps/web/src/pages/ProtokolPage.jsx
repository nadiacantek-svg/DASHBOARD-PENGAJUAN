import React from 'react';

const ProtokolPage = () => {
  const protocols = [
    {
      icon: 'description',
      title: '1. Pengajuan Surat Rekomendasi',
      steps: [
        'Mahasiswa mengisi formulir pengajuan secara online',
        'Berkas diperiksa oleh staff bagian akademik',
        'Surat dibuatkan oleh petugas administrasi',
        'Ditandatangani oleh Dekan',
        'Mahasiswa mendapat notifikasi surat siap diambil'
      ]
    },
    {
      icon: 'verified_user',
      title: '2. Legalisir Dokumen',
      steps: [
        'Unggah scan dokumen asli melalui portal',
        'Verifikasi keaslian oleh bagian akademik',
        'Proses legalisir dan cap basah',
        'Dokumen siap diambil (estimasi 2-3 hari kerja)'
      ]
    },
    {
      icon: 'school',
      title: '3. Izin Penelitian / Skripsi',
      steps: [
        'Ajukan melalui formulir online dengan lampiran proposal',
        'Verifikasi oleh Kaprodi',
        'Persetujuan Wakil Dekan Bidang Akademik',
        'Surat izin diterbitkan dan ditandatangani Dekan',
        'Distribusi ke instansi terkait'
      ]
    },
    {
      icon: 'event_busy',
      title: '4. Permohonan Cuti Akademik',
      steps: [
        'Isi formulir permohonan cuti beserta alasan',
        'Lampirkan dokumen pendukung',
        'Persetujuan Dosen Pembimbing Akademik',
        'Keputusan oleh Wakil Dekan',
        'SK Cuti diterbitkan'
      ]
    }
  ];

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-xl">
      <div className="text-center mb-xl">
        <span className="material-symbols-outlined text-primary text-5xl mb-sm" style={{ fontVariationSettings: '"FILL" 1' }}>gavel</span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Protokol & Prosedur</h1>
        <p className="font-body-md text-body-md text-secondary mt-xs max-w-2xl mx-auto">
          Panduan lengkap mengenai tata cara dan alur pengajuan berkas persuratan akademik di Fakultas Sains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {protocols.map((proto, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline/10 rounded-xl p-lg shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-primary-fixed-dim opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>{proto.icon}</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">{proto.title}</h3>
            </div>
            <ol className="space-y-sm ml-4">
              {proto.steps.map((step, j) => (
                <li key={j} className="flex items-start gap-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-container/30 text-on-primary-container text-xs font-bold rounded-full flex items-center justify-center mt-0.5">{j + 1}</span>
                  <span className="font-body-md text-body-md text-secondary">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-xl bg-primary-container/10 border border-primary-container/30 rounded-xl p-lg">
        <div className="flex items-start gap-sm">
          <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0 mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>info</span>
          <div>
            <h3 className="font-label-lg text-label-lg text-on-surface mb-xs">Catatan Penting</h3>
            <p className="font-body-md text-body-md text-secondary">
              Semua pengajuan berkas akan diproses dalam waktu 1-3 hari kerja tergantung jenis berkas.
              Pastikan semua data yang diisi sudah benar dan lengkap untuk menghindari penolakan atau penundaan proses.
              Untuk pertanyaan lebih lanjut, silakan kunjungi halaman <a href="/kontak" className="text-primary font-medium hover:underline">Kontak</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProtokolPage;
