import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Zap, AlertTriangle, Shield, MessageCircle, TrendingUp } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const mockAnalysis = {
  kesantunan: 15,
  toxicity: 88,
  empati: 8,
  konteks_sosial: 22,
  etika: 12,
  speech_act: 'Ekspresif — Menghina',
  implikatur: 'Merendahkan kemampuan intelektual lawan bicara',
  rekomendasi: 'Gunakan pendekatan yang lebih menghargai perspektif berbeda. Contoh: "Saya kurang setuju dengan pendapat ini, mungkin kita bisa diskusikan lebih lanjut?"',
};

const radarData = [
  { subject: 'Kesantunan', A: 15 },
  { subject: 'Empati', A: 8 },
  { subject: 'Konteks', A: 22 },
  { subject: 'Etika', A: 12 },
  { subject: 'Kejelasan', A: 35 },
  { subject: 'Relevansi', A: 40 },
];

export default function AIAnalyzerDemo() {
  const [text, setText] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setAnalyzed(true);
      setLoading(false);
    }, 1500);
  };

  const defaultText = "Dasar bodoh, opini seperti ini tidak layak diposting.";

  return (
    <section className="relative py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-wider">Demo Interaktif</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-space mt-3 mb-4">
            <span className="text-gradient">AI Pragmatic Analyzer</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Coba analisis teks untuk melihat bagaimana AI mengidentifikasi aspek pragmatik dan etika komunikasi.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-light rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold font-space">Input Teks</h3>
                <p className="text-xs text-muted-foreground">Masukkan teks komunikasi untuk dianalisis</p>
              </div>
            </div>
            <Textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setAnalyzed(false); }}
              placeholder={defaultText}
              className="min-h-[120px] bg-background/50 border-border/50 resize-none mb-4"
            />
            <Button
              onClick={() => { if (!text) setText(defaultText); handleAnalyze(); }}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 rounded-xl py-5"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menganalisis...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Analisis dengan AI
                </span>
              )}
            </Button>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {analyzed ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="glass-light rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-space">Hasil Analisis AI</h3>
                    <p className="text-xs text-muted-foreground">Analisis pragmatik komprehensif</p>
                  </div>
                </div>

                {/* Toxicity indicator */}
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="text-sm font-semibold text-rose-400">Tingkat Toxicity Tinggi</span>
                  </div>
                  <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${mockAnalysis.toxicity}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{mockAnalysis.toxicity}% — Sangat Tidak Santun</p>
                </div>

                {/* Radar Chart */}
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                      <Radar name="Skor" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-background/40 p-3">
                    <p className="text-xs text-muted-foreground">Speech Act</p>
                    <p className="text-sm font-medium text-amber-400">{mockAnalysis.speech_act}</p>
                  </div>
                  <div className="rounded-lg bg-background/40 p-3">
                    <p className="text-xs text-muted-foreground">Kesantunan</p>
                    <p className="text-sm font-medium text-rose-400">{mockAnalysis.kesantunan}%</p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-400">Rekomendasi AI</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{mockAnalysis.rekomendasi}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-light rounded-2xl p-6 flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold font-space mb-2">Hasil Analisis</h3>
                <p className="text-sm text-muted-foreground">Masukkan teks dan klik "Analisis dengan AI" untuk melihat hasil analisis pragmatik.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}