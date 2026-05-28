import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { base44 } from '@/api/base44Client';
import { userRole } from '@/lib/userRole';

export default function DashboardLayout() {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u) { base44.auth.redirectToLogin(); return; }

      // Tentukan role: cek localStorage dulu, fallback ke u.role
      const savedRole = userRole.get(u.email);
      const effectiveRole = savedRole || u.role;

      const appRoles = ['mahasiswa', 'dosen', 'admin'];
      if (!effectiveRole || !appRoles.includes(effectiveRole)) {
        // Belum pilih peran → ke ProfileSetup
        navigate('/profile-setup', { replace: true });
        return;
      }

      // Sinkronkan localStorage jika belum ada
      if (!savedRole && appRoles.includes(u.role)) {
        userRole.set(u.email, u.role);
      }

      setChecking(false);
    }).catch(() => base44.auth.redirectToLogin());
  }, []);

  if (checking) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex gap-2">
        {[0, 0.15, 0.3].map((d, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background neural-bg">
      <Sidebar />
      <main className="lg:ml-[240px] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}