import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PenLine, Plus, Bot, Calendar, Sparkles, RefreshCw, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

const moodOptions = [
  { value: 'sangat_positif', emoji: '😊', label: 'Sangat Positif', color: 'bg-emerald-50 border-emerald-300 text-emerald-700' },
  { value: 'positif', emoji: '🙂', label: 'Positif', color: 'bg-blue-50 border-blue-300 text-blue-700' },
  { value: 'netral', emoji: '😐', label: 'Netral', color: 'bg-slate-50 border-slate-300 text-slate-700' },
  { value: 'negatif', emoji: '😟', label: 'Negatif', color: 'bg-amber-50 border-amber-300 text-amber-700' },
  { value: 'sangat_negatif', emoji: '😔', label: 'Sangat Negatif', color: 'bg-rose-50 border-rose-300 text-rose-700' },
];

const reflectionPrompts = [
  "Ceritakan pengalaman komunikasi digital Anda hari ini. Apa yang Anda pelajari tentang kesantunan berbahasa?",
  "Apakah Anda menemukan ujaran toksis di media sosial hari ini? Bagaimana respons Anda dan apa yang dapat dipelajari?",
  "Refleksikan: Bagaimana cara Anda menyampaikan ketidaksetujuan secara santun dan etis di media sosial?",
  "Apa tantangan terbesar Anda dalam menjaga etika komunikasi digital? Bagaimana Anda mengatasinya?",
  "Identifikasi satu situasi komunikasi digital yang menarik hari ini dan analisis aspek pragmatiknya.",
  "Bagaimana budaya dan konteks sosial mempengaruhi cara Anda berkomunikasi di platform digital?",
];

export default function Journal() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('netral');
  const [aiFeedback, setAiFeedback] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const queryClient = useQueryClient();

  const { data: journals = [], isLoading } = useQuery({
    queryKey: ['journals'],
    queryFn: () => base44.entities.JurnalReflektif.list('-created_date', 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.JurnalReflektif.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      setShowForm(false);
      setTitle('');
      setContent('');
      setMood('netral');
      setAiFeedback('');
    },
  });

  const getAIFeedback = async () => {
    if (!content.trim()) return;
    setLoadingAI(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Anda adalah mentor akademis yang memberikan umpan balik reflektif dan mendorong pemikiran kritis. Berikan respons untuk refleksi mahasiswa ini tentang etika komunikasi digital:

Judul: "${title}"
Isi refleksi: "${content}"
Suasana hati: ${mood}

Berikan umpan balik yang:
1. Mengapresiasi dengan hangat refleksi mereka
2. Memberikan wawasan tambahan tentang pragmatik dan etika komunikasi
3. Mengajukan pertanyaan refleksi lanjutan untuk mendorong pemikiran lebih dalam
4. Merekomendasikan konsep pragmatik yang relevan untuk dipelajari
Gunakan bahasa Indonesia yang hangat, akademis, dan memotivasi. Maksimal 200 kata.`
    });
    setAiFeedback(res);
    setLoadingAI(false);
  };

  const handleSave = () => {
    createMutation.mutate({ title, content, mood, ai_feedback: aiFeedback });
  };

  const randomPrompt = () => {
    const prompt = reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];
    setContent(prev => prompt + '\n\n' + (prev && prev !== prompt ? prev : ''));
  };

  const getMoodStyle = (val) => moodOptions.find(m => m.value === val) || moodOptions[2];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Jurnal Reflektif</h1>
          <p className="text-muted-foreground mt-1 text-sm">Dokumentasikan perjalanan belajar dan refleksi komunikasi digital Anda.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className={`rounded-xl ${showForm ? 'bg-secondary text-foreground hover:bg-secondary/80 border border-border' : 'bg-primary hover:bg-primary/90 text-white'}`}>
          {showForm ? <><X className="w-4 h-4 mr-2" />Tutup</> : <><Plus className="w-4 h-4 mr-2" />Tulis Refleksi</>}
        </Button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-6 space-y-5 border border-border shadow-sm"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Judul Refleksi</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Judul refleksi Anda..."
                  className="bg-secondary/30 border-border text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Suasana Hati</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {moodOptions.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${mood === m.value ? m.color + ' border' : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary'}`}
                    >
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Isi Refleksi</label>
                <Button variant="outline" size="sm" onClick={randomPrompt} className="rounded-lg text-xs h-7 border-border bg-white hover:bg-secondary">
                  <Sparkles className="w-3 h-3 mr-1 text-primary" /> Prompt Acak
                </Button>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis refleksi Anda di sini tentang pengalaman komunikasi digital, etika berbahasa, atau perjalanan belajar pragmatik..."
                className="min-h-[200px] bg-secondary/30 border-border resize-none text-sm leading-relaxed"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{content.length} karakter</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={getAIFeedback}
                disabled={loadingAI || !content.trim()}
                variant="outline"
                className="rounded-xl border-primary/30 text-primary hover:bg-primary/8 bg-white"
              >
                {loadingAI ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
                {loadingAI ? 'Memproses...' : 'Minta Umpan Balik AI'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || !content.trim() || createMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                {createMutation.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                Simpan Refleksi
              </Button>
            </div>

            {aiFeedback && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-indigo-50 border border-indigo-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-indigo-700">Umpan Balik AI Mentor</span>
                </div>
                <p className="text-sm text-indigo-800 leading-relaxed">{aiFeedback}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journal list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : journals.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-border shadow-sm">
          <div className="w-16 h-16 bg-primary/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PenLine className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Belum Ada Jurnal</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">Mulai tulis refleksi pertama Anda tentang perjalanan belajar pragmatik dan etika komunikasi digital.</p>
          <Button onClick={() => setShowForm(true)} className="mt-4 bg-primary hover:bg-primary/90 text-white rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Mulai Menulis
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {journals.map((j, i) => {
            const ms = getMoodStyle(j.mood);
            return (
              <motion.div
                key={j.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setExpandedId(expandedId === j.id ? null : j.id)}
                className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{ms.emoji}</span>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ms.color}`}>{ms.label}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(j.created_date), 'dd MMM yyyy')}
                    </span>
                  </div>
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-2 line-clamp-1">{j.title}</h4>
                <p className={`text-xs text-muted-foreground leading-relaxed ${expandedId === j.id ? '' : 'line-clamp-3'}`}>{j.content}</p>

                {j.ai_feedback && (
                  <AnimatePresence>
                    {expandedId === j.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border overflow-hidden"
                      >
                        <div className="flex items-center gap-1.5 text-xs text-indigo-600 mb-2 font-semibold">
                          <Bot className="w-3.5 h-3.5" /> Umpan Balik AI
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{j.ai_feedback}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {!expandedId && j.ai_feedback && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                      <Bot className="w-3 h-3" /> Ada umpan balik AI
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}