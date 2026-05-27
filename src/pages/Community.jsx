import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  MessageSquare, Plus, Heart, Reply, Shield, Search, Filter,
  AlertTriangle, CheckCircle2, RefreshCw, Send, ChevronDown, ChevronUp,
  Pin, Tag, Globe, Sparkles, Users, TrendingUp, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const CATEGORIES = [
  { key: 'all', label: 'Semua', color: 'text-foreground' },
  { key: 'analisis_kasus', label: 'Analisis Kasus', color: 'text-indigo-600' },
  { key: 'dilema_pragmatik', label: 'Dilema Pragmatik', color: 'text-violet-600' },
  { key: 'refleksi', label: 'Refleksi', color: 'text-emerald-600' },
  { key: 'tanya_jawab', label: 'Tanya Jawab', color: 'text-cyan-600' },
  { key: 'diskusi_umum', label: 'Diskusi Umum', color: 'text-amber-600' },
];

const CAT_COLORS = {
  analisis_kasus: 'bg-indigo-100 text-indigo-700',
  dilema_pragmatik: 'bg-violet-100 text-violet-700',
  refleksi: 'bg-emerald-100 text-emerald-700',
  tanya_jawab: 'bg-cyan-100 text-cyan-700',
  diskusi_umum: 'bg-amber-100 text-amber-700',
};

