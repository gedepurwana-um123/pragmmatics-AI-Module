import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Filter, MessageSquare, AlertTriangle, Shield, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const cases = [
  {
    id: 1, title: 'Cyberbullying di Kolom Komentar Instagram',
    platform: 'instagram', type: 'toksis', speech_act: 'ekspresif',
    context: 'Remaja menghina penampilan fisik selebgram dalam kolom komentar',
    analysis: 'Pelanggaran maksim kesantunan Brown & Levinson. Penggunaan bahasa ofensif yang merusak muka positif lawan bicara.',
    tags: ['cyberbullying', 'body shaming', 'instagram'],
  },
  {
    id: 2, title: 'Diskusi Politik yang Santun di Twitter',
    platform: 'twitter', type: 'santun', speech_act: 'asertif',
    context: 'Dua pengguna berdebat tentang kebijakan publik dengan bahasa yang menghargai perspektif berbeda',
    analysis: 'Contoh implementasi prinsip kesantunan Leech dalam konteks digital. Penggunaan hedging dan strategi kesantunan positif.',
    tags: ['politik', 'diskusi santun', 'kesantunan positif'],
  },
  {
    id: 3, title: 'Hate Speech di Forum Online',
    platform: 'forum_online', type: 'toksis', speech_act: 'direktif',
    context: 'Pengguna forum menyerang kelompok minoritas dengan ujaran kebencian',
    analysis: 'Pelanggaran serius terhadap etika komunikasi. Speech act direktif yang mengandung ancaman dan diskriminasi.',
    tags: ['hate speech', 'diskriminasi', 'ujaran kebencian'],
  },
  {
    id: 4, title: 'Kearifan Lokal dalam Komunikasi WhatsApp',
    platform: 'whatsapp', type: 'santun', speech_act: 'komisif',
    context: 'Komunikasi antar generasi yang mengintegrasikan nilai-nilai kearifan lokal Jawa dalam grup keluarga',
    analysis: 'Contoh penerapan unggah-ungguh Jawa dalam komunikasi digital. Penggunaan bahasa halus dan penghormatan hierarki.',
    tags: ['kearifan lokal', 'Jawa', 'unggah-ungguh'],
  },
  {
    id: 5, title: 'Trolling dan Sarkasme di TikTok',
    platform: 'tiktok', type: 'kurang_santun', speech_act: 'ekspresif',
    context: 'Pengguna TikTok menggunakan sarkasme berlebihan untuk merespons konten edukasi',
    analysis: 'Penggunaan implikatur untuk menyampaikan makna negatif secara tidak langsung. Pelanggaran prinsip kerja sama Grice.',
    tags: ['sarkasme', 'trolling', 'implikatur'],
  },
  {
    id: 6, title: 'Peer Support dalam Grup Akademik Facebook',
    platform: 'facebook', type: 'santun', speech_act: 'ekspresif',
    context: 'Mahasiswa saling mendukung dalam menghadapi tekanan akademik di grup Facebook kampus',
    analysis: 'Implementasi empati digital dan solidaritas melalui speech act ekspresif positif. Menunjukkan kesantunan kolektif.',
    tags: ['peer support', 'empati', 'solidaritas'],
  },
];

const typeColors = {
  santun: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  kurang_santun: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  toksis: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  netral: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  ambigu: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

const platformIcons = { instagram: '📸', twitter: '🐦', tiktok: '🎵', whatsapp: '💬', facebook: '👥', forum_online: '🌐' };

export default function Ethnography() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);

  const filtered = cases.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.includes(search.toLowerCase()));
    const matchType = filterType === 'all' || c.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-space">Perpustakaan Kasus Etnografi Digital</h1>
        <p className="text-muted-foreground mt-1">Studi kasus komunikasi digital dari berbagai konteks budaya dan sosial.</p>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kasus..."
            className="pl-10 bg-background/50 border-border/50 rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'santun', 'kurang_santun', 'toksis'].map(t => (
            <Button
              key={t}
              onClick={() => setFilterType(t)}
              variant={filterType === t ? 'default' : 'outline'}
              size="sm"
              className="rounded-lg text-xs"
            >
              {t === 'all' ? 'Semua' : t === 'kurang_santun' ? 'Kurang Santun' : t.charAt(0).toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Case list */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedCase(c)}
              className={`glass-light rounded-2xl p-5 cursor-pointer transition-all hover:border-primary/20 ${selectedCase?.id === c.id ? 'border-primary/30 bg-primary/5' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{platformIcons[c.platform]}</span>
                  <h3 className="font-semibold font-space text-sm">{c.title}</h3>
                </div>
                <Badge className={`text-xs ${typeColors[c.type]} border`}>
                  {c.type === 'kurang_santun' ? 'Kurang Santun' : c.type.charAt(0).toUpperCase() + c.type.slice(1)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{c.context}</p>
              <div className="flex gap-2 flex-wrap">
                {c.tags.map(t => (
                  <span key={t} className="text-xs bg-background/40 px-2 py-0.5 rounded-md text-muted-foreground">#{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-1">
          {selectedCase ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="glass-light rounded-2xl p-6 lg:sticky lg:top-8 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{platformIcons[selectedCase.platform]}</span>
                <Badge className={`text-xs ${typeColors[selectedCase.type]} border`}>
                  {selectedCase.type === 'kurang_santun' ? 'Kurang Santun' : selectedCase.type.charAt(0).toUpperCase() + selectedCase.type.slice(1)}
                </Badge>
              </div>
              <h3 className="font-bold font-space">{selectedCase.title}</h3>

              <div className="space-y-3">
                <div className="rounded-xl bg-background/40 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Konteks</p>
                  <p className="text-sm leading-relaxed">{selectedCase.context}</p>
                </div>
                <div className="rounded-xl bg-background/40 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Speech Act</p>
                  <p className="text-sm font-medium">{selectedCase.speech_act.charAt(0).toUpperCase() + selectedCase.speech_act.slice(1)}</p>
                </div>
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <p className="text-xs text-primary mb-1">Analisis Pragmatik</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedCase.analysis}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-light rounded-2xl p-8 text-center">
              <Globe className="w-10 h-10 text-primary/40 mx-auto mb-3" />
              <h4 className="font-semibold font-space text-sm mb-1">Pilih Kasus</h4>
              <p className="text-xs text-muted-foreground">Klik pada kasus untuk melihat detail analisis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}