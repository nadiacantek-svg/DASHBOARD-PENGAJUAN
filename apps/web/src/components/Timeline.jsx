import React from 'react';

const Timeline = ({ trackingResult }) => {
  const status = trackingResult ? trackingResult.status : null;

  // Determine completed step index based on status
  // 0: default static/initial (e.g. step 4 active)
  // 'Diproses': step 3 active
  // 'Ditandatangani': step 5 active
  // 'Selesai': step 7 completed
  // 'Ditolak': step 2 rejected (red)

  const steps = [
    { id: 1, title: 'Berkas\nDiterima' },
    { id: 2, title: 'Verifikasi\nAdmin' },
    { id: 3, title: 'Paraf\nKaprodi' },
    { id: 4, title: 'Menunggu TTD\nDekan' },
    { id: 5, title: 'Selesai\nDitandatangani' },
    { id: 6, title: 'Arsip &\nSelesai' },
    { id: 7, title: 'Sudah Dapat\nDiambil' },
  ];

  const getStepState = (stepId) => {
    if (!status) {
      // Default view when no tracking search yet
      if (stepId <= 3) return 'completed';
      if (stepId === 4) return 'active';
      return 'pending';
    }

    if (status === 'Ditolak') {
      if (stepId === 1) return 'completed';
      if (stepId === 2) return 'rejected';
      return 'pending';
    }

    if (status === 'Diproses') {
      if (stepId <= 2) return 'completed';
      if (stepId === 3) return 'active';
      return 'pending';
    }

    if (status === 'Ditandatangani') {
      if (stepId <= 4) return 'completed';
      if (stepId === 5) return 'active';
      return 'pending';
    }

    if (status === 'Selesai') {
      return 'completed';
    }

    return 'pending';
  };

  const getProgressWidth = () => {
    if (!status) return '50%';
    if (status === 'Ditolak') return '20%';
    if (status === 'Diproses') return '35%';
    if (status === 'Ditandatangani') return '70%';
    if (status === 'Selesai') return '100%';
    return '50%';
  };

  return (
    <section className="w-full bg-surface-bright border-t border-outline/10 py-xl mt-auto transition-all">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex justify-between items-center mb-lg">
          <h3 className="font-headline-md text-headline-md text-on-surface">Alur Standar Proses Persuratan</h3>
          {trackingResult && (
            <div className="text-sm font-label-lg text-secondary">
              Status Berkas <strong className="text-on-surface">{trackingResult.nama}</strong>: <span className="text-primary font-bold">{trackingResult.status}</span>
            </div>
          )}
        </div>

        <div className="relative overflow-x-auto pb-8">
          <div className="absolute top-6 left-12 right-12 h-1.5 bg-surface-container-high z-0"></div>
          <div
            className="absolute top-6 left-12 h-1.5 bg-primary-container z-0 transition-all duration-500"
            style={{ width: getProgressWidth() }}
          ></div>
          <div className="flex justify-between min-w-[900px] relative z-10 px-4">
            {steps.map((step) => {
              const state = getStepState(step.id);

              return (
                <div key={step.id} className="flex flex-col items-center w-32">
                  {state === 'completed' && (
                    <div className="w-12 h-12 rounded-full bg-[#10b981] flex items-center justify-center border-4 border-surface-bright mb-sm shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                      <span className="material-symbols-outlined text-white font-bold">check</span>
                    </div>
                  )}

                  {state === 'active' && (
                    <div className="w-12 h-12 rounded-full bg-[#191c1d] flex items-center justify-center border-4 border-primary-container mb-sm shadow-[0_0_20px_rgba(255,176,0,0.5)]">
                      <span className="text-primary-container font-bold text-lg">{step.id}</span>
                    </div>
                  )}

                  {state === 'rejected' && (
                    <div className="w-12 h-12 rounded-full bg-error flex items-center justify-center border-4 border-surface-bright mb-sm shadow-[0_0_15px_rgba(186,26,26,0.4)]">
                      <span className="material-symbols-outlined text-white font-bold">close</span>
                    </div>
                  )}

                  {state === 'pending' && (
                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center border-4 border-surface-bright mb-sm">
                      <span className="text-tertiary-fixed-dim font-bold text-lg">{step.id}</span>
                    </div>
                  )}

                  <span
                    className={`font-label-md text-label-md text-center font-bold uppercase leading-tight whitespace-pre-line ${
                      state === 'completed' ? 'text-on-surface' :
                      state === 'active' ? 'text-primary' :
                      state === 'rejected' ? 'text-error' :
                      'text-tertiary-fixed-dim'
                    }`}
                  >
                    {step.title}
                  </span>

                  {state === 'active' && (
                    <div className="bg-primary-container/20 px-3 py-0.5 rounded-full border border-primary-container/30 mt-2">
                      <span className="text-yellow-800 text-[10px] font-black uppercase">Sedang Proses</span>
                    </div>
                  )}

                  {state === 'rejected' && (
                    <div className="bg-error/20 px-3 py-0.5 rounded-full border border-error/30 mt-2">
                      <span className="text-error text-[10px] font-black uppercase">Ditolak</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
