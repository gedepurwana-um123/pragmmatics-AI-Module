import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import {
  Shield, BarChart3, Users, Bot, AlertTriangle, Database,
  FlaskConical, Eye, GraduationCap, RefreshCw, ChevronRight,
  Cpu, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import AdminAIGovernance from '@/components/admin/AdminAIGovernance';
import AdminContentModeration from '@/components/admin/AdminContentModeration';
import AdminResearchCenter from '@/components/admin/AdminResearchCenter';
import AdminSystemLogs from '@/components/admin/AdminSystemLogs';
import AdminClassManager from '@/components/admin/AdminClassManager';

const ADMIN_EMAIL = 'gedepurwana@gmail.com';

const TABS = [
  { key: 'overview', label: 'Intelligence Overview', icon: BarChart3, color: 'from-indigo-500 to-violet-600', desc: 'KPI & Analytics Real-Time' },
  { key: 'classes', label: 'Kelola Kelas', icon: GraduationCap, color: 'from-emerald-500 to-teal-600', desc: 'Kelas, dosen & enroll mahasiswa' },
  { key: 'users', label: 'User Management', icon: Users, color: 'from-cyan-500 to-blue-600', desc: 'Kelola pengguna & data' },
  { key: 'ai', label: 'AI Governance', icon: Bot, color: 'from-violet-500 to-purple-600', desc: 'Kontrol sistem AI' },
  { key: 'moderation', label: 'Content Moderation', icon: AlertTriangle, color: 'from-rose-500 to-red-600', desc: 'Review konten terflag' },
  { key: 'research', label: 'Research Center', icon: FlaskConical, color: 'from-amber-500 to-orange-600', desc: 'Export & analitik penelitian' },
  { key: 'logs', label: 'System Logs', icon: Database, color: 'from-slate-500 to-slate-700', desc: 'Monitor aktivitas sistem' },
];

const ROLE_LEVELS = [
  { role: 'Super Admin', color: 'rose', desc: 'Kontrol penuh seluruh platform & sistem AI' },
  { role: 'Institution Admin', color: 'indigo', desc: 'Kelola data universitas, dosen & kelas' },
  { role: 'Lecturer Admin', color: 'cyan', desc: 'Kelola kelas, modul & analitik mahasiswa' },
  { role: 'AI Supervisor', color: 'violet', desc: 'Validasi respons AI & konfigurasi prompt' },
  { role: 'Research Admin', color: 'amber', desc: 'Export data & laporan penelitian longitudinal' },
];

export default function AdminPanel() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => {
      setCurrentUser(u);
      if (u?.email === ADMIN_EMAIL || u?.role === 'admin') {
        setAuthorized(true);
      }
      setChecking(false);
    }).catch(() => setChecking(false));
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

  if (!authorized) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl border border-rose-200 shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold font-montserrat text-foreground mb-2">Akses Ditolak</h2>
        <p className="text-sm text-muted-foreground mb-1">Halaman ini hanya dapat diakses oleh administrator sistem.</p>
        {currentUser && (
          <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg mt-3">
            Anda login sebagai: <strong>{currentUser.email}</strong>
          </p>
        )}
        {!currentUser && (
          <Button className="mt-4" onClick={() => base44.auth.redirectToLogin()}>Masuk terlebih dahulu</Button>
        )}
      </motion.div>
    </div>
  );

  const activeTabData = TABS.find(t => t.key === activeTab);

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent)]" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">AI GOVERNANCE PLATFORM</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-montserrat mb-1">
                  Central AI Educational Intelligence
                </h1>
                <p className="text-sm text-white/70">Platform tata kelola AI edukasi pragmatik digital — TKT-6 Implementation</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {ROLE_LEVELS.map((r, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-white/10 border border-white/20 px-2 py-0.5 rounded-full text-white/80">
                      {r.role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preview Buttons */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Preview Mode</p>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/30 gap-2 text-xs"
                  variant="outline"
                >
                  <GraduationCap className="w-4 h-4" />
                  Preview sebagai Mahasiswa
                </Button>
                <Button
                  onClick={() => navigate('/dosen-dashboard')}
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/30 gap-2 text-xs"
                  variant="outline"
                >
                  <Eye className="w-4 h-4" />
                  Preview sebagai Dosen
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`rounded-2xl p-4 border text-left transition-all ${
              activeTab === t.key
                ? 'bg-white border-primary/30 shadow-md'
                : 'bg-white/60 border-border hover:border-primary/20 hover:shadow-sm'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-2.5`}>
              <t.icon className="w-4 h-4 text-white" />
            </div>
            <p className={`text-xs font-bold font-montserrat leading-snug ${activeTab === t.key ? 'text-foreground' : 'text-muted-foreground'}`}>
              {t.label}
            </p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{t.desc}</p>
            {activeTab === t.key && (
              <div className="w-5 h-0.5 bg-primary rounded-full mt-2" />
            )}
          </button>
        ))}
      </div>

      {/* Active Tab Header */}
      <div className="flex items-center gap-2">
        {activeTabData && (
          <>
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${activeTabData.color} flex items-center justify-center`}>
              <activeTabData.icon className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="font-bold font-montserrat text-sm">{activeTabData.label}</h2>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{activeTabData.desc}</span>
          </>
        )}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'classes' && <AdminClassManager />}
        {activeTab === 'users' && <AdminUserManagement />}
        {activeTab === 'ai' && <AdminAIGovernance />}
        {activeTab === 'moderation' && <AdminContentModeration />}
        {activeTab === 'research' && <AdminResearchCenter />}
        {activeTab === 'logs' && <AdminSystemLogs />}
      </motion.div>

    </div>
  );
}