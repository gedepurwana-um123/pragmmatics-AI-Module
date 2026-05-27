import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Bot, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import InfoWidget from './InfoWidget';

const stats = [
  { icon: Shield, label: 'Kesantunan Bahasa', value: '94%', color: 'text-emerald-600' },
  { icon: TrendingUp, label: 'Mahasiswa Aktif', value: '1.2K+', color: 'text-indigo-600' },
  { icon: Bot, label: 'Interaksi AI', value: '28K+', color: 'text-cyan-600' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden pt-36">
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[140px] animate-pulse" />

      <div className="relative z-10 max-w-5xl mx-auto text-center w-full">

        {/* ── Info Widget ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 overflow-x-auto"
        >
          <InfoWidget />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 mb-6"
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-indigo-600">Platform Pragmatik Digital · AI-Powered</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-montserrat leading-tight mb-5"
        >
          <span className="text-foreground">Kuasai </span>
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Etika Digital
          </span>
          <br />
          <span className="text-foreground">dengan </span>
          <span className="bg-gradient-to-r from-cyan-500 to-teal-600 bg-clip-text text-transparent">
            Kecerdasan AI
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Ekosistem pembelajaran pragmatik berbasis AI untuk meningkatkan kompetensi 
          komunikasi etis mahasiswa di era media sosial.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Mulai Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <a href="#fitur">
            <Button size="lg" variant="outline" className="border-indigo-200 hover:bg-indigo-50 text-indigo-700 px-8 py-6 text-base rounded-xl transition-all duration-300 hover:scale-105">
              Jelajahi Fitur
            </Button>
          </a>
          <Link to="/ai-analyzer">
            <Button size="lg" variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 px-8 py-6 text-base rounded-xl transition-all duration-300 hover:scale-105">
              <Bot className="w-5 h-5 mr-2" />
              Coba AI Gratis
            </Button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-5"
        >
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2 bg-white border border-border rounded-2xl px-5 py-3 shadow-sm">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <div className="text-left">
                <div className={`text-lg font-bold font-montserrat ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}