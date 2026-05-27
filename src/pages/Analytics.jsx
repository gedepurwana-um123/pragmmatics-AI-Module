import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, TrendingUp, MessageSquare, BookOpen, Award, Activity, Target, Flame } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';

const weeklyData = [
  { day: 'Sen', pragmatik: 65, kesantunan: 70, toxicity: 35 },
  { day: 'Sel', pragmatik: 72, kesantunan: 75, toxicity: 28 },
  { day: 'Rab', pragmatik: 68, kesantunan: 72, toxicity: 30 },
  { day: 'Kam', pragmatik: 78, kesantunan: 80, toxicity: 22 },
  { day: 'Jum', pragmatik: 82, kesantunan: 85, toxicity: 18 },
  { day: 'Sab', pragmatik: 88, kesantunan: 90, toxicity: 14 },
  { day: 'Min', pragmatik: 91, kesantunan: 92, toxicity: 10 },
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
  { label: 'Kesantunan', value: 85, color: 'from-indigo-500 to-purple-500', desc: 'Sangat Baik' },
  { label: 'Empati Digital', value: 79, color: 'from-cyan-500 to-blue-500', desc: 'Baik' },
  { label: 'Sensitivitas Konteks', value: 72, color: 'from-amber-500 to-orange-500', desc: 'Baik' },
  { label: 'Kesadaran Etika', value: 88, color: 'from-emerald-500 to-teal-500', desc: 'Sangat Baik' },
  { label: 'Kompetensi Pragmatik', value: 76, color: 'from-violet-500 to-indigo-500', desc: 'Baik' },
];

const heatmapData = [
  { day: 'Sen', h1: 3, h2: 5, h3: 2, h4: 8, h5: 4 },
  { day: 'Sel', h1: 6, h2: 4, h3: 7, h4: 3, h5: 9 },
  { day: 'Rab', h1: 2, h2: 8, h3: 5, h4: 6, h5: 3 },
  { day: 'Kam', h1: 9, h2: 3, h3: 8, h4: 4, h5: 7 },
  { day: 'Jum', h1: 5, h2: 7, h3: 4, h4: 9, h5: 6 },
];

const competencyDist = [
  { name: 'Pragmatik', value: 76, color: '#4F46E5' },
  { name: 'Kesantunan', value: 85, color: '#10B981' },
  { name: 'Empati', value: 79, color: '#06B6D4' },
  { name: 'Etika', value: 88, color: '#8B5CF6' },
];

const stats = [
  { icon: Brain, label: 'Kompetensi Pragmatik', value: '78%', sub: '+12% bulan ini', color: 'from-indigo-500 to-purple-600', trend: '+' },
  { icon: Shield, label: 'Tingkat Kesantunan', value: '85%', sub: '+18% bulan ini', color: 'from-emerald-500 to-teal-600', trend: '+' },
  { icon: MessageSquare, label: 'Interaksi AI', value: '142', sub: '42 minggu ini', color: 'from-cyan-500 to-blue-600', trend: '+' },
  { icon: TrendingUp, label: 'Penurunan Toxicity', value: '67%', sub: 'Dari 45% → 15%', color: 'from-amber-500 to-orange-600', trend: '+' },
  { icon: BookOpen, label: 'Modul Selesai', value: '8/12', sub: '67% selesai', color: 'from-pink-500 to-rose-600', trend: '' },
  { icon: Award, label: 'Pencapaian', value: '15', sub: '3 baru minggu ini', color: 'from-violet-500 to-indigo-600', trend: '+' },
  { icon: Activity, label: 'Hari Aktif', value: '24', sub: 'Bulan ini', color: 'from-sky-500 to-cyan-600', trend: '' },
  { icon: Flame, label: 'Streak Belajar', value: '7', sub: 'Hari berturut', color: 'from-orange-500 to-red-600', trend: '+' },
];

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '8px 12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

