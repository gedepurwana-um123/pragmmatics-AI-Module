import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Users, Server, BookOpen, Bot, Shield, Activity, Database,
  CheckCircle2, AlertTriangle, TrendingUp, Brain, Globe, Eye,
  MessageSquare, FileText, Settings, Bell, Lock, Zap, BarChart3,
  HardDrive, Cpu, RefreshCw, Search, Filter, Download, LogOut
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, LineChart, Line
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ── Static data ──────────────────────────────────────────────
const usageData = [
  { day: 'Sen', users: 85, ai: 120, modules: 45, ethics: 62 },
  { day: 'Sel', users: 92, ai: 145, modules: 52, ethics: 70 },
  { day: 'Rab', users: 78, ai: 110, modules: 38, ethics: 58 },
  { day: 'Kam', users: 105, ai: 160, modules: 65, ethics: 78 },
  { day: 'Jum', users: 98, ai: 155, modules: 58, ethics: 75 },
  { day: 'Sab', users: 45, ai: 60, modules: 22, ethics: 40 },
  { day: 'Min', users: 38, ai: 48, modules: 18, ethics: 35 },
];

const toxicityTrend = [
  { month: 'Jan', toxicity: 52, politeness: 45, pragmatic: 38 },
  { month: 'Feb', toxicity: 46, politeness: 52, pragmatic: 45 },
  { month: 'Mar', toxicity: 38, politeness: 60, pragmatic: 55 },
  { month: 'Apr', toxicity: 30, politeness: 68, pragmatic: 63 },
  { month: 'Mei', toxicity: 22, politeness: 76, pragmatic: 72 },
  { month: 'Jun', toxicity: 16, politeness: 84, pragmatic: 80 },
];

const moduleActivity = [
  { name: 'Pragmatik Dasar', views: 450, completion: 78 },
  { name: 'Kesantunan', views: 380, completion: 65 },
  { name: 'Toxicity', views: 320, completion: 70 },
  { name: 'Speech Acts', views: 290, completion: 55 },
  { name: 'Implikatur', views: 240, completion: 48 },
  { name: 'Etika Digital', views: 210, completion: 60 },
];

const userDist = [
  { name: 'Mahasiswa', value: 210, color: '#4F46E5' },
  { name: 'Dosen', value: 38, color: '#10B981' },
  { name: 'Admin', value: 8, color: '#F59E0B' },
];

const competencyRadar = [
  { dim: 'Pragmatik', avg: 76 },
  { dim: 'Kesantunan', avg: 82 },
  { dim: 'Kultural', avg: 71 },
  { dim: 'Etika', avg: 85 },
  { dim: 'Empati', avg: 79 },
  { dim: 'Konteks', avg: 74 },
];

const aiLogs = [
  { id: 1, user: 'Ahmad Fauzi', prompt: 'Ini platform sampah!', toxicity: 85, politeness: 12, flag: true, time: '10:22' },
  { id: 2, user: 'Siti Nurhaliza', prompt: 'Bisakah kamu jelaskan implikatur?', toxicity: 2, politeness: 92, flag: false, time: '10:35' },
  { id: 3, user: 'Raka Pratama', prompt: 'Dosen ini ga kompeten!', toxicity: 78, politeness: 18, flag: true, time: '11:05' },
  { id: 4, user: 'Dewi Lestari', prompt: 'Terima kasih atas penjelasannya.', toxicity: 0, politeness: 98, flag: false, time: '11:20' },
  { id: 5, user: 'Budi Santoso', prompt: 'Gue benci pelajaran ini!', toxicity: 70, politeness: 20, flag: true, time: '12:01' },
];

const recentUsers = [
  { name: 'Dr. Siti Aminah', role: 'Dosen', date: '2 jam lalu', action: 'Lihat Dashboard Kelas', status: 'online' },
  { name: 'Ahmad Fauzi', role: 'Mahasiswa', date: '3 jam lalu', action: 'Analisis AI', status: 'online' },
  { name: 'Dewi Lestari', role: 'Mahasiswa', date: '5 jam lalu', action: 'Jurnal Refleksi', status: 'offline' },
  { name: 'Prof. Bambang', role: 'Dosen', date: '1 hari lalu', action: 'Evaluasi Kelas D', status: 'offline' },
  { name: 'Budi Santoso', role: 'Mahasiswa', date: '1 hari lalu', action: 'Modul Pragmatik', status: 'offline' },
];

