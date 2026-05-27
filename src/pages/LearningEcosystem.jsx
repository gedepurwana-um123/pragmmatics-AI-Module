import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, Search, Brain, Layers, RefreshCw, Heart, BarChart3,
  CheckCircle2, ChevronRight, Sparkles, Globe, BookOpen, Zap
} from 'lucide-react';

const PHASES = [
  {
    number: 1,
    title: 'Orientasi Fenomena Digital',
    subtitle: 'Digital Phenomenon Orientation',
    icon: Eye,
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    textColor: 'text-indigo-700',
    description: 'Mahasiswa diperkenalkan pada fenomena komunikasi digital nyata di media sosial Indonesia. AI mendeteksi konteks budaya dan linguistik secara otomatis.',
    activities: [
      'Eksplorasi tren komunikasi digital terkini',
      'Identifikasi platform media sosial dominan',
      'Analisis awal pola bahasa netizen Indonesia',
      'Pembentukan pertanyaan penelitian etnografis',
    ],
    aiRole: 'AI memindai 500+ sampel post real-time untuk pemetaan fenomena awal',
    output: 'Peta Fenomena Digital & Pertanyaan Etnografis',
    duration: '1-2 Minggu',
  },
  {
    number: 2,
    title: 'Observasi Etnografi Digital',
    subtitle: 'Digital Ethnography Observation',
    icon: Search,
    color: 'from-cyan-500 to-teal-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    textColor: 'text-cyan-700',
    description: 'Mahasiswa melakukan observasi mendalam terhadap interaksi komunikasi di platform digital menggunakan pendekatan etnografi virtual.',
    activities: [
      'Observasi komunitas online selama periode tertentu',
      'Dokumentasi pola interaksi dan respon budaya',
      'Pemetaan jaringan sosial dan hierarki komunikasi',
      'Pencatatan etnografis digital (field notes virtual)',
    ],
    aiRole: 'AI mengklasifikasikan pola interaksi berdasarkan dimensi budaya lokal',
    output: 'Catatan Etnografi Digital & Pola Interaksi',
    duration: '2-3 Minggu',
  },
  {
    number: 3,
    title: 'Analisis Pragmatik',
    subtitle: 'Pragmatic Analysis',
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    textColor: 'text-violet-700',
    description: 'Analisis mendalam terhadap speech act, implikatur, kesantunan bahasa, dan konteks pragmatik dalam komunikasi digital yang diobservasi.',
    activities: [
      'Identifikasi speech act (asertif, direktif, komisif, ekspresif)',
      'Analisis implikatur konvensional dan percakapan',
      'Penilaian tingkat kesantunan berbasis teori Brown & Levinson',
      'Pemetaan konteks situasional dan sosio-kultural',
    ],
    aiRole: 'AI menghitung 12 dimensi pragmatik secara otomatis dengan akurasi 94%',
    output: 'Laporan Analisis Pragmatik Komprehensif',
    duration: '2 Minggu',
  },
  {
    number: 4,
    title: 'AI Adaptive Scaffolding',
    subtitle: 'Intelligent Learning Support',
    icon: Layers,
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    textColor: 'text-amber-700',
    description: 'Sistem AI memberikan bantuan belajar adaptif yang disesuaikan dengan kemampuan, gaya belajar, dan latar belakang budaya setiap mahasiswa.',
    activities: [
      'Diagnosis profil belajar individu secara otomatis',
      'Penyesuaian kompleksitas materi berbasis ZPD (Zone of Proximal Development)',
      'Integrasi kearifan budaya lokal dalam scaffolding',
      'Feedback real-time berbasis analisis pragmatik AI',
    ],
    aiRole: 'Cultural Wisdom Engine aktif: mengintegrasikan nilai Tolaki, Muna, dan Buton',
    output: 'Profil Belajar Adaptif & Rencana Scaffolding Personal',
    duration: 'Berkelanjutan',
  },
  {
    number: 5,
    title: 'Rekonstruksi Komunikasi',
    subtitle: 'Communication Reconstruction',
    icon: RefreshCw,
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    textColor: 'text-emerald-700',
    description: 'Mahasiswa aktif merekonstruksi ulang komunikasi yang tidak etis menjadi komunikasi bermartabat berdasarkan nilai kearifan budaya lokal.',
    activities: [
      'Identifikasi ujaran bermasalah dari hasil observasi',
      'Rekonstruksi berbasis tata nilai budaya Tolaki/Muna/Buton',
      'Simulasi interaksi komunikatif dengan AI partner',
      'Peer review dan diskusi rekonstruksi antar mahasiswa',
    ],
    aiRole: 'AI mengevaluasi setiap rekonstruksi dengan skor kesantunan multi-dimensi',
    output: 'Portofolio Rekonstruksi Komunikasi Etis',
    duration: '2-3 Minggu',
  },
  {
    number: 6,
    title: 'Refleksi Etis',
    subtitle: 'Ethical Reflection',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    textColor: 'text-rose-700',
    description: 'Mahasiswa melakukan refleksi mendalam terhadap perjalanan belajar, menginternalisasi nilai etika komunikasi digital berbasis kearifan lokal.',
    activities: [
      'Jurnal reflektif berbasis pengalaman belajar 6 fase sebelumnya',
      'Analisis perkembangan kompetensi pragmatik pribadi',
      'Refleksi nilai budaya lokal dalam konteks komunikasi global',
      'Presentasi sintesis pembelajaran kepada komunitas kelas',
    ],
    aiRole: 'AI memberikan feedback pedagogis mendalam berbasis pattern refleksi',
    output: 'Jurnal Refleksi Etis & Sintesis Pembelajaran',
    duration: '1-2 Minggu',
  },
  {
    number: 7,
    title: 'Analitik & Personalisasi Pembelajaran',
    subtitle: 'Learning Analytics & Personalization',
    icon: BarChart3,
    color: 'from-slate-500 to-gray-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    textColor: 'text-slate-700',
    description: 'Dashboard analitik komprehensif menampilkan seluruh perjalanan belajar, kompetensi yang dikembangkan, dan rekomendasi personalisasi ke depan.',
    activities: [
      'Visualisasi perkembangan 12 indikator kompetensi pragmatik',
      'Analisis kesenjangan (gap analysis) kompetensi',
      'Rekomendasi jalur belajar personal berbasis AI',
      'Sertifikasi kompetensi pragmatik digital berbasis bukti',
    ],
    aiRole: 'AI menghasilkan laporan komprehensif 360° per mahasiswa',
    output: 'Dashboard Analitik Personal & Sertifikat Kompetensi',
    duration: '1 Minggu',
  },
];

