import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Layers, Brain, Globe, Target, CheckCircle2, Lock, ArrowRight,
  BookOpen, MessageSquare, Zap, RefreshCw, ChevronDown, Sparkles, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PHASES = [
  {
    phase: 1, title: 'Orientasi Etnografi Digital', icon: '🔭', status: 'selesai',
    desc: 'Membangun pemahaman konteks budaya dan ekosistem komunikasi digital.',
    objectives: ['Mengenal platform media sosial sebagai arena pragmatik', 'Memahami konteks budaya Sulawesi Tenggara', 'Orientasi teori pragmatik dasar'],
    activities: ['Eksplorasi platform digital', 'Peta budaya lokal', 'Pre-test pragmatik'],
    ai_role: 'AI memberikan panduan orientasi adaptif berdasarkan latar belakang budaya mahasiswa.',
    color: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    phase: 2, title: 'Identifikasi Masalah Pragmatik', icon: '🔍', status: 'selesai',
    desc: 'Mendeteksi dan mengidentifikasi pola komunikasi bermasalah di media sosial.',
    objectives: ['Identifikasi ujaran toksik', 'Mengenali face threatening acts', 'Klasifikasi speech acts'],
    activities: ['Analisis komentar media sosial', 'Lab Simulasi Fase 2', 'Jurnal identifikasi'],
    ai_role: 'AI membantu mahasiswa mendeteksi pola toxicity dan impoliteness dengan penjelasan mengapa.',
    color: 'from-blue-500 to-indigo-600', badge: 'bg-blue-100 text-blue-700',
  },
  {
    phase: 3, title: 'Pengumpulan Data Etnografis', icon: '📊', status: 'aktif',
    desc: 'Mengumpulkan dan menganalisis data komunikasi dari platform media sosial.',
    objectives: ['Dokumentasi kasus komunikasi digital', 'Klasifikasi berdasarkan speech acts', 'Analisis konteks budaya'],
    activities: ['Lab Media Sosial', 'Database kasus pragmatik', 'AI Analyzer mendalam'],
    ai_role: 'AI membantu klasifikasi otomatis dan memberikan analisis mendalam berbasis knowledge graph.',
    color: 'from-violet-500 to-purple-600', badge: 'bg-violet-100 text-violet-700',
  },
  {
    phase: 4, title: 'Analisis Pragmatik Mendalam', icon: '🧠', status: 'terkunci',
    desc: 'Menganalisis data menggunakan teori pragmatik Austin, Grice, Brown-Levinson, Leech.',
    objectives: ['Analisis implikatur Gricean', 'Teori kesopanan Brown-Levinson', 'Maxim Leech dalam konteks digital'],
    activities: ['Diskusi teori mendalam', 'Analisis perbandingan kasus', 'Esai pragmatik'],
    ai_role: 'AI menjadi debate partner akademis untuk mempertajam pemahaman teori.',
    color: 'from-amber-500 to-orange-600', badge: 'bg-amber-100 text-amber-700',
  },
  {
    phase: 5, title: 'Refleksi Kritis', icon: '💭', status: 'terkunci',
    desc: 'Refleksi mendalam terhadap perkembangan kompetensi pragmatik dan etika komunikasi.',
    objectives: ['Jurnal refleksi mingguan', 'Self-assessment kompetensi', 'Peer feedback digital'],
    activities: ['Jurnal Reflektif AI', 'Kelompok diskusi virtual', 'Portfolio pragmatik'],
    ai_role: 'AI berperan sebagai mentor reflektif yang mengajukan pertanyaan Socratic.',
    color: 'from-pink-500 to-rose-600', badge: 'bg-pink-100 text-pink-700',
  },
  {
    phase: 6, title: 'Sintesis Kultural', icon: '🌿', status: 'terkunci',
    desc: 'Mengintegrasikan kearifan budaya lokal dengan teori pragmatik digital modern.',
    objectives: ['Integrasi nilai Tolaki, Muna, Buton', 'Sintesis teori-praktik', 'Model komunikasi kultural'],
    activities: ['Cultural Wisdom Engine', 'Presentasi etnografi', 'Peta konsep kultural'],
    ai_role: 'Cultural Wisdom Recommendation Engine menyajikan rekomendasi berbasis kearifan 3 budaya.',
    color: 'from-teal-500 to-cyan-600', badge: 'bg-teal-100 text-teal-700',
  },
  {
    phase: 7, title: 'Transformasi Etis', icon: '✨', status: 'terkunci',
    desc: 'Implementasi komunikasi digital yang bermartabat, etis, dan berdasarkan kearifan lokal.',
    objectives: ['Produksi konten digital etis', 'Model komunikasi bermartabat', 'Diseminasi hasil belajar'],
    activities: ['Proyek final komunikasi etis', 'Presentasi transformasi', 'Post-test & evaluasi'],
    ai_role: 'AI mendukung mahasiswa dalam memproduksi komunikasi digital yang mencerminkan kearifan budaya.',
    color: 'from-indigo-600 to-violet-700', badge: 'bg-indigo-100 text-indigo-700',
  },
];

