import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Download, Search, GraduationCap, Users,
  FileText, Loader2, BookMarked
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GuideSection from '@/components/guide/GuideSection';
import GuideOverviewSection from '@/components/guide/GuideOverviewSection';
import { generateGuidePDF } from '@/components/guide/GuidePDFExporter';
import { studentGuide } from '@/components/guide/studentGuideData';
import { lecturerGuide } from '@/components/guide/lecturerGuideData';

export default function UserGuide() {
  const [role, setRole] = useState('mahasiswa');
  const [search, setSearch] = useState('');
  const [generating, setGenerating] = useState('none');

  const guideData = role === 'dosen' ? lecturerGuide : studentGuide;

  const filteredSections = useMemo(() => {
    if (!search.trim()) return guideData.sections;
    const q = search.toLowerCase();
    return guideData.sections.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.steps.some(step =>
        step.title.toLowerCase().includes(q) ||
        step.detail.toLowerCase().includes(q)
      ) ||
      (s.tips || []).some(tip => tip.toLowerCase().includes(q))
    );
  }, [guideData, search]);

  const handleDownload = () => {
    setGenerating(role);
    setTimeout(() => {
      generateGuidePDF(role);
      setGenerating('none');
    }, 100);
  };

  const handleDownloadBoth = () => {
    setGenerating('both');
    setTimeout(() => {
      generateGuidePDF('mahasiswa');
      setTimeout(() => generateGuidePDF('dosen'), 500);
      setGenerating('none');
    }, 100);
  };

  const isGenerating = generating !== 'none';

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent)]" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">PANDUAN PENGGUNAAN</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-montserrat mb-1">
                  Dashboard Panduan Penggunaan
                </h1>
                <p className="text-sm text-white/80 max-w-lg">
                  Panduan komprehensif PragmaticsAI untuk mahasiswa & dosen — cara akses, fitur, dan tahapan pembelajaran.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="bg-white text-indigo-700 hover:bg-white/90 gap-2 text-sm font-semibold shadow-md"
                >
                  {generating === role ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Membuat PDF...</>
                  ) : (
                    <><Download className="w-4 h-4" /> Download PDF {role === 'dosen' ? 'Dosen' : 'Mahasiswa'}</>
                  )}
                </Button>
                <Button
                  onClick={handleDownloadBoth}
                  disabled={isGenerating}
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/30 gap-2 text-xs"
                  variant="outline"
                >
                  {generating === 'both' ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Membuat...</>
                  ) : (
                    <><FileText className="w-3.5 h-3.5" /> Download Keduanya</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Role Tabs */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setRole('mahasiswa')}
          className={`rounded-2xl p-4 border-2 text-left transition-all ${
            role === 'mahasiswa'
              ? 'border-indigo-400 bg-indigo-50 shadow-md'
              : 'border-border bg-white hover:border-indigo-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'mahasiswa' ? 'bg-gradient-to-br from-indigo-500 to-violet-600' : 'bg-secondary'}`}>
              <GraduationCap className={`w-5 h-5 ${role === 'mahasiswa' ? 'text-white' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className={`font-bold font-montserrat text-sm ${role === 'mahasiswa' ? 'text-indigo-700' : 'text-foreground'}`}>Panduan Mahasiswa</p>
              <p className="text-[11px] text-muted-foreground">{studentGuide.sections.length} modul fitur</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => setRole('dosen')}
          className={`rounded-2xl p-4 border-2 text-left transition-all ${
            role === 'dosen'
              ? 'border-cyan-400 bg-cyan-50 shadow-md'
              : 'border-border bg-white hover:border-cyan-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'dosen' ? 'bg-gradient-to-br from-cyan-500 to-teal-600' : 'bg-secondary'}`}>
              <BookMarked className={`w-5 h-5 ${role === 'dosen' ? 'text-white' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className={`font-bold font-montserrat text-sm ${role === 'dosen' ? 'text-cyan-700' : 'text-foreground'}`}>Panduan Dosen</p>
              <p className="text-[11px] text-muted-foreground">{lecturerGuide.sections.length} modul fitur</p>
            </div>
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={`Cari fitur di panduan ${role === 'dosen' ? 'dosen' : 'mahasiswa'}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl"
        />
      </div>

      {/* Conceptual Overview — only when not searching */}
      {!search && guideData.overview && (
        <GuideOverviewSection overview={guideData.overview} role={role} />
      )}

      {/* Guide Sections */}
      <div className="space-y-3">
        {filteredSections.length > 0 ? (
          filteredSections.map((section, idx) => (
            <GuideSection key={section.id} section={section} index={idx} />
          ))
        ) : (
          <div className="text-center py-16">
            <Search className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">Tidak ada hasil untuk "{search}"</p>
          </div>
        )}
      </div>

      {/* Bottom Download CTA */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-6 text-white text-center">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-80" />
        <h3 className="font-bold font-montserrat text-base mb-1">Download Panduan Lengkap (PDF)</h3>
        <p className="text-xs text-white/70 mb-4 max-w-md mx-auto">
          Simpan panduan offline untuk referensi kapan saja. PDF berisi daftar isi, langkah detail, dan tips praktis.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={() => { setRole('mahasiswa'); setTimeout(handleDownload, 50); }}
            disabled={isGenerating}
            className="bg-white text-indigo-700 hover:bg-white/90 gap-2 text-sm"
          >
            <Download className="w-4 h-4" /> PDF Mahasiswa
          </Button>
          <Button
            onClick={() => { setRole('dosen'); setTimeout(handleDownload, 50); }}
            disabled={isGenerating}
            className="bg-white/15 hover:bg-white/25 text-white border border-white/30 gap-2 text-sm"
            variant="outline"
          >
            <Download className="w-4 h-4" /> PDF Dosen
          </Button>
        </div>
      </div>
    </div>
  );
}