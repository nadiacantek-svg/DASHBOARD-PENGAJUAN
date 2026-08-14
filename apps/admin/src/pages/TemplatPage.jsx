import React from 'react';

const TemplatPage = () => {
  const templates = [
    {
      title: 'Surat Keterangan Aktif Kuliah',
      category: 'Akademik',
      desc: 'Templat standar untuk permohonan surat keterangan aktif sebagai mahasiswa yang terdaftar pada semester berjalan.',
      updated: 'Diperbarui 1 minggu lalu',
      used: '124x digunakan',
      icon: 'description'
    },
    {
      title: 'Surat Izin Penelitian Instansi',
      category: 'Penelitian',
      desc: 'Formulir resmi untuk permohonan izin pengambilan data penelitian skripsi/tesis di instansi/luar kampus.',
      updated: 'Diperbarui 3 hari lalu',
      used: '89x digunakan',
      icon: 'badge'
    },
    {
      title: 'Permohonan Cuti Akademik',
      category: 'Kemahasiswaan',
      desc: 'Dokumen pengajuan cuti sementara studi (berhenti studi sementara) dengan alasan yang sah.',
      updated: 'Diperbarui 2 bulan lalu',
      used: '45x digunakan',
      icon: 'event_busy'
    },
    {
      title: 'Surat Keterangan Lulus (SKL)',
      category: 'Kelulusan',
      desc: 'Format sementara pengganti ijazah bagi mahasiswa yang telah menyelesaikan sidang dan yudisium.',
      updated: 'Diperbarui 2 minggu lalu',
      used: '210x digunakan',
      icon: 'school'
    }
  ];

  return (
    <div className="space-y-lg">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Templat Dokumen</h1>
          <p className="text-secondary font-body-md mt-xs">Kelola dan gunakan templat standar untuk berbagai jenis pengajuan akademik</p>
        </div>
        <button
          onClick={() => alert('Fitur Tambah Templat Baru dalam pengembangan')}
          className="bg-primary-container text-on-primary-container font-label-lg font-bold py-sm px-md rounded-lg flex items-center gap-sm hover:bg-primary-fixed-dim transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>+ Tambah Templat Baru</span>
        </button>
      </div>

      {/* Grid of Templates matching screenshot layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {templates.map((tpl, idx) => (
          <div key={idx} className="bg-surface-container-lowest border border-outline/10 rounded-xl p-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-primary-fixed-dim"></div>
            <div>
              <div className="flex items-center gap-sm mb-md">
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>{tpl.icon}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded border border-primary-container/30">{tpl.category}</span>
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-xs">{tpl.title}</h3>
              <p className="text-secondary text-sm font-body-md mb-md leading-relaxed">{tpl.desc}</p>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs text-secondary border-t border-outline/10 pt-sm mb-md">
                <span>{tpl.updated}</span>
                <span className="font-semibold">{tpl.used}</span>
              </div>
              <div className="flex gap-sm">
                <button className="flex-1 bg-primary-container text-on-primary-container font-label-lg font-bold py-xs rounded-lg hover:bg-primary-fixed-dim transition-colors text-xs text-center">
                  Gunakan
                </button>
                <button className="p-xs border border-outline/30 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatPage;