const RUBRIC_INDICATORS = [
  { no: 1, indicator: 'Kesantunan Berbahasa', desc: 'Penggunaan bahasa yang menghormati', weight: '15%' },
  { no: 2, indicator: 'Speech Act Appropriateness', desc: 'Kesesuaian tindak tutur dengan konteks', weight: '12%' },
  { no: 3, indicator: 'Konteks Sosial', desc: 'Pemahaman konteks budaya komunikasi', weight: '12%' },
  { no: 4, indicator: 'Empati Digital', desc: 'Kemampuan merasakan perspektif lawan', weight: '10%' },
  { no: 5, indicator: 'Emotional Control', desc: 'Kendali emosi dalam komunikasi', weight: '10%' },
  { no: 6, indicator: 'Toxicity Level', desc: 'Tingkat ujaran merusak (inverted)', weight: '15%' },
  { no: 7, indicator: 'Cultural Sensitivity', desc: 'Kepekaan terhadap nilai budaya lokal', weight: '12%' },
  { no: 8, indicator: 'Ethical Awareness', desc: 'Kesadaran etika komunikasi digital', weight: '8%' },
  { no: 9, indicator: 'Pragmatic Competence', desc: 'Kompetensi pragmatik keseluruhan', weight: '4%' },
  { no: 10, indicator: 'Communication Maturity', desc: 'Kematangan komunikasi digital', weight: '2%' },
];

