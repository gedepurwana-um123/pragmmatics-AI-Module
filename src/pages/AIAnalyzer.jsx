import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, AlertTriangle, Shield, Send, Sparkles, RefreshCw, CheckCircle2, XCircle, Brain, MessageSquare } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { base44 } from '@/api/base44Client';

const sampleTexts = [
  'Maaf ya kak, pendapat kakak menurut saya kurang tepat berdasarkan fakta yang ada.',
  'BODOH! Gak ada yang minta pendapat lo! Mending diem aja daripada malu-maluin!',
  'Terima kasih atas masukannya, saya akan mempertimbangkan perspektif tersebut.',
  'Sepertinya kontennya kurang riset deh, coba baca lebih banyak referensi ya.',
];

export default function AIAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya asisten AI Pragmatik Anda 👋\n\nMasukkan teks komunikasi digital di sebelah kiri untuk dianalisis, atau tanyakan apa saja tentang pragmatik bahasa Indonesia, etika komunikasi digital, dan kesantunan berbahasa.' }
  ]);
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
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Anda adalah pakar analisis pragmatik bahasa Indonesia. Lakukan analisis komprehensif terhadap teks berikut dari perspektif pragmatik digital dan etika komunikasi:

Teks: "${text}"

Berikan analisis JSON lengkap:
- kesantunan: skor 0-100
- toxicity: skor 0-100 (100 = sangat toksis)
- empati: skor 0-100
- konteks_sosial: skor 0-100
- etika: skor 0-100
- kejelasan: skor 0-100
- emotional_tone: nada emosional (contoh: marah, netral, supportif, sarkastis)
- speech_act: jenis speech act
- speech_act_detail: penjelasan rinci speech act
- implicature: implikatur dalam teks
- pragmatic_principle: prinsip pragmatik yang relevan (Grice/Brown-Levinson/Leech)
- rekomendasi: saran perbaikan komunikasi yang lebih etis
- alternatif: contoh kalimat alternatif yang lebih santun
- academic_note: catatan akademis singkat tentang aspek pragmatik teks ini`,
      response_json_schema: {
        type: "object",
        properties: {
          kesantunan: { type: "number" },
          toxicity: { type: "number" },
          empati: { type: "number" },
          konteks_sosial: { type: "number" },
          etika: { type: "number" },
          kejelasan: { type: "number" },
          emotional_tone: { type: "string" },
          speech_act: { type: "string" },
          speech_act_detail: { type: "string" },
          implicature: { type: "string" },
          pragmatic_principle: { type: "string" },
          rekomendasi: { type: "string" },
          alternatif: { type: "string" },
          academic_note: { type: "string" }
        }
      }
    });
    setResult(res);
    setLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    const contextPrompt = result
      ? `Konteks: Pengguna baru menganalisis teks: "${text}". Hasil analisis: kesantunan=${result.kesantunan}%, toxicity=${result.toxicity}%, speech_act=${result.speech_act}.\n\n`
      : '';

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `${contextPrompt}Anda adalah asisten AI ahli pragmatik bahasa Indonesia. Jawab dengan informatif, akademis, dan mudah dipahami mahasiswa S1. Gunakan bahasa Indonesia yang baik.

