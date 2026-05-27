import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Heart, Share2, AlertTriangle, Shield, RefreshCw, ThumbsUp, Eye } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'forum', label: 'Forum Online', icon: '💬' },
];

const sampleComments = {
  instagram: [
    { user: '@pengguna_123', text: 'Konten bagus, tapi menurut saya kurang akurat datanya.', likes: 24 },
    { user: '@netizen_id', text: 'Dasar bodoh, gak ngerti apa-apa sok posting.', likes: 3 },
    { user: '@mahasiswa_unj', text: 'Terima kasih sharingnya kak, sangat bermanfaat!', likes: 45 },
  ],
  twitter: [
    { user: '@politik_id', text: 'Pendapat yang sangat dangkal. Belajar dulu sana.', likes: 12 },
    { user: '@diskusi_sehat', text: 'Menarik perspektifnya. Boleh diskusi lebih lanjut?', likes: 67 },
    { user: '@hater_99', text: 'GOBLOK! Makanya jangan sok pintar di medsos!', likes: 5 },
  ],
  tiktok: [
    { user: '@viral_indo', text: 'ratio + L + cringe banget', likes: 89 },
    { user: '@edu_content', text: 'Setuju banget! Ini yang perlu diketahui anak muda.', likes: 156 },
    { user: '@troll_master', text: 'Kayak lo paling bener aja 🤡🤡🤡', likes: 23 },
  ],
  forum: [
    { user: 'AnonUser42', text: 'Argumentasinya lemah. Coba pake referensi yang valid.', likes: 8 },
    { user: 'Akademisi_ID', text: 'Perspektif menarik. Bisa ditambahkan konteks sosiolinguistiknya.', likes: 34 },
    { user: 'TrollForum', text: 'Sampah posting beginian. Memenuhi forum aja.', likes: 2 },
  ],
};

export default function SocialLab() {
  const [platform, setPlatform] = useState('instagram');
  const [selectedComment, setSelectedComment] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rewrite, setRewrite] = useState('');

  const analyzeComment = async (comment) => {
    setSelectedComment(comment);
    setLoading(true);
    setAnalysis(null);
    setRewrite('');
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Analisis komentar media sosial berikut dari perspektif pragmatik:
Platform: ${platform}
Komentar: "${comment.text}"

Berikan analisis JSON:
- toxicity_score: 0-100
- politeness_score: 0-100
- speech_act: jenis speech act
- tone: nada emosional
- is_ethical: true/false
- explanation: penjelasan singkat dalam bahasa Indonesia
- suggestion: saran perbaikan jika tidak etis`,
      response_json_schema: {
        type: "object",
        properties: {
          toxicity_score: { type: "number" },
          politeness_score: { type: "number" },
          speech_act: { type: "string" },
          tone: { type: "string" },
          is_ethical: { type: "boolean" },
          explanation: { type: "string" },
          suggestion: { type: "string" }
        }
      }
    });
    setAnalysis(res);
    setLoading(false);
  };

  const handleRewrite = async () => {
    if (!selectedComment) return;
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Tulis ulang komentar berikut menjadi lebih santun dan etis, tetap menyampaikan pesan yang sama:
"${selectedComment.text}"
Berikan versi yang lebih santun dalam bahasa Indonesia.`
    });
    setRewrite(res);
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-space">Laboratorium Simulasi Media Sosial</h1>
        <p className="text-muted-foreground mt-1">Berlatih menganalisis dan memperbaiki komunikasi digital.</p>
      </motion.div>

      {/* Platform selector */}
      <div className="flex gap-3 flex-wrap">
        {platforms.map((p) => (
          <Button
            key={p.id}
            onClick={() => { setPlatform(p.id); setSelectedComment(null); setAnalysis(null); }}
            variant={platform === p.id ? 'default' : 'outline'}
            className={`rounded-xl ${platform === p.id ? 'bg-primary' : ''}`}
          >
            <span className="mr-2">{p.icon}</span> {p.label}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Comments feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-light rounded-2xl p-6">
          <h3 className="font-semibold font-space mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Komentar {platforms.find(p => p.id === platform)?.label}
          </h3>
          <div className="space-y-3">
            {sampleComments[platform].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => analyzeComment(c)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${selectedComment?.text === c.text ? 'bg-primary/10 border border-primary/30' : 'bg-background/40 hover:bg-background/60'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-primary font-medium">{c.user}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="w-3 h-3" /> {c.likes}
                  </div>
                </div>
                <p className="text-sm text-foreground">{c.text}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">Klik komentar untuk menganalisis</p>
        </motion.div>

        {/* Analysis panel */}
        <div className="space-y-4">
          {loading && !analysis && (
            <div className="glass-light rounded-2xl p-8 flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">AI sedang menganalisis...</p>
            </div>
          )}

          {analysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Scores */}
              <div className="glass-light rounded-2xl p-5">
                <h4 className="font-semibold font-space text-sm mb-4">Hasil Analisis</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className={`rounded-xl p-4 ${analysis.toxicity_score > 50 ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                    <AlertTriangle className={`w-4 h-4 mb-2 ${analysis.toxicity_score > 50 ? 'text-rose-400' : 'text-emerald-400'}`} />
                    <p className="text-xs text-muted-foreground">Toxicity</p>
                    <p className={`text-xl font-bold ${analysis.toxicity_score > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>{analysis.toxicity_score}%</p>
                  </div>
                  <div className={`rounded-xl p-4 ${analysis.politeness_score > 50 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                    <Shield className={`w-4 h-4 mb-2 ${analysis.politeness_score > 50 ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <p className="text-xs text-muted-foreground">Kesantunan</p>
                    <p className={`text-xl font-bold ${analysis.politeness_score > 50 ? 'text-emerald-400' : 'text-amber-400'}`}>{analysis.politeness_score}%</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Speech Act</span><span>{analysis.speech_act}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Nada</span><span>{analysis.tone}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Etis</span>
                    <span className={analysis.is_ethical ? 'text-emerald-400' : 'text-rose-400'}>{analysis.is_ethical ? 'Ya' : 'Tidak'}</span>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="glass-light rounded-2xl p-5">
                <h4 className="font-semibold font-space text-sm mb-2">Penjelasan AI</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.explanation}</p>
              </div>

              {/* Suggestion */}
              {analysis.suggestion && (
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2">Saran Perbaikan</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{analysis.suggestion}</p>
                </div>
              )}

              {/* Rewrite button */}
              <Button onClick={handleRewrite} disabled={loading} className="w-full bg-primary hover:bg-primary/90 rounded-xl">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Tulis Ulang dengan AI
              </Button>

              {rewrite && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-light rounded-2xl p-5">
                  <h4 className="font-semibold text-emerald-400 text-sm mb-2">Versi yang Lebih Santun</h4>
                  <p className="text-sm text-foreground italic leading-relaxed">"{rewrite}"</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {!analysis && !loading && (
            <div className="glass-light rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <Eye className="w-10 h-10 text-primary/40 mb-3" />
              <h4 className="font-semibold font-space text-sm mb-1">Pilih Komentar</h4>
              <p className="text-xs text-muted-foreground">Klik pada komentar di sebelah kiri untuk melihat analisis pragmatik AI.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}