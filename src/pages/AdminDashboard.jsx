import React from 'react';
import { motion } from 'framer-motion';
import { Users, Server, BookOpen, Bot, Shield, Activity, Database, CheckCircle2, AlertCircle, HardDrive } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

const usageData = [
  { day: 'Sen', users: 85, ai: 120, modules: 45 },
  { day: 'Sel', users: 92, ai: 145, modules: 52 },
  { day: 'Rab', users: 78, ai: 110, modules: 38 },
  { day: 'Kam', users: 105, ai: 160, modules: 65 },
  { day: 'Jum', users: 98, ai: 155, modules: 58 },
  { day: 'Sab', users: 45, ai: 60, modules: 22 },
  { day: 'Min', users: 38, ai: 48, modules: 18 },
];

const moduleActivity = [
  { name: 'Pragmatik Dasar', views: 450 },
  { name: 'Kesantunan', views: 380 },
  { name: 'Toxicity', views: 320 },
  { name: 'Speech Acts', views: 290 },
  { name: 'Implikatur', views: 240 },
  { name: 'Etika Digital', views: 210 },
];

const userDist = [
  { name: 'Mahasiswa', value: 210, color: '#4F46E5' },
  { name: 'Dosen', value: 38, color: '#10B981' },
  { name: 'Admin', value: 8, color: '#F59E0B' },
];

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '8px 12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

const stats = [
  { icon: Users, label: 'Total Pengguna', value: '256', sub: '+12 bulan ini', color: 'from-indigo-500 to-purple-600' },
  { icon: Bot, label: 'Interaksi AI', value: '3,842', sub: '+420 minggu ini', color: 'from-cyan-500 to-blue-600' },
  { icon: BookOpen, label: 'Modul Aktif', value: '12', sub: '8 kategori', color: 'from-emerald-500 to-teal-600' },
  { icon: Server, label: 'Status Sistem', value: '99.9%', sub: 'Uptime', color: 'from-amber-500 to-orange-600' },
  { icon: Activity, label: 'Beban Server', value: '24%', sub: 'Normal', color: 'from-pink-500 to-rose-600' },
  { icon: Database, label: 'Data Tersimpan', value: '2.4 GB', sub: '15,420 records', color: 'from-violet-500 to-indigo-600' },
];

const systemStatus = [
  { name: 'AI Engine', status: 'online', latency: '142ms' },
  { name: 'Database', status: 'online', latency: '8ms' },
  { name: 'File Storage', status: 'online', latency: '22ms' },
  { name: 'Auth Service', status: 'online', latency: '15ms' },
];

const recentUsers = [
  { name: 'Dr. Siti Aminah', role: 'Dosen', date: '2 jam lalu', action: 'Login' },
  { name: 'Ahmad Fauzi', role: 'Mahasiswa', date: '3 jam lalu', action: 'Analisis AI' },
  { name: 'Dewi Lestari', role: 'Mahasiswa', date: '5 jam lalu', action: 'Jurnal' },
  { name: 'Prof. Bambang', role: 'Dosen', date: '1 hari lalu', action: 'Dashboard' },
  { name: 'Budi Santoso', role: 'Mahasiswa', date: '1 hari lalu', action: 'Modul' },
];

export default function AdminDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Administrator</h1>
        <p className="text-muted-foreground mt-1 text-sm">Kelola sistem, pengguna, konten, dan pemantauan platform PragmaticsAI.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-border shadow-sm"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-lg font-bold font-montserrat text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Usage chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">Penggunaan Platform (7 Hari)</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="adUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="adAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="users" stroke="#4F46E5" fill="url(#adUsers)" name="Pengguna Aktif" strokeWidth={2} />
                <Area type="monotone" dataKey="ai" stroke="#06B6D4" fill="url(#adAI)" name="Interaksi AI" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* System status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">Status Sistem</h3>
          <div className="space-y-3 mb-5">
            {systemStatus.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-600 font-semibold">Online</p>
                  <p className="text-xs text-muted-foreground">{s.latency}</p>
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-foreground text-sm mb-3">Distribusi Pengguna</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={userDist} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={52}>
                  {userDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-3 justify-center mt-1">
            {userDist.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Module activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">Aktivitas Modul</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleActivity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="views" fill="#4F46E5" radius={[0, 6, 6, 0]} name="Jumlah Akses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">Aktivitas Pengguna Terbaru</h3>
          <div className="space-y-3">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{u.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.role} · {u.action}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{u.date}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}