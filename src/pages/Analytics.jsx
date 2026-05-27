import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, TrendingUp, MessageSquare, BookOpen, Award, Users, Zap } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const weeklyData = [
  { day: 'Sen', pragmatik: 65, kesantunan: 70, interaksi: 5 },
  { day: 'Sel', pragmatik: 72, kesantunan: 75, interaksi: 8 },
  { day: 'Rab', pragmatik: 68, kesantunan: 72, interaksi: 6 },
  { day: 'Kam', pragmatik: 78, kesantunan: 80, interaksi: 12 },
  { day: 'Jum', pragmatik: 82, kesantunan: 85, interaksi: 9 },
  { day: 'Sab', pragmatik: 88, kesantunan: 90, interaksi: 15 },
  { day: 'Min', pragmatik: 91, kesantunan: 92, interaksi: 11 },
];

const radarData = [
  { subject: 'Kesantunan', A: 85 },
  { subject: 'Empati Digital', A: 79 },
  { subject: 'Sensitivitas Konteks', A: 72 },
  { subject: 'Kesadaran Etika', A: 88 },
  { subject: 'Kompetensi Pragmatik', A: 76 },
  { subject: 'Aktivitas Refleksi', A: 82 },
];

const monthlyProgress = [
  { month: 'Jan', value: 35 }, { month: 'Feb', value: 42 }, { month: 'Mar', value: 55 },
  { month: 'Apr', value: 62 }, { month: 'Mei', value: 71 }, { month: 'Jun', value: 78 },
];

const profileMetrics = [
  { label: 'Kesantunan', value: 85, color: 'from-indigo-500 to-purple-500' },
  { label: 'Empati Digital', value: 79, color: 'from-cyan-500 to-blue-500' },
  { label: 'Risiko Toxicity', value: 18, color: 'from-emerald-500 to-teal-500', inverse: true },
  { label: 'Sensitivitas Konteks', value: 72, color: 'from-amber-500 to-orange-500' },
  { label: 'Kesadaran Etika', value: 88, color: 'from-violet-500 to-indigo-500' },
];

const stats = [
  { icon: Brain, label: 'Kompetensi Pragmatik', value: '78%', sub: '+12% bulan ini', color: 'from-indigo-500 to-purple-600' },
  { icon: Shield, label: 'Tingkat Kesantunan', value: '85%', sub: '+18% bulan ini', color: 'from-emerald-500 to-teal-600' },
  { icon: MessageSquare, label: 'Interaksi AI', value: '142', sub: '42 minggu ini', color: 'from-cyan-500 to-blue-600' },
  { icon: TrendingUp, label: 'Penurunan Toxicity', value: '67%', sub: 'Dari 45% ke 15%', color: 'from-amber-500 to-orange-600' },
  { icon: BookOpen, label: 'Modul Selesai', value: '8/12', sub: '67% selesai', color: 'from-pink-500 to-rose-600' },
  { icon: Award, label: 'Pencapaian', value: '15', sub: '3 baru minggu ini', color: 'from-violet-500 to-indigo-600' },
];

const customTooltipStyle = {
  backgroundColor: 'hsl(222 47% 14%)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  padding: '8px 12px',
};

export default function Analytics() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-space">Dashboard Analitik Pembelajaran</h1>
        <p className="text-muted-foreground mt-1">Pantau perkembangan kompetensi pragmatik dan etika komunikasi Anda.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-light rounded-2xl p-4"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold font-space">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            <p className="text-xs text-emerald-400 mt-1">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-light rounded-2xl p-6"
        >
          <h3 className="font-semibold font-space mb-4">Perkembangan Mingguan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="anPragmatik" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="anKesantunan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Area type="monotone" dataKey="pragmatik" stroke="#4F46E5" strokeWidth={2} fill="url(#anPragmatik)" name="Pragmatik" />
                <Area type="monotone" dataKey="kesantunan" stroke="#06B6D4" strokeWidth={2} fill="url(#anKesantunan)" name="Kesantunan" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-3 justify-center">
            <div className="flex items-center gap-2 text-xs"><div className="w-3 h-1 rounded-full bg-indigo-500" />Pragmatik</div>
            <div className="flex items-center gap-2 text-xs"><div className="w-3 h-1 rounded-full bg-cyan-500" />Kesantunan</div>
          </div>
        </motion.div>

        {/* Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-light rounded-2xl p-6"
        >
          <h3 className="font-semibold font-space mb-4">Profil Pragmatik Digital</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <Radar dataKey="A" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-light rounded-2xl p-6"
        >
          <h3 className="font-semibold font-space mb-4">Detail Profil Kompetensi</h3>
          <div className="space-y-4">
            {profileMetrics.map((m, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-semibold">{m.inverse ? `${m.value}% (Rendah)` : `${m.value}%`}</span>
                </div>
                <div className="w-full h-2.5 bg-background/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${m.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full bg-gradient-to-r ${m.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Monthly bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-light rounded-2xl p-6"
        >
          <h3 className="font-semibold font-space mb-4">Progress Bulanan</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} name="Skor" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}