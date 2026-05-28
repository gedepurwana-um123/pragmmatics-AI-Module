import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageSquare, Brain, ChevronRight, RefreshCw, Star,
  AlertTriangle, CheckCircle2, Zap, Target, Crown, Globe, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

// ── Cultural context data ──────────────────────────────────────────────────
const BUDAYA = {
  tolaki: {
    nama: 'Tolaki',
    emoji: '🏔️',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    nilai: 'Mosehe (rekonsiliasi), Kongga Hawia (musyawarah), Mepokoaso (gotong royong)',
    prinsip: 'Dalam budaya Tolaki, konflik diselesaikan melalui musyawarah dan rekonsiliasi. Menjaga kehormatan keluarga dan komunitas sangat penting. Hindari konfrontasi langsung — gunakan mediator atau pendekatan tidak langsung.',
    tips: ['Gunakan prinsip Mosehe (rekonsiliasi) sebelum konfrontasi', 'Hormati hirarki dan tatanan sosial Tolaki', 'Gunakan bahasa yang mengutamakan harmoni komunitas'],
  },
  buton: {
    nama: 'Buton',
    emoji: '⚓',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    nilai: 'Bhinci-bhinciki Kuli (empati), Pomaa-maasiaka (saling mengasihi), Poangkataka (saling menghormati)',
    prinsip: 'Budaya Buton menekankan empati mendalam dan saling menghormati. Komunikasi yang baik selalu mempertimbangkan perasaan lawan bicara. Ekspresi diri yang halus dan tidak menyinggung perasaan orang lain sangat dihargai.',
    tips: ['Terapkan Bhinci-bhinciki Kuli: rasakan apa yang orang lain rasakan', 'Gunakan bahasa yang lembut dan penuh kasih', 'Hindari ekspresi yang bisa menyakiti hati orang lain'],
  },
  muna: {
    nama: 'Muna',
    emoji: '🌊',
    color: 'from-teal-500 to-cyan-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    nilai: 'Katangka (ketegasan bermartabat), Kaago-ago (solidaritas), Kafosine (kerukunan)',
    prinsip: 'Masyarakat Muna menghargai ketegasan yang bermartabat. Berbicara jujur dan langsung diperbolehkan, namun tetap dalam bingkai kesopanan dan kerukunan. Solidaritas kelompok sangat dijunjung tinggi.',
    tips: ['Ekspresikan pendapat dengan tegas tapi bermartabat (Katangka)', 'Utamakan kerukunan dan solidaritas kelompok', 'Gunakan kejujuran langsung namun dengan kesopanan penuh'],
  },
};

