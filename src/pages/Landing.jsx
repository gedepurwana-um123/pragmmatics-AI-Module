import React, { useState } from 'react';
import ParticleBackground from '../components/landing/ParticleBackground';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import AIAnalyzerDemo from '../components/landing/AIAnalyzerDemo';
import AnalyticsPreview from '../components/landing/AnalyticsPreview';
import Footer from '../components/landing/Footer';
import InfoWidget from '../components/landing/InfoWidget';
import LoginModal from '../components/landing/LoginModal';
import { Brain, LogIn, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background neural-bg relative">
      <ParticleBackground />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        {/* Top bar — info widget */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-700 px-4 sm:px-6 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-white/80 text-xs hidden sm:block font-medium">
              🎓 Platform Pembelajaran Pragmatik Digital Berbasis AI
            </span>
            <div className="ml-auto">
              <InfoWidget />
            </div>
          </div>
        </div>

        {/* Main navbar */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-indigo-100 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold font-montserrat text-lg bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">PragmaticsAI</span>
                <span className="hidden sm:block text-[10px] text-muted-foreground leading-none -mt-0.5">Etika Komunikasi Digital</span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              <a href="#fitur" className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                Fitur
              </a>
              <Link to="/ai-analyzer" className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                AI Analyzer
              </Link>
              <a href="#tentang" className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all">
                Tentang
              </a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setLoginOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-xl px-5 h-10 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Masuk
              </Button>
              {/* Mobile hamburger */}
              <button
                className="md:hidden w-9 h-9 rounded-lg bg-secondary flex items-center justify-center"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
              <a href="#fitur" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">Fitur</a>
              <Link to="/ai-analyzer" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">AI Analyzer</Link>
              <a href="#tentang" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">Tentang</a>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <FeatureSection />
        <AIAnalyzerDemo />
        <AnalyticsPreview />
        <Footer />
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}