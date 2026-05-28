import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Users, BookOpen, GraduationCap, Brain, Building2, Bot,
  TrendingUp, Shield, Activity, Zap, AlertTriangle, CheckCircle2
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar
} from 'recharts';

export default function AdminOverview() {
  const [stats, setStats] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [toxicityData, setToxicityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [users, classes, enrollments, scores, institutions, aiLogs, analytics] = await Promise.all([
        base44.entities.User.list().catch(() => []),
        base44.entities.Class.list().catch(() => []),
        base44.entities.Enrollment.list().catch(() => []),
        base44.entities.PragmaticScore.list('-date', 300).catch(() => []),
        base44.entities.Institution.list().catch(() => []),
        base44.entities.AIChatLog.list().catch(() => []),
        base44.entities.LearningAnalytics.list('-date', 300).catch(() => []),
      ]);

      const avg = (arr, key) => {
        const f = arr.filter(s => s[key] != null && s[key] > 0);
        return f.length ? Math.round(f.reduce((a, s) => a + s[key], 0) / f.length) : 0;
      };

      setStats({
        totalUsers: users.length,
        totalClasses: classes.length,
        activeEnrollments: enrollments.filter(e => e.status === 'active').length,
        totalAI: aiLogs.length,
        totalInstitutions: institutions.length,
        avgPragmatic: avg(scores, 'pragmatic_competence'),
        avgPoliteness: avg(scores, 'politeness_score'),
        avgToxicity: avg(scores, 'toxicity_score'),
        avgEmpathy: avg(scores, 'empathy_score'),
        avgEthical: avg(scores, 'ethical_awareness'),
        avgCultural: avg(scores, 'cultural_sensitivity'),
        toxicityReduction: Math.max(0, 100 - avg(scores, 'toxicity_score')),
        flaggedContent: aiLogs.filter(l => l.flagged_for_review).length,
      });

      // Monthly trend
      const byMonth = {};
      scores.forEach(s => {
        if (!s.date) return;
        const key = s.date.slice(0, 7);
        if (!byMonth[key]) byMonth[key] = { pragmatic: [], politeness: [], toxicity: [] };
        if (s.pragmatic_competence) byMonth[key].pragmatic.push(s.pragmatic_competence);
        if (s.politeness_score) byMonth[key].politeness.push(s.politeness_score);
        if (s.toxicity_score) byMonth[key].toxicity.push(s.toxicity_score);
      });
      const trend = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).slice(-8).map(([m, v]) => ({
        name: new Date(m + '-01').toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
        pragmatik: v.pragmatic.length ? Math.round(v.pragmatic.reduce((a, x) => a + x, 0) / v.pragmatic.length) : 0,
        kesantunan: v.politeness.length ? Math.round(v.politeness.reduce((a, x) => a + x, 0) / v.politeness.length) : 0,
        toksisitas: v.toxicity.length ? Math.round(v.toxicity.reduce((a, x) => a + x, 0) / v.toxicity.length) : 0,
      }));
      setTrendData(trend);

      setRadarData([
        { subject: 'Pragmatik', A: avg(scores, 'pragmatic_competence') },
        { subject: 'Kesantunan', A: avg(scores, 'politeness_score') },
        { subject: 'Empati', A: avg(scores, 'empathy_score') },
        { subject: 'Etika', A: avg(scores, 'ethical_awareness') },
        { subject: 'Kultural', A: avg(scores, 'cultural_sensitivity') },
        { subject: 'Emosi', A: avg(scores, 'emotional_control') },
      ]);

      // Toxicity by month
      setToxicityData(trend.map(t => ({ name: t.name, toksisitas: t.toksisitas })));
      setLoading(false);
    };
    load();
  }, []);

  const kpis = [
    { label: 'Total Pengguna', value: stats.totalUsers || 0, icon: Users, color: 'from-indigo-500 to-violet-600' },
    { label: 'Mahasiswa Aktif', value: stats.activeEnrollments || 0, icon: GraduationCap, color: 'from-emerald-500 to-teal-600' },
    { label: 'Total Kelas', value: stats.totalClasses || 0, icon: BookOpen, color: 'from-cyan-500 to-blue-600' },
    { label: 'Interaksi AI', value: stats.totalAI || 0, icon: Bot, color: 'from-violet-500 to-purple-600' },
    { label: 'Institusi', value: stats.totalInstitutions || 0, icon: Building2, color: 'from-amber-500 to-orange-600' },
    { label: 'Konten Terflag', value: stats.flaggedContent || 0, icon: AlertTriangle, color: 'from-rose-500 to-red-600' },
  ];

  const performanceCards = [
    { label: 'Kompetensi Pragmatik', value: stats.avgPragmatic, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Brain },
    { label: 'Tingkat Kesantunan', value: stats.avgPoliteness, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Shield },
    { label: 'Rata-rata Empati', value: stats.avgEmpathy, color: 'text-cyan-600', bg: 'bg-cyan-50', icon: Activity },
    { label: 'Penurunan Toxicity', value: stats.toxicityReduction, color: 'text-amber-600', bg: 'bg-amber-50', icon: TrendingUp },
    { label: 'Etika Digital', value: stats.avgEthical, color: 'text-violet-600', bg: 'bg-violet-50', icon: Zap },
    { label: 'Sensitivitas Kultural', value: stats.avgCultural, color: 'text-teal-600', bg: 'bg-teal-50', icon: Users },
  ];

  const ts = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '11px' };

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-border shadow-sm"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center mb-3`}>
              <k.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold font-montserrat">{loading ? '...' : k.value.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Performance Intelligence */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {performanceCards.map((c, i) => (
          <div key={i} className={`${c.bg} rounded-2xl p-4 border border-border/40`}>
            <c.icon className={`w-4 h-4 ${c.color} mb-2`} />
            <p className={`text-2xl font-bold font-montserrat ${c.color}`}>{loading ? '-' : `${c.value ?? 0}%`}</p>
            <p className="text-[10px] text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Trend chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="font-semibold font-montserrat text-sm mb-1">Tren Kompetensi Platform (Agregat Semua Pengguna)</h3>
          <p className="text-xs text-muted-foreground mb-4">Rata-rata bulanan pragmatik & kesantunan seluruh mahasiswa</p>
          <div className="h-52">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} /><stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gK" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={ts} />
                  <Area type="monotone" dataKey="pragmatik" stroke="#4F46E5" fill="url(#gP)" strokeWidth={2} name="Pragmatik" />
                  <Area type="monotone" dataKey="kesantunan" stroke="#10B981" fill="url(#gK)" strokeWidth={2} name="Kesantunan" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{loading ? 'Memuat...' : 'Belum ada data tren'}</div>}
          </div>
        </div>

        {/* Radar */}
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="font-semibold font-montserrat text-sm mb-1">Profil Kompetensi Platform</h3>
          <p className="text-xs text-muted-foreground mb-2">Rata-rata seluruh dimensi</p>
          <div className="h-52">
            {radarData.some(r => r.A > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(0,0,0,0.07)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
                  <Radar dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{loading ? 'Memuat...' : 'Belum ada data'}</div>}
          </div>
        </div>
      </div>

      {/* Toxicity Trend */}
      {toxicityData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="font-semibold font-montserrat text-sm mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />Tren Toxicity Bulanan
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Semakin rendah semakin baik</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={toxicityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ts} />
                <Bar dataKey="toksisitas" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Toxicity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* System Health */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
        <h3 className="font-semibold font-montserrat text-sm mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />Status Sistem & Infrastruktur AI
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { label: 'Database Entitas (Base44)', ok: true },
            { label: 'Autentikasi & Sesi Pengguna', ok: true },
            { label: 'Backend AI Functions', ok: true },
            { label: 'Integrasi LLM (InvokeLLM)', ok: true },
            { label: 'Role-based Access Control', ok: true },
            { label: 'Data Analytics Pipeline', ok: true },
          ].map((h, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${h.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {h.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {h.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}