// ── Scenarios ──────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: 1,
    title: 'Konflik Komentar Media Sosial',
    desc: 'Seseorang meninggalkan komentar agresif di postingan Anda tentang isu sosial.',
    npc: { name: 'Andi', personality: 'Defensif & Emosional', avatar: '😤', role: 'Netizen Reaktif' },
    context: 'Media sosial Instagram, postingan publik tentang kebijakan kampus',
    difficulty: 'Menengah',
    category: 'Konflik Digital',
    opening: 'Tulisan lo tuh ngaco banget! Gak ada yang minta pendapat lo soal kampus ini! Emang lo siapa?',
    budayaHint: 'buton',
  },
  {
    id: 2,
    title: 'Diskusi Akademis yang Memanas',
    desc: 'Dosen bertanya dan seorang teman mengklaim jawaban Anda salah di depan kelas.',
    npc: { name: 'Budi', personality: 'Kompetitif & Sombong', avatar: '😒', role: 'Rekan Kelas' },
    context: 'Ruang kelas, diskusi terbuka di hadapan dosen dan 30 mahasiswa lain',
    difficulty: 'Lanjutan',
    category: 'Akademis',
    opening: 'Itu salah total. Semua orang tau kalau jawaban kamu itu basic banget dan kurang riset. Saya sudah baca 5 jurnal tentang ini.',
    budayaHint: 'muna',
  },
  {
    id: 3,
    title: 'Negosiasi Bantuan Kelompok',
    desc: 'Anggota kelompok Anda sering tidak aktif dan meminta perpanjangan deadline.',
    npc: { name: 'Citra', personality: 'Pasif & Menghindari Konflik', avatar: '😶', role: 'Anggota Kelompok' },
    context: 'WhatsApp grup project, hari H presentasi sudah dekat',
    difficulty: 'Pemula',
    category: 'Kolaborasi',
    opening: 'Eh guys, sorry ya saya belum ngerjain bagian saya... bisa minta extend lagi gak? Soalnya saya lagi banyak kerjaan...',
    budayaHint: 'tolaki',
  },
  {
    id: 4,
    title: 'Musyawarah Adat Digital',
    desc: 'Sengketa pembagian tugas dalam komunitas online mahasiswa daerah.',
    npc: { name: 'La Ode', personality: 'Tradisional & Otoritatif', avatar: '🧔', role: 'Ketua Himpunan' },
    context: 'Grup WhatsApp himpunan mahasiswa Sulawesi Tenggara perantauan',
    difficulty: 'Menengah',
    category: 'Kultural',
    opening: 'Kita sudah putuskan bersama, saudara. Siapa yang berani mempertanyakan keputusan musyawarah ini menunjukkan ia tidak menghormati nilai leluhur kita.',
    budayaHint: 'tolaki',
  },
  {
    id: 5,
    title: 'Mediasi Perdebatan Online',
    desc: 'Dua teman Anda bertengkar keras di grup chat dan meminta Anda menjadi penengah.',
    npc: { name: 'Deni & Eka', personality: 'Keduanya Keras Kepala', avatar: '⚡', role: 'Pihak yang Berkonflik' },
    context: 'WhatsApp grup mahasiswa, perdebatan soal pilihan ketua organisasi',
    difficulty: 'Lanjutan',
    category: 'Mediasi',
    opening: 'Lo (nama Anda) harus bilang ke Eka, dia yang salah! Gue gak mau dengerin alasan apapun. Minta dia minta maaf dulu ke gue.',
    budayaHint: 'buton',
  },
  {
    id: 6,
    title: 'Solidaritas vs Kebenaran',
    desc: 'Teman satu daerah Anda melakukan tindakan tidak jujur dan meminta Anda diam.',
    npc: { name: 'Wa Ode', personality: 'Memohon & Manipulatif', avatar: '🥺', role: 'Teman Kedaerahan' },
    context: 'Pesan pribadi WhatsApp, teman satu kampung yang berbuat salah',
    difficulty: 'Lanjutan',
    category: 'Etika',
    opening: 'Kita sama-sama anak Muna. Jangan sampai kamu lapor ke dosen soal itu. Kita harus jaga nama baik daerah kita, satu untuk semua.',
    budayaHint: 'muna',
  },
];

