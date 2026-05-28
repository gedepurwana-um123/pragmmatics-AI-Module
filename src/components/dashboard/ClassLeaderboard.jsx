import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, PenLine, Shield, Crown, Medal, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TABS = [
  { key: 'xp', label: 'Poin XP', icon: Zap, color: 'text-amber-500', field: 'xp_points' },
  { key: 'politeness', label: 'Kesantunan', icon: Shield, color: 'text-emerald-500', field: 'final_politeness_score' },
  { key: 'reflections', label: 'Refleksi', icon: PenLine, color: 'text-indigo-500', field: 'total_reflections' },
];

const rankStyle = (rank) => {
  if (rank === 1) return { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-400 text-white', icon: <Crown className="w-3 h-3" /> };
  if (rank === 2) return { bg: 'bg-slate-50 border-slate-200', badge: 'bg-slate-400 text-white', icon: <Medal className="w-3 h-3" /> };
  if (rank === 3) return { bg: 'bg-orange-50 border-orange-200', badge: 'bg-orange-400 text-white', icon: <Medal className="w-3 h-3" /> };
  return { bg: 'bg-white border-border', badge: 'bg-secondary text-muted-foreground', icon: null };
};

export default function ClassLeaderboard({ classId, currentUserEmail }) {
  const [tab, setTab] = useState('xp');
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    base44.entities.Enrollment.filter({ class_id: classId, status: 'active' })
      .then(data => setEnrollments(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [classId]);

  const activeTab = TABS.find(t => t.key === tab);
  const sorted = [...enrollments]
    .sort((a, b) => (b[activeTab.field] || 0) - (a[activeTab.field] || 0))
    .slice(0, 10);

  const myRank = sorted.findIndex(e => e.student_email === currentUserEmail) + 1;

  const formatValue = (enr) => {
    if (tab === 'xp') return `${(enr.xp_points || 0).toLocaleString()} XP`;
    if (tab === 'politeness') return `${enr.final_politeness_score || 0}%`;
    if (tab === 'reflections') return `${enr.total_reflections || 0} jurnal`;
    return '-';
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold font-montserrat">Leaderboard Kelas</h3>
          {myRank > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 font-semibold">
              Peringkat #{myRank}
            </span>
          )}
        </div>
        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                tab === t.key ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className={`w-3 h-3 ${t.color}`} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-2">
        {loading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Memuat data...</div>
        ) : sorted.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Belum ada data kelas</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
              {sorted.map((enr, i) => {
                const rank = i + 1;
                const style = rankStyle(rank);
                const isMe = enr.student_email === currentUserEmail;
                const initials = enr.student_email?.charAt(0).toUpperCase();
                const shortEmail = enr.student_email?.split('@')[0];

                return (
                  <div key={enr.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${style.bg} ${isMe ? 'ring-2 ring-primary/30' : ''}`}
                  >
                    {/* Rank badge */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${style.badge}`}>
                      {style.icon || rank}
                    </div>

                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                      isMe ? 'bg-gradient-to-br from-primary to-violet-600' : 'bg-gradient-to-br from-slate-400 to-slate-500'
                    }`}>
                      {initials}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isMe ? 'text-primary' : 'text-foreground'}`}>
                        {shortEmail}{isMe && <span className="text-xs text-primary/70 ml-1">(Kamu)</span>}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{enr.level || 'Pemula'}</p>
                    </div>

                    {/* Score */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${activeTab.color}`}>{formatValue(enr)}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {!classId && (
        <div className="px-5 pb-4 text-xs text-muted-foreground text-center">
          Bergabung ke kelas untuk melihat leaderboard
        </div>
      )}
    </div>
  );
}