import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  PenLine, Brain, RefreshCw, Sparkles, BookOpen, Globe,
  MessageSquare, ChevronRight, X, Lightbulb, Heart
} from 'lucide-react';
import { buildReflectivePrompt } from '@/lib/aiPrompts';

const MOODS = [
  { key: 'sangat_positif', emoji: '😄', label: 'Sangat Positif', color: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
  { key: 'positif', emoji: '🙂', label: 'Positif', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { key: 'netral', emoji: '😐', label: 'Netral', color: 'bg-secondary border-border text-muted-foreground' },
  { key: 'negatif', emoji: '😔', label: 'Negatif', color: 'bg-amber-100 border-amber-300 text-amber-700' },
  { key: 'sangat_negatif', emoji: '😢', label: 'Sangat Negatif', color: 'bg-rose-100 border-rose-300 text-rose-700' },
];

const PROMPTS = [
  'Hari ini saya menemukan komunikasi digital yang menarik ketika...',
  'Refleksi saya tentang pola kesantunan yang saya amati di media sosial...',
  'Sebuah ujaran yang membuat saya berpikir tentang etika komunikasi...',
  'Bagaimana nilai budaya Tolaki/Muna/Buton mempengaruhi cara saya berkomunikasi...',
  'Perkembangan kompetensi pragmatik saya hari ini ditunjukkan dengan...',
  'Satu momen komunikasi yang mengajarkan saya tentang empati digital...',
];

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('netral');
  const [aiFeedback, setAiFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    base44.entities.JurnalReflektif.list('-created_date', 20)
      .then(data => setEntries(data || []))
      .catch(() => {});
  }, []);

  const generatePrompt = () => {
    const p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setContent(p);
  };

  const getAiFeedback = async () => {
    if (!content.trim()) return;
    setAiLoading(true);
    const moodLabel = MOODS.find(m => m.key === mood)?.label || 'netral';
    const prompt = buildReflectivePrompt(content, moodLabel);
    const res = await base44.integrations.Core.InvokeLLM({ prompt });
    setAiFeedback(res);
    setAiLoading(false);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    let feedback = aiFeedback;
    if (!feedback) {
      const moodLabel = MOODS.find(m => m.key === mood)?.label || 'netral';
      const prompt = buildReflectivePrompt(content, moodLabel);
      feedback = await base44.integrations.Core.InvokeLLM({ prompt });
    }
    const entry = await base44.entities.JurnalReflektif.create({
      title, content, mood, ai_feedback: feedback, tags: [],
    });
    setEntries(prev => [entry, ...prev]);
    setTitle('');
    setContent('');
    setMood('netral');
    setAiFeedback('');
    setShowForm(false);
    setLoading(false);
  };

  const moodCfg = (key) => MOODS.find(m => m.key === key) || MOODS[2];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 mb-2">
              <Brain className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-xs font-semibold text-violet-600">AI Reflective Learning System · Fase 5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground">Jurnal Reflektif</h1>
            <p className="text-muted-foreground mt-1 text-sm">Dokumentasi refleksi pembelajaran dengan umpan balik mentor AI berbasis etnografi.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl gap-2"
          >
            <PenLine className="w-4 h-4" />Tulis Refleksi
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Refleksi', value: entries.length, icon: BookOpen, color: 'text-indigo-600' },
          { label: 'Minggu Ini', value: entries.filter(e => new Date(e.created_date) > new Date(Date.now() - 7 * 86400000)).length, icon: PenLine, color: 'text-cyan-600' },
          { label: 'Mendapat Feedback AI', value: entries.filter(e => e.ai_feedback).length, icon: Brain, color: 'text-violet-600' },
          { label: 'Mood Positif', value: entries.filter(e => ['positif', 'sangat_positif'].includes(e.mood)).length, icon: Heart, color: 'text-emerald-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border shadow-sm p-4 text-center">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
            <p className={`text-2xl font-bold font-montserrat ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Journal form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <PenLine className="w-4 h-4 text-primary" />Tulis Refleksi Baru
                </h3>
                <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <Input placeholder="Judul refleksi..." value={title} onChange={e => setTitle(e.target.value)} className="bg-secondary/30" />

              {/* Mood */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Suasana Hati</p>
                <div className="flex gap-2 flex-wrap">
                  {MOODS.map(m => (
                    <button key={m.key} onClick={() => setMood(m.key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${mood === m.key ? m.color : 'border-border text-muted-foreground hover:bg-secondary'}`}
                    >
                      <span>{m.emoji}</span>{m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt suggestion */}
              <div className="flex items-center gap-2">
                <button onClick={generatePrompt}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />Prompt Refleksi Acak
                </button>
                <button onClick={getAiFeedback} disabled={aiLoading || !content.trim()}
                  className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 px-3 py-1.5 rounded-lg border border-violet-200 bg-violet-50 hover:bg-violet-100 transition-colors disabled:opacity-50"
                >
                  {aiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}Preview Feedback AI
                </button>
              </div>

              <Textarea value={content} onChange={e => setContent(e.target.value)}
                placeholder="Tulis refleksi Anda tentang pengalaman komunikasi digital hari ini..."
                className="min-h-[160px] bg-secondary/30 border-border resize-none text-sm"
              />

              {/* AI Feedback preview */}
              <AnimatePresence>
                {(aiLoading || aiFeedback) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="bg-violet-50 rounded-xl border border-violet-200 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                        <Brain className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-xs font-bold text-violet-700">Umpan Balik AI Reflective Mentor</p>
                    </div>
                    {aiLoading
                      ? <div className="flex gap-1.5">{[0, 0.15, 0.3].map((d, i) => <div key={i} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${d}s` }} />)}</div>
                      : <p className="text-sm text-violet-800 leading-relaxed whitespace-pre-line">{aiFeedback}</p>
                    }
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                <Button onClick={handleSubmit} disabled={loading || !title.trim() || !content.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? 'Menyimpan...' : 'Simpan Refleksi'}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Batal</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-border p-12 flex flex-col items-center text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/20 mb-3" />
            <p className="font-semibold text-foreground mb-1">Belum ada jurnal</p>
            <p className="text-sm text-muted-foreground">Mulai tulis refleksi pertama Anda untuk mendapatkan feedback dari AI Reflective Mentor.</p>
          </div>
        ) : entries.map((e, i) => {
          const mc = moodCfg(e.mood);
          return (
            <motion.div key={e.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedEntry(selectedEntry?.id === e.id ? null : e)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-sm leading-tight">{e.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${mc.color}`}>{mc.emoji}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{e.content}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{new Date(e.created_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  {e.ai_feedback && (
                    <span className="text-xs text-violet-600 flex items-center gap-1"><Brain className="w-3 h-3" />AI Feedback</span>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {selectedEntry?.id === e.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-5 space-y-3">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Refleksi Lengkap</p>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{e.content}</p>
                      </div>
                      {e.ai_feedback && (
                        <div className="bg-violet-50 rounded-xl border border-violet-200 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-3.5 h-3.5 text-violet-500" />
                            <p className="text-xs font-bold text-violet-700">Umpan Balik AI Reflective Mentor</p>
                          </div>
                          <p className="text-xs text-violet-800 leading-relaxed whitespace-pre-line">{e.ai_feedback}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}