const DIFFICULTY_COLORS = {
  Pemula: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Menengah: 'bg-amber-100 text-amber-700 border-amber-200',
  Lanjutan: 'bg-violet-100 text-violet-700 border-violet-200',
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function VirtualRoleplayLab() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedBudaya, setSelectedBudaya] = useState(null);
  const [messages, setMessages] = useState([]);
  const [responseOptions, setResponseOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [score, setScore] = useState({ politeness: 0, effectiveness: 0, empathy: 0, cultural: 0, turns: 0 });
  const [gameEnded, setGameEnded] = useState(false);
  const [finalAnalysis, setFinalAnalysis] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, responseOptions]);

  const startScenario = (scenario) => {
    const budaya = BUDAYA[scenario.budayaHint] || BUDAYA.tolaki;
    setSelectedScenario(scenario);
    setSelectedBudaya(budaya);
    setMessages([{ role: 'npc', content: scenario.opening }]);
    setResponseOptions(null);
    setScore({ politeness: 0, effectiveness: 0, empathy: 0, cultural: 0, turns: 0 });
    setGameEnded(false);
    setFinalAnalysis(null);
    generateOptions(scenario.opening, scenario, budaya, []);
  };

  const generateOptions = async (npcMsg, scenario, budaya, history) => {
    setLoadingOptions(true);
    setResponseOptions(null);

    const prompt = `Kamu adalah sistem AI untuk Virtual Roleplay Lab pragmatik budaya Sulawesi Tenggara.

Skenario: "${scenario.title}"
Konteks: ${scenario.context}
NPC "${scenario.npc.name}" (${scenario.npc.personality}): ${npcMsg}
Riwayat: ${history.length > 0 ? history.map(m => `[${m.role === 'player' ? 'Mahasiswa' : 'NPC'}]: ${m.content}`).join(' | ') : 'Ini awal percakapan.'}

KONTEKS BUDAYA — ${budaya.nama}:
Nilai utama: ${budaya.nilai}
Prinsip komunikasi: ${budaya.prinsip}

Buat 3 opsi respons mahasiswa yang SANGAT BERBEDA dalam strategi pragmatik. Integrasikan kearifan lokal budaya ${budaya.nama} secara nyata dan relevan dalam setiap opsi. Untuk setiap opsi berikan:
- text: teks respons (realistis, Bahasa Indonesia, mencerminkan nilai budaya)
- strategy_label: label strategi singkat
- explanation: penjelasan pragmatik + kaitan dengan nilai budaya ${budaya.nama}
- cultural_insight: kutipan atau nilai spesifik budaya ${budaya.nama} yang relevan
- politeness: skor 0-100
- effectiveness: skor 0-100
- empathy: skor 0-100
- cultural_alignment: seberapa selaras dengan nilai budaya ${budaya.nama} (0-100)
- npc_response: respons NPC berikutnya
- end_conversation: true jika sudah 4-5 babak`;

    const schema = {
      type: 'object',
      properties: {
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              strategy_label: { type: 'string' },
              explanation: { type: 'string' },
              cultural_insight: { type: 'string' },
              politeness: { type: 'number' },
              effectiveness: { type: 'number' },
              empathy: { type: 'number' },
              cultural_alignment: { type: 'number' },
              npc_response: { type: 'string' },
              end_conversation: { type: 'boolean' },
            }
          }
        }
      }
    };

    const result = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: schema });
    setResponseOptions(result.options || []);
    setLoadingOptions(false);
  };

  const selectResponse = async (option) => {
    const newMessages = [
      ...messages,
      { role: 'player', content: option.text },
      { role: 'npc', content: option.npc_response },
    ];
    setMessages(newMessages);
    setResponseOptions(null);

    const newTurns = score.turns + 1;
    const avg = (a, b) => Math.round((a * score.turns + b) / newTurns);
    const newScore = {
      politeness: avg(score.politeness, option.politeness),
      effectiveness: avg(score.effectiveness, option.effectiveness),
      empathy: avg(score.empathy, option.empathy),
      cultural: avg(score.cultural, option.cultural_alignment || 0),
      turns: newTurns,
    };
    setScore(newScore);

    if (option.end_conversation || newTurns >= 5) {
      setGameEnded(true);
      await generateFinalAnalysis(newMessages, newScore, selectedScenario, selectedBudaya);
    } else {
      generateOptions(option.npc_response, selectedScenario, selectedBudaya, newMessages);
    }
  };

  const generateFinalAnalysis = async (history, finalScore, scenario, budaya) => {
    const prompt = `Analisis akhir roleplay pragmatik mahasiswa berbasis budaya ${budaya.nama}.

Skenario: "${scenario.title}" — NPC: ${scenario.npc.name} (${scenario.npc.personality})
Konteks budaya: Nilai ${budaya.nama}: ${budaya.nilai}
Riwayat:
${history.map(m => `[${m.role === 'player' ? 'Mahasiswa' : 'NPC'}]: ${m.content}`).join('\n')}

Skor: Kesantunan ${finalScore.politeness}%, Efektivitas ${finalScore.effectiveness}%, Empati ${finalScore.empathy}%, Kesesuaian Budaya ${finalScore.cultural}%

Berikan analisis akhir komprehensif dalam bahasa Indonesia yang mengintegrasikan nilai budaya ${budaya.nama}.`;

    const schema = {
      type: 'object',
      properties: {
        overall_assessment: { type: 'string' },
        cultural_analysis: { type: 'string' },
        best_moment: { type: 'string' },
        missed_opportunity: { type: 'string' },
        recommended_theory: { type: 'string' },
        cultural_wisdom_applied: { type: 'string' },
      }
    };

    const analysis = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: schema });
    setFinalAnalysis(analysis);
  };

  const getOptionStyle = (idx) => {
    const styles = [
      'border-amber-200 bg-amber-50 hover:border-amber-400',
      'border-emerald-200 bg-emerald-50 hover:border-emerald-400 ring-2 ring-emerald-200/50',
      'border-rose-200 bg-rose-50 hover:border-rose-400',
    ];
    return styles[idx] || styles[0];
  };

  const getOptionBadge = (idx) => {
    const badges = [
      { label: 'Pasif', color: 'bg-amber-100 text-amber-700' },
      { label: 'Ideal ⭐', color: 'bg-emerald-100 text-emerald-700' },
      { label: 'Agresif', color: 'bg-rose-100 text-rose-700' },
    ];
    return badges[idx] || badges[0];
  };

  const categories = ['all', ...new Set(SCENARIOS.map(s => s.category))];
  const filteredScenarios = filterCategory === 'all' ? SCENARIOS : SCENARIOS.filter(s => s.category === filterCategory);

  // ── Scenario Selection Screen ────────────────────────────────────────────
  if (!selectedScenario) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 mb-2">
            <Users className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-xs font-semibold text-cyan-600">NPC Roleplay · AI Pragmatics · Kearifan Lokal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Lab Simulasi Pragmatik</h1>
          <p className="text-muted-foreground mt-1 text-sm">Latih kemampuan pragmatik dalam skenario digital yang terintegrasi dengan nilai budaya Tolaki, Buton, dan Muna.</p>
        </motion.div>

        {/* Cultural Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {Object.values(BUDAYA).map((b, i) => (
            <motion.div key={b.nama} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`${b.bg} rounded-2xl border ${b.border} p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{b.emoji}</span>
                <div>
                  <p className={`font-bold text-sm ${b.text}`}>Budaya {b.nama}</p>
                  <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${b.color} mt-0.5`} />
                </div>
              </div>
              <p className={`text-xs ${b.text} leading-relaxed`}>{b.nilai}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                filterCategory === c ? 'bg-primary text-white border-primary' : 'bg-white border-border text-muted-foreground hover:border-primary/40'
              }`}>
              {c === 'all' ? 'Semua' : c}
            </button>
          ))}
        </div>

        {/* Scenario Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredScenarios.map((s, i) => {
            const b = BUDAYA[s.budayaHint];
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-border shadow-sm p-5 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => startScenario(s)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{s.npc.avatar}</div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[s.difficulty]}`}>{s.difficulty}</span>
                    {b && <span className={`text-xs px-2 py-0.5 rounded-full ${b.bg} ${b.text} border ${b.border}`}>{b.emoji} {b.nama}</span>}
                  </div>
                </div>
                <h3 className="font-bold font-montserrat text-sm text-foreground mb-1 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{s.desc}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-sm">{s.npc.avatar}</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{s.npc.name}</p>
                    <p className="text-xs text-muted-foreground">{s.npc.personality}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">{s.category}</span>
                  <Button size="sm" className="text-xs bg-primary text-white rounded-xl gap-1 group-hover:shadow-md transition-all">
                    Mulai <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Active Roleplay Screen ───────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <button onClick={() => setSelectedScenario(null)} className="text-xs text-muted-foreground hover:text-primary mb-1 flex items-center gap-1">
              ← Kembali ke pilihan skenario
            </button>
            <h2 className="text-xl font-bold font-montserrat">{selectedScenario.title}</h2>
            <p className="text-xs text-muted-foreground">{selectedScenario.context}</p>
          </div>
          {score.turns > 0 && (
            <div className="flex gap-2">
              {[
                { label: 'Kesantunan', val: score.politeness, color: 'text-emerald-600' },
                { label: 'Efektivitas', val: score.effectiveness, color: 'text-indigo-600' },
                { label: 'Empati', val: score.empathy, color: 'text-cyan-600' },
                { label: 'Kultural', val: score.cultural, color: 'text-amber-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white border border-border rounded-xl px-3 py-2 text-center hidden sm:block">
                  <p className={`text-base font-bold font-montserrat ${s.color}`}>{s.val}%</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Chat area */}
        <div className="lg:col-span-3 space-y-4">
          {/* NPC profile */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl">{selectedScenario.npc.avatar}</div>
            <div>
              <p className="font-bold text-sm">{selectedScenario.npc.name}</p>
              <p className="text-xs text-muted-foreground">{selectedScenario.npc.role} · <span className="text-amber-600">{selectedScenario.npc.personality}</span></p>
            </div>
            <div className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${selectedBudaya?.bg} ${selectedBudaya?.text} border ${selectedBudaya?.border}`}>
              <span>{selectedBudaya?.emoji}</span> {selectedBudaya?.nama}
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-3 max-h-[380px] overflow-y-auto">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'player' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.role === 'npc' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">{selectedScenario.npc.avatar}</div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${msg.role === 'player' ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white' : 'bg-secondary/60 text-foreground border border-border'}`}>
                  {msg.role === 'npc' && <p className="text-xs font-semibold text-muted-foreground mb-0.5">{selectedScenario.npc.name}</p>}
                  {msg.role === 'player' && <p className="text-xs text-white/70 mb-0.5">Anda</p>}
                  {msg.content}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Response options */}
          {!gameEnded && (
            <div className="space-y-3">
              {loadingOptions ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl border border-border shadow-sm p-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-indigo-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AI sedang menganalisis konteks budaya {selectedBudaya?.nama}...</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Menyiapkan respons berbasis kearifan lokal</p>
                  </div>
                </motion.div>
              ) : responseOptions && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Pilih Respons Anda:</p>
                  {responseOptions.map((opt, idx) => {
                    const badge = getOptionBadge(idx);
                    return (
                      <motion.button key={idx} onClick={() => selectResponse(opt)}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${getOptionStyle(idx)}`}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badge.color}`}>{badge.label}</span>
                          <span className="text-xs text-muted-foreground">{opt.strategy_label}</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">"{opt.text}"</p>
                        <p className="text-xs text-muted-foreground mt-1.5 italic">{opt.explanation}</p>
                        {opt.cultural_insight && (
                          <div className={`mt-2 px-2 py-1.5 rounded-lg ${selectedBudaya?.bg} border ${selectedBudaya?.border}`}>
                            <p className={`text-xs ${selectedBudaya?.text}`}>{selectedBudaya?.emoji} <span className="font-semibold">{selectedBudaya?.nama}:</span> {opt.cultural_insight}</p>
                          </div>
                        )}
                        <div className="flex gap-3 mt-2">
                          <span className="text-xs text-emerald-600">Santun: {opt.politeness}%</span>
                          <span className="text-xs text-indigo-600">Efektif: {opt.effectiveness}%</span>
                          <span className="text-xs text-cyan-600">Empati: {opt.empathy}%</span>
                          <span className="text-xs text-amber-600">Kultural: {opt.cultural_alignment || 0}%</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          )}

          {/* Game ended */}
          <AnimatePresence>
            {gameEnded && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl border border-indigo-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Skenario Selesai!</h3>
                    <p className="text-sm text-muted-foreground">Analisis pragmatik budaya {selectedBudaya?.nama}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Kesantunan', val: score.politeness, icon: '🤝' },
                    { label: 'Efektivitas', val: score.effectiveness, icon: '🎯' },
                    { label: 'Empati', val: score.empathy, icon: '💙' },
                    { label: 'Kultural', val: score.cultural, icon: selectedBudaya?.emoji || '🌿' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 text-center border border-indigo-200">
                      <p className="text-lg">{s.icon}</p>
                      <p className={`text-xl font-bold font-montserrat ${s.val >= 70 ? 'text-emerald-600' : s.val >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{s.val}%</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
                {finalAnalysis && (
                  <div className="space-y-2 text-sm">
                    <div className="bg-white rounded-xl p-3 border border-indigo-200">
                      <p className="text-xs font-bold text-indigo-600 mb-1">📊 Penilaian Keseluruhan</p>
                      <p className="text-foreground text-xs leading-relaxed">{finalAnalysis.overall_assessment}</p>
                    </div>
                    {finalAnalysis.cultural_analysis && (
                      <div className={`rounded-xl p-3 border ${selectedBudaya?.border} ${selectedBudaya?.bg}`}>
                        <p className={`text-xs font-bold mb-1 ${selectedBudaya?.text}`}>{selectedBudaya?.emoji} Analisis Budaya {selectedBudaya?.nama}</p>
                        <p className="text-foreground text-xs leading-relaxed">{finalAnalysis.cultural_analysis}</p>
                      </div>
                    )}
                    {finalAnalysis.cultural_wisdom_applied && (
                      <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                        <p className="text-xs font-bold text-amber-700 mb-1">🌿 Kearifan Lokal yang Diterapkan</p>
                        <p className="text-foreground text-xs">{finalAnalysis.cultural_wisdom_applied}</p>
                      </div>
                    )}
                    {finalAnalysis.best_moment && (
                      <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                        <p className="text-xs font-bold text-emerald-600 mb-1">✨ Momen Terbaik</p>
                        <p className="text-foreground text-xs">{finalAnalysis.best_moment}</p>
                      </div>
                    )}
                    {finalAnalysis.missed_opportunity && (
                      <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                        <p className="text-xs font-bold text-amber-600 mb-1">💡 Peluang yang Terlewat</p>
                        <p className="text-foreground text-xs">{finalAnalysis.missed_opportunity}</p>
                      </div>
                    )}
                  </div>
                )}
                <Button onClick={() => startScenario(selectedScenario)} className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl">
                  <RefreshCw className="w-4 h-4 mr-2" /> Coba Lagi dengan Pilihan Berbeda
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 lg:sticky lg:top-8 space-y-4">
            {/* Cultural wisdom */}
            {selectedBudaya && (
              <div className={`${selectedBudaya.bg} rounded-xl border ${selectedBudaya.border} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{selectedBudaya.emoji}</span>
                  <p className={`text-xs font-bold ${selectedBudaya.text}`}>Konteks Budaya {selectedBudaya.nama}</p>
                </div>
                <p className={`text-xs ${selectedBudaya.text} leading-relaxed mb-2`}>{selectedBudaya.prinsip}</p>
                <div className="space-y-1">
                  {selectedBudaya.tips.map((t, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className={`w-3 h-3 mt-0.5 flex-shrink-0 ${selectedBudaya.text}`} />
                      <p className={`text-xs ${selectedBudaya.text}`}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scenario context */}
            <div>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Panduan Skenario
              </h3>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 mb-2">
                <p className="text-xs font-bold text-indigo-600 mb-1">🎭 Konteks</p>
                <p className="text-xs text-indigo-800">{selectedScenario.context}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-xs font-bold text-amber-600 mb-1">🧠 NPC: {selectedScenario.npc.name}</p>
                <p className="text-xs text-amber-800">Kepribadian: <strong>{selectedScenario.npc.personality}</strong></p>
                <p className="text-xs text-amber-700 mt-0.5">Peran: {selectedScenario.npc.role}</p>
              </div>
            </div>

            {/* Universal tips */}
            <div className="border-t border-border pt-3">
              <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">💡 Tip Pragmatik</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-start gap-2 p-2 rounded-lg bg-secondary/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Gunakan face-saving strategies untuk menjaga harga diri semua pihak</span>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-secondary/40">
                  <Zap className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Prinsip Leech: maksimalkan keuntungan orang lain, minimalkan kerugian</span>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-secondary/40">
                  <Globe className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
                  <span>Kearifan lokal memperkaya strategi pragmatik Anda</span>
                </div>
              </div>
            </div>

            {/* Other scenarios */}
            <div className="border-t border-border pt-3">
              <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Skenario Lain</p>
              <div className="space-y-1.5">
                {SCENARIOS.filter(s => s.id !== selectedScenario.id).slice(0, 3).map(s => {
                  const b = BUDAYA[s.budayaHint];
                  return (
                    <button key={s.id} onClick={() => startScenario(s)}
                      className="w-full text-left p-2.5 rounded-xl border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{s.npc.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{s.title}</p>
                          <div className="flex gap-1.5 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{s.difficulty}</span>
                            {b && <span className={`text-[10px] ${b.text}`}>{b.emoji} {b.nama}</span>}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}