import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare, Heart, Share2, AlertTriangle, Shield, RefreshCw,
  Eye, CheckCircle2, XCircle, Pencil, ChevronRight, BarChart3
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { base44 } from '@/api/base44Client';

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: '📸', color: 'from-pink-500 to-rose-500' },
  { id: 'twitter', label: 'Twitter/X', icon: '🐦', color: 'from-sky-500 to-blue-500' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: 'from-violet-500 to-purple-500' },
  { id: 'forum', label: 'Forum Online', icon: '💬', color: 'from-amber-500 to-orange-500' },
  { id: 'groupchat', label: 'Grup Chat', icon: '👥', color: 'from-emerald-500 to-teal-500' },
];

const sampleComments = {
  instagram: [
    { user: '@mahasiswa_unj', avatar: 'M', text: 'Terima kasih sharingnya kak, sangat bermanfaat untuk tugas kuliah saya!', likes: 45, tags: ['santun'] },
    { user: '@pengguna_123', avatar: 'P', text: 'Konten bagus, tapi menurut saya kurang akurat datanya. Ada referensi?', likes: 24, tags: ['kritis', 'konstruktif'] },
    { user: '@netizen_id', avatar: 'N', text: 'Dasar bodoh, gak ngerti apa-apa sok posting. Malu-maluin!', likes: 3, tags: ['toksis', 'ofensif'] },
    { user: '@edu_lover', avatar: 'E', text: 'Mohon maaf, apakah boleh saya bertanya lebih lanjut tentang konten ini?', likes: 18, tags: ['santun', 'sopan'] },
  ],
  twitter: [
    { user: '@diskusi_sehat', avatar: 'D', text: 'Menarik perspektifnya. Boleh diskusi lebih lanjut? Saya punya data yang relevan.', likes: 67, tags: ['konstruktif', 'santun'] },
    { user: '@politik_id', avatar: 'P', text: 'Pendapat yang sangat dangkal. Belajar dulu sana sebelum berkomentar.', likes: 12, tags: ['merendahkan'] },
    { user: '@hater_99', avatar: 'H', text: 'GOBLOK! Makanya jangan sok pintar di medsos! Pergi sana!', likes: 5, tags: ['toksis', 'hate speech'] },
    { user: '@akademisi_id', avatar: 'A', text: 'Ada beberapa poin yang perlu dikaji ulang berdasarkan teori pragmatik terkini.', likes: 89, tags: ['akademis', 'kritis'] },
  ],
  tiktok: [
    { user: '@viral_indo', avatar: 'V', text: 'ratio + L + cringe banget kontennya 💀💀', likes: 89, tags: ['sarkasme', 'trolling'] },
    { user: '@edu_content', avatar: 'E', text: 'Setuju banget! Ini yang perlu diketahui anak muda zaman sekarang.', likes: 156, tags: ['positif', 'suportif'] },
    { user: '@troll_master', avatar: 'T', text: 'Kayak lo paling bener aja 🤡 semua orang bilang lo salah', likes: 23, tags: ['sarkasme', 'merendahkan'] },
    { user: '@learner_xyz', avatar: 'L', text: 'Keren! Boleh minta sumbernya kak? Untuk referensi tugas 🙏', likes: 45, tags: ['sopan', 'santun'] },
  ],
  forum: [
    { user: 'Akademisi_ID', avatar: 'A', text: 'Perspektif menarik. Bisa ditambahkan konteks sosiolinguistiknya untuk memperkuat argumen.', likes: 34, tags: ['akademis', 'konstruktif'] },
    { user: 'AnonUser42', avatar: 'U', text: 'Argumentasinya lemah. Coba pakai referensi yang valid dan terpercaya.', likes: 8, tags: ['kritis'] },
    { user: 'TrollForum', avatar: 'T', text: 'Sampah posting beginian. Cuma memenuhi forum dan buang-buang waktu.', likes: 2, tags: ['toksis', 'negatif'] },
    { user: 'Moderator01', avatar: 'M', text: 'Terima kasih sudah berbagi. Mohon sertakan sumber referensi ya.', likes: 22, tags: ['netral', 'formal'] },
  ],
  groupchat: [
    { user: 'Budi', avatar: 'B', text: 'Hei guys, ada yang sudah mengerjakan tugas pragmatik? Bisa minta tolong?', likes: 0, tags: ['permintaan', 'santun'] },
    { user: 'Siti', avatar: 'S', text: 'Udah dong! Tp gausah minta2 mulu, malas banget sih tiap hari begini.', likes: 0, tags: ['kasar', 'kurang santun'] },
    { user: 'Ahmad', avatar: 'A', text: 'Santai Budi, kita bisa diskusi bareng. Meet di perpus jam 3 gimana?', likes: 0, tags: ['solusi', 'kooperatif'] },
    { user: 'Dewi', avatar: 'D', text: 'Setuju! Sekalian kita bahas materi ujian tengah semester juga ya.', likes: 0, tags: ['positif', 'kolaboratif'] },
  ],
};

