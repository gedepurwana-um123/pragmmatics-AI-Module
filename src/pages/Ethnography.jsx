import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Globe, MessageSquare, AlertTriangle, Shield, Filter, ChevronRight } from 'lucide-react';

const cases = [
  {
    id: 1, title: 'Cyberbullying di Kolom Komentar Instagram',
    platform: 'instagram', type: 'toksis', speech_act: 'ekspresif',
    context: 'Remaja menghina penampilan fisik selebgram muda dalam kolom komentar dengan bahasa yang sangat kasar',
    analysis: 'Pelanggaran maksim kesantunan Brown & Levinson. Penggunaan bahasa ofensif yang merusak muka positif (positive face) lawan bicara. Termasuk dalam kategori Face Threatening Act (FTA) yang ekstrem.',
    cultural_context: 'Budaya pop digital remaja Indonesia',
    principle: 'Brown-Levinson Face Theory',
    tags: ['cyberbullying', 'body shaming', 'FTA'],
    sample: '"Ih jelek banget sih mukanya, gak cocok jadi influencer. Mending berhenti aja deh!"',
  },
  {
    id: 2, title: 'Diskusi Politik yang Santun di Twitter',
    platform: 'twitter', type: 'santun', speech_act: 'asertif',
    context: 'Dua pengguna berdebat tentang kebijakan pendidikan dengan bahasa yang menghargai perspektif berbeda',
    analysis: 'Contoh implementasi prinsip kesantunan Leech dalam konteks digital. Penggunaan hedging dan strategi kesantunan positif yang efektif. Mematuhi maksim Grice.',
    cultural_context: 'Diskursus politik Indonesia kontemporer',
    principle: 'Leech Politeness Principle',
    tags: ['politik', 'diskusi santun', 'kesantunan positif'],
    sample: '"Saya menghargai pandangan Anda, namun data menunjukkan perspektif yang berbeda. Mari kita diskusikan lebih lanjut."',
  },
  {
    id: 3, title: 'Hate Speech di Forum Online',
    platform: 'forum_online', type: 'toksis', speech_act: 'direktif',
    context: 'Pengguna forum menyerang kelompok minoritas dengan ujaran kebencian dan ancaman terselubung',
    analysis: 'Pelanggaran serius terhadap etika komunikasi digital. Speech act direktif yang mengandung ancaman dan diskriminasi. Melanggar prinsip koperasi Grice secara keseluruhan.',
    cultural_context: 'Pluralisme sosial Indonesia',
    principle: 'Grice Cooperative Principle',
    tags: ['hate speech', 'diskriminasi', 'direktif'],
    sample: '"Kelompok seperti kalian tidak punya tempat di sini. Lebih baik pergi dari forum ini!"',
  },
  {
    id: 4, title: 'Kearifan Lokal dalam Komunikasi WhatsApp',
    platform: 'whatsapp', type: 'santun', speech_act: 'komisif',
    context: 'Komunikasi antar generasi yang mengintegrasikan nilai-nilai unggah-ungguh Jawa dalam grup keluarga',
    analysis: 'Contoh penerapan kearifan lokal Jawa dalam komunikasi digital. Penggunaan bahasa halus dan strategi penghormatan hierarki yang kaya implikatur budaya.',
    cultural_context: 'Budaya Jawa - unggah-ungguh',
    principle: 'Cultural Pragmatics',
    tags: ['kearifan lokal', 'Jawa', 'implikatur budaya'],
    sample: '"Kepareng kula matur, menawi mboten wonten halangan, kula nyuwun pamit badhe tindak."',
  },
  {
    id: 5, title: 'Trolling dan Sarkasme di TikTok',
    platform: 'tiktok', type: 'kurang_santun', speech_act: 'ekspresif',
    context: 'Pengguna TikTok menggunakan sarkasme dan ironi berlebihan untuk merespons konten edukasi',
    analysis: 'Penggunaan implikatur percakapan untuk menyampaikan makna negatif secara tidak langsung. Pelanggaran prinsip kerjasama Grice melalui ironi dan sarkasme.',
    cultural_context: 'Budaya digital Gen Z Indonesia',
    principle: 'Conversational Implicature (Grice)',
    tags: ['sarkasme', 'trolling', 'implikatur'],
    sample: '"Oh ya tentu, kamu paling pintar deh. Terusin aja ngajarin orang-orang yang gak diminta 🙄"',
  },
  {
    id: 6, title: 'Peer Support dalam Grup Akademik Facebook',
    platform: 'facebook', type: 'santun', speech_act: 'ekspresif',
    context: 'Mahasiswa saling mendukung dalam menghadapi tekanan akademik di grup Facebook kampus',
    analysis: 'Implementasi empati digital dan solidaritas melalui speech act ekspresif positif. Menunjukkan kesantunan kolektif dan solidarity politeness.',
    cultural_context: 'Komunitas akademik mahasiswa',
    principle: 'Solidarity Politeness Strategy',
    tags: ['peer support', 'empati', 'solidaritas'],
    sample: '"Semangat teman-teman! Kita pasti bisa melewati masa UAS ini bersama. Kalau perlu diskusi, DM aku ya!"',
  },
  {
    id: 7, title: 'Netizen Cancel Culture di Twitter',
    platform: 'twitter', type: 'toksis', speech_act: 'deklaratif',
    context: 'Gerakan massal di Twitter yang menyerang selebriti karena kontroversi masa lalu dengan hashtag koordinasi',
    analysis: 'Fenomena cancel culture sebagai bentuk hukuman sosial kolektif di media digital. Menggunakan speech act deklaratif untuk "membatalkan" seseorang secara sosial.',
    cultural_context: 'Budaya digital kontemporer, cancel culture',
    principle: 'Speech Act Theory (Austin-Searle)',
    tags: ['cancel culture', 'deklaratif', 'hukuman sosial'],
    sample: '"Sudah terbukti! [nama selebritis] harus di-cancel! RT untuk menyebar! #Cancel[nama]"',
  },
  {
    id: 8, title: 'Komunikasi Dosen-Mahasiswa via WhatsApp',
    platform: 'whatsapp', type: 'santun', speech_act: 'direktif',
    context: 'Mahasiswa meminta izin dan bertanya tentang tugas kepada dosen melalui pesan WhatsApp dengan strategi kesantunan',
    analysis: 'Penggunaan strategi kesantunan negatif (negative politeness) dalam konteks hierarki akademik. Off-record request yang efektif dengan banyak face-saving act.',
    cultural_context: 'Hierarki akademik Indonesia',
    principle: 'Negative Politeness Strategy',
    tags: ['hierarki', 'kesantunan negatif', 'face-saving'],
    sample: '"Selamat siang Bapak, maaf mengganggu. Kira-kira apakah Bapak berkenan menjelaskan soal tugas nomor 3?"',
  },
];

