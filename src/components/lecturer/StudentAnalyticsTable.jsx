import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function StudentAnalyticsTable({ enrollments }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('pragmatic');

  const filtered = enrollments
    .filter(e => e.student_email?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'pragmatic') return (b.final_pragmatic_score || 0) - (a.final_pragmatic_score || 0);
      if (sortBy === 'politeness') return (b.final_politeness_score || 0) - (a.final_politeness_score || 0);
      if (sortBy === 'interactions') return (b.total_ai_interactions || 0) - (a.total_ai_interactions || 0);
      return 0;
    });

  const getScoreColor = (score, inverse = false) => {
    if (!score) return 'text-muted-foreground';
    if (inverse) {
      if (score < 20) return 'text-emerald-600';
      if (score < 40) return 'text-amber-600';
      return 'text-rose-600';
    }
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getTrend = (score) => {
    if (!score) return <Minus className="w-3 h-3 text-muted-foreground" />;
    if (score >= 75) return <TrendingUp className="w-3 h-3 text-emerald-500" />;
    return <TrendingDown className="w-3 h-3 text-rose-500" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border flex flex-wrap gap-3 items-center justify-between">
        <h3 className="font-semibold font-montserrat">Data Analitik Mahasiswa</h3>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari mahasiswa..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-52" />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-input rounded-lg px-3 py-2 text-sm">
            <option value="pragmatic">Urut: Pragmatik</option>
            <option value="politeness">Urut: Kesantunan</option>
            <option value="interactions">Urut: Interaksi AI</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">#</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Mahasiswa</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Pragmatik</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Kesantunan</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Toxicity</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Interaksi AI</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Refleksi</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Selesai</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-10 text-muted-foreground text-sm">Belum ada data mahasiswa</td></tr>
            ) : (
              filtered.map((enr, i) => (
                <tr key={enr.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{i + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {enr.student_email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{enr.student_email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getTrend(enr.final_pragmatic_score)}
                      <span className={`text-sm font-semibold ${getScoreColor(enr.final_pragmatic_score)}`}>
                        {enr.final_pragmatic_score || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-sm font-semibold ${getScoreColor(enr.final_politeness_score)}`}>
                      {enr.final_politeness_score || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-sm font-semibold ${getScoreColor(enr.final_toxicity_score, true)}`}>
                      {enr.final_toxicity_score || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-sm">{enr.total_ai_interactions || 0}</td>
                  <td className="px-4 py-3.5 text-center text-sm">{enr.total_reflections || 0}</td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${enr.completion_percentage || 0}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{enr.completion_percentage || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${enr.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
                      {enr.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}