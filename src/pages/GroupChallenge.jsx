import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Users, Trophy, Zap, RefreshCw, CheckCircle2, MessageSquare, Star, Send, Brain, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const SCENARIOS = [
  {
    id: 1,
    title: 'Konflik Komentar Akademik',
    difficulty: 'Sedang',
    context: 'Di grup WhatsApp kelas, seorang mahasiswa menulis: "Presentasi kelompok 3 tadi benar-benar membosankan dan tidak ada isinya. Buang waktu saja!"',
    task: 'Sebagai kelompok, rumuskan SATU respons kolektif yang: (1) mengakui perasaan, (2) konstruktif, (3) menjaga harmoni kelas, (4) mencerminkan nilai kearifan budaya lokal.',
    rubric: ['Kesantunan Bahasa', 'Empati Digital', 'Konstruktivitas', 'Sensitivitas Kultural', 'Efektivitas Pesan'],
    cultural_hint: 'Budaya Muna mengajarkan: kritik sebaiknya disampaikan dengan kelembutan bahasa dan tidak menyerang langsung.',
  },
  {
    id: 2,
    title: 'Dilemma Ujaran Provokasi Medsos',
    difficulty: 'Sulit',
    context: 'Di Twitter/X, sebuah akun anonim menyebarkan: "Mahasiswa jurusan bahasa memang tidak ada kegunaan, cuma buang uang orang tua saja!"',
    task: 'Kelompok harus menyepakati strategi respons komunitas akademik yang bermartabat, tidak reaktif, dan secara pragmatik efektif untuk menegakkan kebenaran.',
    rubric: ['Ketidak-reaktifan', 'Ketegasan Bermartabat', 'Pengelolaan Emosi', 'Persuasivitas Etis', 'Dampak Sosial'],
    cultural_hint: 'Filosofi Buton "Bhinci-bhinciki kuli" — cubit dirimu sebelum mencubit orang lain. Refleksi sebelum respons.',
  },
  {
    id: 3,
    title: 'Mediasi Konflik Grup Chat',
    difficulty: 'Mudah',
    context: 'Dalam grup chat organisasi mahasiswa, dua anggota terlibat perdebatan panas tentang jadwal rapat. Suasana memanas dan anggota lain diam.',
    task: 'Sebagai kelompok mediator, rumuskan pesan intervensi yang dapat meredakan konflik, mengundang dialog konstruktif, dan memulihkan harmoni grup.',
    rubric: ['Netralitas', 'Kemampuan Mediasi', 'Inklusivitas', 'Kejelasan Komunikasi', 'Efek Meredakan Konflik'],
    cultural_hint: 'Nilai Tolaki "Metobu-tobu": kebersamaan dan saling mendukung adalah fondasi komunikasi komunitas.',
  },
];

