import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PenLine, Plus, Bot, Calendar, Tag, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

const moodOptions = [
  { value: 'sangat_positif', emoji: '😊', label: 'Sangat Positif' },
  { value: 'positif', emoji: '🙂', label: 'Positif' },
  { value: 'netral', emoji: '😐', label: 'Netral' },
  { value: 'negatif', emoji: '😟', label: 'Negatif' },
  { value: 'sangat_negatif', emoji: '😔', label: 'Sangat Negatif' },
];

const reflectionPrompts = [
  "Ceritakan pengalaman komunikasi digital Anda hari ini. Apa yang Anda pelajari tentang kesantunan?",
  "Apakah Anda menemukan ujaran toksis di media sosial? Bagaimana respons Anda?",
  "Refleksikan: Bagaimana cara Anda menyampaikan ketidaksetujuan secara santun di media sosial?",
  "Apa tantangan terbesar Anda dalam menjaga etika komunikasi digital?",
];

export default function Journal() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('netral');
  const [aiFeedback, setAiFeedback] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
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
      prompt: `Anda adalah mentor akademik yang memberikan umpan balik reflektif. Berikan respons singkat dan mendukung untuk refleksi mahasiswa berikut tentang etika komunikasi digital:

Judul: "${title}"
Isi refleksi: "${content}"
Suasana hati: ${mood}

Berikan umpan balik yang:
1. Mengapresiasi refleksi mereka
2. Memberikan wawasan tambahan tentang pragmatik
3. Mendorong refleksi lebih dalam
Gunakan bahasa Indonesia yang hangat dan akademis.`
    });
    setAiFeedback(res);
    setLoadingAI(false);
  };

  const handleSave = () => {
    createMutation.mutate({ title, content, mood, ai_feedback: aiFeedback });
  };

  const randomPrompt = () => {
    const prompt = reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];
    setContent(prompt + '\n\n');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-space">Jurnal Reflektif</h1>
          <p className="text-muted-foreground mt-1">Dokumentasikan perjalanan belajar dan refleksi Anda.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90 rounded-xl">
          <Plus className="w-4 h-4 mr-2" /> Tulis Refleksi
        </Button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-light rounded-2xl p-6 space-y-4 overflow-hidden"
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul refleksi..."
              className="bg-background/50 border-border/50 text-lg font-space"
            />

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground mr-1">Suasana:</span>
              {moodOptions.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${mood === m.value ? 'bg-primary/20 border border-primary/30' : 'bg-background/40 hover:bg-background/60'}`}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={randomPrompt} className="rounded-lg text-xs">
                <Sparkles className="w-3 h-3 mr-1" /> Prompt Refleksi
              </Button>
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis refleksi Anda di sini..."
              className="min-h-[200px] bg-background/50 border-border/50 resize-none"
            />

            <div className="flex gap-3">
              <Button onClick={getAIFeedback} disabled={loadingAI || !content.trim()} variant="outline" className="rounded-xl">
                {loadingAI ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Bot className="w-4 h-4 mr-2" />}
                Minta Umpan Balik AI
              </Button>
              <Button onClick={handleSave} disabled={!title.trim() || !content.trim()} className="bg-primary hover:bg-primary/90 rounded-xl">
                Simpan Refleksi
              </Button>
            </div>

            {aiFeedback && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Umpan Balik AI</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{aiFeedback}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journal list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : journals.length === 0 ? (
        <div className="glass-light rounded-2xl p-12 text-center">
          <PenLine className="w-10 h-10 text-primary/40 mx-auto mb-3" />
          <h3 className="font-semibold font-space mb-1">Belum Ada Jurnal</h3>
          <p className="text-sm text-muted-foreground">Mulai tulis refleksi pertama Anda tentang perjalanan belajar pragmatik.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {journals.map((j, i) => (
            <motion.div
              key={j.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-light rounded-2xl p-5 hover:border-primary/20 transition-all cursor-default"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{moodOptions.find(m => m.value === j.mood)?.emoji || '📝'}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(j.created_date), 'dd MMM yyyy')}</span>
              </div>
              <h4 className="font-semibold font-space text-sm mb-2 line-clamp-1">{j.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{j.content}</p>
              {j.ai_feedback && (
                <div className="mt-3 pt-3 border-t border-border/20">
                  <div className="flex items-center gap-1 text-xs text-primary mb-1">
                    <Bot className="w-3 h-3" /> Umpan Balik AI
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{j.ai_feedback}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}