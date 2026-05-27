import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Brain, Shield, BookOpen, MessageSquare } from 'lucide-react';

const lineData = [
  { name: 'M1', value: 45 }, { name: 'M2', value: 52 }, { name: 'M3', value: 61 },
  { name: 'M4', value: 58 }, { name: 'M5', value: 72 }, { name: 'M6', value: 78 },
  { name: 'M7', value: 85 }, { name: 'M8', value: 91 },
];

const radarData = [
  { subject: 'Kesantunan', A: 85 },
  { subject: 'Empati', A: 79 },
  { subject: 'Konteks', A: 72 },
  { subject: 'Etika', A: 88 },
  { subject: 'Pragmatik', A: 76 },
  { subject: 'Refleksi', A: 82 },
];

const stats = [
  { icon: Brain, label: 'Kompetensi Pragmatik', value: '78%', change: '+12%', color: 'text-indigo-400' },
  { icon: Shield, label: 'Tingkat Kesantunan', value: '85%', change: '+18%', color: 'text-emerald-400' },
  { icon: Users, label: 'Keterlibatan', value: '92%', change: '+8%', color: 'text-cyan-400' },
  { icon: TrendingUp, label: 'Penurunan Toxicity', value: '67%', change: '+25%', color: 'text-amber-400' },
];

export default function AnalyticsPreview() {
  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-wider">Analitik Pembelajaran</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-space mt-3 mb-4">
            Dashboard <span className="text-gradient">Analitik Cerdas</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pantau perkembangan kompetensi pragmatik dan etika komunikasi digital dengan visualisasi data yang canggih.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-light rounded-2xl p-5"
            >
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <p className="text-2xl font-bold font-space">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              <span className="text-xs text-emerald-400 font-medium">{s.change}</span>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-light rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="font-semibold font-space text-sm">Progress Pembelajaran</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineData}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} fill="url(#colorProgress)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-light rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-accent" />
              <h3 className="font-semibold font-space text-sm">Profil Pragmatik Digital</h3>
            </div>
            <div className="h-48">
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
      </div>
    </section>
  );
}