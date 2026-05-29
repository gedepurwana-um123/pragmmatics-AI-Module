import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThumbsUp, MessageSquare, Pin, Plus, ChevronDown, ChevronUp,
  BookOpen, Send, Search, Filter, Award, AlertTriangle, Loader2, Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { userRole } from '@/lib/userRole';

const PLATFORMS = ['instagram','twitter','tiktok','whatsapp','facebook','forum_online','lainnya'];
const PLATFORM_EMOJI = { instagram:'📸', twitter:'🐦', tiktok:'🎵', whatsapp:'💬', facebook:'👥', forum_online:'🌐', lainnya:'📄' };

function PostForm({ classes, onSave, onClose }) {
  const [form, setForm] = useState({ class_id: '', title: '', content: '', platform: 'instagram', tags: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.class_id || !form.title || !form.content) return;
    setSaving(true);
    await onSave({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white z-10">
          <h3 className="font-bold font-montserrat text-sm">📝 Posting Temuan Etnografi</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Kelas *</label>
            <select value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white" required>
              <option value="">-- Pilih Kelas --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Platform yang Dianalisis</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button key={p} type="button" onClick={() => setForm({ ...form, platform: p })}
                  className={`px-3 py-1 rounded-full text-xs border transition-all ${form.platform === p ? 'bg-primary text-white border-primary' : 'bg-white border-border text-foreground hover:border-primary/40'}`}>
                  {PLATFORM_EMOJI[p]} {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Judul Temuan *</label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Contoh: Pola Speech Act Direktif di Grup WhatsApp Mahasiswa" required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Deskripsi Temuan *</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              placeholder="Deskripsikan temuan etnografi Anda secara detail..."
              className="w-full border border-input rounded-lg px-3 py-2 text-sm min-h-[120px] resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags (pisah dengan koma)</label>
            <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="kesantunan, direktif, implikatur" />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />Memposting...</> : 'Posting Temuan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReplyBox({ postId, user, role, onReplied }) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    await base44.entities.EthnographyReply.create({
      post_id: postId,
      author_email: user.email,
      author_name: user.full_name || user.email.split('@')[0],
      author_role: role,
      content: content.trim(),
      is_lecturer_reply: role === 'dosen',
    }).catch(() => {});
    setContent('');
    setSaving(false);
    onReplied();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <Input value={content} onChange={e => setContent(e.target.value)}
        placeholder="Tulis tanggapan Anda..." className="flex-1 text-sm h-9" />
      <Button type="submit" size="sm" disabled={!content.trim() || saving} className="h-9 px-3">
        <Send className="w-3.5 h-3.5" />
      </Button>
    </form>
  );
}

function PostCard({ post, user, role, classes }) {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [upvotedBy, setUpvotedBy] = useState(post.upvoted_by || []);
  const cls = classes.find(c => c.id === post.class_id);
  const isUpvoted = upvotedBy.includes(user?.email);

  const loadReplies = async () => {
    setLoadingReplies(true);
    const r = await base44.entities.EthnographyReply.filter({ post_id: post.id }, 'created_date', 50).catch(() => []);
    setReplies(r);
    setLoadingReplies(false);
  };

  const toggleExpand = () => {
    if (!expanded) loadReplies();
    setExpanded(!expanded);
  };

  const handleUpvote = async () => {
    if (!user) return;
    const newUpvotedBy = isUpvoted ? upvotedBy.filter(e => e !== user.email) : [...upvotedBy, user.email];
    const newCount = isUpvoted ? upvotes - 1 : upvotes + 1;
    setUpvotes(newCount);
    setUpvotedBy(newUpvotedBy);
    await base44.entities.EthnographyPost.update(post.id, { upvotes: newCount, upvoted_by: newUpvotedBy }).catch(() => {});
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden hover:border-primary/20 transition-all">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {(post.author_name || post.author_email || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground">{post.author_name || post.author_email?.split('@')[0]}</span>
                {post.author_role === 'dosen' && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 text-[10px] font-semibold">Dosen</span>
                )}
                {post.is_pinned && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold flex items-center gap-1">
                    <Pin className="w-2.5 h-2.5" /> Disematkan
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {cls && <span className="text-[10px] text-muted-foreground">📚 {cls.class_name}</span>}
                <span className="text-[10px] text-muted-foreground">{PLATFORM_EMOJI[post.platform]} {post.platform}</span>
                <span className="text-[10px] text-muted-foreground">· {new Date(post.created_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h4 className="font-bold font-montserrat text-sm text-foreground mb-2">{post.title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.content}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((t, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">#{t}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
          <button onClick={handleUpvote}
            className={`flex items-center gap-1.5 text-xs font-medium transition-all ${isUpvoted ? 'text-indigo-600' : 'text-muted-foreground hover:text-indigo-600'}`}>
            <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current' : ''}`} />
            {upvotes} Upvote
          </button>
          <button onClick={toggleExpand}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-all">
            <MessageSquare className="w-3.5 h-3.5" />
            {post.replies_count || 0} Balasan
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Replies */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-secondary/20 px-5 pb-4 pt-3 overflow-hidden">
            {loadingReplies ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat balasan...
              </div>
            ) : (
              <div className="space-y-3">
                {replies.length === 0 && <p className="text-xs text-muted-foreground italic">Belum ada balasan. Jadilah yang pertama!</p>}
                {replies.map(r => (
                  <div key={r.id} className={`flex gap-2.5 ${r.is_lecturer_reply ? 'bg-cyan-50 border border-cyan-200 rounded-xl p-3' : ''}`}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(r.author_name || r.author_email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{r.author_name || r.author_email?.split('@')[0]}</span>
                        {r.is_lecturer_reply && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 font-semibold">Dosen</span>}
                        <span className="text-[10px] text-muted-foreground">{new Date(r.created_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <p className="text-xs text-foreground mt-0.5 leading-relaxed">{r.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {user && (
              <ReplyBox postId={post.id} user={user} role={userRole.get(user.email) || user.role}
                onReplied={() => {
                  loadReplies();
                  base44.entities.EthnographyPost.update(post.id, { replies_count: (post.replies_count || 0) + 1 }).catch(() => {});
                }} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function EthnographyForum() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('mahasiswa');
  const [classes, setClasses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');

  useEffect(() => {
    base44.auth.me().then(async u => {
      if (!u) return;
      setUser(u);
      const r = userRole.get(u.email) || u.role;
      setRole(r);
      let cls = [];
      if (r === 'dosen') {
        cls = await base44.entities.Class.filter({ lecturer_email: u.email }).catch(() => []);
      } else {
        const enrs = await base44.entities.Enrollment.filter({ student_email: u.email, status: 'active' }).catch(() => []);
        const all = await base44.entities.Class.list().catch(() => []);
        cls = all.filter(c => enrs.some(e => e.class_id === c.id));
      }
      setClasses(cls);
      const classIds = cls.map(c => c.id);
      const allPosts = await base44.entities.EthnographyPost.list('-created_date', 100).catch(() => []);
      setPosts(allPosts.filter(p => classIds.includes(p.class_id)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSavePost = async (data) => {
    const p = await base44.entities.EthnographyPost.create({
      ...data,
      author_email: user.email,
      author_name: user.full_name || user.email.split('@')[0],
      author_role: role,
    }).catch(() => null);
    if (p) setPosts(prev => [p, ...prev]);
    setShowForm(false);
  };

  const filtered = posts.filter(p => {
    if (filterClass !== 'all' && p.class_id !== filterClass) return false;
    if (filterPlatform !== 'all' && p.platform !== filterPlatform) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pinnedPosts = filtered.filter(p => p.is_pinned);
  const regularPosts = filtered.filter(p => !p.is_pinned);

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 min-h-screen bg-background">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.4),transparent)]" />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">FORUM ETNOGRAFI</span>
              </div>
              <h1 className="text-2xl font-bold font-montserrat">Forum Diskusi Etnografi</h1>
              <p className="text-sm text-white/70 mt-1">Bagikan & diskusikan temuan etnografi digital Anda bersama kelas</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-white text-indigo-600 hover:bg-white/90 gap-2 font-semibold">
              <Plus className="w-4 h-4" /> Posting Temuan
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filter & Search */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari temuan..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 text-sm" />
        </div>
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border text-sm bg-white text-foreground">
          <option value="all">Semua Kelas</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
        </select>
        <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border text-sm bg-white text-foreground">
          <option value="all">Semua Platform</option>
          {PLATFORMS.map(p => <option key={p} value={p}>{PLATFORM_EMOJI[p]} {p}</option>)}
        </select>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Posting', value: posts.length, icon: BookOpen, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Total Upvote', value: posts.reduce((a, p) => a + (p.upvotes || 0), 0), icon: ThumbsUp, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Balasan', value: posts.reduce((a, p) => a + (p.replies_count || 0), 0), icon: MessageSquare, color: 'text-violet-600 bg-violet-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold font-montserrat">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {pinnedPosts.length > 0 && (
            <>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5" /> Disematkan
              </p>
              {pinnedPosts.map(p => <PostCard key={p.id} post={p} user={user} role={role} classes={classes} />)}
            </>
          )}
          {regularPosts.length > 0 && (
            <>
              {pinnedPosts.length > 0 && <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Terbaru</p>}
              {regularPosts.map(p => <PostCard key={p.id} post={p} user={user} role={role} classes={classes} />)}
            </>
          )}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">Belum ada posting etnografi</p>
              <p className="text-xs mt-1">Jadilah yang pertama berbagi temuan!</p>
            </div>
          )}
        </div>
      )}

      {showForm && <PostForm classes={classes} onSave={handleSavePost} onClose={() => setShowForm(false)} />}
    </div>
  );
}