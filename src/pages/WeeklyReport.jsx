import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  BarChart3, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle,
  RefreshCw, Mail, Clock, Target, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WeeklyReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setCurrentUser(u);
      if (u) loadReports(u.email);
    }).catch(() => {});
  }, []);

  const loadReports = async (email) => {
    setLoading(true);
    const data = await base44.entities.WeeklyReport.filter({ user_email: email }, '-week_start', 12).catch(() => []);
    setReports(data || []);
    setLoading(false);
  };

  const requestReport = async () => {
    if (!currentUser) return;
    setSending(true);
    await base44.functions.invoke('sendWeeklyReport', { user_email: currentUser.email }).catch(() => {});
    await loadReports(currentUser.email);
    setSending(false);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-teal-500" />
          <span className="text-xs font-semibold text-teal-600">Weekly Progress Report · AI Summary · Email + Dashboard</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Laporan Progress Mingguan</h1>
            <p className="text-muted-foreground mt-1 text-sm">Ringkasan otomatis pencapaian, skor etika, dan rekomendasi yang dikirim tiap minggu via dashboard & email.</p>
          </div>
          <Button onClick={requestReport} disabled={sending}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl gap-2">
            {sending ? <><RefreshCw className="w-4 h-4 animate-spin" />Membuat Laporan...</> : <><Sparkles className="w-4 h-4" />Buat Laporan Sekarang</>}
          </Button>
        </div>
      </motion.div>

      {/* Info card */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-4 flex items-start gap-3">
        <Mail className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-teal-800">Laporan Otomatis Setiap Senin Pagi</p>
          <p className="text-xs text-teal-700 mt-0.5">Sistem AI menganalisis seluruh aktivitas belajarmu setiap minggu dan mengirimkan ringkasan komprehensif ke email dan dashboard ini. Kamu juga bisa membuatnya manual kapan saja.</p>
        </div>
      </div>

      {/* Reports list */}
      {loading ? (
        <div className="flex items-center gap-2 justify-center py-12 text-muted-foreground text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />Memuat laporan...
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-border p-14 text-center">
          <BarChart3 className="w-14 h-14 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-semibold text-foreground mb-1">Belum Ada Laporan</p>
          <p className="text-sm text-muted-foreground mb-4">Laporan pertamamu akan muncul di sini setelah dibuat.</p>
          <Button onClick={requestReport} disabled={sending}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl gap-2">
            <Sparkles className="w-4 h-4" />Buat Laporan Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r, i) => (
            <motion.div key={r.id || i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground font-medium">
                        {formatDate(r.week_start)} — {r.week_end ? formatDate(r.week_end) : ''}
                      </p>
                      {r.is_sent && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" />Terkirim
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{r.ai_summary}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.score_delta !== undefined && (
                      <span className={`text-sm font-bold flex items-center gap-1 ${r.score_delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {r.score_delta >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {r.score_delta >= 0 ? '+' : ''}{r.score_delta} poin
                      </span>
                    )}
                    <button onClick={() => setExpanded(expanded === i ? null : i)}
                      className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      {expanded === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick scores */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4">
                  {[
                    { label: 'Pragmatik', val: r.pragmatic_score, color: 'text-indigo-600' },
                    { label: 'Kesantunan', val: r.politeness_score, color: 'text-emerald-600' },
                    { label: 'Toxicity', val: r.toxicity_score, color: 'text-rose-600' },
                    { label: 'Kultural', val: r.cultural_sensitivity, color: 'text-violet-600' },
                    { label: 'Etika', val: r.ethical_awareness, color: 'text-amber-600' },
                  ].map((s, j) => (
                    <div key={j} className={`rounded-xl p-2.5 text-center border ${s.val >= 80 ? 'bg-emerald-50 border-emerald-200' : s.val >= 60 ? 'bg-blue-50 border-blue-200' : 'bg-rose-50 border-rose-200'}`}>
                      <p className={`text-base font-bold font-montserrat ${s.color}`}>{s.val || '--'}{s.val ? '%' : ''}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded details */}
              {expanded === i && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-t border-border/60 p-5 bg-secondary/20 grid sm:grid-cols-3 gap-4"
                >
                  {/* Achievements */}
                  {r.achievements?.length > 0 && (
                    <div className="bg-white rounded-xl border border-emerald-200 p-4">
                      <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Pencapaian</p>
                      {r.achievements.map((a, j) => <p key={j} className="text-xs text-foreground mb-1">✓ {a}</p>)}
                    </div>
                  )}
                  {/* Weak areas */}
                  {r.weak_areas?.length > 0 && (
                    <div className="bg-white rounded-xl border border-amber-200 p-4">
                      <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />Perlu Perhatian</p>
                      {r.weak_areas.map((a, j) => <p key={j} className="text-xs text-foreground mb-1">⚠ {a}</p>)}
                    </div>
                  )}
                  {/* Recommendations */}
                  {r.recommendations?.length > 0 && (
                    <div className="bg-white rounded-xl border border-indigo-200 p-4">
                      <p className="text-xs font-bold text-indigo-700 mb-2 flex items-center gap-1"><Target className="w-3.5 h-3.5" />Rekomendasi</p>
                      {r.recommendations.map((rec, j) => <p key={j} className="text-xs text-foreground mb-1">→ {rec}</p>)}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}