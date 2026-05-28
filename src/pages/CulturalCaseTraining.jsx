import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  Trophy, Zap, Globe, CheckCircle2, XCircle, Loader2,
  ChevronRight, Star, BookOpen, RotateCcw, Filter
} from 'lucide-react';

const BUDAYA_COLORS = {
  tolaki: { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: '🏔️' },
  buton: { bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: '⚓' },
  muna: { bg: 'bg-teal-50 border-teal-200', badge: 'bg-teal-100 text-teal-700', icon: '🌊' },
  mekongga: { bg: 'bg-violet-50 border-violet-200', badge: 'bg-violet-100 text-violet-700', icon: '⛰️' },
  umum: { bg: 'bg-slate-50 border-slate-200', badge: 'bg-slate-100 text-slate-600', icon: '🌐' },
};

const DIFFICULTY_COLORS = {
  mudah: 'bg-emerald-100 text-emerald-700',
  sedang: 'bg-amber-100 text-amber-700',
  sulit: 'bg-rose-100 text-rose-700',
};

const SAMPLE_EXERCISES = [
  {
    id: 'sample_1',
    title: 'Konflik Pendapat di Grup WhatsApp Keluarga',
    budaya: 'tolaki',
    difficulty: 'mudah',
    scenario: 'Dalam grup WhatsApp keluarga besar Tolaki, pamanmu membagikan informasi yang menurutmu kurang akurat tentang obat tradisional. Beberapa anggota keluarga sudah mulai mempercayainya. Kamu ingin meluruskan informasi tersebut.',
    context: 'Budaya Tolaki sangat menghormati hubungan antara saudara tua dan muda. Nilai "Mokotutu" (saling menghormati) menjadi pegangan utama dalam komunikasi antar generasi.',
    dilemma_question: 'Bagaimana cara terbaik kamu menyampaikan koreksi kepada paman di grup keluarga?',
    options: [
      { id: 'A', label: 'A', text: '"Pak Paman, informasi ini salah! Silakan cek fakta dulu sebelum share."' },
      { id: 'B', label: 'B', text: '"Maaf Pak Paman, boleh saya berbagi informasi tambahan yang mungkin melengkapi? Saya menemukan riset terbaru yang menarik soal ini."' },
      { id: 'C', label: 'C', text: 'Langsung share artikel klarifikasi tanpa komentar apapun.' },
      { id: 'D', label: 'D', text: 'Diam saja agar tidak menimbulkan konflik dalam keluarga.' },
    ],
    correct_option_id: 'B',
    explanation: 'Opsi B menunjukkan penghormatan kepada yang lebih tua (Mokotutu) dengan meminta izin terlebih dahulu, menggunakan kata "melengkapi" bukan "membantah", dan menyampaikan koreksi secara santun.',
    cultural_wisdom: 'Tolaki: "Mosehe" – prinsip keselarasan hubungan. Kritik disampaikan dengan cara yang menjaga martabat semua pihak.',
    xp_reward: 50,
  },
  {
    id: 'sample_2',
    title: 'Komentar Negatif di Postingan Usaha Teman',
    budaya: 'buton',
    difficulty: 'sedang',
    scenario: 'Temanmu dari komunitas Buton membuka usaha katering dan memposting foto makanannya di Instagram. Ada beberapa komentar negatif dari orang lain. Temanmu terlihat sedih dan kesal di kolom komentar.',
    context: 'Budaya Buton mengenal konsep "Pobinci-binciki Kuli" – saling mengingatkan dengan cara yang penuh kasih. Solidaritas komunitas sangat dijunjung tinggi.',
    dilemma_question: 'Kamu ingin mendukung temanmu. Apa yang sebaiknya kamu lakukan?',
    options: [
      { id: 'A', label: 'A', text: 'Membalas komentar negatif tersebut secara agresif untuk membela temanmu.' },
      { id: 'B', label: 'B', text: 'Memberikan komentar positif yang tulus, lalu hubungi temanmu secara pribadi untuk memberi semangat.' },
      { id: 'C', label: 'C', text: 'Melaporkan akun yang berkomentar negatif ke Instagram.' },
      { id: 'D', label: 'D', text: 'Tidak melakukan apa-apa, itu urusan temanmu sendiri.' },
    ],
    correct_option_id: 'B',
    explanation: 'Opsi B mencerminkan "Pobinci-binciki Kuli" – memberikan dukungan nyata secara publik sekaligus personal. Membalas agresif justru memperburuk situasi dan melanggar etika digital.',
    cultural_wisdom: 'Buton: "Kabanti" – seni komunikasi yang halus dan bermakna. Dukungan diungkapkan dengan tindakan yang bermartabat.',
    xp_reward: 75,
  },
  {
    id: 'sample_3',
    title: 'Perdebatan Sengit di Forum Online Tentang Adat',
    budaya: 'muna',
    difficulty: 'sulit',
    scenario: 'Di sebuah forum diskusi online tentang adat Muna, terjadi perdebatan sengit antara dua kubu: yang mempertahankan tradisi dan yang ingin memodernisasinya. Suasana mulai panas dan beberapa pesan mengandung kata-kata kasar.',
    context: 'Masyarakat Muna menjunjung tinggi "Kaago-ago" – nilai kebersamaan dan gotong royong. Konflik yang tidak terselesaikan dianggap merusak tatanan sosial.',
    dilemma_question: 'Sebagai anggota forum yang netral, apa peran terbaik yang bisa kamu ambil?',
    options: [
      { id: 'A', label: 'A', text: 'Bergabung dengan salah satu kubu yang menurutmu paling benar dan ikut berdebat.' },
      { id: 'B', label: 'B', text: 'Memposting pesan yang menyudutkan pihak yang menggunakan kata kasar agar mereka malu.' },
      { id: 'C', label: 'C', text: 'Memposting ajakan refleksi: "Diskusi ini penting, tapi bisakah kita berbagi pandangan dengan cara yang lebih menghormati satu sama lain? Kita semua ingin yang terbaik untuk budaya kita."' },
      { id: 'D', label: 'D', text: 'Keluar dari forum karena situasinya sudah tidak kondusif.' },
    ],
    correct_option_id: 'C',
    explanation: 'Opsi C mewujudkan "Kaago-ago" dengan menjadi pemersatu. Mengakui nilai diskusi, mengundang refleksi bersama, dan mengingatkan tujuan bersama tanpa mempermalukan pihak manapun.',
    cultural_wisdom: 'Muna: "Pekande-kandea" – prinsip berbagi kebaikan. Dalam konflik, seseorang bijak bertindak sebagai jembatan, bukan pemantik.',
    xp_reward: 100,
  },
];

