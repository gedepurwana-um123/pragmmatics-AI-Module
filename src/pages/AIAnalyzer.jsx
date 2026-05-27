import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Bot, Zap, AlertTriangle, Shield, Send, Sparkles, RefreshCw,
  CheckCircle2, Brain, MessageSquare, Globe, Target, Layers,
  ChevronRight, Eye, Mic, Network, BookOpen
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { base44 } from '@/api/base44Client';
import { buildAnalysisPrompt, buildChatPrompt } from '@/lib/aiPrompts';
import ToxicityAlert from '@/components/ToxicityAlert';

const SCAFFOLDING_LEVELS = [
  { key: 'pemula', label: 'Pemula', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { key: 'menengah', label: 'Menengah', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { key: 'lanjutan', label: 'Lanjutan', color: 'bg-violet-100 text-violet-700 border-violet-300' },
];

const SAMPLE_TEXTS = [
  { label: 'Santun', text: 'Maaf kak, pendapat kakak menurut saya kurang tepat berdasarkan fakta yang ada. Boleh saya jelaskan?' },
  { label: 'Toksik', text: 'BODOH! Gak ada yang minta pendapat lo! Mending diem aja daripada malu-maluin!' },
  { label: 'Sarkastis', text: 'Wah hebat banget ya kamu, paling pintar se-indonesia kayaknya 😒' },
  { label: 'Kritis', text: 'Sepertinya kontennya kurang riset deh, coba baca lebih banyak referensi yang valid ya.' },
];

const REFLECTIVE_STARTERS = [
  'Bagaimana perasaan lawan bicara menerima komentar ini?',
  'Apakah komunikasi ini menjaga martabat semua pihak?',
  'Bagaimana budaya Buton memandang cara bicara seperti ini?',
  'Prinsip Grice mana yang dilanggar dalam kalimat ini?',
];

export default function AIAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scaffoldingLevel, setScaffoldingLevel] = useState('menengah');
  const [activeTab, setActiveTab] = useState('analysis'); // analysis | graph | cultural | reflective
  const [chatMessages, setChatMessages] = useState([{
    role: 'assistant',
    content: '👋 Selamat datang!\n\nSaya adalah **Asisten AI Pragmatik Berbasis Etnografi** Anda.\n\nMasukkan teks komunikasi digital di sebelah kiri untuk analisis mendalam, atau tanyakan apa saja tentang:\n• Pragmatik bahasa & speech acts\n• Etika komunikasi digital\n• Kearifan budaya Sulawesi Tenggara\n• Teori Grice, Brown-Levinson, Leech\n\nLevel scaffolding saya akan menyesuaikan dengan tingkat belajar Anda.'
  }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setActiveTab('analysis');
    const prompt = buildAnalysisPrompt(text, scaffoldingLevel);
    const schema = {
      type: 'object',
      properties: {
        kesantunan: { type: 'number' }, toxicity: { type: 'number' },
        empati: { type: 'number' }, konteks_sosial: { type: 'number' },
        etika: { type: 'number' }, kejelasan: { type: 'number' },
        sensitivitas_kultural: { type: 'number' }, kematangan_komunikasi: { type: 'number' },
        emotional_tone: { type: 'string' }, speech_act: { type: 'string' },
        speech_act_detail: { type: 'string' }, implicature: { type: 'string' },
        face_threat: { type: 'boolean' }, face_threat_type: { type: 'string' },
        pragmatic_principle: { type: 'string' }, cultural_recommendation: { type: 'string' },
        pragmatic_explanation: { type: 'string' }, ethical_explanation: { type: 'string' },
        emotional_explanation: { type: 'string' }, contextual_explanation: { type: 'string' },
        reflective_question_1: { type: 'string' }, reflective_question_2: { type: 'string' },
        rekomendasi: { type: 'string' }, alternatif: { type: 'string' },
        academic_note: { type: 'string' }, knowledge_graph_path: { type: 'string' },
      }
    };
    const res = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: schema });
    setResult(res);
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setChatLoading(true);
    const ctx = result
      ? `Teks dianalisis: "${text}". Hasil: toxicity=${result.toxicity}%, kesantunan=${result.kesantunan}%, speech_act=${result.speech_act}, emotional_tone=${result.emotional_tone}`
      : '';
    const prompt = buildChatPrompt(userMsg, ctx, scaffoldingLevel, chatMessages);
    const res = await base44.integrations.Core.InvokeLLM({ prompt });
    setChatMessages(prev => [...prev, { role: 'assistant', content: res }]);
    setChatLoading(false);
  };

  const radarData = result ? [
    { subject: 'Kesantunan', A: result.kesantunan },
    { subject: 'Empati', A: result.empati },
    { subject: 'Konteks', A: result.konteks_sosial },
    { subject: 'Etika', A: result.etika },
    { subject: 'Kultural', A: result.sensitivitas_kultural || 70 },
    { subject: 'Maturitas', A: result.kematangan_komunikasi || 65 },
  ] : [];

  const getLevel = (val, inverse = false) => {
    const v = inverse ? 100 - val : val;
    if (v >= 80) return { label: 'Sangat Baik', color: 'text-emerald-600', bg: 'bg-emerald-100 border-emerald-200' };
    if (v >= 60) return { label: 'Baik', color: 'text-blue-600', bg: 'bg-blue-100 border-blue-200' };
    if (v >= 40) return { label: 'Cukup', color: 'text-amber-600', bg: 'bg-amber-100 border-amber-200' };
    return { label: 'Rendah', color: 'text-rose-600', bg: 'bg-rose-100 border-rose-200' };
  };

  const toxBg = (v) => v > 60 ? 'bg-rose-50 border-rose-200' : v > 30 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200';
  const toxText = (v) => v > 60 ? 'text-rose-600' : v > 30 ? 'text-amber-600' : 'text-emerald-600';

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-2">
              <Network className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600">Pragmatic Knowledge Graph · Cultural Wisdom Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground">AI Pragmatic Analyzer</h1>
            <p className="text-muted-foreground mt-1 text-sm">Analisis mendalam berbasis etnografi, knowledge graph, dan kearifan budaya lokal.</p>
          </div>
          {/* Scaffolding selector */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-semibold">Level Scaffolding:</span>
            <div className="flex gap-1.5">
              {SCAFFOLDING_LEVELS.map(l => (
                <button key={l.key} onClick={() => setScaffoldingLevel(l.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${scaffoldingLevel === l.key ? l.color : 'border-border text-muted-foreground hover:bg-secondary'}`}
                >{l.label}</button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Input + Results */}
        <div className="lg:col-span-3 space-y-5">
          {/* Input panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-border shadow-sm"
          >
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />Input Teks Komunikasi Digital
            </h3>
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="text-xs text-muted-foreground self-center">Contoh:</span>
              {SAMPLE_TEXTS.map((t, i) => (
                <button key={i} onClick={() => setText(t.text)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-secondary border border-border hover:bg-primary/10 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all">
                  {t.label}
                </button>
              ))}
            </div>
            <Textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="Masukkan teks komunikasi digital (komentar, pesan, caption media sosial)..."
              className="min-h-[110px] bg-secondary/30 border-border resize-none text-sm" />
            <ToxicityAlert text={text} threshold={50} />
            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleAnalyze} disabled={loading || !text.trim()}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl px-6">
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin mr-2" />Menganalisis...</> : <><Zap className="w-4 h-4 mr-2" />Analisis AI</>}
              </Button>
              <Button variant="outline" onClick={() => { setText(''); setResult(null); }} className="rounded-xl bg-white">Bersihkan</Button>
              <button onClick={() => {
                const q = REFLECTIVE_STARTERS[Math.floor(Math.random() * REFLECTIVE_STARTERS.length)];
                setChatInput(q);
              }} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 transition-colors">
                <Mic className="w-3.5 h-3.5" />Pertanyaan Reflektif
              </button>
            </div>
          </motion.div>

          {/* Loading */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl p-10 flex flex-col items-center border border-border shadow-sm"
              >
                <div className="relative w-16 h-16 mb-4">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-indigo-500 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-300 animate-ping opacity-30" />
                </div>
                <p className="text-sm font-semibold text-foreground">Knowledge Graph sedang memproses...</p>
                <p className="text-xs text-muted-foreground mt-1">Mengintegrasikan pragmatik + budaya + etika</p>
                <div className="flex gap-2 mt-4">
                  {['Speech Act', 'Implikatur', 'Kultural', 'Etika'].map((s, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-200 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>{s}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Result tabs */}
                <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit flex-wrap">
                  {[
                    { key: 'analysis', label: '📊 Analisis', icon: Target },
                    { key: 'graph', label: '🕸️ Knowledge Graph', icon: Network },
                    { key: 'cultural', label: '🌿 Kultural', icon: Globe },
                    { key: 'reflective', label: '💭 Reflektif', icon: BookOpen },
                  ].map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === t.key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >{t.label}</button>
                  ))}
                </div>

                {/* ANALYSIS TAB */}
                {activeTab === 'analysis' && (
                  <div className="space-y-4">
                    {/* Toxicity bar */}
                    <div className={`rounded-2xl border p-5 ${toxBg(result.toxicity)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`w-5 h-5 ${toxText(result.toxicity)}`} />
                          <span className={`font-semibold text-sm ${toxText(result.toxicity)}`}>
                            Toxicity: {result.toxicity > 60 ? '⚠️ Tinggi' : result.toxicity > 30 ? '⚡ Sedang' : '✓ Rendah'}
                          </span>
                          {result.face_threat && (
                            <span className="text-xs px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full border border-rose-200">
                              FTA: {result.face_threat_type}
                            </span>
                          )}
                        </div>
                        <span className={`font-bold text-2xl font-montserrat ${toxText(result.toxicity)}`}>{result.toxicity}%</span>
                      </div>
                      <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${result.toxicity}%` }} transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full" />
                      </div>
                      <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                        <span>Sangat Santun</span><span>Sangat Toksik</span>
                      </div>
                    </div>

                    {/* Scores + Radar */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                        <h4 className="font-semibold text-sm text-foreground mb-3">Radar Kompetensi Pragmatik</h4>
                        <div className="h-52">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                              <PolarGrid stroke="rgba(0,0,0,0.08)" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
                              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                              <Radar dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={2} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-5 border border-border shadow-sm space-y-2.5">
                        <h4 className="font-semibold text-sm text-foreground mb-1">Detail Skor Digital Pragmatic Rubric</h4>
                        {[
                          { label: 'Kesantunan', val: result.kesantunan, color: 'from-indigo-500 to-purple-500' },
                          { label: 'Empati Digital', val: result.empati, color: 'from-cyan-500 to-blue-500' },
                          { label: 'Etika', val: result.etika, color: 'from-emerald-500 to-teal-500' },
                          { label: 'Sensitivitas Kultural', val: result.sensitivitas_kultural || 70, color: 'from-violet-500 to-indigo-500' },
                          { label: 'Kematangan Komunikasi', val: result.kematangan_komunikasi || 65, color: 'from-amber-500 to-orange-500' },
                        ].map((s, i) => {
                          const lv = getLevel(s.val);
                          return (
                            <div key={i}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">{s.label}</span>
                                <span className={`font-semibold text-xs px-1.5 py-0.5 rounded border ${lv.bg} ${lv.color}`}>{s.val}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${s.val}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                                  className={`h-full bg-gradient-to-r ${s.color} rounded-full`} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Speech Act + Implicature */}
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                        <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Speech Act</p>
                        <p className="text-sm font-bold text-primary capitalize">{result.speech_act}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{result.speech_act_detail}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                        <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Implikatur</p>
                        <p className="text-xs text-foreground leading-relaxed">{result.implicature}</p>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                        <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Emotional Tone</p>
                        <p className="text-sm font-bold text-amber-600 capitalize">{result.emotional_tone}</p>
                        <p className="text-xs text-muted-foreground mt-1">{result.emotional_explanation}</p>
                      </div>
                    </div>

                    {/* AI Explainability */}
                    <div className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-3">
                      <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary" />AI Explainability System
                      </h4>
                      {[
                        { label: '📚 Pragmatik', text: result.pragmatic_explanation, color: 'border-indigo-200 bg-indigo-50' },
                        { label: '⚖️ Etika', text: result.ethical_explanation, color: 'border-emerald-200 bg-emerald-50' },
                        { label: '🌐 Kontekstual', text: result.contextual_explanation, color: 'border-cyan-200 bg-cyan-50' },
                      ].map((e, i) => e.text && (
                        <div key={i} className={`rounded-xl p-3 border ${e.color}`}>
                          <p className="text-xs font-bold text-foreground mb-1">{e.label}</p>
                          <p className="text-xs text-foreground leading-relaxed">{e.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recommendation */}
                    <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-emerald-700 text-sm">Rekomendasi Etis AI</span>
                        <span className="ml-auto text-xs px-2 py-0.5 bg-emerald-200 text-emerald-700 rounded-full">{result.pragmatic_principle}</span>
                      </div>
                      <p className="text-sm text-emerald-800 leading-relaxed">{result.rekomendasi}</p>
                      {result.alternatif && (
                        <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-200">
                          <p className="text-xs text-muted-foreground mb-1">✏️ Alternatif yang lebih etis:</p>
                          <p className="text-sm text-emerald-700 italic font-medium">"{result.alternatif}"</p>
                        </div>
                      )}
                    </div>

                    {result.academic_note && (
                      <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-5">
                        <p className="text-xs text-indigo-600 font-bold mb-1 uppercase tracking-wide">📖 Catatan Akademis</p>
                        <p className="text-sm text-indigo-700 leading-relaxed">{result.academic_note}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* KNOWLEDGE GRAPH TAB */}
                {activeTab === 'graph' && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                      <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Network className="w-4 h-4 text-primary" />Pragmatic Knowledge Graph — Reasoning Path
                      </h4>
                      {result.knowledge_graph_path && (
                        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 mb-4">
                          <p className="text-xs font-bold text-indigo-600 mb-2">🕸️ Jalur Reasoning:</p>
                          <p className="text-sm text-indigo-800 font-medium">{result.knowledge_graph_path}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { node: 'Speech Act', value: result.speech_act, color: 'from-indigo-500 to-violet-600', icon: '🗣️' },
                          { node: 'Implikatur', value: 'Gricean Analysis', color: 'from-cyan-500 to-blue-600', icon: '💬' },
                          { node: 'Face Threat', value: result.face_threat ? result.face_threat_type : 'Tidak Terdeteksi', color: result.face_threat ? 'from-rose-500 to-red-600' : 'from-emerald-500 to-teal-600', icon: '🎭' },
                          { node: 'Politeness', value: `${result.kesantunan}%`, color: 'from-emerald-500 to-teal-600', icon: '🤝' },
                          { node: 'Toxicity', value: `${result.toxicity}%`, color: result.toxicity > 50 ? 'from-rose-500 to-red-600' : 'from-amber-500 to-orange-600', icon: '⚠️' },
                          { node: 'Kultural', value: result.sensitivitas_kultural ? `${result.sensitivitas_kultural}%` : 'Teranalisis', color: 'from-violet-500 to-purple-600', icon: '🌿' },
                        ].map((n, i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                            className="rounded-xl p-4 border border-border bg-white shadow-sm text-center hover:shadow-md transition-all"
                          >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${n.color} flex items-center justify-center mx-auto mb-2`}>
                              <span className="text-lg">{n.icon}</span>
                            </div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{n.node}</p>
                            <p className="text-sm font-semibold text-foreground mt-0.5 capitalize">{n.value}</p>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-4 p-4 bg-secondary/40 rounded-xl border border-border">
                        <p className="text-xs font-bold text-foreground mb-2">🔗 Koneksi Graph:</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {['Speech Acts → Implikatur', 'Implikatur → Kesantunan', 'Kesantunan → Nilai Budaya', 'Nilai Budaya → Etika Komunikasi', 'Etika → Rekomendasi Adaptif'].map((c, i) => (
                            <span key={i} className="px-2.5 py-1 bg-white border border-border rounded-full text-muted-foreground">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CULTURAL TAB */}
                {activeTab === 'cultural' && (
                  <div className="space-y-4">
                    {result.cultural_recommendation && (
                      <div className="bg-violet-50 rounded-2xl border border-violet-200 p-5">
                        <p className="text-xs font-bold text-violet-600 mb-2 uppercase tracking-wide">🌿 Cultural Wisdom Recommendation Engine</p>
                        <p className="text-sm text-violet-800 leading-relaxed">{result.cultural_recommendation}</p>
                      </div>
                    )}
                    {[
                      { budaya: 'Tolaki/Mekongga', icon: '🏔️', color: 'border-amber-200 bg-amber-50', text: 'Prinsip mombesara (penghormatan) menekankan komunikasi yang menjaga harmoni sosial dan menghindari penghinaan langsung.', nilai: 'Penghormatan · Harmoni · Martabat' },
                      { budaya: 'Muna', icon: '🌊', color: 'border-blue-200 bg-blue-50', text: 'Kabhanti (kelembutan bahasa) mengajarkan bahwa kritik sebaiknya disampaikan dengan kesabaran dan ketenangan.', nilai: 'Kelembutan · Sabar · Bijak' },
                      { budaya: 'Buton', icon: '⚓', color: 'border-emerald-200 bg-emerald-50', text: 'Bhinci-bhinciki kuli (rasa kemanusiaan) menekankan komunikasi bermartabat yang tidak merendahkan siapapun.', nilai: 'Martabat · Tata Krama · Empati' },
                    ].map((b, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className={`rounded-2xl border p-5 ${b.color}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{b.icon}</span>
                          <div>
                            <p className="font-bold text-sm text-foreground">Budaya {b.budaya}</p>
                            <p className="text-xs text-muted-foreground">{b.nilai}</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{b.text}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* REFLECTIVE TAB */}
                {activeTab === 'reflective' && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                      <h4 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-violet-500" />AI Reflective Learning System
                      </h4>
                      <div className="space-y-3">
                        {[result.reflective_question_1, result.reflective_question_2].filter(Boolean).map((q, i) => (
                          <div key={i} className="p-4 rounded-xl bg-violet-50 border border-violet-200">
                            <p className="text-xs font-bold text-violet-600 mb-1">Pertanyaan Reflektif {i + 1}</p>
                            <p className="text-sm text-violet-800 leading-relaxed">💭 {q}</p>
                            <button onClick={() => setChatInput(q)} className="mt-2 text-xs text-violet-600 hover:underline flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />Diskusikan dengan AI
                            </button>
                          </div>
                        ))}
                        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                          <p className="text-xs font-bold text-indigo-600 mb-1">📚 Prinsip Pragmatik Terkait</p>
                          <p className="text-sm text-indigo-800">{result.pragmatic_principle}</p>
                        </div>
                      </div>
                    </div>
                    {/* Emotional Spectrum Visualizer */}
                    <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                      <h4 className="font-semibold text-sm text-foreground mb-3">🎭 Emotional Communication Analyzer</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Agresi', level: result.toxicity > 60 ? 'Tinggi' : result.toxicity > 30 ? 'Sedang' : 'Rendah', color: result.toxicity > 60 ? 'bg-rose-100 text-rose-700 border-rose-200' : result.toxicity > 30 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                          { label: 'Empati', level: result.empati > 70 ? 'Tinggi' : result.empati > 40 ? 'Sedang' : 'Rendah', color: result.empati > 70 ? 'bg-cyan-100 text-cyan-700 border-cyan-200' : result.empati > 40 ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-secondary text-muted-foreground border-border' },
                          { label: 'Kesantunan', level: result.kesantunan > 70 ? 'Tinggi' : result.kesantunan > 40 ? 'Sedang' : 'Rendah', color: result.kesantunan > 70 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : result.kesantunan > 40 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-rose-100 text-rose-700 border-rose-200' },
                          { label: 'Kontrol Emosi', level: result.kematangan_komunikasi > 70 ? 'Baik' : 'Perlu Latihan', color: result.kematangan_komunikasi > 70 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200' },
                          { label: 'Tone', level: result.emotional_tone || 'netral', color: 'bg-secondary text-muted-foreground border-border' },
                          { label: 'FTA', level: result.face_threat ? result.face_threat_type : 'Tidak Ada', color: result.face_threat ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                        ].map((e, i) => (
                          <div key={i} className={`rounded-xl p-3 border text-center ${e.color}`}>
                            <p className="text-xs font-bold">{e.label}</p>
                            <p className="text-xs mt-0.5 capitalize">{e.level}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!result && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-10 flex flex-col items-center border border-dashed border-border text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <Network className="w-8 h-8 text-indigo-300" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Masukkan Teks untuk Dianalisis</h4>
              <p className="text-sm text-muted-foreground max-w-sm">Knowledge Graph akan memetakan speech acts, implikatur, nilai budaya, dan etika komunikasi secara otomatis.</p>
            </motion.div>
          )}
        </div>

        {/* Right: AI Chat */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border shadow-sm flex flex-col h-[680px] lg:sticky lg:top-8"
          >
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Asisten AI Pragmatik</h3>
                  <p className="text-xs text-emerald-600 font-medium">● Berbasis Etnografi · Level: {SCAFFOLDING_LEVELS.find(l => l.key === scaffoldingLevel)?.label}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[83%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line
                    ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white' : 'bg-secondary/50 text-foreground border border-border'}`}
                  >{msg.content}</div>
                </motion.div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mr-2 mt-1">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-secondary/50 border border-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">{[0, 0.15, 0.3].map((d, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}</div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick questions */}
            <div className="px-4 py-2 border-t border-border/50">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {['Apa itu FTA?', 'Teori Grice?', 'Budaya Buton?', 'Speech act ini?'].map((q, i) => (
                  <button key={i} onClick={() => setChatInput(q)}
                    className="flex-shrink-0 text-xs px-2.5 py-1 bg-secondary rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                  >{q}</button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Tanya tentang pragmatik, budaya, etika..."
                  className="flex-1 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
                />
                <Button onClick={handleChat} disabled={chatLoading || !chatInput.trim()} size="icon"
                  className="bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl w-10 h-10 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}