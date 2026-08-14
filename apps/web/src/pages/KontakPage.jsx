import React from 'react';

const KontakPage = () => {
  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-xl">
      <div className="text-center mb-xl">
        <span className="material-symbols-outlined text-primary text-5xl mb-sm" style={{ fontVariationSettings: '"FILL" 1' }}>support_agent</span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Hubungi Kami</h1>
        <p className="font-body-md text-body-md text-secondary mt-xs max-w-xl mx-auto">
          Butuh bantuan atau ada pertanyaan? Tim kami siap membantu Anda melalui berbagai kanal komunikasi berikut.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        {[
          { icon: 'location_on', title: 'Alamat', desc: 'Gedung Rektorat Lt. 2, Jl. Pendidikan No. 1, Kota Akademik 12345' },
          { icon: 'call', title: 'Telepon', desc: '(021) 555-0123\nSenin - Jumat, 08:00 - 16:00 WIB' },
          { icon: 'mail', title: 'Email', desc: 'admin@fspengajuan.ac.id\ninfo@fspengajuan.ac.id' },
        ].map((item, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline/10 rounded-xl p-lg text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-primary-fixed-dim"></div>
            <span className="material-symbols-outlined text-primary text-4xl mb-sm group-hover:scale-110 transition-transform inline-block" style={{ fontVariationSettings: '"FILL" 1' }}>{item.icon}</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">{item.title}</h3>
            <p className="font-body-md text-body-md text-secondary whitespace-pre-line">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest border border-outline/10 rounded-2xl p-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md relative z-10">Kirim Pesan</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-md relative z-10" onSubmit={(e) => { e.preventDefault(); alert('Pesan terkirim! (Demo)'); }}>
          <div>
            <label className="block font-label-lg text-label-lg text-on-surface mb-xs">Nama Lengkap</label>
            <input className="w-full bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" placeholder="Nama Anda" type="text" required />
          </div>
          <div>
            <label className="block font-label-lg text-label-lg text-on-surface mb-xs">Email</label>
            <input className="w-full bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" placeholder="email@contoh.com" type="email" required />
          </div>
          <div className="md:col-span-2">
            <label className="block font-label-lg text-label-lg text-on-surface mb-xs">Subjek</label>
            <input className="w-full bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" placeholder="Subjek pesan" type="text" required />
          </div>
          <div className="md:col-span-2">
            <label className="block font-label-lg text-label-lg text-on-surface mb-xs">Pesan</label>
            <textarea className="w-full bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors" placeholder="Tulis pesan Anda..." rows={5} required></textarea>
          </div>
          <div className="md:col-span-2">
            <button className="bg-primary-container text-on-primary-container font-label-lg text-label-lg font-bold py-sm px-xl rounded hover:bg-primary-fixed-dim transition-colors flex items-center gap-sm" type="submit">
              <span>Kirim Pesan</span>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default KontakPage;
