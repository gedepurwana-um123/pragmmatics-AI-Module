import React from 'react';
import ParticleBackground from '../components/landing/ParticleBackground';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import AIAnalyzerDemo from '../components/landing/AIAnalyzerDemo';
import AnalyticsPreview from '../components/landing/AnalyticsPreview';
import Footer from '../components/landing/Footer';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background neural-bg relative">
      <ParticleBackground />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold font-montserrat text-lg text-foreground">PragmaticsAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a>
            <Link to="/ai-analyzer" className="hover:text-foreground transition-colors">AI Analyzer</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
          <Link to="/dashboard">
            <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-lg">
              Masuk
            </Button>
          </Link>
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
    </div>
  );
}