const typeColors = {
  santun: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  kurang_santun: 'bg-amber-100 text-amber-700 border-amber-300',
  toksis: 'bg-rose-100 text-rose-700 border-rose-300',
  netral: 'bg-slate-100 text-slate-700 border-slate-300',
  ambigu: 'bg-violet-100 text-violet-700 border-violet-300',
};

const platformIcons = {
  instagram: '📸', twitter: '🐦', tiktok: '🎵',
  whatsapp: '💬', facebook: '👥', forum_online: '🌐'
};

const platformLabels = {
  instagram: 'Instagram', twitter: 'Twitter/X', tiktok: 'TikTok',
  whatsapp: 'WhatsApp', facebook: 'Facebook', forum_online: 'Forum Online'
};

export default function Ethnography() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);

  const filtered = cases.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase())
      || c.tags.some(t => t.includes(search.toLowerCase()))
      || c.context.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || c.type === filterType;
    const matchPlatform = filterPlatform === 'all' || c.platform === filterPlatform;
    return matchSearch && matchType && matchPlatform;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Perpustakaan Kasus Etnografi Digital</h1>
        <p className="text-muted-foreground mt-1 text-sm">Studi kasus komunikasi digital dari berbagai konteks budaya dan sosial Indonesia.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Kasus', value: cases.length, icon: BookOpen, color: 'from-indigo-500 to-purple-600' },
          { label: 'Kasus Toksis', value: cases.filter(c=>c.type==='toksis').length, icon: AlertTriangle, color: 'from-rose-500 to-red-600' },
          { label: 'Kasus Santun', value: cases.filter(c=>c.type==='santun').length, icon: Shield, color: 'from-emerald-500 to-teal-600' },
          { label: 'Platform', value: [...new Set(cases.map(c=>c.platform))].length, icon: Globe, color: 'from-cyan-500 to-blue-600' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.05 }}
            className="bg-white rounded-2xl p-4 border border-border shadow-sm flex items-center gap-3"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold font-montserrat text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kasus, tag, atau konteks..."
            className="pl-10 bg-white border-border rounded-xl shadow-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'santun', 'kurang_santun', 'toksis'].map(t => (
            <Button key={t} onClick={() => setFilterType(t)}
              variant={filterType === t ? 'default' : 'outline'}
              size="sm" className={`rounded-lg text-xs ${filterType === t ? 'bg-primary text-white' : 'bg-white border-border hover:bg-secondary'}`}
            >
              {t === 'all' ? 'Semua' : t === 'kurang_santun' ? 'Kurang Santun' : t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Platform filter */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground self-center flex items-center gap-1"><Filter className="w-3 h-3" />Platform:</span>
        {['all', 'instagram', 'twitter', 'tiktok', 'whatsapp', 'facebook', 'forum_online'].map(p => (
          <button key={p} onClick={() => setFilterPlatform(p)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${filterPlatform === p ? 'bg-primary/10 border-primary/30 text-primary font-medium' : 'bg-white border-border text-muted-foreground hover:bg-secondary'}`}
          >
            {p === 'all' ? 'Semua' : `${platformIcons[p]} ${platformLabels[p]}`}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Case list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center border border-border shadow-sm">
              <Search className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Tidak ada kasus yang cocok dengan pencarian Anda.</p>
            </div>
          )}
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedCase(selectedCase?.id === c.id ? null : c)}
              className={`bg-white rounded-2xl p-5 cursor-pointer transition-all border shadow-sm hover:shadow-md ${selectedCase?.id === c.id ? 'border-primary/40 bg-primary/4' : 'border-border hover:border-primary/30'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">{platformIcons[c.platform]}</span>
                  <h3 className="font-semibold text-foreground text-sm line-clamp-1">{c.title}</h3>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <Badge className={`text-xs border ${typeColors[c.type]}`}>
                    {c.type === 'kurang_santun' ? 'Kurang Santun' : c.type.charAt(0).toUpperCase() + c.type.slice(1)}
                  </Badge>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedCase?.id === c.id ? 'rotate-90' : ''}`} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{c.context}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{c.speech_act.charAt(0).toUpperCase() + c.speech_act.slice(1)}</span>
                <span>·</span>
                <span className="italic text-indigo-600">{c.principle}</span>
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {c.tags.map(t => (
                  <span key={t} className="text-xs bg-secondary px-2 py-0.5 rounded-md text-muted-foreground">#{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedCase ? (
              <motion.div key={selectedCase.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-2xl p-6 lg:sticky lg:top-8 space-y-4 border border-border shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{platformIcons[selectedCase.platform]}</span>
                  <Badge className={`text-xs border ${typeColors[selectedCase.type]}`}>
                    {selectedCase.type === 'kurang_santun' ? 'Kurang Santun' : selectedCase.type.charAt(0).toUpperCase() + selectedCase.type.slice(1)}
                  </Badge>
                </div>
                <h3 className="font-bold text-foreground leading-snug">{selectedCase.title}</h3>

                {selectedCase.sample && (
                  <div className="bg-secondary/40 rounded-xl p-4 border-l-4 border-primary">
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">Contoh Teks:</p>
                    <p className="text-sm text-foreground italic leading-relaxed">{selectedCase.sample}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="bg-secondary/30 rounded-xl p-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Konteks</p>
                    <p className="text-sm text-foreground leading-relaxed">{selectedCase.context}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-secondary/30 rounded-xl p-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Speech Act</p>
                      <p className="text-sm font-medium text-primary capitalize">{selectedCase.speech_act}</p>
                    </div>
                    <div className="bg-secondary/30 rounded-xl p-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Konteks Budaya</p>
                      <p className="text-xs text-foreground leading-tight">{selectedCase.cultural_context}</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
                    <p className="text-xs font-semibold text-indigo-600 mb-1.5 uppercase tracking-wide">Prinsip Pragmatik</p>
                    <p className="text-xs text-indigo-700 font-medium mb-2">{selectedCase.principle}</p>
                    <p className="text-xs text-indigo-600 leading-relaxed">{selectedCase.analysis}</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {selectedCase.tags.map(t => (
                      <span key={t} className="text-xs bg-secondary px-2 py-0.5 rounded-md text-muted-foreground">#{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl p-10 text-center border border-border shadow-sm"
              >
                <div className="w-14 h-14 bg-primary/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-primary/60" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Pilih Kasus</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Klik pada kasus di sebelah kiri untuk melihat detail analisis pragmatik lengkap.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}