export default function LearningEcosystem() {
  const [expandedPhase, setExpandedPhase] = useState(3);
  const [activeTab, setActiveTab] = useState('phases');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const askAI = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Kamu adalah mentor pedagogis PragmaticsAI. Mahasiswa sedang mempelajari skenario 7-Fase Adaptive Ethnographic Pragmatic Inquiry.

Pertanyaan mahasiswa: "${aiQuestion}"

Jawab dengan:
1. Penjelasan pedagogis yang jelas dan akademis
2. Koneksi dengan fase pembelajaran yang relevan
3. Contoh konkret dari kehidupan digital
4. Pertanyaan reflektif lanjutan
Gunakan bahasa Indonesia yang baik.`
    });
    setAiAnswer(res);
    setAiLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-2">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs font-semibold text-indigo-600">7-Phase Adaptive Ethnographic Pragmatic Inquiry · TKT Level 6</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground">Ekosistem Pembelajaran</h1>
        <p className="text-muted-foreground mt-1 text-sm">Model skenario pembelajaran adaptif 7-fase berbasis etnografi pragmatik digital.</p>
      </motion.div>

      {/* Progress overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Fase Selesai', value: '2/7', icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'Fase Aktif', value: 'Fase 3', icon: Activity, color: 'text-indigo-600' },
          { label: 'Modul Tersedia', value: '12', icon: BookOpen, color: 'text-cyan-600' },
          { label: 'Indikator Rubrik', value: '10', icon: Target, color: 'text-amber-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-border shadow-sm text-center">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
            <p className={`text-xl font-bold font-montserrat ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit flex-wrap">
        {[
          { key: 'phases', label: '🎯 7 Fase Pembelajaran' },
          { key: 'rubric', label: '📊 Rubrik Digital Pragmatik' },
          { key: 'ai', label: '🤖 Tanya AI Mentor' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t.key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >{t.label}</button>
        ))}
      </div>

      {/* PHASES TAB */}
      {activeTab === 'phases' && (
        <div className="space-y-3">
          {PHASES.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                p.status === 'aktif' ? 'border-indigo-300 shadow-indigo-100' :
                p.status === 'selesai' ? 'border-emerald-200' : 'border-border opacity-75'
              }`}
            >
              <button onClick={() => setExpandedPhase(expandedPhase === p.phase ? null : p.phase)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {p.status === 'selesai' ? '✓' : p.status === 'terkunci' ? '🔒' : p.phase}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold font-montserrat text-foreground text-sm">Fase {p.phase}: {p.title}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.badge}`}>
                      {p.status === 'aktif' ? '● Aktif' : p.status === 'selesai' ? '✓ Selesai' : '🔒 Terkunci'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.desc}</p>
                </div>
                <div className="text-2xl flex-shrink-0">{p.icon}</div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${expandedPhase === p.phase ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {expandedPhase === p.phase && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-border">
                      <div className="grid sm:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">🎯 Tujuan</p>
                          <ul className="space-y-1">
                            {p.objectives.map((o, j) => (
                              <li key={j} className="text-xs text-foreground flex items-start gap-1.5">
                                <span className="text-primary mt-0.5 flex-shrink-0">▸</span>{o}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">📋 Aktivitas</p>
                          <ul className="space-y-1">
                            {p.activities.map((a, j) => (
                              <li key={j} className="text-xs text-foreground flex items-start gap-1.5">
                                <span className="text-cyan-500 mt-0.5 flex-shrink-0">▸</span>{a}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">🤖 Peran AI</p>
                          <p className="text-xs text-foreground leading-relaxed">{p.ai_role}</p>
                          {p.status === 'aktif' && (
                            <Link to="/ai-analyzer">
                              <Button size="sm" className={`mt-3 bg-gradient-to-r ${p.color} text-white text-xs gap-1`}>
                                Mulai dengan AI <ArrowRight className="w-3 h-3" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* RUBRIC TAB */}
      {activeTab === 'rubric' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
            <h3 className="font-bold text-indigo-700 mb-1">Digital Pragmatic Rubric System</h3>
            <p className="text-sm text-indigo-600">10 indikator penilaian kompetensi pragmatik digital terintegrasi dengan AI Assessment Engine.</p>
          </div>
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  {['No', 'Indikator', 'Deskripsi', 'Bobot', 'Level'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RUBRIC_INDICATORS.map((r, i) => {
                  const scores = [85, 79, 72, 88, 76, 15, 75, 88, 78, 82];
                  const score = scores[i];
                  const isInverted = r.no === 6;
                  const effectiveScore = isInverted ? 100 - score : score;
                  const level = effectiveScore >= 80 ? { label: 'Sangat Baik', color: 'bg-emerald-100 text-emerald-700' } :
                    effectiveScore >= 65 ? { label: 'Baik', color: 'bg-blue-100 text-blue-700' } :
                    effectiveScore >= 50 ? { label: 'Cukup', color: 'bg-amber-100 text-amber-700' } :
                    { label: 'Perlu Peningkatan', color: 'bg-rose-100 text-rose-700' };
                  return (
                    <tr key={i} className="hover:bg-secondary/20">
                      <td className="px-4 py-3 text-center font-bold text-muted-foreground w-10">{r.no}</td>
                      <td className="px-4 py-3 font-semibold text-foreground text-xs">{r.indicator}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{r.desc}</td>
                      <td className="px-4 py-3 text-xs font-bold text-primary">{r.weight}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${effectiveScore}%` }} />
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${level.color}`}>{level.label}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* AI MENTOR TAB */}
      {activeTab === 'ai' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />AI Pedagogical Mentor
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Tanya apa saja tentang skenario 7-fase, teori pragmatik, atau materi pembelajaran.</p>
            <div className="flex gap-2 flex-wrap mb-3">
              {[
                'Apa itu 7-fase etnografi?',
                'Jelaskan teori Grice!',
                'Fase 3 aktivitas apa?',
                'Cara meningkatkan kesantunan?',
              ].map((q, i) => (
                <button key={i} onClick={() => setAiQuestion(q)}
                  className="text-xs px-2.5 py-1.5 bg-secondary border border-border rounded-lg hover:bg-primary/10 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
                >{q}</button>
              ))}
            </div>
            <textarea value={aiQuestion} onChange={e => setAiQuestion(e.target.value)}
              placeholder="Tanyakan tentang skenario pembelajaran, teori pragmatik, strategi belajar..."
              className="w-full min-h-[120px] bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none mb-3"
            />
            <Button onClick={askAI} disabled={aiLoading || !aiQuestion.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl"
            >
              {aiLoading ? <><RefreshCw className="w-4 h-4 animate-spin mr-2" />AI Berpikir...</> : <><Sparkles className="w-4 h-4 mr-2" />Tanya AI Mentor</>}
            </Button>
          </div>

          <div>
            {aiAnswer ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-200 p-6 h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <p className="font-bold text-sm text-indigo-700">AI Pedagogical Mentor</p>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{aiAnswer}</p>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-border p-10 flex flex-col items-center text-center h-full justify-center">
                <Brain className="w-12 h-12 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground">Tanya AI Mentor tentang apapun yang ingin kamu pelajari.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}