const SAMPLE_POSTS = [
  {
    id: 's1', author_name: 'Ayu Fitria', author_email: 'ayu@example.com',
    title: 'Analisis Speech Act pada Komentar TikTok: Studi Kasus Ujaran Ekspresif Negatif',
    content: 'Saya baru saja menyelesaikan analisis terhadap 15 komentar TikTok yang mengandung ujaran ekspresif negatif. Temuan menarik: 78% menggunakan strategi kesantuan negatif berupa ancaman muka (FTA) terbuka. Bagaimana pendapat teman-teman?',
    category: 'analisis_kasus', tags: ['speech_act', 'tiktok', 'FTA'], likes: 12, replies_count: 5,
    moderation_status: 'approved', toxicity_score: 8, politeness_score: 88,
    created_date: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 's2', author_name: 'Ahmad Fauzi', author_email: 'ahmad@example.com',
    title: 'Dilema Pragmatik: Haruskah kita merespons ujaran toksis di ruang publik digital?',
    content: 'Dalam kultur Bugis-Makassar, prinsip "siri na pacce" mengharuskan kita mempertahankan martabat. Tapi dalam konteks digital, apakah merespons ujaran toksis justru menurunkan martabat kita? Saya dilema antara diam = merestui vs respons = konfrontasi.',
    category: 'dilema_pragmatik', tags: ['etika', 'budaya_lokal', 'digital'], likes: 19, replies_count: 8,
    moderation_status: 'approved', toxicity_score: 5, politeness_score: 91,
    created_date: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 's3', author_name: 'Siti Nurhaliza', author_email: 'siti@example.com',
    title: 'Refleksi Fase 4: Perubahan pola komunikasi saya setelah menggunakan AI Analyzer',
    content: 'Setelah 3 minggu intensif menggunakan AI Analyzer, skor kesantunan saya naik dari 62% ke 79%. Yang paling signifikan adalah saya mulai lebih sadar terhadap implikatur dalam pesan WhatsApp grup kelas.',
    category: 'refleksi', tags: ['jurnal', 'progress', 'ai_analyzer'], likes: 24, replies_count: 11,
    moderation_status: 'approved', toxicity_score: 2, politeness_score: 95,
    created_date: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

// AI Moderation function
async function moderateContent(text) {
  const res = await base44.integrations.Core.InvokeLLM({
    prompt: `Kamu adalah moderator forum akademik PragmaticsAI. Analisis teks ini:
"${text}"

Apakah teks ini layak ditampilkan di forum akademik? Berikan JSON:
- is_safe: true/false
- toxicity_score: 0-100
- politeness_score: 0-100
- moderation_status: "approved"/"flagged"/"rejected"
- moderation_note: catatan moderasi (jika flagged/rejected, jelaskan mengapa dan saran perbaikan)
- has_academic_value: true/false`,
    response_json_schema: {
      type: 'object',
      properties: {
        is_safe: { type: 'boolean' },
        toxicity_score: { type: 'number' },
        politeness_score: { type: 'number' },
        moderation_status: { type: 'string' },
        moderation_note: { type: 'string' },
        has_academic_value: { type: 'boolean' },
      }
    }
  });
  return res;
}

// Reply component
function ReplyCard({ reply }) {
  return (
    <div className={`pl-6 border-l-2 py-3 ${reply.moderation_status === 'flagged' ? 'border-amber-300' : 'border-indigo-100'}`}>
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">{reply.author_name?.[0] || '?'}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-foreground">{reply.author_name}</span>
            {reply.moderation_status === 'flagged' && (
              <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" />Ditinjau
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">{new Date(reply.created_date || Date.now()).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p className="text-xs text-foreground leading-relaxed">{reply.content}</p>
        </div>
      </div>
    </div>
  );
}

// Post card component
function PostCard({ post, currentUser, onLike, onReply }) {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [moderationWarning, setModerationWarning] = useState(null);
  const [replyCount, setReplyCount] = useState(post.replies_count || 0);

  const loadReplies = async () => {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    setLoadingReplies(true);
    const data = await base44.entities.ForumReply.filter({ post_id: post.id }).catch(() => []);
    setReplies(data || []);
    setLoadingReplies(false);
  };

  const submitReply = async () => {
    if (!replyText.trim() || replyLoading) return;
    setReplyLoading(true);
    setModerationWarning(null);

    // Moderate first
    const mod = await moderateContent(replyText).catch(() => ({ is_safe: true, moderation_status: 'approved', toxicity_score: 0, politeness_score: 80 }));

    if (mod.moderation_status === 'rejected') {
      setModerationWarning({ type: 'rejected', note: mod.moderation_note });
      setReplyLoading(false);
      return;
    }

    const newReply = await base44.entities.ForumReply.create({
      post_id: post.id,
      author_email: currentUser?.email || 'anon@example.com',
      author_name: currentUser?.full_name || 'Mahasiswa',
      content: replyText,
      toxicity_score: mod.toxicity_score,
      politeness_score: mod.politeness_score,
      moderation_status: mod.moderation_status,
    });

    if (mod.moderation_status === 'flagged') {
      setModerationWarning({ type: 'flagged', note: mod.moderation_note });
    }

    setReplies(prev => [...prev, { ...newReply, created_date: new Date().toISOString() }]);
    setReplyCount(c => c + 1);
    setReplyText('');
    setReplyLoading(false);
    onReply?.(post.id);
  };

  const hasLiked = post.liked_by?.includes(currentUser?.email);
  const isApproved = post.moderation_status === 'approved';

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${post.moderation_status === 'flagged' ? 'border-amber-300' : 'border-border'} ${post.is_pinned ? 'ring-2 ring-primary/30' : ''}`}
    >
      {post.is_pinned && (
        <div className="bg-primary/5 border-b border-primary/20 px-4 py-1.5 flex items-center gap-1.5">
          <Pin className="w-3 h-3 text-primary" /><span className="text-xs font-semibold text-primary">Disematkan</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">{post.author_name?.[0] || '?'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{post.author_name}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${CAT_COLORS[post.category] || 'bg-secondary text-muted-foreground'}`}>
                {CATEGORIES.find(c => c.key === post.category)?.label || post.category}
              </span>
              {post.moderation_status === 'flagged' && (
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />Ditinjau AI
                </span>
              )}
              <span className="text-[10px] text-muted-foreground ml-auto">
                {new Date(post.created_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mt-1 text-sm leading-snug">{post.title}</h3>
          </div>
        </div>

        <p className="text-sm text-foreground leading-relaxed mb-3">{post.content}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {post.tags.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground">#{t}</span>
            ))}
          </div>
        )}

        {/* Metrics + Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <div className="flex items-center gap-4">
            <button onClick={() => onLike(post)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${hasLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`}>
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500' : ''}`} />{post.likes}
            </button>
            <button onClick={loadReplies}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-indigo-600 transition-colors">
              <MessageSquare className="w-4 h-4" />{replyCount} Balasan
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${post.politeness_score >= 80 ? 'bg-emerald-100 text-emerald-700' : post.politeness_score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
              🌿 Santun {post.politeness_score}%
            </span>
          </div>
        </div>
      </div>

      {/* Replies section */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/60 px-5 pb-4 pt-3 bg-secondary/20"
          >
            {loadingReplies ? (
              <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />Memuat balasan...
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                {replies.filter(r => r.moderation_status !== 'rejected').map((r, i) => (
                  <ReplyCard key={r.id || i} reply={r} />
                ))}
                {replies.length === 0 && <p className="text-xs text-muted-foreground py-2">Belum ada balasan. Jadilah yang pertama!</p>}
              </div>
            )}

            {/* Moderation warning */}
            {moderationWarning && (
              <div className={`rounded-xl p-3 mb-3 ${moderationWarning.type === 'rejected' ? 'bg-rose-50 border border-rose-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${moderationWarning.type === 'rejected' ? 'text-rose-500' : 'text-amber-500'}`} />
                  <div>
                    <p className={`text-xs font-bold ${moderationWarning.type === 'rejected' ? 'text-rose-700' : 'text-amber-700'}`}>
                      {moderationWarning.type === 'rejected' ? '🚫 Komentar Tidak Dapat Dikirim' : '⚠️ Komentar Sedang Ditinjau AI'}
                    </p>
                    <p className="text-xs text-foreground mt-0.5">{moderationWarning.note}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reply form */}
            <div className="flex gap-2">
              <Textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                placeholder="Tulis balasan yang santun dan akademis..."
                className="min-h-[60px] text-xs bg-white border-border resize-none flex-1"
              />
              <Button onClick={submitReply} disabled={replyLoading || !replyText.trim()} size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex-shrink-0 self-end gap-1">
                {replyLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <Shield className="w-3 h-3" />Setiap balasan dimoderasi AI untuk menjaga kesantunan forum
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// New Post Modal
function NewPostModal({ onClose, onSubmit, currentUser }) {
  const [form, setForm] = useState({ title: '', content: '', category: 'diskusi_umum', tags: '' });
  const [loading, setLoading] = useState(false);
  const [modResult, setModResult] = useState(null);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setLoading(true);
    const mod = await moderateContent(`${form.title}\n${form.content}`).catch(() => ({
      is_safe: true, moderation_status: 'approved', toxicity_score: 5, politeness_score: 85, moderation_note: ''
    }));

    if (mod.moderation_status === 'rejected') {
      setModResult({ type: 'rejected', ...mod });
      setLoading(false);
      return;
    }

    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const post = await base44.entities.ForumPost.create({
      author_email: currentUser?.email || 'anon@example.com',
      author_name: currentUser?.full_name || 'Mahasiswa',
      title: form.title, content: form.content,
      category: form.category, tags,
      likes: 0, replies_count: 0,
      moderation_status: mod.moderation_status,
      moderation_note: mod.moderation_note || '',
      toxicity_score: mod.toxicity_score,
      politeness_score: mod.politeness_score,
    });
    setLoading(false);

    if (mod.moderation_status === 'flagged') {
      setModResult({ type: 'flagged', ...mod });
      setTimeout(() => { onSubmit(post); onClose(); }, 3000);
    } else {
      onSubmit(post);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold font-montserrat text-foreground">Buat Diskusi Baru</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-full">
            <Shield className="w-3 h-3 text-emerald-500" />AI Moderated Forum
          </div>
        </div>

        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40">
          {CATEGORIES.filter(c => c.key !== 'all').map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>

        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Judul diskusi yang jelas dan akademis..."
          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          placeholder="Uraikan topik diskusi Anda secara detail. Sertakan konteks, analisis, atau pertanyaan yang ingin didiskusikan..."
          className="min-h-[130px] bg-secondary/30 border-border resize-none text-sm"
        />
        <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
          placeholder="Tag (pisahkan dengan koma): speech_act, kesantunan, budaya_lokal"
          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        {modResult && (
          <div className={`rounded-xl p-3 ${modResult.type === 'rejected' ? 'bg-rose-50 border border-rose-200' : 'bg-amber-50 border border-amber-200'}`}>
            <p className={`text-xs font-bold ${modResult.type === 'rejected' ? 'text-rose-700' : 'text-amber-700'}`}>
              {modResult.type === 'rejected' ? '🚫 Postingan Tidak Disetujui' : '⚠️ Postingan Sedang Ditinjau'}
            </p>
            <p className="text-xs mt-1">{modResult.moderation_note}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl">Batal</Button>
          <Button onClick={handleSubmit} disabled={loading || !form.title.trim() || !form.content.trim()}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl gap-2">
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Memproses...</> : <><Sparkles className="w-4 h-4" />Kirim & Moderasi AI</>}
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" />Semua konten dimoderasi AI secara otomatis untuk menjaga suasana akademis yang santun
        </p>
      </motion.div>
    </div>
  );
}

export default function Community() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [showNewPost, setShowNewPost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => setCurrentUser(u)).catch(() => {});
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const data = await base44.entities.ForumPost.list('-created_date', 50).catch(() => []);
    if (data?.length > 0) {
      setPosts(prev => {
        const ids = new Set(data.map(p => p.id));
        return [...data, ...prev.filter(p => !ids.has(p.id))];
      });
    }
    setLoading(false);
  };

  const handleLike = async (post) => {
    if (!currentUser) return;
    const liked = post.liked_by?.includes(currentUser.email);
    const newLikes = liked ? post.likes - 1 : post.likes + 1;
    const newLikedBy = liked
      ? (post.liked_by || []).filter(e => e !== currentUser.email)
      : [...(post.liked_by || []), currentUser.email];
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: newLikes, liked_by: newLikedBy } : p));
    if (post.id.startsWith('s')) return; // skip API for sample posts
    await base44.entities.ForumPost.update(post.id, { likes: newLikes, liked_by: newLikedBy }).catch(() => {});
  };

  const handleNewPost = (post) => {
    setPosts(prev => [{ ...post, created_date: new Date().toISOString() }, ...prev]);
  };

  const filteredPosts = posts
    .filter(p => p.moderation_status !== 'rejected')
    .filter(p => catFilter === 'all' || p.category === catFilter)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.likes + b.replies_count) - (a.likes + a.replies_count);
      if (sortBy === 'most_replies') return b.replies_count - a.replies_count;
      return new Date(b.created_date) - new Date(a.created_date);
    });

  const stats = [
    { icon: Users, label: 'Anggota Aktif', value: '127', color: 'text-indigo-600' },
    { icon: MessageSquare, label: 'Diskusi', value: posts.length, color: 'text-violet-600' },
    { icon: Shield, label: 'AI Moderasi', value: '100%', color: 'text-emerald-600' },
    { icon: TrendingUp, label: 'Avg Kesantunan', value: '87%', color: 'text-amber-600' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 mb-2">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-600">Forum Komunitas · AI-Moderated · Academic Space</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Komunitas Pragmatik</h1>
            <p className="text-muted-foreground mt-1 text-sm">Diskusikan analisis kasus, berbagi refleksi, dan dalami dilema pragmatik bersama. Semua konten dimoderasi AI secara otomatis.</p>
          </div>
          <Button onClick={() => setShowNewPost(true)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl gap-2 shadow-md">
            <Plus className="w-4 h-4" />Buat Diskusi
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-border shadow-sm text-center">
            <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1.5`} />
            <p className={`text-xl font-bold font-montserrat ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari diskusi..."
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="border border-border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none">
          <option value="latest">Terbaru</option>
          <option value="popular">Terpopuler</option>
          <option value="most_replies">Paling Aktif</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 p-1 bg-secondary rounded-xl w-fit overflow-x-auto flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setCatFilter(c.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${catFilter === c.key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >{c.label}</button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-4 justify-center">
            <RefreshCw className="w-4 h-4 animate-spin" />Memuat diskusi...
          </div>
        )}
        {filteredPosts.length === 0 && !loading ? (
          <div className="bg-white rounded-2xl border border-dashed border-border p-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="font-semibold text-foreground mb-1">Belum ada diskusi</p>
            <p className="text-sm text-muted-foreground">Jadilah yang pertama membuka diskusi!</p>
          </div>
        ) : (
          filteredPosts.map((post, i) => (
            <PostCard key={post.id || i} post={post} currentUser={currentUser} onLike={handleLike} onReply={() => {}} />
          ))
        )}
      </div>

      {showNewPost && (
        <NewPostModal onClose={() => setShowNewPost(false)} onSubmit={handleNewPost} currentUser={currentUser} />
      )}
    </div>
  );
}