import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 mb-8"
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">Platform Pembelajaran Pragmatik Berbasis AI</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-montserrat leading-tight mb-6"
        >
          <span className="text-foreground">Transformasi </span>
          <span className="text-gradient">Etika Komunikasi Digital</span>
          <br className="hidden sm:block" />
          <span className="text-foreground"> melalui </span>
          <span className="text-gradient">Pragmatik Berbasis AI</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Ekosistem pembelajaran pragmatik digital berbasis AI Chatbot sebagai adaptive scaffolding 
          untuk meningkatkan etika berbahasa mahasiswa di media sosial.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold rounded-xl glow-indigo transition-all duration-300 hover:scale-105">
              Mulai Pembelajaran
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <a href="#fitur">
            <Button size="lg" variant="outline" className="border-border/50 hover:bg-secondary/50 px-8 py-6 text-base rounded-xl transition-all duration-300 hover:scale-105">
              Jelajahi Fitur
            </Button>
          </a>
          <Link to="/ai-analyzer">
            <Button size="lg" variant="outline" className="border-accent/30 text-accent hover:bg-accent/10 px-8 py-6 text-base rounded-xl transition-all duration-300 hover:scale-105">
              <Bot className="w-5 h-5 mr-2" />
              Coba Asisten AI
            </Button>
          </Link>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 right-10 hidden lg:block"
        >
          <div className="bg-white border border-border shadow-lg rounded-2xl px-4 py-3 text-sm text-muted-foreground">
            💬 "Bagaimana cara menyampaikan kritik yang santun?"
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-5 left-10 hidden lg:block"
        >
          <div className="bg-white border border-border shadow-lg rounded-2xl px-4 py-3 text-sm">
            <span className="text-emerald-600 font-semibold">Kesantunan: 92%</span> · <span className="text-cyan-600 font-semibold">Empati Digital: Tinggi</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}