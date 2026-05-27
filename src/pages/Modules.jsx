import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, BarChart3, ChevronRight, Play, CheckCircle2, Mic, Theater, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const modules = [
  { id: 1, title: 'Pengantar Pragmatik Digital', desc: 'Memahami dasar-dasar pragmatik dalam konteks komunikasi digital dan media sosial.', category: 'Pragmatik Dasar', duration: 45, progress: 85, difficulty: 'Pemula' },
  { id: 2, title: 'Kesantunan dalam Media Sosial', desc: 'Menerapkan prinsip kesantunan Brown & Levinson dalam interaksi media sosial.', category: 'Kesantunan', duration: 60, progress: 60, difficulty: 'Menengah' },
  { id: 3, title: 'Deteksi dan Analisis Ujaran Toksis', desc: 'Mengidentifikasi pola ujaran toksis dan memahami dampaknya dalam komunikasi digital.', category: 'Komunikasi Toksis', duration: 50, progress: 30, difficulty: 'Menengah' },
  { id: 4, title: 'Speech Acts dalam Konteks Digital', desc: 'Memahami dan menganalisis jenis-jenis speech act dalam komunikasi online.', category: 'Speech Acts', duration: 55, progress: 0, difficulty: 'Lanjutan' },
  { id: 5, title: 'Implikatur dan Konteks Sosial', desc: 'Menganalisis implikatur percakapan dalam berbagai konteks sosial digital.', category: 'Implikatur', duration: 40, progress: 0, difficulty: 'Lanjutan' },
  { id: 6, title: 'Etika Komunikasi Digital', desc: 'Prinsip-prinsip etika dalam berkomunikasi di ruang digital dan media sosial.', category: 'Etika Digital', duration: 35, progress: 0, difficulty: 'Pemula' },
  { id: 7, title: 'Etnografi Digital: Studi Kasus', desc: 'Mempelajari komunikasi digital melalui studi etnografi dari berbagai konteks budaya.', category: 'Etnografi Digital', duration: 65, progress: 0, difficulty: 'Lanjutan' },
  { id: 8, title: 'Strategi Komunikasi Asertif', desc: 'Teknik komunikasi asertif yang santun dan efektif dalam media sosial.', category: 'Komunikasi Toksis', duration: 45, progress: 0, difficulty: 'Menengah' },
];

const difficultyColors = {
  Pemula: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Menengah: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Lanjutan: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

export default function Modules() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Modul Pembelajaran</h1>
        <p className="text-muted-foreground mt-1">Materi pembelajaran pragmatik digital yang interaktif dan komprehensif.</p>
      </motion.div>

      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-light rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold font-montserrat text-primary">8</p>
          <p className="text-xs text-muted-foreground">Total Modul</p>
        </div>
        <div className="glass-light rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold font-montserrat text-emerald-400">2</p>
          <p className="text-xs text-muted-foreground">Sedang Berjalan</p>
        </div>
        <div className="glass-light rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold font-montserrat text-accent">395</p>
          <p className="text-xs text-muted-foreground">Menit Total</p>
        </div>
      </div>

      {/* AI Feature Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/ai-pragmatics-tutor">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border border-violet-200 p-5 cursor-pointer hover:shadow-md hover:border-violet-300 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 font-semibold">✨ Baru</span>
            </div>
            <h3 className="font-bold font-montserrat text-sm text-foreground mb-1 group-hover:text-violet-700 transition-colors">AI Pragmatics Tutor</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Rekam suara Anda dan dapatkan analisis aksen, intonasi, dan kesantunan berbasis AI secara real-time.</p>
            <div className="mt-3 flex items-center text-xs font-semibold text-violet-600">Mulai Latihan <ChevronRight className="w-3.5 h-3.5 ml-1" /></div>
          </motion.div>
        </Link>
        <Link to="/virtual-roleplay-lab">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl border border-cyan-200 p-5 cursor-pointer hover:shadow-md hover:border-cyan-300 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                <Theater className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-200 font-semibold">✨ Baru</span>
            </div>
            <h3 className="font-bold font-montserrat text-sm text-foreground mb-1 group-hover:text-cyan-700 transition-colors">Virtual Roleplay Lab</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Latih respons pragmatik melalui skenario percakapan interaktif dengan NPC berkarakter berbeda.</p>
            <div className="mt-3 flex items-center text-xs font-semibold text-cyan-600">Mulai Roleplay <ChevronRight className="w-3.5 h-3.5 ml-1" /></div>
          </motion.div>
        </Link>
      </div>

      {/* Module grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {modules.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="glass-light rounded-2xl p-5 group hover:border-primary/20 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.progress === 100 ? 'bg-emerald-500/20' : m.progress > 0 ? 'bg-primary/10' : 'bg-secondary'}`}>
                {m.progress === 100 ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
                 m.progress > 0 ? <Play className="w-5 h-5 text-primary" /> :
                 <BookOpen className="w-5 h-5 text-muted-foreground" />}
              </div>
              <Badge className={`text-xs border ${difficultyColors[m.difficulty]}`}>{m.difficulty}</Badge>
            </div>
            <h3 className="font-semibold font-montserrat text-sm mb-1 group-hover:text-primary transition-colors">{m.title}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{m.desc}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {m.duration} menit</div>
              <span className="text-xs">{m.category}</span>
            </div>

            {m.progress > 0 && (
              <div>
                <div className="w-full h-1.5 bg-background/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${m.progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{m.progress}% selesai</p>
              </div>
            )}

            {m.progress === 0 && (
              <Button size="sm" variant="ghost" className="w-full mt-2 text-xs text-primary">
                Mulai Modul <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}