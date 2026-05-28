import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  Brain, TrendingUp, Shield, MessageSquare, BookOpen, Bot,
  Award, Zap, ArrowRight, Flame, Target, Globe, Layers,
  Network, Sparkles, ChevronRight, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import LearningProgressDashboard from '@/components/dashboard/LearningProgressDashboard';
import GamificationPanel from '@/components/dashboard/GamificationPanel';
import ClassLeaderboard from '@/components/dashboard/ClassLeaderboard';
import ClassCalendar from '@/components/calendar/ClassCalendar';

const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 12px' };

const PHASES = [
  { phase: 1, title: 'Orientasi Etnografi', status: 'selesai', desc: 'Pengenalan konteks budaya & pragmatik' },
  { phase: 2, title: 'Identifikasi Masalah', status: 'selesai', desc: 'Deteksi pola komunikasi digital' },
  { phase: 3, title: 'Pengumpulan Data', status: 'aktif', desc: 'Analisis kasus media sosial' },
  { phase: 4, title: 'Analisis Pragmatik', status: 'terkunci', desc: 'Teori speech acts & implikatur' },
  { phase: 5, title: 'Refleksi Kritis', status: 'terkunci', desc: 'Jurnal & pemikiran mendalam' },
  { phase: 6, title: 'Sintesis Kultural', status: 'terkunci', desc: 'Integrasi kearifan budaya lokal' },
  { phase: 7, title: 'Transformasi Etis', status: 'terkunci', desc: 'Implementasi komunikasi bermartabat' },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [scores, setScores] = useState([]);
  const [greeting, setGreeting] = useState('Selamat datang');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 11) setGreeting('Selamat pagi');
    else if (h < 15) setGreeting('Selamat siang');
    else if (h < 18) setGreeting('Selamat sore');
    else setGreeting('Selamat malam');

    base44.auth.me().then(u => {
      if (!u) return;
      setUser(u);
      Promise.all([
        base44.entities.StudentProfile.filter({ user_email: u.email }).catch(() => []),
        base44.entities.Enrollment.filter({ student_email: u.email, status: 'active' }).catch(() => []),
        base44.entities.PragmaticScore.filter({ student_email: u.email }).catch(() => []),
      ]).then(([profiles, enrs, sc]) => {
        if (profiles?.length > 0) setProfile(profiles[0]);
        if (enrs?.length > 0) setEnrollment(enrs[0]);
        setScores(sc || []);
      });
    }).catch(() => {});
  }, []);

  const xp = enrollment?.xp_points || 0;
  const level = enrollment?.level || 'Pemula';
  const streak = enrollment?.streak_days || 0;
  // Real scores — null if no data yet
  const latestScore = scores.length > 0 ? scores[scores.length - 1] : null;
  const politeness = latestScore?.politeness_score ?? null;
  const pragmatic = latestScore?.pragmatic_competence ?? null;
  const toxicity = latestScore?.toxicity_score ?? null;

  // Real weekly trend from PragmaticScore records
  const progressData = scores
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7)
    .map(s => ({
      day: new Date(s.date).toLocaleDateString('id-ID', { weekday: 'short' }),
      kesantunan: s.politeness_score || 0,
      pragmatik: s.pragmatic_competence || 0,
    }));

  // Real radar data from latest score
  const radarData = latestScore ? [
    { subject: 'Kesantunan', A: latestScore.politeness_score || 0 },
    { subject: 'Empati', A: latestScore.empathy_score || 0 },
    { subject: 'Konteks', A: latestScore.cultural_sensitivity || 0 },
    { subject: 'Etika', A: latestScore.ethical_awareness || 0 },
    { subject: 'Kultural', A: latestScore.cultural_sensitivity || 0 },
    { subject: 'Refleksi', A: latestScore.pragmatic_competence || 0 },
  ] : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-sm">{greeting},</p>
            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground">
              {user?.full_name || 'Mahasiswa'} 👋
            </h1>
            <p className="text-muted-foreground mt-0.5 text-sm">Lanjutkan perjalanan pragmatik etnografi Anda hari ini.</p>
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
            <div className="bg-white border border-border rounded-2xl px-4 py-3 shadow-sm text-center">
              <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                <Flame className="w-4 h-4" />
                <span className="text-lg font-montserrat">{streak}</span>
              </div>
              <p className="text-xs text-muted-foreground">Hari Streak</p>
            </div>
            )}
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl px-4 py-3 text-white text-center shadow-md">
              <div className="flex items-center gap-1.5 font-bold">
                <Award className="w-4 h-4" />
                <span className="text-lg font-montserrat">{level}</span>
              </div>
              <p className="text-xs text-white/80">{xp.toLocaleString()} XP</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Brain, label: 'Kompetensi Pragmatik', value: pragmatic !== null ? `${pragmatic}%` : '-', color: 'from-indigo-500 to-purple-600', trend: pragmatic !== null ? 'Skor saat ini' : 'Belum ada data' },
          { icon: Shield, label: 'Tingkat Kesantunan', value: politeness !== null ? `${politeness}%` : '-', color: 'from-emerald-500 to-teal-600', trend: politeness !== null ? 'Skor saat ini' : 'Belum ada data' },
          { icon: MessageSquare, label: 'Interaksi AI', value: profile?.total_ai_interactions || 0, color: 'from-cyan-500 to-blue-600', trend: 'Total sesi' },
          { icon: TrendingUp, label: 'Tingkat Toxicity', value: toxicity !== null ? `${toxicity}%` : '-', color: 'from-amber-500 to-orange-600', trend: toxicity !== null ? 'Skor saat ini' : 'Belum ada data' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold font-montserrat text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">{s.trend}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts — only show if real data exists */}
      {progressData.length > 0 && (
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold font-montserrat mb-1">Progress Pragmatik Mingguan</h3>
          <p className="text-xs text-muted-foreground mb-4">Perkembangan kesantunan & kompetensi pragmatik</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="gKesantunan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPragmatik" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} /><stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="kesantunan" stroke="#10B981" fill="url(#gKesantunan)" strokeWidth={2} name="Kesantunan" />
                <Area type="monotone" dataKey="pragmatik" stroke="#4F46E5" fill="url(#gPragmatik)" strokeWidth={2} name="Pragmatik" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-3 h-1 rounded bg-emerald-500" />Kesantunan</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-3 h-1 rounded bg-indigo-500" />Pragmatik</div>
          </div>
        </motion.div>

        {radarData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold font-montserrat mb-1">Digital Pragmatic Profile</h3>
          <p className="text-xs text-muted-foreground mb-2">Radar kompetensi Anda</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(0,0,0,0.07)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar name="Profil" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {[
              { label: 'Pragmatik', score: latestScore?.pragmatic_competence },
              { label: 'Etika', score: latestScore?.ethical_awareness },
              { label: 'Kultural', score: latestScore?.cultural_sensitivity },
            ].map((m, i) => (
              <div key={i} className="flex-1 min-w-0 bg-secondary/50 rounded-xl p-2 text-center">
                <p className="text-sm font-bold font-montserrat text-indigo-600">{m.score != null ? `${m.score}%` : '-'}</p>
                <p className="text-[10px] text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        )}
      </div>
      )}

      {/* 7-Phase Learning Scenario */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl p-6 border border-border shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold font-montserrat flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />7-Fase Adaptive Ethnographic Inquiry
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Skenario pembelajaran pragmatik adaptif berbasis etnografi</p>
          </div>
          <Link to="/learning-ecosystem">
            <Button size="sm" variant="outline" className="text-xs gap-1">Lihat Detail <ChevronRight className="w-3 h-3" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {PHASES.map((p, i) => (
            <div key={i} className={`rounded-xl p-3 border text-center transition-all ${
              p.status === 'selesai' ? 'bg-emerald-50 border-emerald-200' :
              p.status === 'aktif' ? 'bg-indigo-50 border-indigo-300 shadow-md' :
              'bg-secondary/30 border-border opacity-60'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1.5 text-xs font-bold ${
                p.status === 'selesai' ? 'bg-emerald-500 text-white' :
                p.status === 'aktif' ? 'bg-indigo-500 text-white animate-pulse' :
                'bg-secondary text-muted-foreground'
              }`}>{p.phase}</div>
              <p className="text-[10px] font-semibold text-foreground leading-tight">{p.title}</p>
              {p.status === 'aktif' && <p className="text-[9px] text-indigo-500 font-semibold mt-0.5">Aktif</p>}
              {p.status === 'selesai' && <p className="text-[9px] text-emerald-500 font-semibold mt-0.5">✓ Selesai</p>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Learning Progress Dashboard */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
        <LearningProgressDashboard />
      </motion.div>

      {/* Gamification Panel */}
      <GamificationPanel />

      {/* Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
        <ClassLeaderboard classId={enrollment?.class_id} currentUserEmail={user?.email} />
      </motion.div>

      {/* Kalender Jadwal Kelas */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}>
        <ClassCalendar mode="mahasiswa" />
      </motion.div>

      {/* Quick actions + Modules */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="space-y-3">
          <h3 className="font-semibold font-montserrat text-sm text-foreground">Akses Cepat</h3>
          {[
            { icon: Bot, label: 'Asisten AI Pragmatik', desc: 'Knowledge graph + cultural wisdom', path: '/ai-analyzer', color: 'from-indigo-500 to-violet-600' },
            { icon: Network, label: 'Lab Simulasi', desc: 'Berlatih etika di media sosial virtual', path: '/social-lab', color: 'from-cyan-500 to-blue-600' },
            { icon: BookOpen, label: 'Jurnal Reflektif', desc: 'Refleksi dengan umpan balik AI', path: '/journal', color: 'from-emerald-500 to-teal-600' },
            { icon: Globe, label: 'Kearifan Budaya', desc: 'Explore nilai Tolaki, Muna, Buton', path: '/cultural-wisdom', color: 'from-violet-500 to-purple-600' },
          ].map((a, i) => (
            <Link key={i} to={a.path}>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.06 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-border shadow-sm hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center flex-shrink-0`}>
                  <a.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Recent modules */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold font-montserrat flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />Modul Aktif
            </h3>
            <Link to="/modules" className="text-xs text-primary hover:underline flex items-center gap-1">
              Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {scores.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Belum ada modul yang dikerjakan.</p>
                <p className="text-xs mt-1">Mulai dari <Link to="/modules" className="text-primary underline">halaman Modul</Link>.</p>
              </div>
            ) : (
              scores.slice(-4).map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{s.session_notes || `Sesi ${i + 1}`}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 max-w-[120px] h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${s.pragmatic_competence || 0}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{s.pragmatic_competence || 0}%</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {new Date(s.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Cultural Wisdom quick card */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-200">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-violet-500" />
              <p className="text-xs font-bold text-violet-700">Cultural Wisdom Engine Aktif</p>
            </div>
            <p className="text-xs text-violet-600">Mengintegrasikan kearifan budaya Tolaki, Muna, dan Buton dalam setiap analisis AI.</p>
            <div className="flex gap-2 mt-2">
              {['🏔️ Tolaki', '🌊 Muna', '⚓ Buton'].map((b, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 bg-white border border-violet-200 rounded-full text-violet-600">{b}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}