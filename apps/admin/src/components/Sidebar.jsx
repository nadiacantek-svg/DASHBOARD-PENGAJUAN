import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const menuItems = [
    { to: '/dashboard', label: 'Dasbor', icon: 'dashboard' },
    { to: '/kotak-masuk', label: 'Kotak Masuk', icon: 'inbox' },
    { to: '/riwayat', label: 'Item Terkirim', icon: 'send' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('admin_user') || '{}');

  return (
    <aside className="w-64 bg-surface border-r border-outline/10 h-screen flex flex-col justify-between p-md sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-sm px-xs mb-xl">
          <img
            alt="Logo"
            className="h-9 w-auto"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1ZJb5XquQBqfse6TmUEpGq9ntMKLf_zCe0ECkSTlVwgDjeynSxsLisJ3M-po0FOppS3WaaL8isXm7dW70JFnuuD4gXtLWiFR7hAMKxjf6AHiS0Y7pGgHmXMNupzkUuAWueItXjl5ZnpvL0e4M_KdMvrWCOQP-8K2eDHSYXIKvlKwfYEa7e1wX6ohOJcCZPleIjUyMfLWSUsPY6h6yC7S8JJNGfRIJRTQctcouX0_u_a39ehKNhoFZzuHkA6K8DrvKIyDM11B2Dg"
          />
          <div>
            <h1 className="font-bold text-on-surface text-base leading-none">FSPengajuan</h1>
            <span className="text-xs text-secondary font-medium">Akademik Management</span>
          </div>
        </div>



        {/* Menu Navigation */}
        <nav className="space-y-xs">
          {menuItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-sm px-sm py-sm rounded-lg font-label-lg transition-all ${
                  active
                    ? 'bg-primary-container/20 text-primary font-bold shadow-xs'
                    : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: active ? '"FILL" 1' : '"FILL" 0' }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer & Logout */}
      <div className="border-t border-outline/10 pt-md space-y-sm">
        <button
          onClick={() => setShowProfileModal(true)}
          className="w-full flex items-center gap-sm px-xs py-xs hover:bg-surface-container-low rounded-lg transition-colors text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-primary-container/30 text-primary flex items-center justify-center font-bold text-sm border border-primary-container/40">
            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex-grow overflow-hidden">
            <p className="font-label-lg text-on-surface truncate leading-tight font-semibold">{user.name || 'Admin'}</p>
            <p className="text-xs text-secondary truncate">@{user.username || 'admin'}</p>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-sm px-sm py-xs text-secondary hover:text-error hover:bg-error-container/20 rounded-lg transition-colors font-label-md"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Keluar</span>
        </button>
      </div>

      {/* Profile Detail Modal */}
      {showProfileModal && (
        <div
          onClick={() => setShowProfileModal(false)}
          className="fixed inset-0 z-50 bg-on-surface/45 backdrop-blur-xs flex items-center justify-center p-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest border border-outline/10 rounded-2xl shadow-2xl w-full max-w-sm p-xl relative animate-fade-in text-on-surface"
          >
            <div className="flex justify-between items-center mb-md border-b border-outline/10 pb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary">account_circle</span>
                <span>Detail Profil Admin</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="text-secondary hover:text-on-surface p-1 rounded-lg focus:outline-none"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-sm py-xs">
              <div className="flex items-center gap-md bg-surface-container-low p-sm rounded-xl mb-sm">
                <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container font-bold text-lg flex items-center justify-center border border-primary-container/20">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-base">{user.name || 'Administrator'}</h4>
                  <p className="text-xs text-secondary">@{user.username || 'admin'}</p>
                </div>
              </div>

              <div className="space-y-xs text-sm">
                <div className="flex justify-between py-xs border-b border-outline/5">
                  <span className="text-secondary">Jabatan / Role:</span>
                  <span className="font-semibold">{user.role || 'Super Admin'}</span>
                </div>
                <div className="flex justify-between py-xs border-b border-outline/5">
                  <span className="text-secondary">Email:</span>
                  <span className="font-semibold text-primary">{user.email || 'admin@fspengajuan.ac.id'}</span>
                </div>
                <div className="flex justify-between py-xs">
                  <span className="text-secondary">Status Akun:</span>
                  <span className="font-semibold text-[#10b981] flex items-center gap-3xs">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block"></span>
                    <span>Aktif</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-md pt-sm border-t border-outline/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-md py-sm bg-primary border border-outline/10 text-white font-label-lg font-bold rounded-lg hover:opacity-90 transition-opacity focus:outline-none"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
