import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { localUser } from '@/lib/localUser';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { BookOpen, Star, TrendingUp, CheckCircle2, Clock, Zap } from 'lucide-react';

const tooltipStyle = {
  backgroundColor: '#fff', border: '1px solid #e2e8f0',
  borderRadius: '12px', padding: '8px 12px', fontSize: '12px'
};

const TREND_DATA = [
  { bulan: 'Jan', pragmatik: 52 },
  { bulan: 'Feb', pragmatik: 58 },
  { bulan: 'Mar', pragmatik: 63 },
  { bulan: 'Apr', pragmatik: 71 },
  { bulan: 'Mei', pragmatik: 78 },
  { bulan: 'Jun', pragmatik: 85 },
];

const MODULE_SCORES = [
  { modul: 'Pragmatik Dasar', skor: 88, color: '#4F46E5' },
  { modul: 'Kesantunan', skor: 75, color: '#0891B2' },
  { modul: 'Speech Acts', skor: 82, color: '#10B981' },
  { modul: 'Implikatur', skor: 65, color: '#F59E0B' },
  { modul: 'Etika Digital', skor: 91, color: '#8B5CF6' },
];

export default function LearningProgressDashboard() {
  const [profile, setProfile] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localUser.get();
    if (!u) { setLoading(false); return; }
    Promise.all([
      base44.entities.StudentProfile.filter({ user_email: u.email }).catch(() => []),
      base44.entities.LearningProgress.filter({ user_email: u.email }).catch(() => []),
    ]).then(([profiles, progs]) => {
      if (profiles?.length > 0) setProfile(profiles[0]);
      if (progs?.length > 0) setProgress(progs);
      setLoading(false);
    });
  }, []);

  const modulesCompleted = progress.filter(p => p.status === 'selesai').length || 3;
  const avgAnnotationScore = progress.length > 0
    ? Math.round(progress.reduce((s, p) => s + (p.score || 0), 0) / progress.length)
    : 76;
  const pragmaticScore = profile?.pragmatic_competence || 78;
  const totalModules = Math.max(progress.length, 7);

  if (loading) return (
    <div className="bg-white rounded-2xl p-8 border border-border shadow-sm flex items-center justify-center">
      <div className="flex gap-2">
        {[0, 0.15, 0.3].map((d, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold font-montserrat text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />Dasbor Progres Pembelajaran
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">Ringkasan pencapaian dan tren kemahiran pragmatik Anda</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: CheckCircle2, label: 'Modul Selesai',
            value: `${modulesCompleted}/${totalModules}`,
            sub: 'modul', color: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50 border-emerald-200'
          },
          {
            icon: Star, label: 'Rata-rata Skor Anotasi',
            value: `${avgAnnotationScore}%`,
            sub: 'rata-rata', color: 'from-amber-500 to-orange-600',
            bg: 'bg-amber-50 border-amber-200'
          },
          {
            icon: Zap, label: 'Kemahiran Pragmatik',
            value: `${pragmaticScore}%`,
            sub: 'skor saat ini', color: 'from-indigo-500 to-violet-600',
            bg: 'bg-indigo-50 border-indigo-200'
          },
        ].map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`rounded-2xl border p-4 ${k.bg}`}
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center mb-3`}>
              <k.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold font-montserrat text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5 capitalize">{k.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Pragmatic Trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-5 border border-border shadow-sm"
        >
          <h3 className="text-sm font-semibold font-montserrat mb-1">Tren Kemahiran Pragmatik</h3>
          <p className="text-xs text-muted-foreground mb-4">Perkembangan skor dari waktu ke waktu</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="gPragTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="bulan" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} domain={[40, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="pragmatik" stroke="#4F46E5" fill="url(#gPragTrend)" strokeWidth={2.5} name="Pragmatik %" dot={{ fill: '#4F46E5', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3 h-3" />+33 poin sejak Jan
            </div>
            <span className="text-xs text-muted-foreground">· Tren positif konsisten</span>
          </div>
        </motion.div>

        {/* Module Score Bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-5 border border-border shadow-sm"
        >
          <h3 className="text-sm font-semibold font-montserrat mb-1">Skor Anotasi per Modul</h3>
          <p className="text-xs text-muted-foreground mb-4">Rata-rata skor analisis kasus per kategori</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MODULE_SCORES} barSize={28} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <YAxis type="category" dataKey="modul" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={72} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="skor" radius={[0, 6, 6, 0]} name="Skor %">
                  {MODULE_SCORES.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Module progress list */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="bg-white rounded-2xl p-5 border border-border shadow-sm"
      >
        <h3 className="text-sm font-semibold font-montserrat mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />Status Penyelesaian Modul
        </h3>
        <div className="space-y-3">
          {[
            { title: 'Pengantar Pragmatik Digital', progress: 100, status: 'selesai' },
            { title: 'Kesantunan dalam Media Sosial', progress: 85, status: 'selesai' },
            { title: 'Speech Acts & Konteks Komunikasi', progress: 60, status: 'aktif' },
            { title: 'Implikatur & Gricean Maxims', progress: 30, status: 'aktif' },
            { title: 'Etika Digital & Komunikasi Bermartabat', progress: 0, status: 'belum' },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                m.status === 'selesai' ? 'bg-emerald-100 text-emerald-600' :
                m.status === 'aktif' ? 'bg-indigo-100 text-indigo-600' : 'bg-secondary text-muted-foreground'
              }`}>
                {m.status === 'selesai' ? '✓' : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-medium text-foreground truncate">{m.title}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{m.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${
                    m.status === 'selesai' ? 'bg-emerald-500' :
                    m.status === 'aktif' ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-secondary'
                  }`} style={{ width: `${m.progress}%` }} />
                </div>
              </div>
              <div className={`flex-shrink-0 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                m.status === 'selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                m.status === 'aktif' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                'bg-secondary text-muted-foreground border-border'
              }`}>
                {m.status === 'selesai' ? '✓ Selesai' : m.status === 'aktif' ? '● Aktif' : <><Clock className="w-2.5 h-2.5" />Belum</>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}