const getHeatColor = (val) => {
  if (val >= 8) return 'bg-indigo-600';
  if (val >= 6) return 'bg-indigo-400';
  if (val >= 4) return 'bg-indigo-200';
  if (val >= 2) return 'bg-indigo-100';
  return 'bg-secondary';
};

export default function Analytics() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Analitik Pembelajaran</h1>
        <p className="text-muted-foreground mt-1 text-sm">Pantau perkembangan kompetensi pragmatik, etika komunikasi, dan profil digital Anda.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl p-4 border border-border shadow-sm"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-lg font-bold font-montserrat text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Profil Pragmatik Digital Mahasiswa */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-border shadow-sm"
      >
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Profil Pragmatik Digital Mahasiswa</h3>
          <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">Profil Aktif</span>
        </div>
        <div className="grid sm:grid-cols-5 gap-4">
          {[
            { label: 'Kesantunan', value: '85%', level: 'Sangat Baik', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Empati Digital', value: '79%', level: 'Baik', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
            { label: 'Risiko Toxicity', value: 'Rendah', level: '15%', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Sensitivitas Konteks', value: 'Tinggi', level: '72%', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
            { label: 'Kesadaran Etika', value: 'Sangat Baik', level: '88%', color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200' },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
              className={`rounded-xl p-4 border text-center ${m.bg}`}
            >
              <p className={`text-xl font-bold font-montserrat ${m.color}`}>{m.value}</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">{m.label}</p>
              <p className={`text-xs ${m.color} mt-0.5`}>{m.level}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly area chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">Perkembangan Mingguan</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="anPragmatik" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="anKesantunan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="pragmatik" stroke="#4F46E5" strokeWidth={2} fill="url(#anPragmatik)" name="Pragmatik" />
                <Area type="monotone" dataKey="kesantunan" stroke="#10B981" strokeWidth={2} fill="url(#anKesantunan)" name="Kesantunan" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-3 h-1 rounded-full bg-indigo-500" />Kompetensi Pragmatik</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="w-3 h-1 rounded-full bg-emerald-500" />Tingkat Kesantunan</div>
          </div>
        </motion.div>

        {/* Radar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">Peta Kompetensi Pragmatik</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(0,0,0,0.07)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile metric bars */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-5">Detail Profil Kompetensi</h3>
          <div className="space-y-4">
            {profileMetrics.map((m, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-foreground">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">{m.desc}</span>
                    <span className="text-sm font-bold font-montserrat text-foreground">{m.value}%</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
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

        {/* Monthly bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">Progress Bulanan</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Skor Kompetensi" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 border border-border shadow-sm"
      >
        <h3 className="font-semibold text-foreground mb-4">Heatmap Aktivitas Belajar (Minggu Ini)</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            <div className="flex gap-1 items-center mb-2">
              <div className="w-12" />
              {['Pagi', 'Siang', 'Sore', 'Malam', 'Dini Hari'].map(h => (
                <div key={h} className="flex-1 text-xs text-center text-muted-foreground">{h}</div>
              ))}
            </div>
            {heatmapData.map((row, i) => (
              <div key={i} className="flex gap-1 items-center mb-1">
                <div className="w-12 text-xs text-muted-foreground text-right pr-2">{row.day}</div>
                {[row.h1, row.h2, row.h3, row.h4, row.h5].map((val, j) => (
                  <div key={j} className={`flex-1 h-8 rounded-lg ${getHeatColor(val)} transition-all`} title={`${val} sesi`} />
                ))}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-3 justify-end">
              <span className="text-xs text-muted-foreground">Kurang aktif</span>
              {['bg-secondary', 'bg-indigo-100', 'bg-indigo-200', 'bg-indigo-400', 'bg-indigo-600'].map((c, i) => (
                <div key={i} className={`w-5 h-5 rounded ${c}`} />
              ))}
              <span className="text-xs text-muted-foreground">Sangat aktif</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}