export default function LearningEcosystem() {
  const [activePhase, setActivePhase] = useState(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs font-semibold text-indigo-600">Adaptive Ethnographic Pragmatic Learning Ecosystem</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground">
          7-Phase Adaptive Ethnographic<br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Pragmatic Inquiry Model</span>
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
          Skenario pembelajaran komprehensif yang mengintegrasikan etnografi digital, analisis pragmatik, kearifan budaya lokal, dan AI adaptif dalam satu ekosistem terpadu.
        </p>
      </motion.div>

      {/* Phase Overview — horizontal stepper */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-6 overflow-x-auto"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">Alur Skenario Pembelajaran</h2>
        <div className="flex items-start gap-0 min-w-max">
          {PHASES.map((phase, i) => {
            const Icon = phase.icon;
            const isActive = activePhase === i;
            return (
              <React.Fragment key={i}>
                <button
                  onClick={() => setActivePhase(isActive ? null : i)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all w-28 ${isActive ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-secondary/50'}`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-muted-foreground">FASE {phase.number}</p>
                    <p className="text-xs font-semibold text-foreground leading-tight">{phase.title.split(' ').slice(0, 2).join(' ')}</p>
                  </div>
                </button>
                {i < PHASES.length - 1 && (
                  <div className="flex items-center pt-6 flex-shrink-0">
                    <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* Phase Detail Cards */}
      <div className="space-y-4">
        {PHASES.map((phase, i) => {
          const Icon = phase.icon;
          const isOpen = activePhase === i;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isOpen ? phase.border : 'border-border'}`}
            >
              {/* Card header */}
              <button
                onClick={() => setActivePhase(isOpen ? null : i)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-secondary/20 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${phase.bg} ${phase.textColor}`}>FASE {phase.number}</span>
                    <h3 className="font-bold font-montserrat text-foreground text-sm sm:text-base">{phase.title}</h3>
                    <span className="text-xs text-muted-foreground italic hidden sm:block">— {phase.subtitle}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{phase.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${phase.bg} ${phase.textColor}`}>{phase.duration}</span>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Expanded detail */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className={`border-t ${phase.border} p-5 grid sm:grid-cols-3 gap-5`}>
                      {/* Description */}
                      <div className="sm:col-span-2 space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
                        <div>
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Aktivitas Pembelajaran</h4>
                          <ul className="space-y-2">
                            {phase.activities.map((act, ai) => (
                              <li key={ai} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${phase.textColor}`} />
                                <span className="text-foreground">{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {/* Side info */}
                      <div className="space-y-3">
                        <div className={`rounded-xl ${phase.bg} border ${phase.border} p-4`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className={`w-4 h-4 ${phase.textColor}`} />
                            <span className="text-xs font-bold text-foreground">Peran AI</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{phase.aiRole}</p>
                        </div>
                        <div className="rounded-xl bg-secondary/50 border border-border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-foreground">Output Fase</span>
                          </div>
                          <p className="text-xs text-foreground font-medium leading-relaxed">{phase.output}</p>
                        </div>
                        <div className="rounded-xl bg-secondary/50 border border-border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs font-bold text-foreground">Durasi</span>
                          </div>
                          <p className={`text-sm font-bold ${phase.textColor}`}>{phase.duration}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Total duration bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="mt-6 bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm">Total Durasi Skenario</p>
            <p className="text-2xl font-bold font-montserrat">12–16 Minggu</p>
            <p className="text-white/60 text-xs mt-1">Satu semester penuh · Terintegrasi penuh dengan Cultural Wisdom Engine</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Fase', value: '7' },
              { label: 'Indikator', value: '12+' },
              { label: 'Budaya', value: '3' },
            ].map((s, i) => (
              <div key={i} className="bg-white/15 rounded-xl p-3">
                <p className="text-xl font-bold font-montserrat">{s.value}</p>
                <p className="text-xs text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}