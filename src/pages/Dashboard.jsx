import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Shield, MessageSquare, BookOpen, Bot, Award, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, AreaChart, Area } from 'recharts';

const radarData = [
  { subject: 'Kesantunan', A: 85 },
  { subject: 'Empati', A: 79 },
  { subject: 'Konteks', A: 72 },
  { subject: 'Etika', A: 88 },
  { subject: 'Pragmatik', A: 76 },
  { subject: 'Refleksi', A: 82 },
];

const progressData = [
  { day: 'Sen', value: 65 }, { day: 'Sel', value: 72 }, { day: 'Rab', value: 68 },
  { day: 'Kam', value: 78 }, { day: 'Jum', value: 82 }, { day: 'Sab', value: 88 }, { day: 'Min', value: 91 },
];

const quickStats = [
  { icon: Brain, label: 'Kompetensi Pragmatik', value: '78%', color: 'from-indigo-500 to-purple-600' },
  { icon: Shield, label: 'Tingkat Kesantunan', value: '85%', color: 'from-emerald-500 to-teal-600' },
  { icon: MessageSquare, label: 'Interaksi AI', value: '42', color: 'from-cyan-500 to-blue-600' },
  { icon: TrendingUp, label: 'Penurunan Toxicity', value: '67%', color: 'from-amber-500 to-orange-600' },
];

const recentModules = [
  { title: 'Pengantar Pragmatik Digital', progress: 85, status: 'Lanjutkan' },
  { title: 'Kesantunan dalam Media Sosial', progress: 60, status: 'Lanjutkan' },
  { title: 'Deteksi Ujaran Toksis', progress: 30, status: 'Lanjutkan' },
  { title: 'Speech Acts dalam Konteks Digital', progress: 0, status: 'Mulai' },
];

const quickActions = [
  { icon: Bot, label: 'Asisten AI', desc: 'Tanya apa saja tentang pragmatik', path: '/ai-analyzer', color: 'from-indigo-500 to-purple-600' },
  { icon: Zap, label: 'Lab Simulasi', desc: 'Berlatih di media sosial virtual', path: '/social-lab', color: 'from-cyan-500 to-blue-600' },
  { icon: BookOpen, label: 'Jurnal Reflektif', desc: 'Tulis refleksi pembelajaran', path: '/journal', color: 'from-emerald-500 to-teal-600' },
];

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-space">Dashboard Mahasiswa</h1>
        <p className="text-muted-foreground mt-1">Selamat datang kembali! Lanjutkan perjalanan belajar Anda.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-light rounded-2xl p-5 hover:border-primary/20 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold font-space">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-light rounded-2xl p-6"
        >
          <h3 className="font-semibold font-space mb-4">Progress Pembelajaran Mingguan</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} fill="url(#dashGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-light rounded-2xl p-6"
        >
          <h3 className="font-semibold font-space mb-4">Profil Pragmatik</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Profil" dataKey="A" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {quickActions.map((a, i) => (
          <Link key={i} to={a.path}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-light rounded-2xl p-5 group cursor-pointer hover:border-primary/20 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <a.icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold font-space text-sm">{a.label}</h4>
              <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-light rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold font-space">Modul Terbaru</h3>
          <Link to="/modules" className="text-xs text-primary hover:underline flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentModules.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background/40 hover:bg-background/60 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{m.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-24 h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{m.progress}%</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-xs text-primary">
                {m.status}
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}