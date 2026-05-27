import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { localUser } from '@/lib/localUser';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Users, Plus, MessageSquare, BookOpen, Send, Sparkles,
  ChevronRight, Globe, Brain, FileText, RefreshCw, X, Search
} from 'lucide-react';

const SAMPLE_CASES = [
  {
    id: 'c1', platform: 'Twitter', title: 'Komentar Ujaran Kebencian', snippet: '"Dasar bodoh! Gak bisa kerja apa-apa lo!"',
    tags: ['toksik', 'agresi', 'direktif'], color: 'border-rose-200 bg-rose-50'
  },
  {
    id: 'c2', platform: 'Instagram', title: 'Kritik Konstruktif', snippet: '"Kontenmu bagus, tapi coba perkuat risetnya ya kak!"',
    tags: ['santun', 'direktif', 'empati'], color: 'border-emerald-200 bg-emerald-50'
  },
  {
    id: 'c3', platform: 'WhatsApp', title: 'Sarkasme Terselubung', snippet: '"Wah hebat banget ya… kalau memang kamu bisa sih 😒"',
    tags: ['sarkasme', 'ambigu', 'ekspresif'], color: 'border-amber-200 bg-amber-50'
  },
];

const GUIDED_QUESTIONS = [
  'Identifikasi jenis speech act dalam cuplikan ini!',
  'Apakah ada pelanggaran Maxim Grice? Jelaskan!',
  'Bagaimana budaya lokal memandang gaya komunikasi ini?',
  'Apa dampak emosional ujaran ini bagi penerimanya?',
  'Bagaimana cara merekonstruksi kalimat ini agar lebih etis?',
];

