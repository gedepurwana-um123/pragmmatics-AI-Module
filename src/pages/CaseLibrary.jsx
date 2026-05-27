import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { BookOpen, Search, Filter, Brain, Globe, Tag, CheckCircle2, RefreshCw, ChevronRight, Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const SAMPLE_CASES = [
  {
    id: 'c1', title: 'Komentar Kebencian di Postingan Akademik', platform: 'instagram',
    original_text: 'Dasar gak punya malu, sok-sokan posting hal yang lo gak ngerti! Lebih baik diem!',
    context: 'Komentar pada postingan akademik seorang mahasiswa tentang teori pragmatik',
    difficulty: 'Mudah', tags: ['hate speech', 'FTA', 'impoliteness'],
    toxicity_score: 82, politeness_score: 8, cultural_category: 'umum',
    ai_analysis: null,
  },
  {
    id: 'c2', title: 'Sarkasme Terselubung di Twitter', platform: 'twitter',
    original_text: 'Wah, bagus sekali ya penelitian kalian 🙄 Pasti dapat A nih dari dosen yang buta itu.',
    context: 'Respons terhadap pengumuman kelulusan skripsi di Twitter/X',
    difficulty: 'Sedang', tags: ['sarkasme', 'implikatur', 'indirect FTA'],
    toxicity_score: 65, politeness_score: 25, cultural_category: 'umum',
    ai_analysis: null,
  },
  {
    id: 'c3', title: 'Mediasi Konflik Berbasis Nilai Muna', platform: 'whatsapp',
    original_text: 'Maaf sebelumnya, saya merasa ada yang perlu kita diskusikan bersama dengan tenang. Boleh saya sampaikan pendapat saya?',
    context: 'Pesan dalam grup WhatsApp organisasi yang mencoba meredakan konflik',
    difficulty: 'Mudah', tags: ['mediasi', 'kesantunan', 'direktif santun'],
    toxicity_score: 2, politeness_score: 95, cultural_category: 'muna',
    ai_analysis: null,
  },
  {
    id: 'c4', title: 'Cyberbullying Terselubung di TikTok', platform: 'tiktok',
    original_text: 'Ratio 💀 L boomer + ga ada yang peduli konten lo + ketinggalan zaman',
    context: 'Komentar pada video tutorial belajar bahasa oleh mahasiswa',
    difficulty: 'Sulit', tags: ['cyberbullying', 'indirect speech', 'trolling', 'implikatur'],
    toxicity_score: 78, politeness_score: 5, cultural_category: 'umum',
    ai_analysis: null,
  },
  {
    id: 'c5', title: 'Kritik Konstruktif Bermartabat', platform: 'forum_online',
    original_text: 'Perspektif Anda menarik, namun ada beberapa aspek metodologis yang perlu diperkuat. Apakah Anda telah mempertimbangkan teori kontekstual Brown-Levinson?',
    context: 'Forum diskusi akademik online tentang penelitian pragmatik',
    difficulty: 'Sedang', tags: ['kritik konstruktif', 'komisif', 'akademis'],
    toxicity_score: 5, politeness_score: 88, cultural_category: 'buton',
    ai_analysis: null,
  },
  {
    id: 'c6', title: 'Ujaran Provokatif Konteks Budaya Tolaki', platform: 'facebook',
    original_text: 'Adat kita sudah rusak gara-gara orang luar! Jangan biarkan mereka masuk ke komunitas kita!',
    context: 'Postingan di grup Facebook komunitas adat lokal',
    difficulty: 'Sulit', tags: ['provokasi', 'xenofobia', 'konteks kultural'],
    toxicity_score: 72, politeness_score: 15, cultural_category: 'tolaki',
    ai_analysis: null,
  },
];

const PLATFORM_ICONS = { instagram: '📸', twitter: '🐦', tiktok: '🎵', whatsapp: '💬', facebook: '👤', forum_online: '🗨️' };
const DIFFICULTY_COLOR = { Mudah: 'bg-emerald-100 text-emerald-700', Sedang: 'bg-amber-100 text-amber-700', Sulit: 'bg-rose-100 text-rose-700' };

export default function CaseLibrary() {
  const [cases, setCases] = useState(SAMPLE_CASES);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterDiff, setFilterDiff] = useState('all');
  const [studentSpeechAct, setStudentSpeechAct] = useState('');
  const [studentAnnotation, setStudentAnnotation] = useState('');
  const [aiComparison, setAiComparison] = useState(null);
  const [compLoading, setCompLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = cases.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.original_text.toLowerCase().includes(search.toLowerCase());
    const matchPlat = filterPlatform === 'all' || c.platform === filterPlatform;
    const matchDiff = filterDiff === 'all' || c.difficulty === filterDiff;
    return matchSearch && matchPlat && matchDiff;
  });

  const handleCompare = async () => {
    if (!studentSpeechAct.trim() || !studentAnnotation.trim() || !selected) return;
    setCompLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Kamu adalah ahli pragmatik dan evaluator etnografi PragmaticsAI.

KASUS: "${selected.original_text}"
KONTEKS: ${selected.context}
SPEECH ACT MAHASISWA: "${studentSpeechAct}"
ANOTASI ETNOGRAFI MAHASISWA: "${studentAnnotation}"

Bandingkan analisis mahasiswa dengan analisis ahli. Berikan JSON:
- speech_act_expert: klasifikasi speech act yang tepat menurut Austin/Searle
- speech_act_match: true/false apakah mahasiswa tepat
- speech_act_feedback: feedback spesifik tentang klasifikasi speech act
- annotation_expert: anotasi etnografi yang komprehensif
- annotation_score: 0-100 (seberapa baik anotasi mahasiswa)
- annotation_feedback: feedback mendalam tentang anotasi
- missing_elements: elemen pragmatik yang terlewat
- cultural_dimension: dimensi budaya yang relevan
- overall_score: 0-100
- encouragement: pesan motivasi akademis`,
      response_json_schema: {
        type: 'object',
        properties: {
          speech_act_expert: { type: 'string' }, speech_act_match: { type: 'boolean' },
          speech_act_feedback: { type: 'string' }, annotation_expert: { type: 'string' },
          annotation_score: { type: 'number' }, annotation_feedback: { type: 'string' },
          missing_elements: { type: 'string' }, cultural_dimension: { type: 'string' },
          overall_score: { type: 'number' }, encouragement: { type: 'string' },
        }
      }
    });
    setAiComparison(res);
    setSubmitted(true);
    setCompLoading(false);
  };

  const resetAnalysis = () => { setStudentSpeechAct(''); setStudentAnnotation(''); setAiComparison(null); setSubmitted(false); };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs font-semibold text-emerald-600">Interactive Case Library · Ethnographic Analysis · AI Comparison</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Perpustakaan Kasus Interaktif</h1>
        <p className="text-muted-foreground mt-1 text-sm">Analisis skenario komunikasi digital anonim, lakukan anotasi etnografi, dan bandingkan dengan analisis AI.</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Case list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Cari kasus..." className="pl-9 bg-secondary/30" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}
                className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary/40">
                <option value="all">Semua Platform</option>
                {['instagram', 'twitter', 'tiktok', 'whatsapp', 'facebook', 'forum_online'].map(p => (
                  <option key={p} value={p}>{PLATFORM_ICONS[p]} {p}</option>
                ))}
              </select>
              <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)}
                className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary/40">
                <option value="all">Semua Level</option>
                {['Mudah', 'Sedang', 'Sulit'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Cases */}
          <div className="space-y-2">
            {filtered.map((c, i) => (
              <motion.button key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => { setSelected(c); resetAnalysis(); }}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${selected?.id === c.id ? 'bg-indigo-50 border-indigo-300 shadow-sm' : 'bg-white border-border hover:border-indigo-200 hover:shadow-sm'}`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-lg flex-shrink-0">{PLATFORM_ICONS[c.platform]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">{c.title}</p>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${DIFFICULTY_COLOR[c.difficulty]}`}>{c.difficulty}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${c.toxicity_score > 60 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        Toxicity: {c.toxicity_score}%
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 ${selected?.id === c.id ? 'rotate-90' : ''}`} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 pl-7">{c.original_text}</p>
                <div className="flex gap-1 mt-2 pl-7 flex-wrap">
                  {c.tags.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground">#{t}</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Analysis panel */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-dashed border-border p-12 flex flex-col items-center text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground/20 mb-3" />
              <p className="font-semibold text-foreground mb-1">Pilih Kasus untuk Dianalisis</p>
              <p className="text-sm text-muted-foreground max-w-xs">Klik salah satu kasus di sebelah kiri untuk memulai analisis etnografi interaktif.</p>
            </div>
          ) : (
            <motion.div key={selected.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Case detail */}
              <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">{PLATFORM_ICONS[selected.platform]}</span>
                  <div>
                    <h3 className="font-bold font-montserrat text-foreground">{selected.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{selected.context}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[selected.difficulty]}`}>{selected.difficulty}</span>
                      {selected.cultural_category !== 'umum' && (
                        <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-bold">🌿 Budaya {selected.cultural_category}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-secondary/40 rounded-xl p-4 border border-border mb-4">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Teks Anonim</p>
                  <p className="text-sm text-foreground italic">"{selected.original_text}"</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl p-3 border text-center ${selected.toxicity_score > 60 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <p className={`text-lg font-bold font-montserrat ${selected.toxicity_score > 60 ? 'text-rose-600' : 'text-emerald-600'}`}>{selected.toxicity_score}%</p>
                    <p className="text-xs text-muted-foreground">Toxicity</p>
                  </div>
                  <div className={`rounded-xl p-3 border text-center ${selected.politeness_score > 60 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                    <p className={`text-lg font-bold font-montserrat ${selected.politeness_score > 60 ? 'text-emerald-600' : 'text-amber-600'}`}>{selected.politeness_score}%</p>
                    <p className="text-xs text-muted-foreground">Kesantunan</p>
                  </div>
                </div>
              </div>

              {/* Student analysis form */}
              {!submitted ? (
                <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />Analisis Anda
                  </h4>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Klasifikasi Speech Act (Austin/Searle)</label>
                    <input value={studentSpeechAct} onChange={e => setStudentSpeechAct(e.target.value)}
                      placeholder="mis: Ini adalah tindak tutur ekspresif — mengekspresikan emosi negatif..."
                      className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Anotasi Etnografi</label>
                    <Textarea value={studentAnnotation} onChange={e => setStudentAnnotation(e.target.value)}
                      placeholder="Analisis konteks sosial budaya, nilai yang dilanggar/ditunjukkan, implikasi etnografis..."
                      className="min-h-[120px] bg-secondary/30 border-border resize-none text-sm"
                    />
                  </div>
                  <Button onClick={handleCompare} disabled={compLoading || !studentSpeechAct.trim() || !studentAnnotation.trim()}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl gap-2"
                  >
                    {compLoading ? <><RefreshCw className="w-4 h-4 animate-spin" />AI Membandingkan...</> : <><Sparkles className="w-4 h-4" />Bandingkan dengan Analisis AI Ahli</>}
                  </Button>
                </div>
              ) : aiComparison && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {/* Overall score */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-montserrat ${aiComparison.overall_score >= 80 ? 'bg-emerald-100 text-emerald-600' : aiComparison.overall_score >= 60 ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                      {aiComparison.overall_score}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Skor Analisis Anda</p>
                      <p className="text-xs text-muted-foreground">Dibandingkan dengan analisis ahli AI</p>
                      <p className="text-sm text-emerald-700 mt-1 italic">{aiComparison.encouragement}</p>
                    </div>
                  </div>

                  {/* Speech Act comparison */}
                  <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
                    <h5 className="font-semibold text-sm text-foreground">🗣️ Perbandingan Speech Act</h5>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-secondary/40 rounded-xl p-3">
                        <p className="text-xs font-bold text-muted-foreground mb-1">Analisis Anda</p>
                        <p className="text-xs text-foreground">{studentSpeechAct}</p>
                      </div>
                      <div className={`rounded-xl p-3 ${aiComparison.speech_act_match ? 'bg-emerald-50 border border-emerald-200' : 'bg-indigo-50 border border-indigo-200'}`}>
                        <p className="text-xs font-bold text-muted-foreground mb-1">Analisis AI Ahli {aiComparison.speech_act_match ? '✓' : '↗'}</p>
                        <p className="text-xs text-foreground">{aiComparison.speech_act_expert}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground bg-secondary/30 rounded-lg p-3">{aiComparison.speech_act_feedback}</p>
                  </div>

                  {/* Annotation comparison */}
                  <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-sm text-foreground">🌿 Perbandingan Anotasi Etnografi</h5>
                      <span className={`text-sm font-bold font-montserrat px-2 py-0.5 rounded-full ${aiComparison.annotation_score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{aiComparison.annotation_score}/100</span>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                      <p className="text-xs font-bold text-indigo-700 mb-1">Anotasi Komprehensif AI</p>
                      <p className="text-xs text-indigo-800">{aiComparison.annotation_expert}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{aiComparison.annotation_feedback}</p>
                    {aiComparison.missing_elements && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Elemen yang Terlewat</p>
                        <p className="text-xs text-amber-800">{aiComparison.missing_elements}</p>
                      </div>
                    )}
                    {aiComparison.cultural_dimension && (
                      <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
                        <p className="text-xs font-bold text-violet-700 mb-1">🌿 Dimensi Kultural</p>
                        <p className="text-xs text-violet-800">{aiComparison.cultural_dimension}</p>
                      </div>
                    )}
                  </div>

                  <Button onClick={resetAnalysis} variant="outline" className="w-full rounded-xl">Analisis Ulang</Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}