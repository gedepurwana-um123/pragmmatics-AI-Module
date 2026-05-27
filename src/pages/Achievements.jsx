import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Target, Flame, Zap, Shield, BookOpen, MessageSquare, Brain, Crown, Medal, TrendingUp, Users } from 'lucide-react';

const LEVELS = [
  { name: 'Pemula', minXP: 0, color: 'from-slate-400 to-gray-500', badge: '🌱' },
  { name: 'Perunggu', minXP: 500, color: 'from-amber-700 to-orange-700', badge: '🥉' },
  { name: 'Perak', minXP: 1000, color: 'from-slate-400 to-slate-500', badge: '🥈' },
  { name: 'Emas', minXP: 2000, color: 'from-amber-400 to-yellow-500', badge: '🥇' },
  { name: 'Platinum', minXP: 3500, color: 'from-cyan-400 to-blue-500', badge: '💎' },
  { name: 'Master', minXP: 5000, color: 'from-indigo-500 to-purple-600', badge: '👑' },
];

const achievements = [
  { icon: Star, title: 'Pemula Pragmatik', desc: 'Selesaikan modul pertama', unlocked: true, xp: 100, color: 'from-amber-500 to-orange-600' },
  { icon: Shield, title: 'Penjaga Etika', desc: 'Analisis 10 komentar toksis', unlocked: true, xp: 150, color: 'from-emerald-500 to-teal-600' },
  { icon: MessageSquare, title: 'Komunikator Santun', desc: 'Capai skor kesantunan 80%', unlocked: true, xp: 200, color: 'from-indigo-500 to-purple-600' },
  { icon: Brain, title: 'AI Explorer', desc: 'Lakukan 50 interaksi AI', unlocked: true, xp: 250, color: 'from-cyan-500 to-blue-600' },
  { icon: Flame, title: 'Streak 7 Hari', desc: 'Belajar 7 hari berturut-turut', unlocked: true, xp: 300, color: 'from-rose-500 to-red-600' },
  { icon: BookOpen, title: 'Refleksi Mendalam', desc: 'Tulis 5 jurnal reflektif', unlocked: false, xp: 200, color: 'from-violet-500 to-indigo-600' },
  { icon: Trophy, title: 'Master Pragmatik', desc: 'Selesaikan semua modul', unlocked: false, xp: 500, color: 'from-amber-500 to-yellow-600' },
  { icon: Target, title: 'Detektif Toksis', desc: 'Deteksi 25 ujaran toksis', unlocked: false, xp: 350, color: 'from-pink-500 to-rose-600' },
  { icon: Zap, title: 'Speed Learner', desc: 'Selesaikan modul lebih cepat dari estimasi', unlocked: false, xp: 400, color: 'from-sky-500 to-cyan-600' },
];

const leaderboard = [
  { rank: 1, name: 'Ayu Fitria', kelas: 'C', xp: 2850, kesantunan: 91, streak: 14, level: 'Emas', badge: '🥇' },
  { rank: 2, name: 'Ahmad Fauzi', kelas: 'A', xp: 2640, kesantunan: 88, streak: 10, level: 'Emas', badge: '🥈' },
  { rank: 3, name: 'Siti Nurhaliza', kelas: 'C', xp: 2410, kesantunan: 90, streak: 8, level: 'Perak', badge: '🥉' },
  { rank: 4, name: 'Dewi Lestari', kelas: 'A', xp: 1980, kesantunan: 82, streak: 6, level: 'Perak', badge: '⭐' },
  { rank: 5, name: 'Budi Santoso', kelas: 'B', xp: 1340, kesantunan: 65, streak: 3, level: 'Perunggu', badge: '⭐' },
  { rank: 6, name: 'Raka Pratama', kelas: 'D', xp: 820, kesantunan: 52, streak: 1, level: 'Perunggu', badge: '🌱' },
  // Current user (self)
  { rank: 7, name: 'Anda', kelas: 'B', xp: 1250, kesantunan: 78, streak: 7, level: 'Perak', badge: '🥈', isSelf: true },
];

