import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Target, Flame, Zap, Shield, BookOpen, MessageSquare, Brain, TrendingUp, Users, Globe, Crown, Medal } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const LEVELS = [
  { name: 'Pemula', minXP: 0, color: 'from-slate-400 to-gray-500', badge: '🌱', desc: 'Mulai perjalanan pragmatik' },
  { name: 'Perunggu', minXP: 500, color: 'from-amber-700 to-orange-700', badge: '🥉', desc: 'Kesadaran dasar etika' },
  { name: 'Perak', minXP: 1000, color: 'from-slate-400 to-slate-500', badge: '🥈', desc: 'Komunikator yang berkembang' },
  { name: 'Emas', minXP: 2000, color: 'from-amber-400 to-yellow-500', badge: '🥇', desc: 'Pragmatik kompeten' },
  { name: 'Platinum', minXP: 3500, color: 'from-cyan-400 to-blue-500', badge: '💎', desc: 'Pakar etika komunikasi' },
  { name: 'Master', minXP: 5000, color: 'from-indigo-500 to-purple-600', badge: '👑', desc: 'Master pragmatik etnografi' },
];

const BADGES = [
  { icon: Star, title: 'Pemula Pragmatik', desc: 'Selesaikan modul pertama', unlocked: true, xp: 100, color: 'from-amber-500 to-orange-600', category: 'achievement' },
  { icon: Shield, title: 'Penjaga Etika Digital', desc: 'Analisis 10 komentar toksis', unlocked: true, xp: 150, color: 'from-emerald-500 to-teal-600', category: 'ethics' },
  { icon: MessageSquare, title: 'Komunikator Santun', desc: 'Capai skor kesantunan 80%', unlocked: true, xp: 200, color: 'from-indigo-500 to-purple-600', category: 'politeness' },
  { icon: Brain, title: 'AI Explorer', desc: 'Lakukan 50 interaksi AI', unlocked: true, xp: 250, color: 'from-cyan-500 to-blue-600', category: 'ai' },
  { icon: Flame, title: 'Streak 7 Hari', desc: 'Belajar 7 hari berturut-turut', unlocked: true, xp: 300, color: 'from-rose-500 to-red-600', category: 'engagement' },
  { icon: Globe, title: 'Cultural Wisdom Seeker', desc: 'Pelajari 3 budaya lokal', unlocked: true, xp: 350, color: 'from-violet-500 to-purple-600', category: 'cultural' },
  { icon: BookOpen, title: 'Refleksi Mendalam', desc: 'Tulis 5 jurnal reflektif', unlocked: false, xp: 200, color: 'from-violet-500 to-indigo-600', category: 'reflection' },
  { icon: Trophy, title: 'Master Pragmatik', desc: 'Selesaikan semua modul', unlocked: false, xp: 500, color: 'from-amber-500 to-yellow-600', category: 'achievement' },
  { icon: Target, title: 'Detektif Toksis', desc: 'Deteksi 25 ujaran toksis', unlocked: false, xp: 350, color: 'from-pink-500 to-rose-600', category: 'ethics' },
  { icon: Zap, title: 'Speed Learner', desc: 'Selesaikan modul lebih cepat', unlocked: false, xp: 400, color: 'from-sky-500 to-cyan-600', category: 'achievement' },
  { icon: Users, title: 'Team Player', desc: 'Selesaikan 3 tantangan kelompok', unlocked: false, xp: 300, color: 'from-teal-500 to-emerald-600', category: 'collaboration' },
  { icon: Crown, title: 'Ethnography Expert', desc: 'Analisis 20 kasus perpustakaan', unlocked: false, xp: 450, color: 'from-amber-600 to-yellow-500', category: 'cultural' },
];

const LEADERBOARD = [
  { rank: 1, name: 'Ayu Fitria', kelas: 'C', xp: 2850, kesantunan: 91, ethical: 94, kultural: 88, streak: 14, level: 'Emas', badge: '🥇' },
  { rank: 2, name: 'Ahmad Fauzi', kelas: 'A', xp: 2640, kesantunan: 88, ethical: 89, kultural: 82, streak: 10, level: 'Emas', badge: '🥈' },
  { rank: 3, name: 'Siti Nurhaliza', kelas: 'C', xp: 2410, kesantunan: 90, ethical: 91, kultural: 85, streak: 8, level: 'Perak', badge: '🥉' },
  { rank: 4, name: 'Dewi Lestari', kelas: 'A', xp: 1980, kesantunan: 82, ethical: 85, kultural: 79, streak: 6, level: 'Perak', badge: '⭐' },
  { rank: 5, name: 'Budi Santoso', kelas: 'B', xp: 1340, kesantunan: 65, ethical: 68, kultural: 60, streak: 3, level: 'Perunggu', badge: '⭐' },
  { rank: 6, name: 'Raka Pratama', kelas: 'D', xp: 820, kesantunan: 52, ethical: 55, kultural: 48, streak: 1, level: 'Perunggu', badge: '🌱' },
  { rank: 7, name: 'Anda', kelas: 'B', xp: 1250, kesantunan: 78, ethical: 82, kultural: 75, streak: 7, level: 'Perak', badge: '🥈', isSelf: true },
];

