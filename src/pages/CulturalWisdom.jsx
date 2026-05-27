import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Sparkles, Send, Brain, Shield, Heart, Star, AlertTriangle,
  ChevronDown, BarChart3, MessageSquare, Globe, Zap, Eye, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const CULTURES = [
  {
    id: 'tolaki',
    name: 'Tolaki / Mekongga',
    region: 'Sulawesi Tenggara',
    emoji: '🏔️',
    color: 'from-indigo-500 to-blue-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    textColor: 'text-indigo-700',
    coreValues: ['Penghormatan', 'Harmoni Sosial', 'Kesantunan Verbal', 'Martabat Lawan Bicara'],
    philosophy: 'Mosehe Wonua — memelihara kedamaian dan harmoni dalam kehidupan bermasyarakat',
    feedbackTemplate: 'Dalam budaya Tolaki/Mekongga, komunikasi santun menekankan penghormatan dan menjaga keharmonisan sosial. Ujaran seperti ini sebaiknya diubah dengan mempertimbangkan martabat lawan bicara.',
    proverb: '"Meambo-ambo nokone owose" — Kebaikan yang tulus menjaga keharmonisan bersama',
    indicators: [
      { label: 'Penghormatan', value: 95 },
      { label: 'Harmoni', value: 90 },
      { label: 'Kesantunan', value: 88 },
      { label: 'Martabat', value: 92 },
    ],
  },
  {
    id: 'muna',
    name: 'Muna',
    region: 'Sulawesi Tenggara',
    emoji: '🌊',
    color: 'from-cyan-500 to-teal-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    textColor: 'text-cyan-700',
    coreValues: ['Kelembutan Bahasa', 'Pengendalian Emosi', 'Etika Komunikasi Sosial', 'Kehalusan Tutur'],
    philosophy: 'Poangka-angkataka — saling menghargai dan menjaga perasaan sesama',
    feedbackTemplate: 'Dalam budaya Muna, kritik disampaikan dengan bahasa yang lembut dan tidak menyerang secara langsung. Emosi perlu dikendalikan agar komunikasi tetap bermartabat.',
    proverb: '"Kalau lisumu pogaa" — Jagalah lisanmu dari kata-kata yang menyakiti',
    indicators: [
      { label: 'Kelembutan', value: 92 },
      { label: 'Emosi', value: 88 },
      { label: 'Etika', value: 90 },
      { label: 'Kehalusan', value: 94 },
    ],
  },
  {
    id: 'buton',
    name: 'Buton',
    region: 'Sulawesi Tenggara',
    emoji: '⚓',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    textColor: 'text-violet-700',
    coreValues: ['Kebijaksanaan', 'Tata Krama', 'Penghormatan Sosial', 'Komunikasi Bermartabat'],
    philosophy: 'Bhinci-bhinciki Kuli — rasa empati dan kepekaan terhadap sesama',
    feedbackTemplate: 'Dalam budaya Buton, komunikasi yang bermartabat menghindari ujaran yang merendahkan. Kebijaksanaan mengajarkan kita untuk selalu menempatkan diri dalam posisi yang terhormat.',
    proverb: '"Yinda-yindamo arata somanamo karo" — Harta yang paling berharga adalah diri yang terhormat',
    indicators: [
      { label: 'Kebijaksanaan', value: 96 },
      { label: 'Tata Krama', value: 93 },
      { label: 'Penghormatan', value: 91 },
      { label: 'Martabat', value: 95 },
    ],
  },
];

const ETHICS_METER_DIMS = [
  { key: 'cultural_sensitivity', label: 'Cultural Sensitivity', color: '#4F46E5' },
  { key: 'ethical_awareness', label: 'Ethical Awareness', color: '#0891B2' },
  { key: 'pragmatic_maturity', label: 'Pragmatic Maturity', color: '#10B981' },
  { key: 'emotional_control', label: 'Emotional Control', color: '#F59E0B' },
  { key: 'cultural_adaptation', label: 'Cultural Adaptation', color: '#8B5CF6' },
];

const SAMPLE_TEXTS = [
  'Udah deh, pendapat lo ga penting. Diem aja!',
  'Makasih ya udah bantu, walaupun hasilnya kurang maksimal tapi aku appreciate usahamu.',
  'Anjir lo bego banget sih, masa ga ngerti hal simpel gini!',
];

const tooltipStyle = {
  backgroundColor: '#ffffff', border: '1px solid #e2e8f0',
  borderRadius: '12px', padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

export default function CulturalWisdom() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedCulture, setSelectedCulture] = useState('tolaki');
  const [activeTab, setActiveTab] = useState('analyzer'); // analyzer | insights | ethics

  const culture = CULTURES.find(c => c.id === selectedCulture);

  const analyzeText = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Kamu adalah Cultural Wisdom Recommendation Engine yang menganalisis komunikasi digital dengan perspektif budaya lokal Indonesia (Tolaki/Mekongga, Muna, Buton).

