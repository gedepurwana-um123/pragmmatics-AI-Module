import React from 'react';
import { motion } from 'framer-motion';
import {
  Bot, BarChart3, ShieldAlert, MessageSquare, BookOpen, TrendingUp,
  MessageCircle, Award, User, LayoutDashboard, Globe, Mic,
  Theater, Users, Swords, Library, PenLine, Lightbulb, Bell, Map
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Bot,
    title: 'AI Pragmatics Analyzer',
    desc: 'Analisis teks secara real-time: deteksi kesantunan, speech act, implikatur, dan emosi. Didukung knowledge graph budaya lokal.',
    color: 'from-indigo-500 to-purple-600',
    path: '/ai-analyzer',
    badge: 'Unggulan',
  },
  {
    icon: Theater,
    title: 'Lab Simulasi (Roleplay)',
    desc: 'Skenario percakapan interaktif dengan NPC berkarakter AI. Respons dinilai real-time berdasarkan nilai budaya Tolaki, Buton, dan Muna.',
    color: 'from-cyan-500 to-blue-600',
    path: '/virtual-roleplay-lab',
    badge: 'Baru',
  },
  {
    icon: Mic,
    title: 'AI Pragmatics Tutor',
    desc: 'Tutor AI personal yang memberikan scaffolding adaptif, menyesuaikan tingkat bantuan dengan kemampuan pragmatik setiap mahasiswa.',
    color: 'from-violet-500 to-indigo-600',
    path: '/ai-pragmatics-tutor',
  },
  {
    icon: PenLine,
    title: 'Jurnal Reflektif',
    desc: 'Tulis refleksi harian dan terima umpan balik AI yang dipersonalisasi berdasarkan perspektif etnografi digital.',
    color: 'from-emerald-500 to-teal-600',
    path: '/journal',
  },
  {
    icon: Globe,
    title: 'Kearifan Budaya Lokal',
    desc: 'Eksplorasi nilai komunikasi budaya Tolaki (Mosehe), Buton (Bhinci-bhinciki Kuli), dan Muna (Katangka) sebagai fondasi etika digital.',
    color: 'from-amber-500 to-orange-600',
    path: '/cultural-wisdom',
    badge: 'Khas',
  },
  {
    icon: Swords,
    title: 'Latihan Kasus Budaya',
    desc: 'Hadapi dilema etika komunikasi berlatar budaya lokal dan pilih respons terbaik yang selaras dengan kearifan leluhur.',
    color: 'from-rose-500 to-pink-600',
    path: '/cultural-case-training',
  },
  {
    icon: Library,
    title: 'Perpustakaan Etnografi',
    desc: 'Kumpulan kasus komunikasi digital nyata dari media sosial, dianotasi secara etnografis untuk studi analisis pragmatik.',
    color: 'from-teal-500 to-emerald-600',
    path: '/ethnography-case-library',
  },
  {
    icon: BarChart3,
    title: 'Analitik Kemajuan',
    desc: 'Dashboard komprehensif dengan grafik tren kompetensi pragmatik, politeness, toxicity, dan kesadaran etika dari waktu ke waktu.',
    color: 'from-blue-500 to-indigo-600',
    path: '/analytics',
  },
  {
    icon: TrendingUp,
    title: 'Laporan Mingguan AI',
    desc: 'Laporan otomatis setiap minggu yang merangkum kemajuan belajar, area lemah, dan rekomendasi personalisasi dari AI.',
    color: 'from-pink-500 to-rose-600',
    path: '/weekly-report',
  },
  {
    icon: Lightbulb,
    title: 'Belajar Adaptif',
    desc: 'Sistem rekomendasi cerdas yang menyarankan modul, kasus, dan latihan berdasarkan profil kompetensi dan kelemahan Anda.',
    color: 'from-yellow-500 to-amber-600',
    path: '/adaptive-learning',
  },
  {
    icon: Users,
    title: 'Kolaborasi & Forum',
    desc: 'Diskusi komunitas, tantangan kelompok, dan kolaborasi studi bersama mahasiswa lain untuk pembelajaran sosial yang kaya.',
    color: 'from-sky-500 to-cyan-600',
    path: '/community',
  },
  {
    icon: Award,
    title: 'Gamifikasi & Pencapaian',
    desc: 'Sistem XP, level, streak harian, dan lencana untuk memotivasi konsistensi belajar pragmatik komunikasi digital.',
    color: 'from-violet-500 to-purple-600',
    path: '/achievements',
  },
  {
    icon: BookOpen,
    title: 'Modul Pembelajaran',
    desc: '7-Fase Adaptive Ethnographic Inquiry: dari orientasi etnografi hingga transformasi etis, terstruktur dan berbasis teori.',
    color: 'from-indigo-500 to-blue-600',
    path: '/modules',
  },
  {
    icon: Map,
    title: 'Wisata Budaya Pragmatik',
    desc: 'Tur interaktif melalui lanskap budaya Sulawesi Tenggara untuk memahami konteks komunikasi antar-budaya secara mendalam.',
    color: 'from-green-500 to-teal-600',
    path: '/pragmatic-cultural-tour',
  },
  {
    icon: Bell,
    title: 'Notifikasi & Pengingat',
    desc: 'Sistem notifikasi cerdas untuk umpan balik dosen, pencapaian baru, dan pengingat belajar agar konsistensi terjaga.',
    color: 'from-orange-500 to-red-500',
    path: '/notifications',
  },
];

export default function FeatureSection() {
  return (
    <section id="fitur" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-wider">Fitur Lengkap</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-montserrat mt-3 mb-4">
            Ekosistem Pembelajaran <span className="text-gradient">Pragmatik Digital</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            15+ fitur terintegrasi yang dirancang untuk mentransformasi kompetensi komunikasi etis mahasiswa — dari analisis AI hingga kearifan budaya lokal Sulawesi Tenggara.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-6 border border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-500 relative"
            >
              {f.badge && (
                <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  f.badge === 'Unggulan' ? 'bg-indigo-100 text-indigo-700' :
                  f.badge === 'Baru' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{f.badge}</span>
              )}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 font-montserrat text-sm">{f.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
              {f.path && (
                <Link to={f.path} className="mt-3 text-xs text-primary font-semibold hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Coba fitur ini →
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}