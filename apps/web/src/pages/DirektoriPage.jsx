import React from 'react';

const DirektoriPage = () => {
  const staff = [
    { name: 'Prof. Dr. Ahmad Sudirman, M.Si.', role: 'Dekan Fakultas Sains', icon: 'school', email: 'dekan@fspengajuan.ac.id' },
    { name: 'Dr. Siti Nurhaliza, M.Pd.', role: 'Wakil Dekan Bidang Akademik', icon: 'co_present', email: 'wadek1@fspengajuan.ac.id' },
    { name: 'Dr. Budi Hartono, M.T.', role: 'Wakil Dekan Bidang Kemahasiswaan', icon: 'groups', email: 'wadek3@fspengajuan.ac.id' },
    { name: 'Ir. Maya Putri, M.Eng.', role: 'Kepala Tata Usaha', icon: 'badge', email: 'ktu@fspengajuan.ac.id' },
    { name: 'Rina Susanti, S.Kom.', role: 'Staff Administrasi Akademik', icon: 'person', email: 'admin.akademik@fspengajuan.ac.id' },
    { name: 'Dian Pratama, A.Md.', role: 'Staff Persuratan', icon: 'person', email: 'surat@fspengajuan.ac.id' },
  ];

  const units = [
    { name: 'Bagian Akademik', desc: 'Pengelolaan administrasi akademik, transkrip, dan surat keterangan', icon: 'menu_book', location: 'Gedung A, Lt. 1' },
    { name: 'Bagian Kemahasiswaan', desc: 'Pelayanan kemahasiswaan, beasiswa, dan kegiatan mahasiswa', icon: 'diversity_3', location: 'Gedung A, Lt. 2' },
    { name: 'Bagian Keuangan', desc: 'Pengelolaan keuangan, pembayaran, dan reimbursement', icon: 'payments', location: 'Gedung B, Lt. 1' },
    { name: 'Bagian Kepegawaian', desc: 'Administrasi kepegawaian dosen dan tenaga kependidikan', icon: 'work', location: 'Gedung B, Lt. 2' },
  ];

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-xl">
      <div className="text-center mb-xl">
        <span className="material-symbols-outlined text-primary text-5xl mb-sm" style={{ fontVariationSettings: '"FILL" 1' }}>contacts</span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Direktori</h1>
        <p className="font-body-md text-body-md text-secondary mt-xs max-w-xl mx-auto">
          Informasi kontak pejabat dan unit kerja di lingkungan Fakultas Sains.
        </p>
      </div>

      <h2 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>people</span>
        Pejabat & Staff
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md mb-xl">
        {staff.map((person, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline/10 rounded-xl p-md shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-primary-fixed-dim opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-sm mb-sm">
              <div className="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>{person.icon}</span>
              </div>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface font-medium">{person.name}</p>
                <p className="font-body-sm text-body-sm text-secondary">{person.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-xs text-sm text-secondary mt-sm">
              <span className="material-symbols-outlined text-sm">mail</span>
              <a href={`mailto:${person.email}`} className="text-primary hover:underline">{person.email}</a>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>apartment</span>
        Unit Kerja
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {units.map((unit, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline/10 rounded-xl p-lg shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-primary-fixed-dim opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-primary text-3xl flex-shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>{unit.icon}</span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">{unit.name}</h3>
                <p className="font-body-md text-body-md text-secondary mb-sm">{unit.desc}</p>
                <div className="flex items-center gap-xs text-sm text-secondary">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>{unit.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default DirektoriPage;
