import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Target, Flame, Zap, Shield, BookOpen, MessageSquare, Brain } from 'lucide-react';

const achievements = [
  { icon: Star, title: 'Pemula Pragmatik', desc: 'Selesaikan modul pertama', unlocked: true, color: 'from-amber-500 to-orange-600' },
  { icon: Shield, title: 'Penjaga Etika', desc: 'Analisis 10 komentar toksis', unlocked: true, color: 'from-emerald-500 to-teal-600' },
  { icon: MessageSquare, title: 'Komunikator Santun', desc: 'Capai skor kesantunan 80%', unlocked: true, color: 'from-indigo-500 to-purple-600' },
  { icon: Brain, title: 'AI Explorer', desc: 'Lakukan 50 interaksi dengan AI', unlocked: true, color: 'from-cyan-500 to-blue-600' },
  { icon: Flame, title: 'Streak 7 Hari', desc: 'Belajar 7 hari berturut-turut', unlocked: true, color: 'from-rose-500 to-red-600' },
  { icon: BookOpen, title: 'Refleksi Mendalam', desc: 'Tulis 5 jurnal reflektif', unlocked: false, color: 'from-violet-500 to-indigo-600' },
  { icon: Trophy, title: 'Master Pragmatik', desc: 'Selesaikan semua modul', unlocked: false, color: 'from-amber-500 to-yellow-600' },
  { icon: Target, title: 'Detektif Toksis', desc: 'Deteksi 25 ujaran toksis', unlocked: false, color: 'from-pink-500 to-rose-600' },
  { icon: Zap, title: 'Speed Learner', desc: 'Selesaikan modul dalam waktu kurang dari estimasi', unlocked: false, color: 'from-sky-500 to-cyan-600' },
];

const stats = { total: 9, unlocked: 5, streak: 7, points: 1250 };

export default function Achievements() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Pencapaian</h1>
        <p className="text-muted-foreground mt-1">Lacak pencapaian dan kemajuan belajar Anda.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-light rounded-2xl p-4 text-center">
          <Award className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-xl font-bold font-montserrat">{stats.unlocked}/{stats.total}</p>
          <p className="text-xs text-muted-foreground">Terbuka</p>
        </div>
        <div className="glass-light rounded-2xl p-4 text-center">
          <Flame className="w-6 h-6 text-rose-400 mx-auto mb-2" />
          <p className="text-xl font-bold font-montserrat">{stats.streak}</p>
          <p className="text-xs text-muted-foreground">Hari Streak</p>
        </div>
        <div className="glass-light rounded-2xl p-4 text-center">
          <Star className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-xl font-bold font-montserrat">{stats.points}</p>
          <p className="text-xs text-muted-foreground">Poin XP</p>
        </div>
        <div className="glass-light rounded-2xl p-4 text-center">
          <Trophy className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="text-xl font-bold font-montserrat">Perak</p>
          <p className="text-xs text-muted-foreground">Level</p>
        </div>
      </div>

      {/* Achievement grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-light rounded-2xl p-5 transition-all ${a.unlocked ? 'hover:border-primary/20' : 'opacity-50'}`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3 ${a.unlocked ? '' : 'grayscale'}`}>
              <a.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold font-montserrat text-sm">{a.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
            <div className="mt-3">
              {a.unlocked ? (
                <span className="text-xs text-emerald-400 font-medium">✓ Terbuka</span>
              ) : (
                <span className="text-xs text-muted-foreground">🔒 Terkunci</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}