Pertanyaan: ${userMsg}`
    });
    setChatMessages(prev => [...prev, { role: 'assistant', content: res }]);
    setChatLoading(false);
  };

  const radarData = result ? [
    { subject: 'Kesantunan', A: result.kesantunan },
    { subject: 'Empati', A: result.empati },
    { subject: 'Konteks', A: result.konteks_sosial },
    { subject: 'Etika', A: result.etika },
    { subject: 'Kejelasan', A: result.kejelasan },
  ] : [];

  const getLevel = (val, inverse = false) => {
    const v = inverse ? 100 - val : val;
    if (v >= 80) return { label: 'Sangat Baik', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    if (v >= 60) return { label: 'Baik', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (v >= 40) return { label: 'Cukup', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { label: 'Rendah', color: 'text-rose-600', bg: 'bg-rose-100' };
  };

  const getToxicityColor = (val) => val > 60 ? 'text-rose-600' : val > 30 ? 'text-amber-600' : 'text-emerald-600';
  const getToxicityBg = (val) => val > 60 ? 'bg-rose-50 border-rose-200' : val > 30 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200';

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">AI Pragmatic Analyzer</h1>
        <p className="text-muted-foreground mt-1 text-sm">Analisis mendalam aspek pragmatik, etika, dan komunikasi digital dengan AI.</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Analyzer - left side */}
        <div className="lg:col-span-3 space-y-5">
          {/* Input */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              Input Teks Komunikasi Digital
            </h3>

            {/* Sample texts */}
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="text-xs text-muted-foreground self-center">Contoh:</span>
              {sampleTexts.slice(0,3).map((t, i) => (
                <button key={i} onClick={() => setText(t)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-secondary border border-border hover:bg-primary/8 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all">
                  Contoh {i+1}
                </button>
              ))}
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Masukkan teks komunikasi digital yang ingin dianalisis (komentar, pesan, caption, dll)..."
              className="min-h-[110px] bg-secondary/30 border-border resize-none mb-4 text-sm"
            />
            <div className="flex gap-3">
              <Button onClick={handleAnalyze} disabled={loading || !text.trim()} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6">
                {loading
                  ? <><RefreshCw className="w-4 h-4 animate-spin mr-2" />Menganalisis...</>
                  : <><Zap className="w-4 h-4 mr-2" />Analisis AI</>}
              </Button>
              <Button variant="outline" onClick={() => { setText(''); setResult(null); }} className="rounded-xl bg-white">
                Bersihkan
              </Button>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-10 flex flex-col items-center border border-border shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <p className="text-sm font-medium text-foreground">AI sedang menganalisis teks...</p>
                <p className="text-xs text-muted-foreground mt-1">Memproses pragmatik, etika, dan konteks komunikasi</p>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Toxicity bar */}
                <div className={`rounded-2xl border p-5 ${getToxicityBg(result.toxicity)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-5 h-5 ${getToxicityColor(result.toxicity)}`} />
                      <span className={`font-semibold text-sm ${getToxicityColor(result.toxicity)}`}>
                        Tingkat Toxicity: {result.toxicity > 60 ? 'Tinggi' : result.toxicity > 30 ? 'Sedang' : 'Rendah'}
                      </span>
                    </div>
                    <span className={`font-bold text-lg font-montserrat ${getToxicityColor(result.toxicity)}`}>{result.toxicity}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.toxicity}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                    <span>Sangat Santun</span><span>Sangat Toksis</span>
                  </div>
                </div>

                {/* Radar + Scores */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                    <h4 className="font-semibold text-sm text-foreground mb-3">Radar Analisis</h4>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(0,0,0,0.08)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                          <Radar dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-border shadow-sm space-y-3">
                    <h4 className="font-semibold text-sm text-foreground mb-1">Detail Skor</h4>
                    {[
                      { label: 'Kesantunan', val: result.kesantunan, color: 'from-indigo-500 to-purple-500' },
                      { label: 'Empati', val: result.empati, color: 'from-cyan-500 to-blue-500' },
                      { label: 'Etika', val: result.etika, color: 'from-emerald-500 to-teal-500' },
                      { label: 'Konteks Sosial', val: result.konteks_sosial, color: 'from-amber-500 to-orange-500' },
                    ].map((s, i) => {
                      const lv = getLevel(s.val);
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{s.label}</span>
                            <span className={`font-semibold text-xs px-1.5 py-0.5 rounded ${lv.bg} ${lv.color}`}>{s.val}%</span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${s.val}%` }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                              className={`h-full bg-gradient-to-r ${s.color} rounded-full`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Speech Act, Implicature, Principle */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">Speech Act</p>
                    <p className="text-sm font-semibold text-primary capitalize">{result.speech_act}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{result.speech_act_detail}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">Implikatur</p>
                    <p className="text-xs text-foreground leading-relaxed">{result.implicature}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200">
                    <p className="text-xs text-indigo-600 font-semibold mb-1">Prinsip Pragmatik</p>
                    <p className="text-xs text-indigo-700 leading-relaxed">{result.pragmatic_principle}</p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-700 text-sm">Rekomendasi AI</span>
                  </div>
                  <p className="text-sm text-emerald-800 leading-relaxed">{result.rekomendasi}</p>
                  {result.alternatif && (
                    <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-200">
                      <p className="text-xs text-muted-foreground mb-1">Alternatif yang lebih santun:</p>
                      <p className="text-sm text-emerald-700 italic font-medium">"{result.alternatif}"</p>
                    </div>
                  )}
                </div>

                {/* Academic note */}
                {result.academic_note && (
                  <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-5">
                    <p className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wide">Catatan Akademis</p>
                    <p className="text-sm text-indigo-700 leading-relaxed">{result.academic_note}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Chat */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border shadow-sm flex flex-col h-[640px] lg:sticky lg:top-8"
          >
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">Asisten AI Pragmatik</h3>
                <p className="text-xs text-emerald-600 font-medium">● Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line
                    ${msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-secondary/60 text-foreground border border-border'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mr-2 mt-1">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-secondary/60 border border-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0, 0.15, 0.3].map((d, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${d}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="Tanyakan tentang pragmatik..."
                  className="flex-1 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
                />
                <Button onClick={handleChat} disabled={chatLoading || !chatInput.trim()} size="icon" className="bg-primary hover:bg-primary/90 text-white rounded-xl w-10 h-10 flex-shrink-0">
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