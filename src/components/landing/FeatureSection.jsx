import React from 'react';
import { motion } from 'framer-motion';
import { Bot, BarChart3, ShieldAlert, MessageSquare, BookOpen, TrendingUp, MessageCircle, Award, User, LayoutDashboard } from 'lucide-react';

const features = [
  { icon: Bot, title: 'AI Adaptive Scaffolding', desc: 'Sistem pendampingan AI yang menyesuaikan tingkat bantuan berdasarkan kemampuan mahasiswa secara real-time.', color: 'from-indigo-500 to-purple-600' },
  { icon: BarChart3, title: 'Analisis Pragmatik Real-Time', desc: 'Analisis otomatis terhadap aspek kesantunan, speech act, dan implikatur dalam komunikasi digital.', color: 'from-cyan-500 to-blue-600' },
  { icon: ShieldAlert, title: 'Deteksi Bahasa Toxic', desc: 'Identifikasi dan analisis ujaran toksis dengan rekomendasi alternatif komunikasi yang lebih etis.', color: 'from-rose-500 to-red-600' },
  { icon: MessageSquare, title: 'Simulasi Media Sosial', desc: 'Laboratorium virtual untuk berlatih komunikasi etis di berbagai platform media sosial.', color: 'from-emerald-500 to-teal-600' },
  { icon: BookOpen, title: 'Pembelajaran Berbasis Etnografi', desc: 'Studi kasus komunikasi nyata dari berbagai konteks budaya dan sosial Indonesia.', color: 'from-amber-500 to-orange-600' },
  { icon: TrendingUp, title: 'Analitik Pembelajaran', desc: 'Dashboard analitik komprehensif untuk memantau perkembangan kompetensi pragmatik.', color: 'from-violet-500 to-indigo-600' },
  { icon: MessageCircle, title: 'Umpan Balik Adaptif', desc: 'Respons AI yang dipersonalisasi berdasarkan profil dan kebutuhan belajar mahasiswa.', color: 'from-sky-500 to-cyan-600' },
  { icon: Award, title: 'Evaluasi Kesantunan', desc: 'Sistem penilaian multidimensi terhadap tingkat kesantunan berbahasa dalam konteks digital.', color: 'from-pink-500 to-rose-600' },
  { icon: User, title: 'Profil Pragmatik Digital', desc: 'Pemetaan komprehensif profil kompetensi pragmatik dan etika komunikasi mahasiswa.', color: 'from-teal-500 to-emerald-600' },
  { icon: LayoutDashboard, title: 'Dashboard AI Interaktif', desc: 'Antarmuka cerdas dengan visualisasi data dan interaksi AI yang intuitif.', color: 'from-blue-500 to-indigo-600' },
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
          <span className="text-accent text-sm font-semibold uppercase tracking-wider">Fitur Unggulan</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-montserrat mt-3 mb-4">
            Ekosistem Pembelajaran <span className="text-gradient">Pragmatik Digital</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fitur-fitur canggih yang dirancang untuk mentransformasi cara mahasiswa belajar etika komunikasi digital.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-6 border border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-500 cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 font-montserrat text-sm">{f.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}