export default function CulturalCaseTraining() {
  const [user, setUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null); // { correct, feedback, xp }
  const [evaluating, setEvaluating] = useState(false);
  const [filterBudaya, setFilterBudaya] = useState('semua');
  const [filterDiff, setFilterDiff] = useState('semua');
  const [totalXP, setTotalXP] = useState(0);
  const startTime = useRef(null);

  useEffect(() => {
    base44.auth.me().then(u => { if (u) setUser(u); }).catch(() => {});
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [dbExercises, dbAttempts] = await Promise.all([
      base44.entities.CulturalCaseExercise.filter({ is_active: true }).catch(() => []),
      base44.entities.CulturalCaseAttempt.filter({}).catch(() => []),
    ]);
    const all = [...SAMPLE_EXERCISES, ...(dbExercises || [])];
    setExercises(all);
    setAttempts(dbAttempts || []);
    setTotalXP((dbAttempts || []).reduce((s, a) => s + (a.xp_earned || 0), 0));
    setLoading(false);
  };

  const openExercise = (ex) => {
    setSelectedExercise(ex);
    setSelectedOption(null);
    setResult(null);
    startTime.current = Date.now();
  };

  const submitAnswer = async () => {
    if (!selectedOption || !selectedExercise) return;
    setEvaluating(true);
    const isCorrect = selectedOption === selectedExercise.correct_option_id;
    const chosen = selectedExercise.options.find(o => o.id === selectedOption);

    const prompt = `Kamu adalah evaluator pragmatik budaya. Seorang mahasiswa mengerjakan latihan dilema etika budaya.

Skenario: "${selectedExercise.scenario}"
Konteks budaya: "${selectedExercise.context}"
Pertanyaan: "${selectedExercise.dilemma_question}"
Pilihan yang dipilih mahasiswa (${selectedOption}): "${chosen?.text}"
Pilihan terbaik (${selectedExercise.correct_option_id}): "${selectedExercise.options.find(o => o.id === selectedExercise.correct_option_id)?.text}"
Penjelasan ahli: "${selectedExercise.explanation}"
Kearifan budaya: "${selectedExercise.cultural_wisdom}"

Berikan feedback singkat (2-3 kalimat) kepada mahasiswa:
- Jika benar: puji dan perkuat pemahaman budayanya
- Jika salah: jelaskan dengan lembut mengapa pilihannya kurang tepat dan apa yang lebih baik

Feedback harus hangat, edukatif, dan mengintegrasikan nilai budaya lokal.`;

    const aiResp = await base44.integrations.Core.InvokeLLM({ prompt }).catch(() => ({ result: 'Jawaban telah dievaluasi.' }));
    const feedback = typeof aiResp === 'string' ? aiResp : aiResp?.result || 'Evaluasi selesai.';
    const xpEarned = isCorrect ? (selectedExercise.xp_reward || 50) : Math.floor((selectedExercise.xp_reward || 50) * 0.2);
    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);

    setResult({ correct: isCorrect, feedback, xp: xpEarned });
    setTotalXP(prev => prev + xpEarned);

    // Save attempt
    if (user?.email) {
      await base44.entities.CulturalCaseAttempt.create({
        exercise_id: selectedExercise.id,
        student_email: user.email,
        selected_option_id: selectedOption,
        is_correct: isCorrect,
        xp_earned: xpEarned,
        ai_feedback: feedback,
        ai_score: isCorrect ? 100 : 40,
        time_spent_seconds: timeSpent,
      }).catch(() => {});
    }

    setEvaluating(false);
  };

  const isAttempted = (exId) => attempts.some(a => a.exercise_id === exId && a.student_email === user?.email);

  const filtered = exercises.filter(ex => {
    if (filterBudaya !== 'semua' && ex.budaya !== filterBudaya) return false;
    if (filterDiff !== 'semua' && ex.difficulty !== filterDiff) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground flex items-center gap-2">
              <Globe className="w-7 h-7 text-amber-500" />
              Latihan Kasus Budaya
            </h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Praktikkan komunikasi etis dalam dilema budaya Tolaki, Buton & Muna — dievaluasi langsung oleh AI.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl px-4 py-3 shadow-md">
            <Zap className="w-4 h-4" />
            <div>
              <p className="text-lg font-bold font-montserrat">{totalXP.toLocaleString()}</p>
              <p className="text-[10px] text-white/80">Total XP Latihan</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Kasus', value: exercises.length, color: 'text-indigo-600' },
          { label: 'Diselesaikan', value: [...new Set(attempts.filter(a => a.student_email === user?.email).map(a => a.exercise_id))].length, color: 'text-emerald-600' },
          { label: 'Jawaban Benar', value: attempts.filter(a => a.student_email === user?.email && a.is_correct).length, color: 'text-amber-600' },
          { label: 'Akurasi', value: attempts.filter(a => a.student_email === user?.email).length > 0 ? `${Math.round(attempts.filter(a => a.student_email === user?.email && a.is_correct).length / attempts.filter(a => a.student_email === user?.email).length * 100)}%` : '-', color: 'text-violet-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-border shadow-sm text-center">
            <p className={`text-xl font-bold font-montserrat ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
          {['semua', 'tolaki', 'buton', 'muna', 'mekongga'].map(b => (
            <button key={b} onClick={() => setFilterBudaya(b)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filterBudaya === b ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'}`}>
              {b === 'semua' ? 'Semua' : `${BUDAYA_COLORS[b]?.icon} ${b.charAt(0).toUpperCase() + b.slice(1)}`}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
          {['semua', 'mudah', 'sedang', 'sulit'].map(d => (
            <button key={d} onClick={() => setFilterDiff(d)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filterDiff === d ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'}`}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ex, i) => {
            const budaya = BUDAYA_COLORS[ex.budaya] || BUDAYA_COLORS.umum;
            const done = isAttempted(ex.id);
            return (
              <motion.div key={ex.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => openExercise(ex)}
                className={`rounded-2xl border p-5 cursor-pointer hover:shadow-md transition-all ${budaya.bg} ${done ? 'opacity-80' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{budaya.icon}</span>
                  <div className="flex gap-1.5">
                    {done && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">✓ Selesai</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${DIFFICULTY_COLORS[ex.difficulty]}`}>{ex.difficulty}</span>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${budaya.badge}`}>
                  {ex.budaya.charAt(0).toUpperCase() + ex.budaya.slice(1)}
                </span>
                <h4 className="font-semibold font-montserrat text-sm mt-2 mb-1 leading-snug">{ex.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{ex.scenario}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-amber-600">
                    <Zap className="w-3 h-3" />
                    <span className="text-xs font-semibold">+{ex.xp_reward} XP</span>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs h-7 gap-1">
                    {done ? 'Ulangi' : 'Mulai'} <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Exercise Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget && !evaluating) { setSelectedExercise(null); } }}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className={`p-6 rounded-t-3xl ${BUDAYA_COLORS[selectedExercise.budaya]?.bg || 'bg-slate-50'}`}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{BUDAYA_COLORS[selectedExercise.budaya]?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${BUDAYA_COLORS[selectedExercise.budaya]?.badge}`}>
                        {selectedExercise.budaya.charAt(0).toUpperCase() + selectedExercise.budaya.slice(1)}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${DIFFICULTY_COLORS[selectedExercise.difficulty]}`}>
                        {selectedExercise.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold font-montserrat text-foreground">{selectedExercise.title}</h3>
                  </div>
                  <button onClick={() => setSelectedExercise(null)} className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition text-muted-foreground text-lg leading-none">×</button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Scenario */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Skenario</p>
                  <p className="text-sm text-foreground leading-relaxed bg-secondary/30 rounded-xl p-4">{selectedExercise.scenario}</p>
                </div>

                {/* Context */}
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <BookOpen className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">{selectedExercise.context}</p>
                </div>

                {/* Question */}
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedExercise.dilemma_question}</p>
                </div>

                {/* Options */}
                {!result ? (
                  <div className="space-y-2">
                    {selectedExercise.options.map(opt => (
                      <button key={opt.id} onClick={() => !evaluating && setSelectedOption(opt.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
                          selectedOption === opt.id
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/40 hover:bg-secondary/30'
                        }`}
                      >
                        <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold mr-2 flex-shrink-0 ${
                          selectedOption === opt.id ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'
                        }`}>{opt.label}</span>
                        {opt.text}
                      </button>
                    ))}
                    <Button className="w-full mt-2" disabled={!selectedOption || evaluating} onClick={submitAnswer}>
                      {evaluating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Mengevaluasi...</> : 'Kirim Jawaban'}
                    </Button>
                  </div>
                ) : (
                  /* Result */
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                      {result.correct
                        ? <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                        : <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${result.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {result.correct ? 'Jawaban Tepat!' : 'Belum Tepat'}
                        </p>
                        <div className="flex items-center gap-1 text-amber-600 mt-0.5">
                          <Zap className="w-3 h-3" />
                          <span className="text-xs font-semibold">+{result.xp} XP diperoleh</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                      <p className="text-xs font-semibold text-indigo-600 mb-1.5">💬 Umpan Balik AI</p>
                      <p className="text-sm text-indigo-900 leading-relaxed">{result.feedback}</p>
                    </div>

                    {/* Cultural Wisdom */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                      <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-amber-700 mb-0.5">Kearifan Budaya</p>
                        <p className="text-xs text-amber-800">{selectedExercise.cultural_wisdom}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 gap-1" onClick={() => { setResult(null); setSelectedOption(null); }}>
                        <RotateCcw className="w-3.5 h-3.5" />Coba Lagi
                      </Button>
                      <Button className="flex-1 gap-1" onClick={() => setSelectedExercise(null)}>
                        Kasus Lain <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}