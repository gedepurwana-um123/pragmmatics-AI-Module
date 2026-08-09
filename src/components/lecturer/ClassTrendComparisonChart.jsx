import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Brain, ShieldCheck, Layers, Eye, EyeOff } from 'lucide-react';

const CLASS_COLORS = [
  '#4F46E5', '#0891B2', '#10B981', '#F59E0B',
  '#EC4899', '#8B5CF6', '#EF4444', '#14B8A6',
];

const tooltipStyle = {
  backgroundColor: '#fff', border: '1px solid #e2e8f0',
  borderRadius: '12px', padding: '8px 12px', fontSize: 11,
};

/**
 * Interactive cross-class trend comparison.
 * Aggregates PragmaticScore per class per date and overlays collective
 * Kesantunan & Pragmatik trends so a lecturer can compare classes over time.
 */
export default function ClassTrendComparisonChart({ classes, lecturerEmail }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({}); // classId -> bool
  const [range, setRange] = useState(12); // last N dates

  useEffect(() => {
    if (!lecturerEmail) { setLoading(false); return; }
    setLoading(true);
    base44.entities.PragmaticScore.filter({ lecturer_email: lecturerEmail }, '-date', 500)
      .then(data => {
        setScores(data || []);
        // default: show every class that actually has scores
        const withScores = new Set((data || []).map(s => s.class_id));
        const init = {};
        (classes || []).forEach(c => { init[c.id] = withScores.has(c.id); });
        setVisible(init);
      })
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, [lecturerEmail, classes]);

  const classMap = useMemo(() => {
    const m = {};
    (classes || []).forEach((c, i) => {
      m[c.id] = { name: c.class_name || c.class_code || c.id, color: CLASS_COLORS[i % CLASS_COLORS.length] };
    });
    return m;
  }, [classes]);

  // group: classId -> dateIso -> { prag: [], poli: [] }
  const { dates, byClassDate } = useMemo(() => {
    const grouped = {};
    const dateSet = new Set();
    (scores || []).forEach(s => {
      const d = (s.date || s.created_date || '').slice(0, 10);
      if (!d) return;
      dateSet.add(d);
      if (!grouped[s.class_id]) grouped[s.class_id] = {};
      if (!grouped[s.class_id][d]) grouped[s.class_id][d] = { prag: [], poli: [] };
      grouped[s.class_id][d].prag.push(s.pragmatic_competence || 0);
      grouped[s.class_id][d].poli.push(s.politeness_score || 0);
    });
    const sortedDates = Array.from(dateSet).sort((a, b) => a.localeCompare(b));
    return { dates: sortedDates, byClassDate: grouped };
  }, [scores]);

  const visibleDates = useMemo(() => {
    const n = range === 0 ? dates.length : Math.min(range, dates.length);
    return dates.slice(-n);
  }, [dates, range]);

  const buildSeriesData = (metric) => {
    const key = metric === 'poli' ? 'poli' : 'prag';
    return visibleDates.map(d => {
      const row = { label: new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) };
      Object.keys(byClassDate).forEach(cid => {
        const bucket = byClassDate[cid]?.[d];
        if (bucket && bucket[key].length) {
          row[cid] = Math.round(bucket[key].reduce((a, b) => a + b, 0) / bucket[key].length);
        }
      });
      return row;
    });
  };

  const politenessData = useMemo(() => buildSeriesData('poli'), [visibleDates, byClassDate]);
  const pragmaticData = useMemo(() => buildSeriesData('prag'), [visibleDates, byClassDate]);

  const visibleClassIds = Object.keys(visible).filter(id => visible[id] && classMap[id]);

  const toggleClass = (id) => setVisible(prev => ({ ...prev, [id]: !prev[id] }));

  const ChartCard = ({ title, icon, color, data, metricKey }) => (
    <div className="bg-white rounded-2xl border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <h4 className="font-semibold text-sm font-montserrat">{title}</h4>
      </div>
      <div className="h-56">
        {data.length > 0 && visibleClassIds.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} iconType="circle" />
              {visibleClassIds.map(cid => (
                <Line
                  key={`${metricKey}-${cid}`}
                  type="monotone"
                  dataKey={cid}
                  name={classMap[cid]?.name}
                  stroke={classMap[cid]?.color}
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                  activeDot={{ r: 4 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <TrendingUp className="w-7 h-7 mb-2 opacity-20" />
            <p className="text-xs">Belum ada data tren untuk dibandingkan</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border shadow-sm p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Layers className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 className="font-bold font-montserrat text-sm">Perbandingan Tren Antar Kelas</h3>
            <p className="text-[10px] text-muted-foreground">
              Bandingkan rata-rata kolektif kesantunan &amp; kompetensi pragmatik mahasiswa per kelas dari waktu ke waktu
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          {[
            { v: 6, l: '6' },
            { v: 12, l: '12' },
            { v: 0, l: 'Semua' },
          ].map(opt => (
            <button key={opt.v} onClick={() => setRange(opt.v)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                range === opt.v ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >{opt.l}</button>
          ))}
        </div>
      </div>

      {/* Class toggle chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(classes || []).map(c => {
          const isOn = !!visible[c.id];
          const color = classMap[c.id]?.color;
          return (
            <button key={c.id} onClick={() => toggleClass(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                isOn ? 'bg-white border-border text-foreground shadow-sm' : 'bg-secondary/50 border-border text-muted-foreground'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: isOn ? color : '#cbd5e1' }} />
              {c.class_name || c.class_code}
              {isOn ? <Eye className="w-3 h-3 ml-0.5" /> : <EyeOff className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}
        {(classes || []).length === 0 && (
          <p className="text-xs text-muted-foreground">Belum ada kelas tersedia.</p>
        )}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          <TrendingUp className="w-5 h-5 mr-2 animate-pulse" /> Memuat data tren...
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <ChartCard
            title="Tren Kesantunan"
            color="bg-emerald-100 text-emerald-600"
            icon={<ShieldCheck className="w-4 h-4" />}
            data={politenessData}
            metricKey="poli"
          />
          <ChartCard
            title="Tren Kompetensi Pragmatik"
            color="bg-indigo-100 text-indigo-600"
            icon={<Brain className="w-4 h-4" />}
            data={pragmaticData}
            metricKey="prag"
          />
        </div>
      )}
    </motion.div>
  );
}