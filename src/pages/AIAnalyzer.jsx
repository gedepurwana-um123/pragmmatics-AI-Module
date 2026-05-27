import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Zap, AlertTriangle, Shield, Send, Sparkles, RefreshCw } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { base44 } from '@/api/base44Client';

export default function AIAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya asisten AI pragmatik Anda. Kirimkan teks komunikasi digital dan saya akan menganalisis aspek kesantunan, speech act, dan etika komunikasinya. Anda juga bisa bertanya apa saja tentang pragmatik!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Anda adalah pakar analisis pragmatik bahasa Indonesia. Analisis teks berikut dari perspektif pragmatik digital dan etika komunikasi:

Teks: "${text}"

Berikan analisis dalam format JSON berikut:
- kesantunan: skor 0-100
- toxicity: skor 0-100
- empati: skor 0-100
- konteks_sosial: skor 0-100
- etika: skor 0-100
- kejelasan: skor 0-100
- speech_act: jenis (asertif/direktif/komisif/ekspresif/deklaratif) dan penjelasan singkat
- implikatur: penjelasan implikatur dalam teks
- rekomendasi: saran perbaikan komunikasi yang lebih etis (dalam bahasa Indonesia)
- alternatif: contoh kalimat alternatif yang lebih santun`,
      response_json_schema: {
        type: "object",
        properties: {
          kesantunan: { type: "number" },
          toxicity: { type: "number" },
          empati: { type: "number" },
          konteks_sosial: { type: "number" },
          etika: { type: "number" },
          kejelasan: { type: "number" },
          speech_act: { type: "string" },
          implikatur: { type: "string" },
          rekomendasi: { type: "string" },
          alternatif: { type: "string" }
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

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Anda adalah asisten AI ahli pragmatik bahasa Indonesia. Jawab pertanyaan berikut dengan cara yang informatif, akademis namun mudah dipahami mahasiswa. Gunakan bahasa Indonesia yang baik dan santun. Jika pertanyaan berkaitan dengan analisis teks, berikan analisis pragmatik yang komprehensif.

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

  const getToxicityColor = (val) => val > 60 ? 'text-rose-400' : val > 30 ? 'text-amber-400' : 'text-emerald-400';
  const getToxicityBg = (val) => val > 60 ? 'bg-rose-500/10 border-rose-500/20' : val > 30 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20';
  const getToxicityLabel = (val) => val > 60 ? 'Tinggi' : val > 30 ? 'Sedang' : 'Rendah';

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-space">AI Pragmatic Analyzer</h1>
        <p className="text-muted-foreground mt-1">Analisis aspek pragmatik dan etika komunikasi digital dengan AI.</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Analyzer - left side */}
        <div className="lg:col-span-3 space-y-6">
          {/* Input */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-light rounded-2xl p-6">
            <h3 className="font-semibold font-space mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Input Teks Komunikasi
            </h3>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Masukkan teks komunikasi digital yang ingin dianalisis..."
              className="min-h-[100px] bg-background/50 border-border/50 resize-none mb-4"
            />
            <div className="flex gap-3">
              <Button onClick={handleAnalyze} disabled={loading || !text.trim()} className="bg-primary hover:bg-primary/90 rounded-xl">
                {loading ? (
                  <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" />Menganalisis...</span>
                ) : (
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4" />Analisis</span>
                )}
              </Button>
              <Button variant="outline" onClick={() => { setText(''); setResult(null); }} className="rounded-xl">
                Bersihkan
              </Button>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Toxicity */}
                <div className={`rounded-2xl border p-5 ${getToxicityBg(result.toxicity)}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className={`w-5 h-5 ${getToxicityColor(result.toxicity)}`} />
                    <span className={`font-semibold ${getToxicityColor(result.toxicity)}`}>
                      Tingkat Toxicity: {getToxicityLabel(result.toxicity)}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-background/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.toxicity}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Santun</span><span>Toksis</span>
                  </div>
                </div>

                {/* Radar + Scores */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass-light rounded-2xl p-5">
                    <h4 className="font-semibold font-space text-sm mb-3">Radar Analisis</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                          <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                          <Radar dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="glass-light rounded-2xl p-5 space-y-3">
                    <h4 className="font-semibold font-space text-sm mb-3">Detail Skor</h4>
                    {[
                      { label: 'Kesantunan', val: result.kesantunan, color: 'from-indigo-500 to-purple-500' },
                      { label: 'Empati', val: result.empati, color: 'from-cyan-500 to-blue-500' },
                      { label: 'Etika', val: result.etika, color: 'from-emerald-500 to-teal-500' },
                      { label: 'Konteks Sosial', val: result.konteks_sosial, color: 'from-amber-500 to-orange-500' },
                    ].map((s, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{s.label}</span>
                          <span className="font-medium">{s.val}%</span>
                        </div>
                        <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.val}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className={`h-full bg-gradient-to-r ${s.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speech Act & Implikatur */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass-light rounded-2xl p-5">
                    <h4 className="font-semibold font-space text-sm mb-2">Speech Act</h4>
                    <p className="text-sm text-muted-foreground">{result.speech_act}</p>
                  </div>
                  <div className="glass-light rounded-2xl p-5">
                    <h4 className="font-semibold font-space text-sm mb-2">Implikatur</h4>
                    <p className="text-sm text-muted-foreground">{result.implikatur}</p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-emerald-400 text-sm">Rekomendasi AI</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.rekomendasi}</p>
                  {result.alternatif && (
                    <div className="mt-3 p-3 rounded-xl bg-background/30">
                      <p className="text-xs text-muted-foreground mb-1">Alternatif yang lebih santun:</p>
                      <p className="text-sm text-emerald-300 italic">"{result.alternatif}"</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Chat - right side */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-light rounded-2xl flex flex-col h-[600px] lg:sticky lg:top-8"
          >
            <div className="p-4 border-b border-border/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold font-space text-sm">Asisten AI Pragmatik</h3>
                <p className="text-xs text-emerald-400">Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background/60 border border-border/30'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-background/60 border border-border/30 rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="Tanyakan tentang pragmatik..."
                  className="flex-1 bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button onClick={handleChat} disabled={chatLoading || !chatInput.trim()} size="icon" className="bg-primary hover:bg-primary/90 rounded-xl w-10 h-10">
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