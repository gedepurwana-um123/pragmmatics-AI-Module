import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Bot, Shield, TrendingUp, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import InfoWidget from './InfoWidget';
import { base44 } from '@/api/base44Client';

export default function HeroSection() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [enrollments, aiLogs, scores] = await Promise.all([
          base44.entities.Enrollment.list().catch(() => []),
          base44.entities.AIChatLog.list().catch(() => []),
          base44.entities.PragmaticScore.list().catch(() => []),
        ]);

        const activeStudents = enrollments.filter(e => e.status === 'active').length;
        const totalAI = aiLogs.length;

        // Avg politeness from PragmaticScore
        const withPoliteness = scores.filter(s => s.politeness_score != null && s.politeness_score > 0);
        const avgPoliteness = withPoliteness.length > 0
          ? Math.round(withPoliteness.reduce((a, s) => a + s.politeness_score, 0) / withPoliteness.length)
          : null;

        setStats({
          students: activeStudents,
          aiInteractions: totalAI,
          politeness: avgPoliteness,
          budaya: 3, // always 3: Tolaki, Buton, Muna
        });
      } catch {
        setStats({ students: 0, aiInteractions: 0, politeness: null, budaya: 3 });
      }
      setLoadingStats(false);
    };
    fetchStats();
  }, []);

  const formatNum = (n) => {
    if (n == null) return '-';
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
    return n > 0 ? `${n}+` : `${n}`;
  };

  const statItems = [
    {
      icon: Shield,
      label: 'Rata-rata Kesantunan',
      value: stats?.politeness != null ? `${stats.politeness}%` : (loadingStats ? '...' : '-'),
      color: 'text-emerald-600',
    },
    {
      icon: Users,
      label: 'Mahasiswa Aktif',
      value: loadingStats ? '...' : formatNum(stats?.students),
      color: 'text-indigo-600',
    },
    {
      icon: Bot,
      label: 'Interaksi AI',
      value: loadingStats ? '...' : formatNum(stats?.aiInteractions),
      color: 'text-cyan-600',
    },
    {
      icon: Sparkles,
      label: 'Budaya Terintegrasi',
      value: '3',
      sub: 'Tolaki · Buton · Muna',
      color: 'text-violet-600',
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden pt-36">
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-400/5 rounded-full blur-[160px]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center w-full">

        {/* Info Widget */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 overflow-x-auto">
          <InfoWidget />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 mb-6">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-indigo-600">Platform Pragmatik Digital · AI-Powered</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-montserrat leading-tight mb-5">
          <span className="text-foreground">Kuasai </span>
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
            Etika Digital
          </span>
          <br />
          <span className="text-foreground">dengan Modul Pragmatik </span>
          <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Terintegrasi AI
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Ekosistem pembelajaran pragmatik berbasis AI untuk meningkatkan kompetensi
          komunikasi etis mahasiswa di era media sosial — terintegrasi kearifan budaya Sulawesi Tenggara.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14">
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

        {/* Real-time Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4">
          {statItems.map((s, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-border rounded-2xl px-5 py-3 shadow-sm">
              <s.icon className={`w-4 h-4 ${s.color} flex-shrink-0`} />
              <div className="text-left">
                <div className={`text-lg font-bold font-montserrat ${s.color} flex items-center gap-1.5`}>
                  {loadingStats && s.label !== 'Budaya Terintegrasi' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : s.value}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                {s.sub && <div className="text-[10px] text-muted-foreground/70">{s.sub}</div>}
              </div>
            </div>
          ))}
          <div className="text-[10px] text-muted-foreground/60 w-full text-center mt-1">
            * Data diperbarui secara real-time dari basis data platform
          </div>
        </motion.div>
      </div>
    </section>
  );
}