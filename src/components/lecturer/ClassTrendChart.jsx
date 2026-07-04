import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import { TrendingUp, Brain, ShieldCheck } from 'lucide-react';

/**
 * Aggregates PragmaticScore records by date and renders
 * a trend chart showing class-level politeness & pragmatic competence over time.
 */
export default function ClassTrendChart({ scores, className }) {
  const chartData = useMemo(() => {
    if (!scores || scores.length === 0) return [];

    const grouped = {};
    scores.forEach(s => {
      if (!s.date) return;
      const d = s.date.slice(0, 10); // YYYY-MM-DD
      if (!grouped[d]) {
        grouped[d] = { date: d, politeness: [], pragmatic: [], toxicity: [], cultural: [] };
      }
      if (s.politeness_score != null) grouped[d].politeness.push(s.politeness_score);
      if (s.pragmatic_competence != null) grouped[d].pragmatic.push(s.pragmatic_competence);
      if (s.toxicity_score != null) grouped[d].toxicity.push(s.toxicity_score);
      if (s.cultural_sensitivity != null) grouped[d].cultural.push(s.cultural_sensitivity);
    });

    return Object.values(grouped)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(g => ({
        date: g.date,
        label: new Date(g.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        Kesantunan: g.politeness.length ? Math.round(g.politeness.reduce((a, b) => a + b, 0) / g.politeness.length) : null,
        Pragmatik: g.pragmatic.length ? Math.round(g.pragmatic.reduce((a, b) => a + b, 0) / g.pragmatic.length) : null,
        Toksisitas: g.toxicity.length ? Math.round(g.toxicity.reduce((a, b) => a + b, 0) / g.toxicity.length) : null,
        Kultural: g.cultural.length ? Math.round(g.cultural.reduce((a, b) => a + b, 0) / g.cultural.length) : null,
      }));
  }, [scores]);

  const latest = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const prev = chartData.length > 1 ? chartData[chartData.length - 2] : null;

  const delta = (key) => {
    if (!latest || !prev || latest[key] == null || prev[key] == null) return null;
    return latest[key] - prev[key];
  };

  const politenessDelta = delta('Kesantunan');
  const pragmaticDelta = delta('Pragmatik');

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold font-montserrat text-sm">Tren Perkembangan Kelas</h2>
        </div>
        <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
          <TrendingUp className="w-8 h-8 mb-2 opacity-20" />
          <p className="text-xs">Belum ada data skor untuk ditampilkan</p>
          <p className="text-[10px] mt-1">Grafik akan muncul setelah mahasiswa memiliki skor pragmatik</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-white border border-border rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-foreground mb-1.5">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border shadow-sm p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold font-montserrat text-sm">Tren Perkembangan Kelas</h2>
            <p className="text-[10px] text-muted-foreground">
              {className ? `${className} · ` : ''}Rata-rata skor kolektif mahasiswa
            </p>
          </div>
        </div>

        {/* Delta badges */}
        <div className="flex gap-2">
          {politenessDelta != null && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold ${
              politenessDelta >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
            }`}>
              <ShieldCheck className="w-3 h-3" />
              Kesantunan {politenessDelta >= 0 ? '+' : ''}{politenessDelta}
            </div>
          )}
          {pragmaticDelta != null && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold ${
              pragmaticDelta >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
            }`}>
              <Brain className="w-3 h-3" />
              Pragmatik {pragmaticDelta >= 0 ? '+' : ''}{pragmaticDelta}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="gradPoliteness" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPragmatic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(0,0,0,0.1)' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="Kesantunan"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#gradPoliteness)"
              dot={{ r: 3, fill: '#10B981' }}
              activeDot={{ r: 5 }}
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="Pragmatik"
              stroke="#4F46E5"
              strokeWidth={2.5}
              fill="url(#gradPragmatic)"
              dot={{ r: 3, fill: '#4F46E5' }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
        {[
          { key: 'Kesantunan', color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Kesantunan', icon: ShieldCheck },
          { key: 'Pragmatik', color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Pragmatik', icon: Brain },
          { key: 'Toksisitas', color: 'text-amber-600', bg: 'bg-amber-50', label: 'Toksisitas', icon: TrendingUp },
          { key: 'Kultural', color: 'text-cyan-600', bg: 'bg-cyan-50', label: 'Kultural', icon: ShieldCheck },
        ].map((item, i) => {
          const val = latest?.[item.key];
          const Icon = item.icon;
          return (
            <div key={i} className={`${item.bg} rounded-xl p-2.5 text-center`}>
              <Icon className={`w-3.5 h-3.5 mx-auto mb-1 ${item.color}`} />
              <p className={`text-base font-bold ${item.color}`}>{val != null ? `${val}%` : '-'}</p>
              <p className="text-[9px] text-muted-foreground">{item.label}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}