export default function GroupChallenge() {
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const [groupName, setGroupName] = useState('');
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedChallenges, setSavedChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([
    { group: 'Kelompok Alpha', score: 92, scenario: 'Konflik Komentar Akademik' },
    { group: 'Kelompok Beta', score: 88, scenario: 'Mediasi Konflik Grup Chat' },
    { group: 'Kelompok Gamma', score: 85, scenario: 'Dilemma Ujaran Provokasi' },
    { group: 'Tim Pragmatik', score: 79, scenario: 'Konflik Komentar Akademik' },
  ]);

  useEffect(() => {
    base44.entities.GroupChallenge.filter({ status: 'completed' })
      .then(d => setSavedChallenges(d || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!response.trim() || !groupName.trim()) return;
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Kamu adalah evaluator pragmatik akademis PragmaticsAI.

SKENARIO: ${activeScenario.title}
KONTEKS: "${activeScenario.context}"
TUGAS: ${activeScenario.task}
NAMA KELOMPOK: ${groupName}
RESPONS KELOMPOK: "${response}"

Evaluasi respons kelompok berdasarkan 5 indikator rubrik berikut: ${activeScenario.rubric.join(', ')}.

Berikan evaluasi JSON:
- skor_total: 0-100 (rata-rata semua indikator)
- skor_kesantunan: 0-100
- skor_empati: 0-100
- skor_konstruktivitas: 0-100
- skor_kultural: 0-100
- skor_efektivitas: 0-100
- kekuatan: array 2-3 kelebihan respons
- perbaikan: array 2-3 area yang perlu ditingkatkan
- analisis_pragmatik: analisis mendalam 3-4 kalimat
- rekomendasi_kultural: rekomendasi berbasis kearifan budaya lokal
- versi_ideal: contoh respons ideal yang lebih baik
- grade: A/B/C/D`,
      response_json_schema: {
        type: 'object',
        properties: {
          skor_total: { type: 'number' }, skor_kesantunan: { type: 'number' },
          skor_empati: { type: 'number' }, skor_konstruktivitas: { type: 'number' },
          skor_kultural: { type: 'number' }, skor_efektivitas: { type: 'number' },
          kekuatan: { type: 'array', items: { type: 'string' } },
          perbaikan: { type: 'array', items: { type: 'string' } },
          analisis_pragmatik: { type: 'string' }, rekomendasi_kultural: { type: 'string' },
          versi_ideal: { type: 'string' }, grade: { type: 'string' },
        }
      }
    });
    setEvaluation(res);
    setSubmitted(true);

    // Save to DB
    await base44.entities.GroupChallenge.create({
      title: activeScenario.title,
      scenario: activeScenario.context,
      group_name: groupName,
      avg_politeness: res.skor_kesantunan,
      avg_effectiveness: res.skor_efektivitas,
      cultural_score: res.skor_kultural,
      ai_consensus: res.analisis_pragmatik,
      status: 'completed',
    }).catch(() => {});

    setLeaderboard(prev => [...prev, { group: groupName, score: res.skor_total, scenario: activeScenario.title }].sort((a, b) => b.score - a.score).slice(0, 8));
    setLoading(false);
  };

  const gradeColor = (g) => ({ A: 'text-emerald-600 bg-emerald-100', B: 'text-blue-600 bg-blue-100', C: 'text-amber-600 bg-amber-100', D: 'text-rose-600 bg-rose-100' }[g] || 'text-muted-foreground bg-secondary');

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 mb-2">
          <Users className="w-3.5 h-3.5 text-cyan-500" />
          <span className="text-xs font-semibold text-cyan-600">Collaborative Learning · Pragmatic Dilemma Challenge</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Tantangan Kelompok</h1>
        <p className="text-muted-foreground mt-1 text-sm">Selesaikan dilema komunikasi pragmatik bersama kelompok. Performa dinilai berdasarkan konsensus kesantunan dan efektivitas pesan.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Scenario selector + form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Scenario cards */}
          <div className="grid sm:grid-cols-3 gap-3">
            {SCENARIOS.map((s, i) => (
              <button key={i} onClick={() => { setActiveScenario(s); setSubmitted(false); setEvaluation(null); setResponse(''); }}
                className={`p-4 rounded-2xl border text-left transition-all ${activeScenario.id === s.id ? 'bg-indigo-50 border-indigo-300 shadow-md' : 'bg-white border-border hover:border-indigo-200'}`}
              >
                <div className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit mb-2 ${s.difficulty === 'Mudah' ? 'bg-emerald-100 text-emerald-700' : s.difficulty === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                  {s.difficulty}
                </div>
                <p className="text-xs font-semibold text-foreground leading-tight">{s.title}</p>
              </button>
            ))}
          </div>

          {/* Active scenario */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-700 mb-1">📋 Skenario: {activeScenario.title}</p>
              <p className="text-sm text-amber-800 leading-relaxed">"{activeScenario.context}"</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <p className="text-xs font-bold text-indigo-700 mb-1">🎯 Tugas Kelompok</p>
              <p className="text-sm text-indigo-800 leading-relaxed">{activeScenario.task}</p>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
              <p className="text-xs font-bold text-violet-700 mb-1">🌿 Cultural Hint</p>
              <p className="text-xs text-violet-800">{activeScenario.cultural_hint}</p>
            </div>

            {/* Rubric */}
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Indikator Penilaian</p>
              <div className="flex gap-2 flex-wrap">
                {activeScenario.rubric.map((r, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-secondary border border-border rounded-full text-muted-foreground">{r}</span>
                ))}
              </div>
            </div>

            {!submitted ? (
              <div className="space-y-3">
                <input value={groupName} onChange={e => setGroupName(e.target.value)}
                  placeholder="Nama kelompok Anda..."
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <Textarea value={response} onChange={e => setResponse(e.target.value)}
                  placeholder="Tulis respons kolektif kelompok Anda di sini. Diskusikan dulu bersama anggota kelompok sebelum mengirim..."
                  className="min-h-[130px] bg-secondary/30 border-border resize-none text-sm"
                />
                <Button onClick={handleSubmit} disabled={loading || !response.trim() || !groupName.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl gap-2"
                >
                  {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />AI Mengevaluasi...</> : <><Send className="w-4 h-4" />Kirim Respons Kelompok</>}
                </Button>
              </div>
            ) : evaluation && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Grade + total */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold font-montserrat ${gradeColor(evaluation.grade)}`}>
                    {evaluation.grade}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{groupName}</p>
                    <p className="text-2xl font-bold font-montserrat text-indigo-600">{evaluation.skor_total}/100</p>
                    <p className="text-xs text-muted-foreground">Skor Konsensus Kelompok</p>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { label: 'Kesantunan', val: evaluation.skor_kesantunan },
                    { label: 'Empati', val: evaluation.skor_empati },
                    { label: 'Konstruktif', val: evaluation.skor_konstruktivitas },
                    { label: 'Kultural', val: evaluation.skor_kultural },
                    { label: 'Efektivitas', val: evaluation.skor_efektivitas },
                  ].map((s, i) => (
                    <div key={i} className="bg-white border border-border rounded-xl p-3 text-center">
                      <p className={`text-lg font-bold font-montserrat ${s.val >= 80 ? 'text-emerald-600' : s.val >= 60 ? 'text-blue-600' : 'text-amber-600'}`}>{s.val}</p>
                      <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Kekuatan & Perbaikan */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-emerald-700 mb-2">✓ Kekuatan</p>
                    {evaluation.kekuatan?.map((k, i) => <p key={i} className="text-xs text-emerald-800 mb-1">• {k}</p>)}
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-amber-700 mb-2">↑ Area Perbaikan</p>
                    {evaluation.perbaikan?.map((p, i) => <p key={i} className="text-xs text-amber-800 mb-1">• {p}</p>)}
                  </div>
                </div>

                <div className="bg-white border border-border rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-foreground">📚 Analisis Pragmatik AI</p>
                  <p className="text-sm text-foreground leading-relaxed">{evaluation.analisis_pragmatik}</p>
                </div>
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-violet-700 mb-1">🌿 Rekomendasi Kultural</p>
                  <p className="text-sm text-violet-800">{evaluation.rekomendasi_kultural}</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-indigo-700 mb-1">✏️ Versi Ideal AI</p>
                  <p className="text-sm text-indigo-800 italic">"{evaluation.versi_ideal}"</p>
                </div>

                <Button onClick={() => { setSubmitted(false); setEvaluation(null); setResponse(''); setGroupName(''); }}
                  variant="outline" className="w-full rounded-xl">
                  Coba Skenario Lain
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Leaderboard */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />Papan Peringkat Kelompok
              </h3>
            </div>
            <div className="divide-y divide-border">
              {leaderboard.slice(0, 8).map((l, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i === 0 ? 'bg-amber-50' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-300 text-slate-700' : i === 2 ? 'bg-amber-700 text-white' : 'bg-secondary text-muted-foreground'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{l.group}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{l.scenario}</p>
                  </div>
                  <span className={`text-sm font-bold font-montserrat flex-shrink-0 ${l.score >= 85 ? 'text-emerald-600' : l.score >= 70 ? 'text-blue-600' : 'text-amber-600'}`}>{l.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-4 space-y-3">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />Statistik Tantangan
            </h4>
            {[
              { label: 'Skenario Aktif', value: SCENARIOS.length },
              { label: 'Kelompok Berpartisipasi', value: leaderboard.length },
              { label: 'Avg Skor Kesantunan', value: '83%' },
              { label: 'Konsensus Tertinggi', value: `${Math.max(...leaderboard.map(l => l.score))}/100` },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="text-sm font-bold text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}