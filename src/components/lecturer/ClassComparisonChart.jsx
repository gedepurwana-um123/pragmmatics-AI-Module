import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { base44 } from '@/api/base44Client';

const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 12px', fontSize: 12 };

/**
 * Cross-class performance comparison chart.
 * Loads all PragmaticScore records for a lecturer, groups by class, and shows
 * the average politeness & pragmatic competence per class as a grouped bar chart.
 */
export default function ClassComparisonChart({ classes = [], lecturerEmail }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const allScores = lecturerEmail
          ? await base44.entities.PragmaticScore.filter({ lecturer_email: lecturerEmail })
          : [];
        if (!active) return;
        const grouped = {};
        allScores.forEach((s) => {
          const cid = s.class_id;
          if (!cid) return;
          if (!grouped[cid]) grouped[cid] = { politeness: [], pragmatic: [] };
          grouped[cid].politeness.push(s.politeness_score || 0);
          grouped[cid].pragmatic.push(s.pragmatic_competence || 0);
        });
        const rows = classes.map((c) => {
          const g = grouped[c.id] || { politeness: [], pragmatic: [] };
          const label = c.class_name || c.class_code || 'Kelas';
          return {
            name: label.length > 14 ? label.slice(0, 13) + '…' : label,
            kesantunan: g.politeness.length ? Math.round(g.politeness.reduce((a, x) => a + x, 0) / g.politeness.length) : 0,
            pragmatik: g.pragmatic.length ? Math.round(g.pragmatic.reduce((a, x) => a + x, 0) / g.pragmatic.length) : 0,
            fullName: label,
          };
        });
        if (active) setData(rows);
      } catch {
        if (active) setData([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [classes, lecturerEmail]);

  const hasData = data.some((d) => d.kesantunan > 0 || d.pragmatik > 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-border shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 className="w-4 h-4 text-indigo-500" />
        <h3 className="font-semibold font-montserrat">Perbandingan Performa Antar Kelas</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Rata-rata kesantunan & kompetensi pragmatik mahasiswa per kelas</p>
      {loading ? (
        <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">Memuat data perbandingan…</div>
      ) : !hasData ? (
        <div className="h-64 flex items-center justify-center text-sm text-muted-foreground text-center px-4">
          Belum ada data skor. Data muncul setelah mahasiswa melakukan analisis AI &amp; latihan budaya.
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.03)' }} formatter={(v, n) => [`${v}%`, n]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="kesantunan" name="Kesantunan" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pragmatik" name="Pragmatik" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}