const systemStatus = [
  { name: 'AI Engine (Cultural Wisdom)', status: 'online', latency: '142ms', load: 38 },
  { name: 'Database (PostgreSQL)', status: 'online', latency: '8ms', load: 22 },
  { name: 'Auth Service (JWT)', status: 'online', latency: '15ms', load: 12 },
  { name: 'Analytics Engine', status: 'online', latency: '35ms', load: 18 },
  { name: 'Notification Service', status: 'online', latency: '22ms', load: 8 },
  { name: 'File Storage', status: 'warning', latency: '180ms', load: 72 },
];

const adminModules = [
  { label: 'Manajemen Pengguna', icon: Users, path: 'users', desc: '256 pengguna terdaftar' },
  { label: 'AI Control Panel', icon: Bot, path: 'ai', desc: '3,842 interaksi log' },
  { label: 'Analitik Platform', icon: BarChart3, path: 'analytics', desc: 'Real-time insights' },
  { label: 'Modul & Konten', icon: BookOpen, path: 'modules', desc: '12 modul aktif' },
  { label: 'Cultural Engine', icon: Globe, path: 'cultural', desc: '3 budaya terintegrasi' },
  { label: 'Toxicity Monitor', icon: Shield, path: 'toxicity', desc: '24 flag minggu ini' },
  { label: 'System Logs', icon: FileText, path: 'logs', desc: '15,420 records' },
  { label: 'Notifikasi', icon: Bell, path: 'notifications', desc: '8 belum dibaca' },
  { label: 'Role & Permissions', icon: Lock, path: 'permissions', desc: '3 peran aktif' },
  { label: 'Database Manager', icon: Database, path: 'database', desc: '2.4 GB data' },
  { label: 'Scaffolding Config', icon: Zap, path: 'scaffolding', desc: 'Engine adaptif' },
  { label: 'Laporan & Export', icon: Download, path: 'reports', desc: 'PDF / Excel' },
];