const MY_XP = 1250;
const currentLevel = LEVELS.slice().reverse().find(l => MY_XP >= l.minXP) || LEVELS[0];
const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
const xpProgress = nextLevel ? ((MY_XP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100;

const radarData = [
  { subject: 'Etika', A: 82 },
  { subject: 'Kesantunan', A: 78 },
  { subject: 'Kultural', A: 75 },
  { subject: 'Empati', A: 79 },
  { subject: 'Refleksi', A: 72 },
  { subject: 'AI Use', A: 85 },
];

const CATEGORIES = ['all', 'achievement', 'ethics', 'politeness', 'cultural', 'ai', 'engagement', 'reflection', 'collaboration'];

export default function Achievements() {
  const [tab, setTab] = useState('badges');
  const [badgeFilter, setBadgeFilter] = useState('all');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    base44.entities.StudentProfile.filter({})
      .then(p => { if (p?.length > 0) setProfile(p[0]); })
      .catch(() => {});
  }, []);

  const xp = profile?.xp_points || MY_XP;
  const politeness = profile?.politeness_score || 78;
  const culturalSensitivity = profile?.cultural_sensitivity || 75;
  const ethicalAwareness = profile?.ethical_awareness || 82;

  const filteredBadges = badgeFilter === 'all' ? BADGES : BADGES.filter(b => b.category === badgeFilter);

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 mb-2">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-semibold text-amber-600">Gamification System · Ethical Communication Badges · Class Leaderboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Pencapaian & Peringkat</h1>
        <p className="text-muted-foreground mt-1">Kumpulkan lencana, naikkan level, dan bersaing di papan peringkat berdasarkan etika komunikasi & sensitivitas kultural.</p>
      </motion.div>

      {/* Level card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className={`bg-gradient-to-r ${currentLevel.color} rounded-2xl p-6 text-white shadow-lg`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl">{currentLevel.badge}</div>
            <div>
              <p className="text-white/70 text-sm">Ethical Communicator Level</p>
              <h2 className="text-2xl font-bold font-montserrat">{currentLevel.name}</h2>
              <p className="text-white/80 text-sm">{currentLevel.desc}</p>
              <p className="text-white/70 text-xs mt-0.5">{xp.toLocaleString()} XP terkumpul</p>
            </div>
          </div>
          <div className="w-full sm:w-72">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/80">Menuju {nextLevel?.name || 'Maksimum'}</span>
              <span className="font-bold">{nextLevel ? `${xp}/${nextLevel.minXP}` : '✓'}</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1.2 }}
                className="h-full bg-white rounded-full" />
            </div>
            <p className="text-white/60 text-xs mt-1">{nextLevel ? `${nextLevel.minXP - xp} XP lagi ke ${nextLevel.name}` : 'Level tertinggi!'}</p>
          </div>
        </div>
      </motion.div>

      {/* Core metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Shield, label: 'Ethical Awareness', value: `${ethicalAwareness}%`, color: 'text-indigo-600', sub: 'Kesadaran Etika' },
          { icon: Globe, label: 'Cultural Sensitivity', value: `${culturalSensitivity}%`, color: 'text-violet-600', sub: 'Sensitivitas Kultural' },
          { icon: MessageSquare, label: 'Politeness Score', value: `${politeness}%`, color: 'text-emerald-600', sub: 'Tingkat Kesantunan' },
          { icon: Award, label: 'Badges Earned', value: `${BADGES.filter(b => b.unlocked).length}/${BADGES.length}`, color: 'text-amber-600', sub: 'Lencana Terbuka' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-white rounded-2xl p-4 text-center border border-border shadow-sm"
          >
            <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
            <p className={`text-xl font-bold font-montserrat ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-secondary rounded-xl w-fit">
        {[
          { key: 'badges', label: '🏅 Lencana' },
          { key: 'radar', label: '📊 Profil Etika' },
          { key: 'leaderboard', label: '🏆 Papan Peringkat' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >{t.label}</button>
        ))}
      </div>

      {/* BADGES TAB */}
      {tab === 'badges' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setBadgeFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${badgeFilter === c ? 'bg-primary text-white border-primary' : 'bg-white border-border text-muted-foreground hover:border-primary/30'}`}
              >{c === 'all' ? 'Semua' : c}</button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${b.unlocked ? 'border-border hover:border-primary/30 hover:shadow-md' : 'opacity-50 border-border'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center ${b.unlocked ? '' : 'grayscale'}`}>
                    <b.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">+{b.xp} XP</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">{b.category}</p>
                  </div>
                </div>
                <h3 className="font-semibold font-montserrat text-sm text-foreground">{b.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
                <div className="mt-3">
                  {b.unlocked ? <span className="text-xs text-emerald-600 font-semibold">✓ Terbuka</span> : <span className="text-xs text-muted-foreground">🔒 Terkunci</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* RADAR TAB */}
      {tab === 'radar' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-semibold text-foreground mb-4">Profil Ethical Communication Awareness</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(0,0,0,0.07)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={2} name="Skor Anda" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <h4 className="font-semibold text-foreground mb-3">Detail Kompetensi Etika Komunikasi</h4>
              {[
                { label: 'Ethical Awareness', val: ethicalAwareness, color: 'from-indigo-500 to-violet-500' },
                { label: 'Cultural Sensitivity', val: culturalSensitivity, color: 'from-violet-500 to-purple-500' },
                { label: 'Politeness Score', val: politeness, color: 'from-emerald-500 to-teal-500' },
                { label: 'Empati Digital', val: 79, color: 'from-cyan-500 to-blue-500' },
                { label: 'Emotional Control', val: 76, color: 'from-amber-500 to-orange-500' },
              ].map((m, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-foreground">{m.label}</span>
                    <span className={`text-xs font-bold ${m.val >= 80 ? 'text-emerald-600' : m.val >= 60 ? 'text-blue-600' : 'text-amber-600'}`}>{m.val}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${m.val}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full bg-gradient-to-r ${m.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-indigo-700 mb-1">🎯 Rekomendasi Peningkatan</p>
              <p className="text-xs text-indigo-800">Fokus pada Cultural Sensitivity untuk naik ke level Emas. Ikuti lebih banyak tantangan kelompok dan analisis kasus budaya lokal.</p>
            </div>
          </div>
        </div>
      )}

      {/* LEADERBOARD TAB */}
      {tab === 'leaderboard' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
        >
          {/* Podium */}
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 border-b border-border">
            <div className="flex items-end justify-center gap-6">
              {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((s, i) => {
                const heights = ['h-20', 'h-28', 'h-16'];
                const labels = ['2nd', '1st', '3rd'];
                const colors = ['bg-slate-200', 'bg-amber-300', 'bg-amber-700/40'];
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <span className="text-2xl">{s.badge}</span>
                    <p className="text-xs font-semibold text-center max-w-[70px] leading-tight">{s.name}</p>
                    <div className="text-center">
                      <p className="text-[10px] text-emerald-600 font-bold">Etika {s.ethical}%</p>
                      <p className="text-[10px] text-violet-600 font-bold">Kultural {s.kultural}%</p>
                    </div>
                    <div className={`w-16 ${heights[i]} ${colors[i]} rounded-t-xl flex items-center justify-center`}>
                      <span className="text-sm font-bold text-foreground">{labels[i]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  {['#', 'Mahasiswa', 'Kesantunan', 'Etika Komunikasi', 'Sensitivitas Kultural', 'Streak', 'XP', 'Level'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD.sort((a, b) => a.rank - b.rank).map((s, i) => (
                  <tr key={i} className={`border-b border-border/50 transition-colors ${s.isSelf ? 'bg-indigo-50 border-l-4 border-primary' : 'hover:bg-secondary/20'}`}>
                    <td className="px-4 py-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-secondary text-muted-foreground'}`}>{s.rank}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{s.badge}</span>
                        <div>
                          <p className={`font-semibold text-sm ${s.isSelf ? 'text-primary' : 'text-foreground'}`}>{s.name} {s.isSelf && <span className="text-xs">(Anda)</span>}</p>
                          <p className="text-xs text-muted-foreground">Kelas {s.kelas}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="font-bold text-emerald-600">{s.kesantunan}%</span></td>
                    <td className="px-4 py-3"><span className="font-bold text-indigo-600">{s.ethical}%</span></td>
                    <td className="px-4 py-3"><span className="font-bold text-violet-600">{s.kultural}%</span></td>
                    <td className="px-4 py-3"><span className="font-semibold text-rose-500">🔥 {s.streak}</span></td>
                    <td className="px-4 py-3"><span className="font-bold text-foreground">{s.xp.toLocaleString()}</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">{s.level}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}