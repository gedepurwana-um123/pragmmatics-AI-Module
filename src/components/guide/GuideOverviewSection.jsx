import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, BookOpen, Lightbulb, CheckCircle2, ChevronDown,
  AlertTriangle, Sparkles, Globe
} from 'lucide-react';

const CONCEPT_SECTIONS = [
  { key: 'what_is', icon: Brain, label: 'Apa Itu Modul Pragmatik AI', color: 'from-indigo-500 to-violet-600' },
  { key: 'background', icon: BookOpen, label: 'Latar Belakang', color: 'from-cyan-500 to-blue-600' },
  { key: 'urgency', icon: AlertTriangle, label: 'Urgensi', color: 'from-amber-500 to-orange-600' },
];

export default function GuideOverviewSection({ overview, role }) {
  const [openKey, setOpenKey] = useState('what_is');

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">PENGENALAN MODUL</span>
        </div>
        <h2 className="text-lg font-bold font-montserrat mb-1">Tentang Modul Pragmatik AI</h2>
        <p className="text-xs text-white/80">
          Pahami esensi, latar belakang, urgensi, dan manfaat platform PragmaticsAI sebelum mempelajari fitur-fiturnya.
        </p>
      </div>

      {/* Conceptual Accordion Sections */}
      {CONCEPT_SECTIONS.map((cs, idx) => {
        const section = overview[cs.key];
        if (!section) return null;
        const isOpen = openKey === cs.key;
        return (
          <motion.div
            key={cs.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenKey(isOpen ? null : cs.key)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/40 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cs.color} flex items-center justify-center flex-shrink-0`}>
                <cs.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground/60">{String(idx + 1).padStart(2, '0')}</span>
                  <h3 className="font-bold font-montserrat text-sm text-foreground">{section.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {cs.key === 'what_is' && 'Definisi & konsep inti modul'}
                  {cs.key === 'background' && 'Mengapa modul ini dikembangkan'}
                  {cs.key === 'urgency' && 'Kepentingan & kebutuhan mendesak'}
                </p>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <div className="space-y-3">
                      {section.paragraphs.map((para, pIdx) => (
                        <div key={pIdx} className="flex gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 flex-shrink-0" />
                          <p className="text-xs text-foreground leading-relaxed">{para}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold font-montserrat text-sm text-foreground">Manfaat Platform</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Keunggulan dan nilai yang diperoleh dari PragmaticsAI</p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {/* General Benefits */}
          <div>
            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wide mb-2">Manfaat Umum</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {overview.benefits_general.map((b, idx) => (
                <div key={idx} className="flex gap-2 p-2.5 bg-secondary/30 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-foreground leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Role-Specific Benefits */}
          <div>
            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wide mb-2">
              Manfaat Khusus {role === 'dosen' ? 'Dosen' : 'Mahasiswa'}
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {(role === 'dosen' ? overview.benefits_lecturer : overview.benefits_student).map((b, idx) => (
                <div key={idx} className="flex gap-2 p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-foreground leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex-1 h-px bg-border" />
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Panduan Fitur</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    </div>
  );
}