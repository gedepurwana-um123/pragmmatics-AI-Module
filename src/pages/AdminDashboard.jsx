import React from 'react';
import { motion } from 'framer-motion';
import { Users, Server, BookOpen, Bot, Shield, Activity, Database, Settings } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const usageData = [
  { day: 'Sen', users: 85, ai: 120, modules: 45 },
  { day: 'Sel', users: 92, ai: 145, modules: 52 },
  { day: 'Rab', users: 78, ai: 110, modules: 38 },
  { day: 'Kam', users: 105, ai: 160, modules: 65 },
  { day: 'Jum', users: 98, ai: 155, modules: 58 },
  { day: 'Sab', users: 45, ai: 60, modules: 22 },
  { day: 'Min', users: 38, ai: 48, modules: 18 },
];

const stats = [
  { icon: Users, label: 'Total Pengguna', value: '256', sub: '+12 bulan ini', color: 'from-indigo-500 to-purple-600' },
  { icon: Bot, label: 'Interaksi AI', value: '3,842', sub: '+420 minggu ini', color: 'from-cyan-500 to-blue-600' },
  { icon: BookOpen, label: 'Modul Aktif', value: '12', sub: '8 kategori', color: 'from-emerald-500 to-teal-600' },
  { icon: Server, label: 'Status Sistem', value: 'Online', sub: '99.9% uptime', color: 'from-amber-500 to-orange-600' },
  { icon: Activity, label: 'Beban Server', value: '24%', sub: 'Normal', color: 'from-pink-500 to-rose-600' },
  { icon: Database, label: 'Data Tersimpan', value: '2.4 GB', sub: '15,420 records', color: 'from-violet-500 to-indigo-600' },
];

const tooltipStyle = { backgroundColor: 'hsl(222 47% 14%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 12px' };

const recentUsers = [
  { name: 'Dr. Siti Aminah', role: 'Dosen', date: '2 jam lalu' },
  { name: 'Ahmad Fauzi', role: 'Mahasiswa', date: '3 jam lalu' },
  { name: 'Dewi Lestari', role: 'Mahasiswa', date: '5 jam lalu' },
  { name: 'Prof. Bambang', role: 'Dosen', date: '1 hari lalu' },
];

export default function AdminDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-space">Dashboard Administrator</h1>
        <p className="text-muted-foreground mt-1">Kelola sistem, pengguna, dan pemantauan platform.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-light rounded-2xl p-4"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-lg font-bold font-space">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-xs text-emerald-400 mt-1">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Usage chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-light rounded-2xl p-6"
        >
          <h3 className="font-semibold font-space mb-4">Penggunaan Platform</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="adUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="adAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="users" stroke="#4F46E5" fill="url(#adUsers)" name="Pengguna" />
                <Area type="monotone" dataKey="ai" stroke="#06B6D4" fill="url(#adAI)" name="Interaksi AI" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-light rounded-2xl p-6"
        >
          <h3 className="font-semibold font-space mb-4">Pengguna Aktif Terbaru</h3>
          <div className="space-y-3">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{u.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.role}</p>
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