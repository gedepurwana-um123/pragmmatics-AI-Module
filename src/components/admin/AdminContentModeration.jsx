import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, AlertTriangle, CheckCircle2, Flag, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminContentModeration() {
  const [flagged, setFlagged] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ai');

  const load = async () => {
    setLoading(true);
    const [aiLogs, posts, replies] = await Promise.all([
      base44.entities.AIChatLog.filter({ flagged_for_review: true }).catch(() => []),
      base44.entities.ForumPost.filter({ moderation_status: 'flagged' }).catch(() => []),
      base44.entities.ForumReply.filter({ moderation_status: 'flagged' }).catch(() => []),
    ]);
    setFlagged(aiLogs);
    setForumPosts([...posts, ...replies].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const getToxicColor = (score) => {
    if (score >= 70) return 'text-rose-600 bg-rose-50';
    if (score >= 40) return 'text-amber-600 bg-amber-50';
    return 'text-emerald-600 bg-emerald-50';
  };

  const items = activeTab === 'ai' ? flagged : forumPosts;
  const filtered = items.filter(i => !search || JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold font-montserrat text-rose-900">Content Moderation System</h2>
            <p className="text-xs text-rose-600">Review dan kelola konten yang diflag sistem AI untuk deteksi ujaran berisiko</p>
          </div>
          <div className="ml-auto flex gap-3">
            <div className="bg-white rounded-xl px-4 py-2 border border-rose-200 text-center">
              <p className="text-xl font-bold font-montserrat text-rose-600">{flagged.length}</p>
              <p className="text-[10px] text-rose-500">AI Logs Terflag</p>
            </div>
            <div className="bg-white rounded-xl px-4 py-2 border border-amber-200 text-center">
              <p className="text-xl font-bold font-montserrat text-amber-600">{forumPosts.length}</p>
              <p className="text-[10px] text-amber-500">Forum Terflag</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            {[{ key: 'ai', label: `AI Logs (${flagged.length})` }, { key: 'forum', label: `Forum (${forumPosts.length})` }].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === t.key ? 'bg-rose-100 text-rose-700' : 'bg-secondary text-muted-foreground'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari..." className="pl-8 h-8 text-xs w-40" />
            </div>
            <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={load}>
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Memuat data moderasi...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="text-sm font-medium text-emerald-600">Tidak ada konten yang perlu direview</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.slice(0, 30).map((item, i) => (
              <div key={i} className="p-4 hover:bg-secondary/10 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-foreground">{item.user_email || item.author_email || '—'}</span>
                      {item.toxicity_score != null && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getToxicColor(item.toxicity_score)}`}>
                          Toxicity: {item.toxicity_score}%
                        </span>
                      )}
                      {item.ethical_level && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">{item.ethical_level}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.user_prompt || item.content || item.title || '—'}
                    </p>
                    {item.ai_response && (
                      <p className="text-[10px] text-muted-foreground/60 mt-1 line-clamp-1">
                        Respons AI: {item.ai_response}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground/50 mt-1">
                      {item.created_date ? new Date(item.created_date).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : ''}
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 border-emerald-200 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" />Aman
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 border-rose-200 text-rose-700">
                      <Flag className="w-3 h-3" />Hapus
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}