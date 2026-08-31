import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if token and user are passed as query params from Web Client
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', decodeURIComponent(userStr));
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'bypass-tunnel-reminder': 'true'
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login gagal. Periksa username dan password.');
      }
    } catch (err) {
      // Fallback for demo if backend isn't running
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('admin_token', 'demo-token');
        localStorage.setItem('admin_user', JSON.stringify({ name: 'Administrator', username: 'admin', role: 'admin' }));
        navigate('/dashboard');
      } else {
        setError('Terjadi kesalahan koneksi ke server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface-container-lowest border border-outline/10 rounded-2xl shadow-xl p-xl relative z-10">
        <div className="text-center mb-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container/30 text-primary mb-sm border border-primary-container/40">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>admin_panel_settings</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Login Admin</h1>
          <p className="font-body-md text-body-md text-secondary mt-xs">Masuk ke Dashboard Kelola Pengajuan Surat</p>
        </div>

        {error && (
          <div className="mb-md p-sm bg-error/10 border border-error/30 text-error rounded-lg text-sm font-semibold flex items-center gap-xs">
            <span className="material-symbols-outlined text-lg">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-md">
          <div>
            <label className="block font-label-lg text-label-lg text-on-surface mb-xs" htmlFor="username">Username Admin</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-xl">person</span>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-sm py-sm pl-10 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-lg text-label-lg text-on-surface mb-xs" htmlFor="password">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary text-xl">lock</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-sm py-sm pl-10 pr-10 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-sm top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-bold py-sm rounded-lg hover:bg-primary-fixed-dim transition-colors flex items-center justify-center gap-sm shadow-sm"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                <span>Masuk Dashboard</span>

                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-lg text-center text-xs text-secondary bg-surface-container-low p-sm rounded-lg">
          <p className="font-semibold text-on-surface mb-xs">Default Akses Admin Demo:</p>
          <p>Username: <code className="font-bold text-primary">admin</code> | Password: <code className="font-bold text-primary">admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