const toxicityTags = ['toksis', 'hate speech', 'ofensif', 'kasar'];

export default function SocialLab() {
  const [platform, setPlatform] = useState('instagram');
  const [selectedComment, setSelectedComment] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rewrite, setRewrite] = useState('');
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const analyzeComment = async (comment) => {
    setSelectedComment(comment);
    setLoading(true);
    setAnalysis(null);
    setRewrite('');
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Anda adalah pakar pragmatik bahasa Indonesia. Analisis komentar media sosial berikut secara komprehensif:
Platform: ${platform}
Komentar: "${comment.text}"

Berikan analisis JSON lengkap:
- toxicity_score: 0-100 (100 = sangat toksis)
- politeness_score: 0-100 (100 = sangat santun)
- empathy_score: 0-100
- context_awareness: 0-100
- speech_act: jenis speech act (asertif/direktif/komisif/ekspresif/deklaratif)
- speech_act_explanation: penjelasan singkat speech act
- tone: nada emosional (misalnya: agresif, netral, suportif, sarkastis)
- is_ethical: true/false
- implicature: implikatur dalam komentar
- explanation: analisis pragmatik lengkap dalam bahasa Indonesia
- suggestion: saran perbaikan spesifik jika tidak etis
- pragmatic_principle_violated: prinsip pragmatik yang dilanggar (jika ada)`,
      response_json_schema: {
        type: "object",
        properties: {
          toxicity_score: { type: "number" },
          politeness_score: { type: "number" },
          empathy_score: { type: "number" },
          context_awareness: { type: "number" },
          speech_act: { type: "string" },
          speech_act_explanation: { type: "string" },
          tone: { type: "string" },
          is_ethical: { type: "boolean" },
          implicature: { type: "string" },
          explanation: { type: "string" },
          suggestion: { type: "string" },
          pragmatic_principle_violated: { type: "string" }
        }
      }
    });
    setAnalysis(res);
    setLoading(false);
  };

  const analyzeCustom = async () => {
    if (!customText.trim()) return;
    await analyzeComment({ user: 'Komentar Kustom', text: customText, likes: 0, tags: [] });
  };

  const handleRewrite = async () => {
    if (!selectedComment) return;
    setRewriteLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tulis ulang komentar berikut menjadi lebih santun, etis, dan konstruktif. Pertahankan pesan utama tetapi dengan bahasa yang lebih baik:
"${selectedComment.text}"
Platform: ${platform}
Berikan HANYA versi yang sudah diperbaiki tanpa penjelasan tambahan, dalam bahasa Indonesia yang baik.`
    });
    setRewrite(res);
    setRewriteLoading(false);
  };

  const isToxic = (comment) => comment.tags.some(t => toxicityTags.includes(t));

  const radarData = analysis ? [
    { subject: 'Kesantunan', A: analysis.politeness_score },
    { subject: 'Empati', A: analysis.empathy_score },
    { subject: 'Konteks', A: analysis.context_awareness },
    { subject: 'Etika', A: analysis.is_ethical ? 85 : 20 },
    { subject: 'Non-Toxik', A: 100 - analysis.toxicity_score },
  ] : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Laboratorium Simulasi Media Sosial</h1>
        <p className="text-muted-foreground mt-1 text-sm">Analisis dan tingkatkan komunikasi digital Anda secara real-time dengan AI.</p>
      </motion.div>

      {/* Platform selector */}
      <div className="flex gap-2 flex-wrap">
        {platforms.map((p) => (
          <Button
            key={p.id}
            onClick={() => { setPlatform(p.id); setSelectedComment(null); setAnalysis(null); setRewrite(''); }}
            variant={platform === p.id ? 'default' : 'outline'}
            className={`rounded-xl text-sm ${platform === p.id ? 'bg-primary text-white shadow-md' : 'bg-white border-border hover:bg-secondary'}`}
          >
            <span className="mr-1.5">{p.icon}</span> {p.label}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Comments feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-sm">
              <MessageSquare className="w-4 h-4 text-primary" />
              Komentar {platforms.find(p => p.id === platform)?.label}
            </h3>
            <div className="space-y-3">
              {sampleComments[platform].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => analyzeComment(c)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                    selectedComment?.text === c.text
                      ? 'bg-primary/8 border-primary/40 shadow-sm'
                      : 'bg-secondary/30 border-border hover:border-primary/30 hover:bg-primary/4'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${platforms.find(p=>p.id===platform)?.color || 'from-indigo-400 to-indigo-600'} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {c.avatar}
                    </div>
                    <span className="text-xs font-semibold text-primary">{c.user}</span>
                    {isToxic(c) && <XCircle className="w-3.5 h-3.5 text-rose-500 ml-auto" />}
                    {!isToxic(c) && c.tags.includes('santun') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto" />}
                    {c.likes > 0 && (
                      <div className="flex items-center gap-0.5 text-xs text-muted-foreground ml-auto">
                        <Heart className="w-3 h-3" /> {c.likes}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{c.text}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {c.tags.map(t => (
                      <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        toxicityTags.includes(t) ? 'bg-rose-100 text-rose-600' : 'bg-secondary text-muted-foreground'
                      }`}>#{t}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">Klik komentar untuk menganalisis dengan AI</p>
          </div>

          {/* Custom input */}
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="flex items-center gap-2 text-sm font-semibold text-foreground w-full"
            >
              <Pencil className="w-4 h-4 text-primary" />
              Analisis Komentar Sendiri
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${showCustomInput ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {showCustomInput && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                  <Textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Ketik komentar yang ingin dianalisis..."
                    className="min-h-[80px] resize-none bg-secondary/30 border-border text-sm mb-3"
                  />
                  <Button onClick={analyzeCustom} disabled={loading || !customText.trim()} className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl text-sm">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                    Analisis Sekarang
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Analysis panel */}
        <div className="lg:col-span-3 space-y-4">
          {loading && (
            <div className="bg-white rounded-2xl p-10 flex flex-col items-center justify-center border border-border shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
              <p className="text-sm font-medium text-foreground">AI sedang menganalisis...</p>
              <p className="text-xs text-muted-foreground mt-1">Memproses aspek pragmatik dan etika komunikasi</p>
            </div>
          )}

          <AnimatePresence>
            {analysis && !loading && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Score cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Toxicity', val: analysis.toxicity_score, icon: AlertTriangle, inverse: true },
                    { label: 'Kesantunan', val: analysis.politeness_score, icon: Shield },
                    { label: 'Empati', val: analysis.empathy_score, icon: CheckCircle2 },
                    { label: 'Konteks', val: analysis.context_awareness, icon: Eye },
                  ].map((s, i) => {
                    const good = s.inverse ? s.val < 40 : s.val > 60;
                    return (
                      <div key={i} className={`bg-white rounded-2xl p-4 border shadow-sm text-center ${good ? 'border-emerald-200' : 'border-rose-200'}`}>
                        <s.icon className={`w-5 h-5 mx-auto mb-2 ${good ? 'text-emerald-500' : 'text-rose-500'}`} />
                        <p className={`text-xl font-bold font-montserrat ${good ? 'text-emerald-600' : 'text-rose-600'}`}>{s.val}%</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Ethical status */}
                <div className={`rounded-2xl p-4 border flex items-center gap-3 ${analysis.is_ethical ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                  {analysis.is_ethical
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    : <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                  <div>
                    <p className={`text-sm font-semibold ${analysis.is_ethical ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {analysis.is_ethical ? 'Komunikasi Etis' : 'Komunikasi Tidak Etis'}
                    </p>
                    <p className="text-xs text-muted-foreground">Nada: {analysis.tone} · Speech Act: {analysis.speech_act}</p>
                  </div>
                </div>

                {/* Radar + speech act */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                    <h4 className="font-semibold text-sm text-foreground mb-3">Radar Pragmatik</h4>
                    <div className="h-44">
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
                  <div className="space-y-3">
                    <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">Speech Act</p>
                      <p className="text-sm font-semibold text-primary capitalize">{analysis.speech_act}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{analysis.speech_act_explanation}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-border shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">Implikatur</p>
                      <p className="text-xs text-foreground leading-relaxed">{analysis.implicature}</p>
                    </div>
                    {analysis.pragmatic_principle_violated && (
                      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                        <p className="text-xs text-amber-700 font-semibold mb-1">Prinsip yang Dilanggar</p>
                        <p className="text-xs text-amber-600 leading-relaxed">{analysis.pragmatic_principle_violated}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI explanation */}
                <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                  <h4 className="font-semibold text-sm text-foreground mb-2">Analisis Pragmatik AI</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{analysis.explanation}</p>
                </div>

                {/* Suggestion */}
                {analysis.suggestion && (
                  <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
                    <h4 className="font-semibold text-emerald-700 text-sm mb-2">Saran Perbaikan</h4>
                    <p className="text-sm text-emerald-800 leading-relaxed">{analysis.suggestion}</p>
                  </div>
                )}

                {/* Rewrite */}
                <Button onClick={handleRewrite} disabled={rewriteLoading} className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl">
                  {rewriteLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Pencil className="w-4 h-4 mr-2" />}
                  Tulis Ulang dengan AI
                </Button>

                {rewrite && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-indigo-50 rounded-2xl border border-indigo-200 p-5">
                    <h4 className="font-semibold text-indigo-700 text-sm mb-2">Versi yang Lebih Santun</h4>
                    <p className="text-sm text-indigo-800 italic leading-relaxed">"{rewrite}"</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!analysis && !loading && (
            <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center text-center border border-border shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-primary/60" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Pilih Komentar untuk Dianalisis</h4>
              <p className="text-sm text-muted-foreground max-w-sm">Klik pada komentar di sebelah kiri atau tulis komentar sendiri untuk mendapatkan analisis pragmatik AI yang komprehensif.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}