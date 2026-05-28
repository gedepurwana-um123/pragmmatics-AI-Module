import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Award, Star, Zap, Shield, Brain, MessageSquare, BookOpen, Flame, TrendingUp, Lock } from 'lucide-react';


const BADGES_CONFIG = [
  { code: 'pesan_tersopan', icon: '🕊️', label: 'Pesan Ter-sopan', desc: 'Skor kesantunan > 90 dalam satu sesi', color: 'from-emerald-400 to-teal-500', req: 'Politeness ≥ 90' },
  { code: 'penjelajah_ai', icon: '🤖', label: 'Penjelajah AI', desc: 'Menyelesaikan 20+ interaksi AI', color: 'from-indigo-400 to-violet-500', req: '20 AI Interactions' },
  { code: 'reflektor_aktif', icon: '📝', label: 'Reflektor Aktif', desc: 'Menulis 10+ jurnal refleksi', color: 'from-amber-400 to-orange-500', req: '10 Reflections' },
  { code: 'bebas_toksik', icon: '✨', label: 'Bebas Toksik', desc: 'Toxicity < 10% selama seminggu', color: 'from-cyan-400 to-blue-500', req: 'Toxicity < 10' },
  { code: 'maestro_kultural', icon: '🏔️', label: 'Maestro Kultural', desc: 'Menganalisis 5+ kasus budaya', color: 'from-violet-400 to-purple-500', req: '5 Cultural Cases' },
  { code: 'komunikator_etis', icon: '⚖️', label: 'Komunikator Etis', desc: 'Pragmatic score > 85 secara konsisten', color: 'from-rose-400 to-pink-500', req: 'Pragmatic ≥ 85' },
];

const LEVELS = [
  { name: 'Pemula', min: 0, max: 200, color: 'text-slate-500', bg: 'bg-slate-100' },
  { name: 'Perunggu', min: 200, max: 500, color: 'text-amber-700', bg: 'bg-amber-100' },
  { name: 'Perak', min: 500, max: 1000, color: 'text-slate-400', bg: 'bg-slate-200' },
  { name: 'Emas', min: 1000, max: 2000, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { name: 'Platinum', min: 2000, max: 3500, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  { name: 'Master', min: 3500, max: 99999, color: 'text-violet-600', bg: 'bg-violet-100' },
];

function getLevelInfo(xp) {
  const lvl = LEVELS.find(l => xp >= l.min && xp < l.max) || LEVELS[LEVELS.length - 1];
  const next = LEVELS[LEVELS.indexOf(lvl) + 1];
  const progress = next ? Math.round(((xp - lvl.min) / (next.min - lvl.min)) * 100) : 100;
  return { ...lvl, progress, nextXP: next?.min, xpToNext: next ? next.min - xp : 0 };
}

export default function GamificationPanel() {
  const [enrollment, setEnrollment] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u) return;
      setUserEmail(u.email);
      base44.entities.Enrollment.filter({ student_email: u.email, status: 'active' })
        .then(enrs => { if (enrs?.length > 0) setEnrollment(enrs[0]); })
        .catch(() => {});
    }).catch(() => {});
  }, []);

  const xp = enrollment?.xp_points || 0;
  const earnedBadges = enrollment?.badges || [];
  const levelInfo = getLevelInfo(xp);
  const streak = enrollment?.streak_days || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl p-6 border border-border shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold font-montserrat text-sm">Pencapaian & Level</h3>
            <p className="text-[11px] text-muted-foreground">Gamifikasi kompetensi pragmatik Anda</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5">
          <Flame className="w-4 h-4 text-rose-500" />
          <span className="text-sm font-bold text-rose-600">{streak} hari</span>
        </div>
      </div>

      {/* Level Progress */}
      <div className={`rounded-xl p-4 mb-5 ${levelInfo.bg} border border-border/50`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className={`font-bold text-lg font-montserrat ${levelInfo.color}`}>{levelInfo.name}</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-base font-montserrat text-foreground">{xp.toLocaleString()} XP</p>
            {levelInfo.xpToNext > 0 && (
              <p className="text-[11px] text-muted-foreground">{levelInfo.xpToNext} XP ke {LEVELS[LEVELS.indexOf(LEVELS.find(l => l.name === levelInfo.name)) + 1]?.name}</p>
            )}
          </div>
        </div>
        <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden border border-white/80">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelInfo.progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">{levelInfo.min} XP</span>
          <span className="text-[10px] font-semibold text-amber-600">{levelInfo.progress}%</span>
          <span className="text-[10px] text-muted-foreground">{levelInfo.nextXP ? `${levelInfo.nextXP} XP` : 'MAX'}</span>
        </div>
      </div>

      {/* XP Sources */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { icon: Brain, label: 'Pragmatik', xp: '+15 XP', color: 'text-indigo-600' },
          { icon: MessageSquare, label: 'Interaksi AI', xp: '+10 XP', color: 'text-cyan-600' },
          { icon: BookOpen, label: 'Refleksi', xp: '+20 XP', color: 'text-emerald-600' },
        ].map((s, i) => (
          <div key={i} className="bg-secondary/40 rounded-xl p-2.5 text-center border border-border/30">
            <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
            <p className={`text-xs font-bold ${s.color}`}>{s.xp}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Lencana ({earnedBadges.length}/{BADGES_CONFIG.length})
        </p>
        <div className="grid grid-cols-3 gap-2">
          {BADGES_CONFIG.map((badge) => {
            const earned = earnedBadges.includes(badge.code);
            return (
              <motion.div
                key={badge.code}
                whileHover={{ scale: 1.04 }}
                title={badge.desc}
                className={`rounded-xl p-3 text-center border transition-all cursor-default ${
                  earned
                    ? 'border-amber-200 bg-gradient-to-br ' + badge.color + ' text-white shadow-sm'
                    : 'border-dashed border-border bg-secondary/20 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{earned ? badge.icon : '🔒'}</div>
                <p className={`text-[10px] font-semibold leading-tight ${earned ? 'text-white' : 'text-muted-foreground'}`}>
                  {badge.label}
                </p>
                {!earned && (
                  <p className="text-[9px] text-muted-foreground mt-0.5">{badge.req}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}