const MY_XP = 1250;
const currentLevel = LEVELS.slice().reverse().find(l => MY_XP >= l.minXP) || LEVELS[0];
const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
const xpProgress = nextLevel ? ((MY_XP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100;

export default function Achievements() {
  const [tab, setTab] = useState('badges'); // badges | leaderboard

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Pencapaian & Peringkat</h1>
        <p className="text-muted-foreground mt-1">Kumpulkan lencana, naikkan level, dan bersaing di papan peringkat kelas.</p>
      </motion.div>

      {/* Level card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">
              {currentLevel.badge}
            </div>
            <div>
              <p className="text-white/70 text-sm">Level Saat Ini</p>
              <h2 className="text-2xl font-bold font-montserrat">{currentLevel.name}</h2>
              <p className="text-white/80 text-sm">{MY_XP} XP terkumpul</p>
            </div>
          </div>
          <div className="w-full sm:w-64">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/80">Menuju {nextLevel?.name || 'Maksimum'}</span>
              <span className="font-bold">{nextLevel ? `${MY_XP}/${nextLevel.minXP}` : '✓'}</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${xpProgress}%` }} />
            </div>
            <p className="text-white/60 text-xs mt-1">{nextLevel ? `${nextLevel.minXP - MY_XP} XP lagi ke ${nextLevel.name}` : 'Level tertinggi!'}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Award, label: 'Lencana Terbuka', value: '5/9', color: 'text-amber-500' },
          { icon: Flame, label: 'Hari Streak', value: '7', color: 'text-rose-500' },
          { icon: Star, label: 'Total XP', value: '1.250', color: 'text-primary' },
          { icon: TrendingUp, label: 'Peringkat Kelas', value: '#7', color: 'text-emerald-500' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-white rounded-2xl p-4 text-center border border-border shadow-sm"
          >
            <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
            <p className="text-xl font-bold font-montserrat">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-secondary rounded-xl w-fit">
        <button onClick={() => setTab('badges')} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'badges' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
          🏅 Lencana
        </button>
        <button onClick={() => setTab('leaderboard')} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'leaderboard' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
          🏆 Papan Peringkat
        </button>
      </div>

      {tab === 'badges' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-sm ${a.unlocked ? 'border-border hover:border-primary/30 hover:shadow-md' : 'opacity-50 border-border'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center ${a.unlocked ? '' : 'grayscale'}`}>
                  <a.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">+{a.xp} XP</span>
              </div>
              <h3 className="font-semibold font-montserrat text-sm text-foreground">{a.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
              <div className="mt-3">
                {a.unlocked
                  ? <span className="text-xs text-emerald-600 font-semibold">✓ Terbuka</span>
                  : <span className="text-xs text-muted-foreground">🔒 Terkunci</span>}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
        >
          {/* Top 3 podium */}
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 border-b border-border">
            <div className="flex items-end justify-center gap-4">
              {[leaderboard[1], leaderboard[0], leaderboard[2]].map((s, i) => {
                const heights = ['h-20', 'h-28', 'h-16'];
                const labels = ['2nd', '1st', '3rd'];
                const colors = ['bg-slate-200', 'bg-amber-300', 'bg-amber-700/40'];
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span className="text-2xl">{s.badge}</span>
                    <p className="text-xs font-semibold text-foreground text-center max-w-[70px] leading-tight">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.xp} XP</p>
                    <div className={`w-16 ${heights[i]} ${colors[i]} rounded-t-xl flex items-center justify-center`}>
                      <span className="text-sm font-bold text-foreground">{labels[i]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full list */}
          <div className="divide-y divide-border">
            {leaderboard.sort((a, b) => a.rank - b.rank).map((s, i) => (
              <div key={i} className={`flex items-center gap-4 px-6 py-4 ${s.isSelf ? 'bg-indigo-50 border-l-4 border-primary' : 'hover:bg-secondary/30 transition-colors'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${s.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-secondary text-muted-foreground'}`}>
                  {s.rank}
                </div>
                <span className="text-xl flex-shrink-0">{s.badge}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${s.isSelf ? 'text-primary' : 'text-foreground'}`}>{s.name} {s.isSelf && <span className="text-xs text-primary">(Anda)</span>}</p>
                  <p className="text-xs text-muted-foreground">Kelas {s.kelas} · Level {s.level}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-emerald-600">{s.kesantunan}%</p>
                    <p className="text-xs text-muted-foreground">Kesantunan</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-rose-500">🔥 {s.streak}</p>
                    <p className="text-xs text-muted-foreground">Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-indigo-600">{s.xp.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}