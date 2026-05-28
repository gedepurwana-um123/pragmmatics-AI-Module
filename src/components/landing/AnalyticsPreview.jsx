import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Users, Brain, Shield, BookOpen, MessageSquare, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AnalyticsPreview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scores, analytics] = await Promise.all([
          base44.entities.PragmaticScore.list('-date', 200).catch(() => []),
          base44.entities.LearningAnalytics.list('-date', 200).catch(() => []),
        ]);

        // Compute aggregate stats from all users' scores
        const withData = scores.filter(s => s.pragmatic_competence != null);
        const avgPragmatic = withData.length
          ? Math.round(withData.reduce((a, s) => a + (s.pragmatic_competence || 0), 0) / withData.length)
          : null;

        const withPoliteness = scores.filter(s => s.politeness_score != null);
        const avgPoliteness = withPoliteness.length
          ? Math.round(withPoliteness.reduce((a, s) => a + (s.politeness_score || 0), 0) / withPoliteness.length)
          : null;

        const withToxicity = scores.filter(s => s.toxicity_score != null);
        const avgToxicity = withToxicity.length
          ? Math.round(withToxicity.reduce((a, s) => a + (s.toxicity_score || 0), 0) / withToxicity.length)
          : null;
        // Penurunan toxicity = 100 - avg toxicity (lower is better)
        const toxicityReduction = avgToxicity != null ? Math.max(0, 100 - avgToxicity) : null;

        // Engagement: avg engagement from LearningAnalytics
        const withEngagement = analytics.filter(a => a.engagement_score != null);
        const avgEngagement = withEngagement.length
          ? Math.round(withEngagement.reduce((a, s) => a + (s.engagement_score || 0), 0) / withEngagement.length)
          : null;

        setStats({
          pragmatic: avgPragmatic,
          politeness: avgPoliteness,
          engagement: avgEngagement,
          toxicityReduction,
        });

        // Build monthly trend: group scores by month, avg pragmatic_competence
        const byMonth = {};
        scores.forEach(s => {
          if (!s.date || !s.pragmatic_competence) return;
          const key = s.date.slice(0, 7); // YYYY-MM
          if (!byMonth[key]) byMonth[key] = [];
          byMonth[key].push(s.pragmatic_competence);
        });
        const trend = Object.entries(byMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-8)
          .map(([month, vals]) => ({
            name: new Date(month + '-01').toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
            value: Math.round(vals.reduce((a, v) => a + v, 0) / vals.length),
          }));
        setTrendData(trend);

        // Radar: avg per dimension from latest scores
        const avg = (arr, key) => {
          const f = arr.filter(s => s[key] != null);
          return f.length ? Math.round(f.reduce((a, s) => a + s[key], 0) / f.length) : 0;
        };
        setRadarData([
          { subject: 'Kesantunan', A: avg(scores, 'politeness_score') },
          { subject: 'Empati', A: avg(scores, 'empathy_score') },
          { subject: 'Etika', A: avg(scores, 'ethical_awareness') },
          { subject: 'Kultural', A: avg(scores, 'cultural_sensitivity') },
          { subject: 'Pragmatik', A: avg(scores, 'pragmatic_competence') },
          { subject: 'Emosi', A: avg(scores, 'emotional_control') },
        ]);
      } catch {
        // fallback: leave null
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const fmt = (v) => v != null ? `${v}%` : '-';

  const statItems = [
    { icon: Brain, label: 'Kompetensi Pragmatik', value: fmt(stats?.pragmatic), color: 'text-indigo-400' },
    { icon: Shield, label: 'Tingkat Kesantunan', value: fmt(stats?.politeness), color: 'text-emerald-400' },
    { icon: Users, label: 'Keterlibatan', value: fmt(stats?.engagement), color: 'text-cyan-400' },
    { icon: TrendingUp, label: 'Penurunan Toxicity', value: fmt(stats?.toxicityReduction), color: 'text-amber-400' },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-wider">Analitik Pembelajaran</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-montserrat mt-3 mb-4">
            Dashboard <span className="text-gradient">Analitik Cerdas</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Data real-time dari seluruh pengguna platform — pantau kompetensi pragmatik, kesantunan, keterlibatan, dan penurunan toxicity secara agregat.
          </p>
          {!loading && (
            <p className="text-xs text-muted-foreground/60 mt-2">* Diperbarui real-time dari basis data platform</p>
          )}
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statItems.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-light rounded-2xl p-5"
            >
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mb-1" />
              ) : (
                <p className="text-2xl font-bold font-montserrat">{s.value}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              {!loading && s.value !== '-' && (
                <span className="text-xs text-emerald-500 font-medium">↑ Rata-rata seluruh pengguna</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-light rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="font-semibold font-montserrat text-sm">Tren Kompetensi Pragmatik</h3>
              </div>
              {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>
            <div className="h-48">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v) => [`${v}%`, 'Kompetensi']} />
                    <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} fill="url(#colorProgress)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  {loading ? 'Memuat data...' : 'Belum ada data tren'}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-light rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                <h3 className="font-semibold font-montserrat text-sm">Profil Pragmatik Digital</h3>
              </div>
              {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>
            <div className="h-48">
              {radarData.some(r => r.A > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(0,0,0,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Radar name="Rata-rata" dataKey="A" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  {loading ? 'Memuat data...' : 'Belum ada data profil'}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}