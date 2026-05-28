import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { FileDown, BarChart3, Brain, TrendingUp, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function AdminResearchCenter() {
  const [scores, setScores] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.PragmaticScore.list('-date', 500).catch(() => []),
      base44.entities.LearningAnalytics.list('-date', 500).catch(() => []),
    ]).then(([s, a]) => { setScores(s); setAnalytics(a); setLoading(false); });
  }, []);

  const avg = (arr, key) => {
    const f = arr.filter(x => x[key] != null && x[key] > 0);
    return f.length ? (f.reduce((a, x) => a + x[key], 0) / f.length).toFixed(1) : '0';
  };

  // Group by month for longitudinal
  const byMonth = {};
  scores.forEach(s => {
    if (!s.date) return;
    const key = s.date.slice(0, 7);
    if (!byMonth[key]) byMonth[key] = { pragmatic: [], politeness: [], empathy: [], cultural: [], ethical: [] };
    if (s.pragmatic_competence) byMonth[key].pragmatic.push(s.pragmatic_competence);
    if (s.politeness_score) byMonth[key].politeness.push(s.politeness_score);
    if (s.empathy_score) byMonth[key].empathy.push(s.empathy_score);
    if (s.cultural_sensitivity) byMonth[key].cultural.push(s.cultural_sensitivity);
    if (s.ethical_awareness) byMonth[key].ethical.push(s.ethical_awareness);
  });

  const a = (arr) => arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;
  const longitudinal = Object.entries(byMonth).sort(([x], [y]) => x.localeCompare(y)).map(([m, v]) => ({
    bulan: new Date(m + '-01').toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
    pragmatik: a(v.pragmatic), kesantunan: a(v.politeness), empati: a(v.empathy),
    kultural: a(v.cultural), etika: a(v.ethical),
  }));

  const exportCSV = () => {
    const rows = [['email', 'class_id', 'date', 'pragmatic_competence', 'politeness_score', 'toxicity_score', 'empathy_score', 'cultural_sensitivity', 'ethical_awareness', 'emotional_control']];
    scores.forEach(s => rows.push([s.student_email, s.class_id, s.date, s.pragmatic_competence, s.politeness_score, s.toxicity_score, s.empathy_score, s.cultural_sensitivity, s.ethical_awareness, s.emotional_control]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pragmatics_research_data.csv'; a.click();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ scores, analytics }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pragmatics_research_data.json'; a.click();
  };

  const ts = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '11px' };

  const summaryStats = [
    { label: 'Total Data Skor', value: scores.length, icon: Database, color: 'from-indigo-500 to-violet-600' },
    { label: 'Rata-rata Pragmatik', value: `${avg(scores, 'pragmatic_competence')}%`, icon: Brain, color: 'from-cyan-500 to-blue-600' },
    { label: 'Rata-rata Kesantunan', value: `${avg(scores, 'politeness_score')}%`, icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
    { label: 'Rata-rata Empati', value: `${avg(scores, 'empathy_score')}%`, icon: BarChart3, color: 'from-violet-500 to-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold font-montserrat text-violet-900">Research Analytics & Publication Center</h2>
              <p className="text-xs text-violet-600">Export dataset, longitudinal analytics, dan laporan penelitian pragmatik digital</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={exportCSV} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
              <FileDown className="w-3.5 h-3.5" />Export CSV (SPSS-ready)
            </Button>
            <Button size="sm" onClick={exportJSON} variant="outline" className="gap-1.5 text-xs border-violet-200 text-violet-700">
              <FileDown className="w-3.5 h-3.5" />Export JSON
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold font-montserrat">{loading ? '...' : s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Longitudinal Chart */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
        <h3 className="font-semibold font-montserrat text-sm mb-1">Analisis Longitudinal — Semua Dimensi Kompetensi</h3>
        <p className="text-xs text-muted-foreground mb-4">Tren bulanan seluruh dimensi pragmatik seluruh mahasiswa</p>
        <div className="h-64">
          {longitudinal.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={longitudinal}>
                <defs>
                  {[['gPr', '#4F46E5'], ['gKe', '#10B981'], ['gEm', '#06B6D4'], ['gKu', '#8B5CF6'], ['gEt', '#F59E0B']].map(([id, c]) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.15} /><stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="bulan" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={ts} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="pragmatik" stroke="#4F46E5" fill="url(#gPr)" strokeWidth={1.5} name="Pragmatik" />
                <Area type="monotone" dataKey="kesantunan" stroke="#10B981" fill="url(#gKe)" strokeWidth={1.5} name="Kesantunan" />
                <Area type="monotone" dataKey="empati" stroke="#06B6D4" fill="url(#gEm)" strokeWidth={1.5} name="Empati" />
                <Area type="monotone" dataKey="kultural" stroke="#8B5CF6" fill="url(#gKu)" strokeWidth={1.5} name="Kultural" />
                <Area type="monotone" dataKey="etika" stroke="#F59E0B" fill="url(#gEt)" strokeWidth={1.5} name="Etika" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              {loading ? 'Memuat data penelitian...' : 'Belum ada data longitudinal'}
            </div>
          )}
        </div>
      </div>

      {/* TKT Implementation Monitor */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
        <h3 className="font-semibold font-montserrat text-sm mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-500" />Monitor Implementasi TKT-6
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Validasi Konsep AI Pragmatik', status: 'Tercapai', tkt: 'TKT-3', color: 'emerald' },
            { label: 'Prototype Platform Digital', status: 'Tercapai', tkt: 'TKT-4', color: 'emerald' },
            { label: 'Validasi Lingkungan Terkontrol', status: 'Tercapai', tkt: 'TKT-5', color: 'emerald' },
            { label: 'Demonstrasi Lingkungan Relevan', status: 'Berjalan', tkt: 'TKT-6', color: 'indigo' },
            { label: 'Sistem Prototipe Penuh', status: 'Direncanakan', tkt: 'TKT-7', color: 'amber' },
            { label: 'Deployment Institusional', status: 'Direncanakan', tkt: 'TKT-8+', color: 'slate' },
          ].map((t, i) => (
            <div key={i} className={`p-3 rounded-xl border bg-${t.color}-50 border-${t.color}-200`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold text-${t.color}-700 bg-${t.color}-100 px-2 py-0.5 rounded-full`}>{t.tkt}</span>
                <span className={`text-[10px] text-${t.color}-600`}>{t.status}</span>
              </div>
              <p className={`text-xs font-medium text-${t.color}-800`}>{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}