Analisis teks berikut secara komprehensif:
"${inputText}"

Berikan analisis dalam format JSON dengan field berikut:
- toxicity_level: angka 0-100
- politeness_score: angka 0-100
- speech_act: string (asertif/direktif/komisif/ekspresif/deklaratif)
- cultural_sensitivity: angka 0-100
- ethical_awareness: angka 0-100
- pragmatic_maturity: angka 0-100
- emotional_control: angka 0-100
- cultural_adaptation: angka 0-100
- main_issues: array string (masalah utama yang terdeteksi, max 3)
- tolaki_recommendation: string (rekomendasi berdasarkan nilai budaya Tolaki/Mekongga tentang penghormatan dan harmoni sosial)
- muna_recommendation: string (rekomendasi berdasarkan nilai budaya Muna tentang kelembutan bahasa dan pengendalian emosi)
- buton_recommendation: string (rekomendasi berdasarkan nilai budaya Buton tentang kebijaksanaan dan komunikasi bermartabat)
- reconstructed_text: string (rekonstruksi teks menjadi komunikasi yang lebih etis dan santun)
- ethical_level: string (Sangat Baik/Baik/Cukup/Perlu Perbaikan)
- pragmatic_analysis: string (analisis pragmatik singkat 2-3 kalimat)`,
        response_json_schema: {
          type: 'object',
          properties: {
            toxicity_level: { type: 'number' },
            politeness_score: { type: 'number' },
            speech_act: { type: 'string' },
            cultural_sensitivity: { type: 'number' },
            ethical_awareness: { type: 'number' },
            pragmatic_maturity: { type: 'number' },
            emotional_control: { type: 'number' },
            cultural_adaptation: { type: 'number' },
            main_issues: { type: 'array', items: { type: 'string' } },
            tolaki_recommendation: { type: 'string' },
            muna_recommendation: { type: 'string' },
            buton_recommendation: { type: 'string' },
            reconstructed_text: { type: 'string' },
            ethical_level: { type: 'string' },
            pragmatic_analysis: { type: 'string' },
          },
        },
      });
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const radarData = result ? ETHICS_METER_DIMS.map(d => ({
    dim: d.label.split(' ')[0],
    value: result[d.key] ?? 0,
  })) : [];

  const barData = result ? [
    { name: 'Kesantunan', value: result.politeness_score, fill: '#10B981' },
    { name: 'Toxicity', value: result.toxicity_level, fill: '#F43F5E' },
    { name: 'Kultural', value: result.cultural_sensitivity, fill: '#4F46E5' },
    { name: 'Etika', value: result.ethical_awareness, fill: '#F59E0B' },
    { name: 'Pragmatik', value: result.pragmatic_maturity, fill: '#8B5CF6' },
  ] : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 mb-3">
          <Brain className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-xs font-semibold text-violet-600">Cultural Wisdom Recommendation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground">
          AI Kearifan Budaya Lokal
        </h1>
        <p className="text-muted-foreground mt-1 text-sm max-w-2xl">
          Sistem AI terintegrasi yang menganalisis etika komunikasi digital berdasarkan nilai kearifan budaya Tolaki/Mekongga, Muna, dan Buton Sulawesi Tenggara.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-secondary rounded-xl w-fit flex-wrap">
        {[
          { key: 'analyzer', label: '🔍 Analisis Teks', },
          { key: 'insights', label: '🌿 Wawasan Budaya', },
          { key: 'ethics', label: '⚖️ Ethics Meter', },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t.key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: ANALYZER ── */}
      {activeTab === 'analyzer' && (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Input panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4"
          >
            <h3 className="font-semibold text-foreground font-montserrat">Input Komunikasi Digital</h3>

            {/* Sample texts */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Contoh teks uji:</p>
              <div className="space-y-2">
                {SAMPLE_TEXTS.map((s, i) => (
                  <button key={i} onClick={() => setInputText(s)}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg bg-secondary hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-muted-foreground border border-border hover:border-indigo-200"
                  >
                    "{s.length > 60 ? s.slice(0, 60) + '...' : s}"
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Ketik atau tempel teks komunikasi digital yang ingin dianalisis..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="min-h-[120px] resize-none text-sm"
            />
            <Button onClick={analyzeText} disabled={loading || !inputText.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl"
            >
              {loading ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Menganalisis...</>
              ) : (
                <><Brain className="w-4 h-4 mr-2" />Analisis dengan Cultural AI</>
              )}
            </Button>
          </motion.div>

          {/* Result panel */}
          <div className="lg:col-span-3 space-y-4">
            {!result && !loading && (
              <div className="bg-white rounded-2xl border border-dashed border-border p-12 text-center">
                <Brain className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Masukkan teks dan klik Analisis untuk melihat rekomendasi kearifan budaya lokal</p>
              </div>
            )}
            {loading && (
              <div className="bg-white rounded-2xl border border-border p-12 text-center">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Cultural Wisdom Engine sedang memproses...</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Mengintegrasikan nilai Tolaki · Muna · Buton</p>
              </div>
            )}
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Score bar */}
                <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground text-sm">Hasil Analisis Komprehensif</h4>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      result.ethical_level === 'Sangat Baik' ? 'bg-emerald-100 text-emerald-700' :
                      result.ethical_level === 'Baik' ? 'bg-blue-100 text-blue-700' :
                      result.ethical_level === 'Cukup' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>{result.ethical_level}</span>
                  </div>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {barData.map((entry, i) => (
                            <rect key={i} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Key metrics */}
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {[
                      { label: 'Kesantunan', value: `${result.politeness_score}%`, color: 'text-emerald-600' },
                      { label: 'Toxicity', value: `${result.toxicity_level}%`, color: result.toxicity_level > 40 ? 'text-rose-600' : 'text-emerald-600' },
                      { label: 'Speech Act', value: result.speech_act, color: 'text-indigo-600' },
                    ].map((m, i) => (
                      <div key={i} className="bg-secondary/50 rounded-xl p-3 text-center">
                        <p className={`font-bold text-sm ${m.color}`}>{m.value}</p>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pragmatic analysis */}
                {result.main_issues?.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <p className="text-xs font-bold text-amber-700">Isu Terdeteksi</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.main_issues.map((issue, i) => (
                        <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">{issue}</span>
                      ))}
                    </div>
                    <p className="text-xs text-amber-700 mt-2">{result.pragmatic_analysis}</p>
                  </div>
                )}

                {/* Cultural recommendations */}
                <div className="space-y-3">
                  {CULTURES.map(c => (
                    <div key={c.id} className={`${c.bg} border ${c.border} rounded-2xl p-4`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{c.emoji}</span>
                        <div>
                          <p className={`text-xs font-bold ${c.textColor}`}>Rekomendasi Budaya {c.name}</p>
                          <p className="text-[10px] text-muted-foreground">{c.region}</p>
                        </div>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">
                        {result[`${c.id}_recommendation`]}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Reconstructed text */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs font-bold text-emerald-700">Rekonstruksi Komunikasi Etis</p>
                  </div>
                  <p className="text-sm text-emerald-800 font-medium italic">"{result.reconstructed_text}"</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: INSIGHTS ── */}
      {activeTab === 'insights' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CULTURES.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              {/* Culture header */}
              <div className={`bg-gradient-to-br ${c.color} p-5 text-white`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{c.emoji}</span>
                  <div>
                    <h3 className="font-bold font-montserrat text-lg">{c.name}</h3>
                    <p className="text-white/70 text-xs">{c.region}</p>
                  </div>
                </div>
                <p className="text-white/80 text-xs italic leading-relaxed">{c.philosophy}</p>
              </div>

              <div className="p-5 space-y-4">
                {/* Core values */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Nilai Inti</p>
                  <div className="flex flex-wrap gap-2">
                    {c.coreValues.map((v, vi) => (
                      <span key={vi} className={`text-xs px-2 py-1 rounded-full ${c.bg} ${c.textColor} font-medium`}>{v}</span>
                    ))}
                  </div>
                </div>

                {/* Indicators */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Indikator Nilai</p>
                  <div className="space-y-2">
                    {c.indicators.map((ind, ii) => (
                      <div key={ii} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{ind.label}</span>
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${ind.value}%` }}
                            transition={{ delay: i * 0.1 + ii * 0.05, duration: 0.6 }}
                            className={`h-full bg-gradient-to-r ${c.color} rounded-full`}
                          />
                        </div>
                        <span className={`text-xs font-bold ${c.textColor} w-8 text-right`}>{ind.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proverb */}
                <div className={`${c.bg} border ${c.border} rounded-xl p-3`}>
                  <p className={`text-xs font-bold ${c.textColor} mb-1`}>📜 Peribahasa Lokal</p>
                  <p className="text-xs text-foreground italic leading-relaxed">{c.proverb}</p>
                </div>

                {/* Feedback example */}
                <div className="bg-secondary/50 rounded-xl p-3 border border-border">
                  <p className="text-xs font-bold text-muted-foreground mb-1">💬 Contoh Feedback AI</p>
                  <p className="text-xs text-foreground leading-relaxed">"{c.feedbackTemplate}"</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Cultural Wisdom Engine Architecture */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="sm:col-span-2 lg:col-span-3 bg-white rounded-2xl border border-border shadow-sm p-6"
          >
            <h3 className="font-semibold font-montserrat text-foreground mb-4">Arsitektur Cultural Wisdom Engine</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  title: 'AI Processing Layer',
                  icon: Brain,
                  color: 'from-indigo-500 to-blue-600',
                  items: ['NLP Pragmatic Parser', 'Speech Act Detector', 'Toxicity Analyzer', 'Cultural Context Engine'],
                },
                {
                  title: 'Rule Base Layer',
                  icon: Shield,
                  color: 'from-emerald-500 to-teal-600',
                  items: ['Tolaki/Mekongga Rules', 'Muna Ethics Rules', 'Buton Wisdom Rules', 'Cross-cultural Validator'],
                },
                {
                  title: 'Adaptive Scaffolding System',
                  icon: Zap,
                  color: 'from-amber-500 to-orange-600',
                  items: ['ZPD-based Difficulty', 'Cultural Recommendation', 'Personalized Feedback', 'Learning Path Engine'],
                },
              ].map((layer, li) => (
                <div key={li} className="bg-secondary/30 rounded-xl p-4 border border-border">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center mb-3`}>
                    <layer.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">{layer.title}</h4>
                  <ul className="space-y-1">
                    {layer.items.map((item, ii) => (
                      <li key={ii} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── TAB: ETHICS METER ── */}
      {activeTab === 'ethics' && (
        <div className="space-y-5">
          {/* Header metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Cultural Sensitivity', value: 78, icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Ethical Awareness', value: 82, icon: Shield, color: 'text-cyan-600', bg: 'bg-cyan-50' },
              { label: 'Pragmatic Maturity', value: 75, icon: Brain, color: 'text-violet-600', bg: 'bg-violet-50' },
              { label: 'Emotional Control', value: 70, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
              { label: 'Cultural Adaptation', value: 80, icon: RefreshCw, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-border shadow-sm p-4 text-center"
              >
                <div className={`w-10 h-10 rounded-xl ${m.bg} flex items-center justify-center mx-auto mb-2`}>
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <p className={`text-2xl font-bold font-montserrat ${m.color}`}>{m.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{m.label}</p>
                <div className="w-full h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    transition={{ delay: i * 0.07 + 0.2, duration: 0.8 }}
                    className={`h-full rounded-full bg-gradient-to-r ${
                      i === 0 ? 'from-indigo-400 to-indigo-600' :
                      i === 1 ? 'from-cyan-400 to-cyan-600' :
                      i === 2 ? 'from-violet-400 to-violet-600' :
                      i === 3 ? 'from-rose-400 to-rose-600' :
                      'from-emerald-400 to-emerald-600'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Radar chart */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-border shadow-sm p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">Profil Kompetensi Etika Komunikasi</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { dim: 'Cultural', value: 78 },
                    { dim: 'Ethical', value: 82 },
                    { dim: 'Pragmatic', value: 75 },
                    { dim: 'Emotional', value: 70 },
                    { dim: 'Adaptation', value: 80 },
                  ]}>
                    <PolarGrid stroke="rgba(0,0,0,0.06)" />
                    <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Radar name="Skor" dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Dimension details */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4"
            >
              <h3 className="font-semibold text-foreground">Detail Dimensi Ethics Meter</h3>
              {[
                { label: 'Cultural Sensitivity', value: 78, desc: 'Kepekaan terhadap perbedaan budaya dalam komunikasi', color: 'from-indigo-500 to-blue-500' },
                { label: 'Ethical Communication Awareness', value: 82, desc: 'Kesadaran terhadap etika dalam berkomunikasi digital', color: 'from-cyan-500 to-teal-500' },
                { label: 'Pragmatic Maturity', value: 75, desc: 'Kematangan dalam pemahaman konteks pragmatik', color: 'from-violet-500 to-purple-500' },
                { label: 'Emotional Communication Control', value: 70, desc: 'Kemampuan mengelola emosi dalam komunikasi', color: 'from-rose-500 to-pink-500' },
                { label: 'Cultural Communication Adaptation', value: 80, desc: 'Adaptasi komunikasi lintas budaya lokal', color: 'from-emerald-500 to-green-500' },
              ].map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-foreground">{d.label}</span>
                    <span className="text-xs font-bold text-muted-foreground">{d.value}/100</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.value}%` }}
                      transition={{ delay: i * 0.07 + 0.3, duration: 0.7 }}
                      className={`h-full rounded-full bg-gradient-to-r ${d.color}`}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{d.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}