const tooltipStyle = {
  backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
  borderRadius: '12px', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

const TABS = ['Overview', 'Pengguna', 'AI Monitor', 'Analytics', 'System'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview');
  const [searchUser, setSearchUser] = useState('');
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    if (tab === 'System') {
      setLoadingLogs(true);
      base44.entities.SystemLog.list('-created_date', 20)
        .then(data => setLogs(data || []))
        .catch(() => setLogs([]))
        .finally(() => setLoadingLogs(false));
    }
  }, [tab]);

  const filteredUsers = recentUsers.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600">PragmaticsAI · Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground">Dashboard Administrator</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">Sistem manajemen terpusat platform PragmaticsAI.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Sistem Online
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: Users, label: 'Total Pengguna', value: '256', sub: '+12 bulan ini', color: 'from-indigo-500 to-purple-600' },
          { icon: Bot, label: 'Interaksi AI', value: '3,842', sub: '+420 minggu ini', color: 'from-cyan-500 to-blue-600' },
          { icon: Brain, label: 'Rata-rata Pragmatik', value: '76%', sub: 'Seluruh kelas', color: 'from-violet-500 to-indigo-600' },
          { icon: Shield, label: 'Rata-rata Kesantunan', value: '82%', sub: '+18% 6 bulan', color: 'from-emerald-500 to-teal-600' },
          { icon: AlertTriangle, label: 'Flag Toxicity', value: '24', sub: 'Minggu ini', color: 'from-rose-500 to-red-600' },
          { icon: Activity, label: 'Uptime Sistem', value: '99.9%', sub: '30 hari terakhir', color: 'from-amber-500 to-orange-600' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-border shadow-sm"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold font-montserrat text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ══ OVERVIEW TAB ══ */}
      {tab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Platform usage */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-4">Penggunaan Platform — 7 Hari</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData}>
                    <defs>
                      {[['adUsers', '#4F46E5'], ['adAI', '#06B6D4'], ['adEthics', '#10B981']].map(([id, c]) => (
                        <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={c} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="users" stroke="#4F46E5" fill="url(#adUsers)" name="Pengguna Aktif" strokeWidth={2} />
                    <Area type="monotone" dataKey="ai" stroke="#06B6D4" fill="url(#adAI)" name="Interaksi AI" strokeWidth={2} />
                    <Area type="monotone" dataKey="ethics" stroke="#10B981" fill="url(#adEthics)" name="Skor Etika" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* System status */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-6 border border-border shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-3">Status Infrastruktur</h3>
              <div className="space-y-2">
                {systemStatus.map((s, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border ${s.status === 'online' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{s.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.load > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${s.load}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">{s.latency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Toxicity + Competency trends */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-border shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-4">Tren Toxicity & Kesantunan (6 Bulan)</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={toxicityTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="toxicity" stroke="#F43F5E" strokeWidth={2} dot={false} name="Toxicity %" />
                    <Line type="monotone" dataKey="politeness" stroke="#10B981" strokeWidth={2} dot={false} name="Kesantunan %" />
                    <Line type="monotone" dataKey="pragmatic" stroke="#4F46E5" strokeWidth={2} dot={false} name="Pragmatik %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl p-6 border border-border shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-4">Rata-rata Kompetensi Mahasiswa</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={competencyRadar}>
                    <PolarGrid stroke="rgba(0,0,0,0.06)" />
                    <PolarAngleAxis dataKey="dim" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Radar dataKey="avg" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.15} strokeWidth={2} name="Rata-rata" />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Module + User dist */}
          <div className="grid lg:grid-cols-5 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="lg:col-span-3 bg-white rounded-2xl p-6 border border-border shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-4">Aktivitas & Completion Rate Modul</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleActivity} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="views" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Akses" />
                    <Bar dataKey="completion" fill="#10B981" radius={[4, 4, 0, 0]} name="Completion %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-4">Distribusi Pengguna</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={userDist} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={58}>
                      {userDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {userDist.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-bold text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Admin module grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-border shadow-sm"
          >
            <h3 className="font-semibold text-foreground mb-4">Panel Manajemen Sistem</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {adminModules.map((m, i) => (
                <button key={i} onClick={() => {
                  if (m.path === 'users') setTab('Pengguna');
                  else if (m.path === 'ai') setTab('AI Monitor');
                  else if (m.path === 'analytics') setTab('Analytics');
                  else if (m.path === 'logs') setTab('System');
                }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-indigo-50 transition-all group text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <m.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-foreground leading-tight">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ══ PENGGUNA TAB ══ */}
      {tab === 'Pengguna' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Cari pengguna..." className="pl-9" value={searchUser} onChange={e => setSearchUser(e.target.value)} />
            </div>
            <Button variant="outline" size="sm" className="gap-2"><Filter className="w-3.5 h-3.5" />Filter</Button>
            <Button variant="outline" size="sm" className="gap-2"><Download className="w-3.5 h-3.5" />Export</Button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Aktivitas Pengguna Terbaru</h3>
              <span className="text-xs text-muted-foreground">256 pengguna terdaftar</span>
            </div>
            <div className="divide-y divide-border">
              {filteredUsers.map((u, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">{u.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.role} · {u.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
                      {u.status === 'online' ? '● Online' : u.date}
                    </span>
                    <Button size="sm" variant="outline" className="text-xs">Detail</Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Role distribution */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { role: 'Mahasiswa', count: 210, icon: Users, color: 'from-indigo-500 to-blue-600', active: 42 },
              { role: 'Dosen', count: 38, icon: Brain, color: 'from-emerald-500 to-teal-600', active: 12 },
              { role: 'Administrator', count: 8, icon: Shield, color: 'from-amber-500 to-orange-600', active: 3 },
            ].map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-border shadow-sm p-5"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-3`}>
                  <r.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold font-montserrat text-foreground">{r.count}</p>
                <p className="text-sm text-muted-foreground">{r.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-600 font-medium">{r.active} aktif sekarang</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ══ AI MONITOR TAB ══ */}
      {tab === 'AI Monitor' && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Log AI', value: '3,842', icon: Bot, color: 'from-indigo-500 to-violet-600' },
              { label: 'Flagged (Toxic)', value: '24', icon: AlertTriangle, color: 'from-rose-500 to-red-600' },
              { label: 'Avg Politeness', value: '76%', icon: Shield, color: 'from-emerald-500 to-teal-600' },
              { label: 'Avg Toxicity', value: '22%', icon: Activity, color: 'from-amber-500 to-orange-600' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-border shadow-sm p-5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold font-montserrat text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* AI Logs Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Log Interaksi AI — Perlu Perhatian</h3>
              <span className="text-xs bg-rose-100 text-rose-700 font-semibold px-2 py-1 rounded-full">{aiLogs.filter(l => l.flag).length} flagged</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    {['Pengguna', 'Pesan', 'Toxicity', 'Kesantunan', 'Waktu', 'Aksi'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {aiLogs.map((log) => (
                    <tr key={log.id} className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${log.flag ? 'bg-rose-50/40' : ''}`}>
                      <td className="px-5 py-3 font-semibold text-foreground">{log.user}</td>
                      <td className="px-5 py-3 text-muted-foreground max-w-xs">
                        <p className="truncate">{log.prompt}</p>
                        {log.flag && <span className="text-[10px] text-rose-600 font-bold">⚠️ Flagged</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`font-bold text-sm ${log.toxicity > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>{log.toxicity}%</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`font-bold text-sm ${log.politeness > 60 ? 'text-emerald-600' : 'text-amber-600'}`}>{log.politeness}%</span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{log.time}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-auto">Review</Button>
                          {log.flag && <Button size="sm" className="text-xs px-2 py-1 h-auto bg-rose-600 hover:bg-rose-700 text-white">Tindak</Button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* AI Config panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-border shadow-sm p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Konfigurasi AI Control Panel</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Threshold Toxicity', value: '50%', desc: 'Nilai di atas ini otomatis diflag', editable: true },
                { label: 'Scaffolding Level Default', value: 'Moderat', desc: 'Level bantuan AI awal untuk mahasiswa baru', editable: true },
                { label: 'Cultural Engine', value: 'Aktif (3 budaya)', desc: 'Tolaki · Muna · Buton', editable: false },
                { label: 'Model AI', value: 'GPT-4o-mini', desc: 'Versi model bahasa yang digunakan', editable: true },
                { label: 'Max Token per Sesi', value: '2,048', desc: 'Batas token per interaksi AI', editable: true },
                { label: 'Auto-Reconstruct', value: 'Aktif', desc: 'Rekonstruksi otomatis teks toxic', editable: true },
              ].map((c, i) => (
                <div key={i} className="bg-secondary/30 rounded-xl p-4 border border-border">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-bold text-foreground">{c.label}</p>
                    {c.editable && <button className="text-[10px] text-indigo-600 font-semibold hover:underline flex-shrink-0">Edit</button>}
                  </div>
                  <p className="text-sm font-semibold text-indigo-700">{c.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{c.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ══ ANALYTICS TAB ══ */}
      {tab === 'Analytics' && (
        <div className="space-y-5">
          {/* Engagement heatmap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-border shadow-sm p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">Heatmap Engagement Platform</h3>
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                <div className="flex gap-1 mb-2">
                  <div className="w-16" />
                  {['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map(h => (
                    <div key={h} className="flex-1 text-[10px] text-center text-muted-foreground">{h}</div>
                  ))}
                </div>
                {[
                  { day: 'Senin', vals: [2, 8, 9, 6, 7, 4] },
                  { day: 'Selasa', vals: [3, 7, 8, 9, 6, 3] },
                  { day: 'Rabu', vals: [1, 6, 7, 8, 9, 5] },
                  { day: 'Kamis', vals: [4, 9, 8, 7, 8, 6] },
                  { day: 'Jumat', vals: [3, 8, 9, 6, 5, 2] },
                  { day: 'Sabtu', vals: [1, 3, 4, 3, 2, 1] },
                  { day: 'Minggu', vals: [1, 2, 3, 2, 2, 1] },
                ].map((row, ri) => (
                  <div key={ri} className="flex gap-1 mb-1">
                    <div className="w-16 text-xs text-muted-foreground text-right pr-2 pt-1">{row.day}</div>
                    {row.vals.map((v, vi) => {
                      const intensity = v >= 8 ? 'bg-indigo-600' : v >= 6 ? 'bg-indigo-400' : v >= 4 ? 'bg-indigo-200' : v >= 2 ? 'bg-indigo-100' : 'bg-secondary';
                      return <div key={vi} className={`flex-1 h-8 rounded-lg ${intensity}`} title={`${v * 10} sesi`} />;
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Competency table per kelas */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Perbandingan Kompetensi per Kelas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    {['Kelas', 'Pragmatik', 'Kesantunan', 'Toxicity', 'Kultural', 'Etika', 'Engagement', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { kelas: 'Kelas A', pragmatik: 82, kesantunan: 86, toxicity: 18, kultural: 79, etika: 84, engagement: 88, status: 'Sangat Baik' },
                    { kelas: 'Kelas B', pragmatik: 72, kesantunan: 76, toxicity: 28, kultural: 68, etika: 74, engagement: 72, status: 'Baik' },
                    { kelas: 'Kelas C', pragmatik: 88, kesantunan: 91, toxicity: 12, kultural: 85, etika: 90, engagement: 92, status: 'Sangat Baik' },
                    { kelas: 'Kelas D', pragmatik: 65, kesantunan: 68, toxicity: 38, kultural: 60, etika: 66, engagement: 58, status: 'Perlu Bimbingan' },
                  ].map((row, i) => {
                    const statusColor = row.status === 'Sangat Baik' ? 'bg-emerald-100 text-emerald-700' : row.status === 'Baik' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700';
                    return (
                      <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                        <td className="px-4 py-3 font-bold text-foreground">{row.kelas}</td>
                        <td className="px-4 py-3 font-semibold text-indigo-600">{row.pragmatik}%</td>
                        <td className="px-4 py-3 font-semibold text-emerald-600">{row.kesantunan}%</td>
                        <td className="px-4 py-3 font-semibold text-rose-600">{row.toxicity}%</td>
                        <td className="px-4 py-3 text-violet-600 font-semibold">{row.kultural}%</td>
                        <td className="px-4 py-3 text-cyan-600 font-semibold">{row.etika}%</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${row.engagement}%` }} />
                            </div>
                            <span className="text-xs font-medium">{row.engagement}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor}`}>{row.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

      {/* ══ SYSTEM TAB ══ */}
      {tab === 'System' && (
        <div className="space-y-5">
          {/* Infrastructure cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'CPU Usage', value: '24%', icon: Cpu, color: 'from-indigo-500 to-violet-600', status: 'Normal' },
              { label: 'Memory', value: '2.4 GB', icon: HardDrive, color: 'from-cyan-500 to-blue-600', status: 'Normal' },
              { label: 'Storage', value: '2.4 GB', icon: Database, color: 'from-emerald-500 to-teal-600', status: 'Normal' },
              { label: 'Network', value: '12 MB/s', icon: Activity, color: 'from-amber-500 to-orange-600', status: 'Normal' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-border shadow-sm p-5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xl font-bold font-montserrat text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <span className="text-xs text-emerald-600 font-semibold">{s.status}</span>
              </motion.div>
            ))}
          </div>

          {/* System logs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">System Log Terbaru</h3>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => {
                setLoadingLogs(true);
                base44.entities.SystemLog.list('-created_date', 20)
                  .then(data => setLogs(data || []))
                  .finally(() => setLoadingLogs(false));
              }}>
                <RefreshCw className="w-3.5 h-3.5" />Refresh
              </Button>
            </div>
            {loadingLogs ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Memuat log...</div>
            ) : logs.length > 0 ? (
              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 px-6 py-3 hover:bg-secondary/20">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${log.severity === 'error' ? 'bg-rose-500' : log.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.user_email} · {log.category}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${log.severity === 'error' ? 'bg-rose-100 text-rose-700' : log.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{log.severity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Belum ada log tersimpan. Log akan muncul ketika aktivitas sistem tercatat.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}