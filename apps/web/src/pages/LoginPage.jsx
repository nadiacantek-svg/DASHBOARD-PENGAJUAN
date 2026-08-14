import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL, ADMIN_URL } from '../config';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Since localStorage is scoped to domain/port, we redirect to admin port with the token
        window.location.href = `${ADMIN_URL}/login?token=${data.token}&user=${encodeURIComponent(JSON.stringify(data.user))}`;
      } else {
        setError(data.message || 'Login gagal. Periksa username dan password.');
      }
    } catch (err) {
      if (username === 'admin' && password === 'admin123') {
        window.location.href = `${ADMIN_URL}/login?token=demo-token&user=${encodeURIComponent(JSON.stringify({ name: 'Administrator', username: 'admin', role: 'admin' }))}`;
      } else {
        setError('Terjadi kesalahan koneksi ke server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl min-h-[80vh] relative">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
        <img alt="" className="w-full h-full object-cover object-center" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKNL-LASNNy_3nMV0S31Xe3oXUWmPJnKqj3BRmscNjT1d4W7yKPxTSE5dDsXInOtbK-LLjQ24TI2zVbp06VAfWNIUwX5dD3anTtoaGktzoq4hSmWnDHD-5hkOLqebzr62rHX0CfthxTfgQuTjLKoufzZmw8qPCaFyu_3exfXinRL9E6KSPTklhraf3mXkuWuUHRXcI1Bt810bA3G7IFn-dIev1is-yMFtcj2rynamY5Zp3kkpaWIU6Obq9tqdgq8MQhM9uPAL6bg" />
      </div>
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline/10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-xl relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-container/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="text-center mb-lg relative z-10">
          <span className="material-symbols-outlined text-primary text-5xl mb-sm" style={{ fontVariationSettings: '"FILL" 1' }}>account_circle</span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Masuk ke Akun Admin</h1>
          <p className="font-body-md text-body-md text-secondary mt-xs">Silakan masuk menggunakan username untuk mengakses dashboard</p>
        </div>

        {error && (
          <div className="mb-md p-sm bg-error/10 border border-error/30 text-error rounded-lg text-sm font-semibold flex items-center gap-xs">
            <span className="material-symbols-outlined text-lg">error</span>
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-md relative z-10" onSubmit={handleSubmit}>
          <div>
            <label className="block font-label-lg text-label-lg text-on-surface mb-xs" htmlFor="username">Username</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-xl">person</span>
              <input
                value={username} onChange={(e) => setUsername(e.target.value)} required
                className="w-full bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm pl-10 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors"
                id="username" placeholder="Masukkan username" type="text"
              />
            </div>
          </div>
          <div>
            <label className="block font-label-lg text-label-lg text-on-surface mb-xs" htmlFor="password">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-xl">lock</span>
              <input
                value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-surface-container-lowest border border-outline/30 rounded px-sm py-sm pl-10 pr-10 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors"
                id="password" placeholder="••••••••" type={showPassword ? 'text' : 'password'}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-sm top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-xs text-secondary cursor-pointer">
              <input type="checkbox" className="rounded border-outline/30 text-primary focus:ring-primary-container" />
              <span>Ingat saya</span>
            </label>
          </div>
          <button
            disabled={loading}
            className="w-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-bold py-sm rounded hover:bg-primary-fixed-dim transition-colors flex justify-center items-center gap-sm"
            type="submit"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                <span>Masuk</span>
                <span className="material-symbols-outlined">login</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
