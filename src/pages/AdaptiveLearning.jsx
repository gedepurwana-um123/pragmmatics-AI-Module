import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Brain, Zap, Target, TrendingUp, BookOpen, Users, Globe, RefreshCw,
  ChevronRight, CheckCircle2, Clock, Star, Sparkles, BarChart3, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const TYPE_CONFIG = {
  modul: { icon: BookOpen, color: 'from-indigo-500 to-violet-500', bg: 'bg-indigo-50 border-indigo-200', label: 'Modul', text: 'text-indigo-700' },
  kasus: { icon: Target, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 border-amber-200', label: 'Kasus', text: 'text-amber-700' },
  latihan: { icon: Zap, color: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-50 border-cyan-200', label: 'Latihan', text: 'text-cyan-700' },
  tantangan: { icon: Users, color: 'from-rose-500 to-pink-500', bg: 'bg-rose-50 border-rose-200', label: 'Tantangan', text: 'text-rose-700' },
  budaya: { icon: Globe, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50 border-violet-200', label: 'Kultural', text: 'text-violet-700' },
};

const PRIORITY_COLORS = {
  tinggi: 'bg-rose-100 text-rose-700 border-rose-300',
  sedang: 'bg-amber-100 text-amber-700 border-amber-300',
  rendah: 'bg-emerald-100 text-emerald-700 border-emerald-300',
};

const ACTION_URLS = {
  modul: '/modules',
  kasus: '/case-library',
  latihan: '/ai-analyzer',
  tantangan: '/group-challenge',
  budaya: '/cultural-wisdom',
};

export default function AdaptiveLearning() {
  const [recommendations, setRecommendations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tab, setTab] = useState('rekomendasi');

  const skillData = [
    { subject: 'Kesantunan', A: profile?.politeness_score || 72 },
    { subject: 'Etika', A: profile?.ethical_awareness || 78 },
    { subject: 'Kultural', A: profile?.cultural_sensitivity || 65 },
    { subject: 'Empati', A: 74 },
    { subject: 'Pragmatik', A: profile?.pragmatic_competence || 70 },
    { subject: 'Refleksi', A: profile?.total_reflections ? Math.min(100, profile.total_reflections * 10) : 60 },
  ];

  const weakestSkill = skillData.reduce((min, s) => s.A < min.A ? s : min, skillData[0]);
  const strongestSkill = skillData.reduce((max, s) => s.A > max.A ? s : max, skillData[0]);

  useEffect(() => {
    const init = async () => {
      const user = await base44.auth.me().catch(() => null);
      setCurrentUser(user);
      if (user) {
        await Promise.all([loadRecommendations(user.email), loadProfile(user.email), loadAnalytics(user.email)]);
      }
    };
    init();
  }, []);

  const loadRecommendations = async (email) => {
    setLoading(true);
    const data = await base44.entities.AdaptiveRecommendation.filter({ user_email: email, is_completed: false })
      .catch(() => []);
    setRecommendations(data || []);
    setLoading(false);
  };

  const loadProfile = async (email) => {
    const data = await base44.entities.StudentProfile.filter({ user_email: email }).catch(() => []);
    if (data?.length > 0) setProfile(data[0]);
  };

  const loadAnalytics = async (email) => {
    const data = await base44.entities.LearningAnalytics.filter({ user_email: email }, '-date', 14).catch(() => []);
    setAnalytics(data || []);
  };

  const generateRecommendations = async () => {
    if (!currentUser) return;
    setGenerating(true);

    const avgPoliteness = analytics.length > 0 ? Math.round(analytics.reduce((a, b) => a + (b.politeness_score || 0), 0) / analytics.length) : (profile?.politeness_score || 70);
    const avgToxicity = analytics.length > 0 ? Math.round(analytics.reduce((a, b) => a + (b.toxicity_score || 0), 0) / analytics.length) : 20;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Kamu adalah sistem pembelajaran adaptif PragmaticsAI.

PROFIL MAHASISWA:
- Skor Kesantunan: ${profile?.politeness_score || 72}%
- Skor Etika: ${profile?.ethical_awareness || 78}%
- Sensitivitas Kultural: ${profile?.cultural_sensitivity || 65}%
- Kompetensi Pragmatik: ${profile?.pragmatic_competence || 70}%
- Total Interaksi AI: ${profile?.total_ai_interactions || 15}
- Total Refleksi: ${profile?.total_reflections || 5}
- Level: ${profile?.level || 'Pemula'}
- Rata-rata Kesantunan (14 hari): ${avgPoliteness}%
- Rata-rata Toxicity (14 hari): ${avgToxicity}%

Analisis riwayat dan berikan 5 rekomendasi pembelajaran yang SANGAT SPESIFIK dan PERSONAL untuk meningkatkan kompetensi mahasiswa. 

Berikan JSON array "recommendations" dengan 5 objek, masing-masing:
- type: "modul"/"kasus"/"latihan"/"tantangan"/"budaya"
- priority: "tinggi"/"sedang"/"rendah"
- title: judul spesifik yang menarik
- reason: alasan personal mengapa mahasiswa HARUS melakukan ini sekarang (berdasarkan datanya)
- target_skill: kompetensi yang ditingkatkan
- estimated_improvement: estimasi peningkatan skor 1-15 poin`,
      response_json_schema: {
        type: 'object',
        properties: {
          recommendations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' }, priority: { type: 'string' },
                title: { type: 'string' }, reason: { type: 'string' },
                target_skill: { type: 'string' }, estimated_improvement: { type: 'number' },
              }
            }
          }
        }
      }
    });

    // Save to DB + set state
    const newRecs = [];
    for (const rec of res.recommendations || []) {
      const saved = await base44.entities.AdaptiveRecommendation.create({
        user_email: currentUser.email,
        type: rec.type, priority: rec.priority,
        title: rec.title, reason: rec.reason,
        target_skill: rec.target_skill,
        estimated_improvement: rec.estimated_improvement,
        action_url: ACTION_URLS[rec.type] || '/dashboard',
        is_completed: false,
        expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      }).catch(() => ({ ...rec, id: `gen_${Date.now()}_${Math.random()}` }));
      newRecs.push(saved);
    }
    setRecommendations(newRecs);
    setGenerating(false);
  };

  const markCompleted = async (rec) => {
    setRecommendations(prev => prev.filter(r => r.id !== rec.id));
    if (!rec.id.startsWith('gen_')) {
      await base44.entities.AdaptiveRecommendation.update(rec.id, { is_completed: true }).catch(() => {});
    }
  };

  const sortedRecs = [...recommendations].sort((a, b) => {
    const prio = { tinggi: 0, sedang: 1, rendah: 2 };
    return (prio[a.priority] || 1) - (prio[b.priority] || 1);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 mb-2">
          <Brain className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-xs font-semibold text-violet-600">Adaptive Learning AI · Personalized Pragmatic Pathway</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Pembelajaran Adaptif</h1>
        <p className="text-muted-foreground mt-1 text-sm">AI menganalisis riwayat interaksimu dan merekomendasikan jalur belajar yang dipersonalisasi untuk mempercepat peningkatan kompetensi pragmatikmu.</p>
      </motion.div>

      {/* Insight cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-rose-600 mb-1">⚠️ Area Prioritas</p>
          <p className="text-lg font-bold font-montserrat text-rose-700">{weakestSkill.subject}</p>
          <p className="text-xs text-rose-600">Skor {weakestSkill.A}% — butuh peningkatan segera</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-emerald-600 mb-1">⭐ Kekuatan Terbaik</p>
          <p className="text-lg font-bold font-montserrat text-emerald-700">{strongestSkill.subject}</p>
          <p className="text-xs text-emerald-600">Skor {strongestSkill.A}% — pertahankan momentum</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-indigo-600 mb-1">🎯 Rekomendasi Aktif</p>
          <p className="text-lg font-bold font-montserrat text-indigo-700">{recommendations.filter(r => !r.is_completed).length}</p>
          <p className="text-xs text-indigo-600">Tugas personal menunggu</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-secondary rounded-xl w-fit">
        {[
          { key: 'rekomendasi', label: '🎯 Rekomendasi' },
          { key: 'profil', label: '📊 Profil Kompetensi' },
          { key: 'riwayat', label: '📈 Riwayat Belajar' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >{t.label}</button>
        ))}
      </div>

      {/* REKOMENDASI TAB */}
      {tab === 'rekomendasi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-muted-foreground">{sortedRecs.length} rekomendasi aktif berdasarkan analisis AI terhadap riwayat belajarmu</p>
            <Button onClick={generateRecommendations} disabled={generating}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl gap-2 text-sm">
              {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Menganalisis...</> : <><Sparkles className="w-4 h-4" />Generate Ulang</>}
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 justify-center py-10 text-muted-foreground text-sm">
              <RefreshCw className="w-4 h-4 animate-spin" />Memuat rekomendasi...
            </div>
          ) : sortedRecs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-border p-12 text-center">
              <Brain className="w-14 h-14 text-muted-foreground/20 mx-auto mb-3" />
              <p className="font-semibold text-foreground mb-2">Belum Ada Rekomendasi</p>
              <p className="text-sm text-muted-foreground mb-4">Klik tombol "Generate Rekomendasi" untuk mendapatkan jalur belajar personal dari AI.</p>
              <Button onClick={generateRecommendations} disabled={generating}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl gap-2">
                <Sparkles className="w-4 h-4" />Generate Rekomendasi AI
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedRecs.map((rec, i) => {
                const cfg = TYPE_CONFIG[rec.type] || TYPE_CONFIG.modul;
                const Icon = cfg.icon;
                return (
                  <motion.div key={rec.id || i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className={`bg-white rounded-2xl border shadow-sm p-5 ${rec.priority === 'tinggi' ? 'border-rose-200' : 'border-border'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${PRIORITY_COLORS[rec.priority]}`}>
                            {rec.priority === 'tinggi' ? '🔴' : rec.priority === 'sedang' ? '🟡' : '🟢'} {rec.priority}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                          {rec.target_skill && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground">🎯 {rec.target_skill}</span>
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground text-sm">{rec.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.reason}</p>
                        {rec.estimated_improvement && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-xs text-emerald-600 font-semibold">+{rec.estimated_improvement} poin estimasi peningkatan</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Link to={rec.action_url || ACTION_URLS[rec.type] || '/dashboard'}>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1 h-8">
                            Mulai <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" onClick={() => markCompleted(rec)} className="rounded-xl text-xs h-8 gap-1">
                          <CheckCircle2 className="w-3 h-3" />Selesai
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PROFIL TAB */}
      {tab === 'profil' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />Radar Kompetensi Pragmatik
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillData}>
                  <PolarGrid stroke="rgba(0,0,0,0.07)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Radar dataKey="A" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.18} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Detail Skor Kompetensi</h3>
            {skillData.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-foreground">{s.subject}</span>
                  <span className={`text-xs font-bold ${s.A >= 80 ? 'text-emerald-600' : s.A >= 65 ? 'text-blue-600' : 'text-rose-600'}`}>{s.A}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.A}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full rounded-full ${s.A >= 80 ? 'bg-emerald-500' : s.A >= 65 ? 'bg-indigo-500' : 'bg-rose-500'}`} />
                </div>
              </div>
            ))}
            <div className="mt-4 bg-violet-50 border border-violet-200 rounded-xl p-3">
              <p className="text-xs font-bold text-violet-700 mb-1">💡 Insight AI</p>
              <p className="text-xs text-violet-800">
                Fokus utama: tingkatkan <strong>{weakestSkill.subject}</strong> ({weakestSkill.A}%) melalui latihan kasus budaya lokal dan tantangan kelompok.
                Kekuatanmu di <strong>{strongestSkill.subject}</strong> ({strongestSkill.A}%) bisa menjadi modal untuk membantu teman di forum komunitas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RIWAYAT TAB */}
      {tab === 'riwayat' && (
        <div className="space-y-3">
          {analytics.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-border p-10 text-center">
              <Clock className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Belum ada riwayat analytics tersimpan.</p>
            </div>
          ) : (
            analytics.slice(0, 14).map((a, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
                <div className="text-center min-w-[60px]">
                  <p className="text-xs font-bold text-foreground">{new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Pragmatik', val: a.pragmatic_score, color: 'text-indigo-600' },
                    { label: 'Kesantunan', val: a.politeness_score, color: 'text-emerald-600' },
                    { label: 'Toxicity', val: a.toxicity_score, color: 'text-rose-600' },
                    { label: 'Keterlibatan', val: a.engagement_score, color: 'text-amber-600' },
                  ].map((m, j) => (
                    <div key={j} className="text-center">
                      <p className={`text-base font-bold font-montserrat ${m.color}`}>{m.val || '--'}{m.val ? '%' : ''}</p>
                      <p className="text-[10px] text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="text-right min-w-[60px]">
                  <p className="text-xs text-muted-foreground">{a.ai_interactions || 0} AI</p>
                  <p className="text-xs text-muted-foreground">{a.reflections_written || 0} refleksi</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}