export default function StudyGroupCollaboration() {
  const [user] = useState(() => localUser.get());
  const [groups, setGroups] = useState([
    { id: 'g1', name: 'Kelompok Pragmatik A', members: ['ana@univ.ac.id', 'budi@univ.ac.id', 'citra@univ.ac.id'], activeCase: 'c1', memberCount: 3 },
    { id: 'g2', name: 'Tim Analisis Budaya', members: ['dewi@univ.ac.id'], activeCase: 'c2', memberCount: 4 },
  ]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeCase, setActiveCase] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, author: 'Ana', email: 'ana@univ.ac.id', content: 'Menurut saya ini termasuk ekspresif direktif. Ada unsur perintah implisit yang agresif.', ts: '10:32', type: 'member' },
    { id: 2, author: 'AI Fasilitator', email: 'ai', content: '💡 Analisis menarik! Coba pertimbangkan: apakah ada Face Threatening Act (FTA) di sini menurut teori Brown-Levinson?', ts: '10:33', type: 'ai' },
    { id: 3, author: 'Budi', email: 'budi@univ.ac.id', content: 'Setuju Ana. FTA-nya jelas karena menyerang positive face lawan bicara dengan label "bodoh".', ts: '10:35', type: 'member' },
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [activeQuestion, setActiveQuestion] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectGroup = (g) => {
    setSelectedGroup(g);
    setActiveCase(SAMPLE_CASES.find(c => c.id === g.activeCase) || SAMPLE_CASES[0]);
  };

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    const myMsg = { id: Date.now(), author: user?.full_name || 'Saya', email: user?.email || '', content: newMsg, ts: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), type: 'member' };
    setMessages(prev => [...prev, myMsg]);
    const sentMsg = newMsg;
    setNewMsg('');

    // Auto AI facilitation every 3 messages
    if (messages.length % 3 === 2) {
      setAiLoading(true);
      const prompt = `Kamu adalah fasilitator diskusi kelompok pragmatik. Diskusi tentang kasus: "${activeCase?.snippet}". Pesan terakhir mahasiswa: "${sentMsg}". Berikan pertanyaan pemandu atau insight singkat (maks 2 kalimat) dalam Bahasa Indonesia untuk mendorong analisis lebih dalam. Gunakan teori pragmatik seperti speech acts, Grice, atau Brown-Levinson.`;
      const res = await base44.integrations.Core.InvokeLLM({ prompt });
      setMessages(prev => [...prev, {
        id: Date.now() + 1, author: 'AI Fasilitator', email: 'ai',
        content: `💡 ${res}`, ts: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), type: 'ai'
      }]);
      setAiLoading(false);
    }
  };

  const handleGuidedQuestion = async (q) => {
    setActiveQuestion(q);
    setAiLoading(true);
    const prompt = `Kamu adalah fasilitator diskusi pragmatik. Kasus: "${activeCase?.snippet}". Pertanyaan panduan: "${q}". Berikan respons fasilitasi singkat (2-3 kalimat) yang mendorong mahasiswa berpikir kritis, bukan langsung memberi jawaban. Bahasa Indonesia.`;
    const res = await base44.integrations.Core.InvokeLLM({ prompt });
    setMessages(prev => [...prev, {
      id: Date.now(), author: 'AI Fasilitator', email: 'ai',
      content: `🔍 **Pertanyaan Terpandu:** ${q}\n\n💡 ${res}`,
      ts: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), type: 'ai'
    }]);
    setAiLoading(false);
    setActiveQuestion(null);
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newG = { id: `g${Date.now()}`, name: newGroupName, members: [user?.email || ''], activeCase: 'c1', memberCount: 1 };
    setGroups(prev => [...prev, newG]);
    setNewGroupName('');
    setShowNewGroup(false);
    handleSelectGroup(newG);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-2">
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs font-semibold text-indigo-600">Kolaborasi Kelompok Belajar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground">Ruang Kerja Digital</h1>
        <p className="text-muted-foreground mt-1 text-sm">Bentuk kelompok, bagikan kasus etnografi, dan diskusi terpandu bersama AI.</p>
      </motion.div>

      {!selectedGroup ? (
        <div className="max-w-3xl space-y-5">
          {/* Group list */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground text-sm">Kelompok Belajar Anda</h2>
            <Button size="sm" onClick={() => setShowNewGroup(true)} className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" />Buat Kelompok
            </Button>
          </div>

          <AnimatePresence>
            {showNewGroup && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex gap-3"
              >
                <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateGroup()}
                  placeholder="Nama kelompok belajar..."
                  className="flex-1 bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <Button onClick={handleCreateGroup} className="rounded-xl bg-indigo-600 text-white">Buat</Button>
                <Button variant="ghost" onClick={() => setShowNewGroup(false)} size="icon" className="rounded-xl"><X className="w-4 h-4" /></Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid sm:grid-cols-2 gap-4">
            {groups.map((g, i) => (
              <motion.div key={g.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                onClick={() => handleSelectGroup(g)}
                className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-muted-foreground">{g.memberCount} anggota</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{g.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">Kasus aktif: {SAMPLE_CASES.find(c => c.id === g.activeCase)?.title}</p>
                <div className="flex items-center gap-1 text-xs text-primary group-hover:gap-2 transition-all">
                  Masuk ruang kerja <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Case library preview */}
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-primary" />Kasus Etnografi Tersedia
            </h3>
            <div className="space-y-2">
              {SAMPLE_CASES.map(c => (
                <div key={c.id} className={`rounded-xl p-3 border ${c.color}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-foreground">{c.platform} · {c.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 italic">"{c.snippet}"</p>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {c.tags.map(t => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 bg-white/70 border border-current rounded-full text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5 h-[calc(100vh-200px)]">
          {/* Left: case + guided questions */}
          <div className="space-y-4 overflow-y-auto">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedGroup(null)} className="text-xs gap-1 rounded-xl">
                ← Kembali
              </Button>
              <h2 className="font-bold text-sm text-foreground truncate">{selectedGroup.name}</h2>
            </div>

            {/* Active case */}
            {activeCase && (
              <div className={`rounded-2xl border p-4 ${activeCase.color}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{activeCase.platform}</p>
                <p className="font-semibold text-sm text-foreground mb-2">{activeCase.title}</p>
                <p className="text-sm italic text-foreground/80 bg-white/60 rounded-xl p-3 border border-white">"{activeCase.snippet}"</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {activeCase.tags.map(t => (
                    <span key={t} className="text-[9px] px-2 py-0.5 bg-white/70 border rounded-full text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Case switcher */}
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-2">Ganti Kasus:</p>
              <div className="space-y-2">
                {SAMPLE_CASES.map(c => (
                  <button key={c.id} onClick={() => setActiveCase(c)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${activeCase?.id === c.id ? 'border-primary/50 bg-primary/5' : 'border-border bg-white hover:border-primary/30'}`}
                  >
                    <p className="font-semibold">{c.platform}: {c.title}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Guided questions */}
            <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
              <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-violet-500" />Pertanyaan Pemandu AI
              </p>
              <div className="space-y-2">
                {GUIDED_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => handleGuidedQuestion(q)}
                    disabled={!!activeQuestion}
                    className="w-full text-left p-2.5 rounded-xl bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-colors text-xs text-violet-700 font-medium disabled:opacity-50"
                  >
                    {activeQuestion === q ? '⏳ Memproses...' : `${i + 1}. ${q}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Chat workspace */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm flex flex-col">
            {/* Chat header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Diskusi Terpandu</h3>
                <p className="text-xs text-muted-foreground">{selectedGroup.memberCount} anggota · AI Fasilitator aktif</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-600 font-semibold">Live</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(m => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${m.email === user?.email ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${
                    m.type === 'ai' ? 'bg-gradient-to-br from-violet-500 to-indigo-600' :
                    m.email === user?.email ? 'bg-gradient-to-br from-indigo-500 to-cyan-500' : 'bg-secondary border border-border'
                  }`}>
                    {m.type === 'ai' ? <Brain className="w-3.5 h-3.5 text-white" /> :
                     m.author?.[0]?.toUpperCase()}
                  </div>
                  <div className={`max-w-[75%] ${m.email === user?.email ? 'items-end' : 'items-start'} flex flex-col`}>
                    <p className={`text-[10px] text-muted-foreground mb-1 ${m.email === user?.email ? 'text-right' : ''}`}>
                      {m.author} · {m.ts}
                    </p>
                    <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                      m.type === 'ai' ? 'bg-violet-50 border border-violet-200 text-violet-900' :
                      m.email === user?.email ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white' :
                      'bg-secondary/50 border border-border text-foreground'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {aiLoading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-violet-50 border border-violet-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">{[0, 0.15, 0.3].map((d, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}</div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea value={newMsg} onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Tulis analisis atau pendapat Anda... (Enter kirim)"
                  className="flex-1 min-h-[60px] max-h-[100px] resize-none bg-secondary/30 border-border text-sm rounded-xl" />
                <Button onClick={handleSend} disabled={!newMsg.trim() || aiLoading} size="icon"
                  className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl w-11 h-11 flex-shrink-0 self-end">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}