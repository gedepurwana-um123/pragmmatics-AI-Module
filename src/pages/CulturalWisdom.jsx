import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Globe, Sparkles, BookOpen, Brain, Shield, RefreshCw, ChevronRight, MessageSquare, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const CULTURES = [
  {
    id: 'tolaki', name: 'Tolaki / Mekongga', icon: '🏔️', region: 'Konawe, Kolaka',
    color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 border-amber-200',
    textColor: 'text-amber-700',
    prinsip: 'Mombesara — Penghormatan & Harmoni Sosial',
    nilai: ['Penghormatan (Mombesara)', 'Harmoni Sosial (Sara)', 'Menjaga Martabat', 'Komunikasi Kolektif', 'Penghargaan Lawan Bicara'],
    etika: 'Dalam budaya Tolaki/Mekongga, komunikasi yang baik selalu mengutamakan penghormatan dan menjaga keharmonisan sosial. Kritik disampaikan secara personal untuk menjaga harga diri.',
    larangan: 'Mengkritik secara langsung di depan umum, merendahkan status sosial, komunikasi yang memecah harmoni komunitas.',
    contoh_baik: '"Maaf, boleh saya menyampaikan pendapat secara langsung? Saya pikir ada perspektif lain yang perlu dipertimbangkan."',
    contoh_buruk: '"Komentar kamu tidak masuk akal sama sekali!"',
    peribahasa: '"Metobu-tobu" — Saling mendukung dan menguatkan dalam komunitas',
    komunikasi_digital: 'Di media sosial, orang Tolaki yang bijak akan memilih kata-kata yang menjaga martabat semua pihak, bahkan dalam ketidaksepakatan.',
  },
  {
    id: 'muna', name: 'Muna', icon: '🌊', region: 'Kepulauan Muna',
    color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-700',
    prinsip: 'Kabhanti — Kelembutan Bahasa & Kesabaran',
    nilai: ['Kelembutan Bahasa (Kabhanti)', 'Pengendalian Emosi', 'Komunikasi Tenang', 'Etika Kritik', 'Kesabaran Sosial'],
    etika: 'Masyarakat Muna menjunjung tinggi kelembutan dalam berbahasa. Perbedaan pendapat disampaikan dengan penuh kesabaran dan ketenangan, tidak pernah dengan konfrontasi langsung.',
    larangan: 'Berteriak, menggunakan kata-kata kasar, konfrontasi langsung yang menyebabkan malu, mempermalukan seseorang di depan umum.',
    contoh_baik: '"Dengan hormat, saya memiliki perspektif berbeda yang ingin saya bagikan dengan penuh kerendahan hati."',
    contoh_buruk: '"SALAH BESAR! Gak ngerti apa-apa!"',
    peribahasa: '"Kafogena" — Kepatutan dalam berbicara sesuai konteks dan menjaga kesopanan',
    komunikasi_digital: 'Pengguna media sosial dari budaya Muna cenderung merespons dengan bahasa yang lembut meski dalam situasi konflik.',
  },
  {
    id: 'buton', name: 'Buton', icon: '⚓', region: 'Kepulauan Buton',
    color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 border-emerald-200',
    textColor: 'text-emerald-700',
    prinsip: 'Bhinci-bhinciki Kuli — Rasa Kemanusiaan & Martabat',
    nilai: ['Tata Krama', 'Komunikasi Bermartabat', 'Penghormatan Sosial', 'Kebijaksanaan Berbicara', 'Etika Hierarki'],
    etika: 'Filosofi Bhinci-bhinciki kuli mengajarkan bahwa setiap manusia memiliki martabat yang harus dijaga. Komunikasi harus selalu memanusiakan lawan bicara, tanpa memandang perbedaan.',
    larangan: 'Ujaran yang merendahkan martabat, komunikasi yang menyepelekan status sosial, kata-kata yang tidak bermartabat.',
    contoh_baik: '"Dengan segala hormat, izinkan saya berbagi pandangan yang mungkin dapat memperkaya diskusi ini."',
    contoh_buruk: '"Gak ada gunanya dengerin kamu!"',
    peribahasa: '"Bhinci-bhinciki kuli" — Cubitlah dirimu sendiri dulu sebelum mencubit orang lain (empati & refleksi)',
    komunikasi_digital: 'Dalam konteks digital, orang Buton menekankan bahwa setiap komentar online mencerminkan karakter dan martabat penulisnya.',
  },
];

const WISDOM_SCENARIOS = [
  { text: 'Komentar kamu tidak masuk akal!', type: 'FTA - Face Threatening Act' },
  { text: 'Bodoh! Belajar dulu sebelum berkomentar!', type: 'Hate Speech + Impoliteness' },
  { text: 'Terima kasih, pendapatmu sangat membantu.', type: 'Santun - Ekspresif' },
  { text: 'Wah, kamu berani sekali ya 🙄', type: 'Sarkasme Implisit' },
];

export default function CulturalWisdom() {
  const [selectedCulture, setSelectedCulture] = useState(CULTURES[0]);
  const [testText, setTestText] = useState('');
  const [wisdomResult, setWisdomResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbRecommendations, setDbRecommendations] = useState([]);

  useEffect(() => {
    base44.entities.CulturalRecommendation.filter({ is_active: true })
      .then(data => setDbRecommendations(data || []))
      .catch(() => {});
  }, []);

  const analyzeWithCulture = async () => {
    if (!testText.trim()) return;
    setLoading(true);
    setWisdomResult(null);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Kamu adalah Cultural Wisdom Recommendation Engine PragmaticsAI.

Analisis teks komunikasi berikut menggunakan perspektif kearifan budaya lokal Sulawesi Tenggara (Tolaki/Mekongga, Muna, Buton).

Teks: "${testText}"
Fokus budaya saat ini: ${selectedCulture.name}
Prinsip: ${selectedCulture.prinsip}

Berikan analisis mendalam:
1. Apakah teks ini selaras atau bertentangan dengan nilai budaya ${selectedCulture.name}?
2. Bagaimana perspektif budaya ${selectedCulture.name} memandang komunikasi seperti ini?
3. Rekomendasi spesifik berbasis nilai ${selectedCulture.prinsip}
4. Versi alternatif yang mencerminkan nilai budaya tersebut
5. Pelajaran pragmatik etnografi yang dapat dipetik`,
      response_json_schema: {
        type: 'object',
        properties: {
          selaras: { type: 'boolean' },
          perspektif_budaya: { type: 'string' },
          rekomendasi_etis: { type: 'string' },
          versi_alternatif: { type: 'string' },
          pelajaran_etnografi: { type: 'string' },
          prinsip_yang_relevan: { type: 'string' },
          level_kesantunan: { type: 'string' },
        }
      }
    });
    setWisdomResult(res);
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 mb-2">
          <Globe className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-xs font-semibold text-violet-600">Cultural Wisdom Recommendation Engine · Etnografi Digital</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground">Kearifan Budaya Lokal</h1>
        <p className="text-muted-foreground mt-1 text-sm">Database etnografi kearifan budaya Sulawesi Tenggara terintegrasi dengan AI Pragmatic Analyzer.</p>
      </motion.div>

      {/* Culture selector */}
      <div className="grid sm:grid-cols-3 gap-4">
        {CULTURES.map((c, i) => (
          <motion.button key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedCulture(c)}
            className={`p-5 rounded-2xl border text-left transition-all hover:shadow-md ${
              selectedCulture.id === c.id ? `${c.bg} shadow-md` : 'bg-white border-border hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{c.icon}</span>
              <div>
                <p className="font-bold font-montserrat text-foreground text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.region}</p>
              </div>
            </div>
            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${c.bg} ${c.textColor} border ${c.bg.replace('bg-', 'border-').replace('50', '300')} w-fit`}>
              {c.prinsip.split('—')[0].trim()}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected culture detail */}
      <AnimatePresence mode="wait">
        <motion.div key={selectedCulture.id}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className={`rounded-2xl border p-6 ${selectedCulture.bg}`}
        >
          <div className="flex flex-wrap items-start gap-4 mb-5">
            <div className="text-5xl">{selectedCulture.icon}</div>
            <div className="flex-1">
              <h2 className={`text-xl font-bold font-montserrat ${selectedCulture.textColor}`}>Budaya {selectedCulture.name}</h2>
              <p className={`text-sm font-semibold mt-0.5 ${selectedCulture.textColor} opacity-80`}>{selectedCulture.prinsip}</p>
              <p className="text-sm text-foreground mt-2 leading-relaxed">{selectedCulture.etika}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-white/50 shadow-sm">
              <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Nilai Utama</p>
              <div className="space-y-1">
                {selectedCulture.nilai.map((n, i) => (
                  <p key={i} className="text-xs text-foreground flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-60" />{n}
                  </p>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-white/50 shadow-sm">
              <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">Larangan Komunikasi</p>
              <p className="text-xs text-foreground leading-relaxed">{selectedCulture.larangan}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-white/50 shadow-sm">
              <p className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-wider">✓ Contoh Baik</p>
              <p className="text-xs text-foreground italic leading-relaxed">{selectedCulture.contoh_baik}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-white/50 shadow-sm">
              <p className="text-xs font-bold text-rose-600 mb-2 uppercase tracking-wider">✗ Contoh Buruk</p>
              <p className="text-xs text-foreground italic leading-relaxed">{selectedCulture.contoh_buruk}</p>
            </div>
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="bg-white/70 rounded-xl p-4">
              <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">📜 Peribahasa / Filosofi</p>
              <p className="text-sm font-semibold text-foreground italic">"{selectedCulture.peribahasa}"</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">📱 Konteks Digital</p>
              <p className="text-xs text-foreground leading-relaxed">{selectedCulture.komunikasi_digital}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Cultural Wisdom AI Test */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-border shadow-sm p-6"
        >
          <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />Uji Teks dengan Cultural Wisdom Engine
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Analisis teks menggunakan perspektif budaya {selectedCulture.name}</p>
          <div className="flex gap-2 flex-wrap mb-3">
            {WISDOM_SCENARIOS.map((s, i) => (
              <button key={i} onClick={() => setTestText(s.text)}
                className="text-xs px-2.5 py-1 bg-secondary border border-border rounded-lg hover:bg-primary/10 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all"
              >Contoh {i + 1}</button>
            ))}
          </div>
          <Textarea value={testText} onChange={e => setTestText(e.target.value)}
            placeholder="Masukkan teks komunikasi untuk dianalisis melalui lensa budaya..."
            className="min-h-[100px] bg-secondary/30 border-border resize-none mb-3 text-sm"
          />
          <Button onClick={analyzeWithCulture} disabled={loading || !testText.trim()}
            className={`w-full bg-gradient-to-r ${selectedCulture.color} hover:opacity-90 text-white rounded-xl`}
          >
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin mr-2" />Menganalisis...</> : <><Sparkles className="w-4 h-4 mr-2" />Analisis dengan Kearifan {selectedCulture.name}</>}
          </Button>
        </motion.div>

        {/* Wisdom Result */}
        <div>
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col items-center"
              >
                <span className="text-4xl mb-4 animate-pulse">{selectedCulture.icon}</span>
                <p className="text-sm font-semibold text-foreground">Cultural Wisdom Engine bekerja...</p>
                <p className="text-xs text-muted-foreground mt-1">Mengintegrasikan nilai {selectedCulture.name}</p>
              </motion.div>
            )}

            {wisdomResult && !loading && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className={`rounded-2xl p-4 border ${wisdomResult.selaras ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'} flex items-center gap-3`}>
                  <span className="text-2xl">{wisdomResult.selaras ? '✓' : '✗'}</span>
                  <div>
                    <p className={`font-bold text-sm ${wisdomResult.selaras ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {wisdomResult.selaras ? 'Selaras dengan Nilai Budaya' : 'Bertentangan dengan Nilai Budaya'} {selectedCulture.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Level: {wisdomResult.level_kesantunan}</p>
                  </div>
                </div>
                {[
                  { label: '🔍 Perspektif Budaya', text: wisdomResult.perspektif_budaya, color: selectedCulture.bg },
                  { label: '🌿 Rekomendasi Etis', text: wisdomResult.rekomendasi_etis, color: 'bg-emerald-50 border-emerald-200' },
                  { label: '📖 Pelajaran Etnografi', text: wisdomResult.pelajaran_etnografi, color: 'bg-indigo-50 border-indigo-200' },
                ].map((r, i) => r.text && (
                  <div key={i} className={`rounded-xl p-4 border ${r.color}`}>
                    <p className="text-xs font-bold text-foreground mb-1">{r.label}</p>
                    <p className="text-sm text-foreground leading-relaxed">{r.text}</p>
                  </div>
                ))}
                {wisdomResult.versi_alternatif && (
                  <div className={`rounded-xl p-4 border ${selectedCulture.bg}`}>
                    <p className="text-xs font-bold mb-1 text-foreground">✏️ Versi Berbasis Nilai {selectedCulture.name}</p>
                    <p className="text-sm text-foreground italic">"{wisdomResult.versi_alternatif}"</p>
                  </div>
                )}
              </motion.div>
            )}

            {!wisdomResult && !loading && (
              <div className="bg-white rounded-2xl border border-dashed border-border p-10 flex flex-col items-center text-center">
                <span className="text-4xl mb-3 opacity-30">{selectedCulture.icon}</span>
                <p className="text-sm text-muted-foreground">Masukkan teks di sebelah kiri untuk mendapatkan analisis kearifan budaya</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cultural comparison */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-border shadow-sm p-6"
      >
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />Perbandingan Nilai Komunikasi Antar Budaya
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-border">
                {['Dimensi', '🏔️ Tolaki/Mekongga', '🌊 Muna', '⚓ Buton'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { dim: 'Prinsip Utama', tolaki: 'Mombesara (Penghormatan)', muna: 'Kabhanti (Kelembutan)', buton: 'Bhinci-bhinciki kuli (Martabat)' },
                { dim: 'Gaya Komunikasi', tolaki: 'Kolektif & harmonis', muna: 'Tenang & sabar', buton: 'Bermartabat & bijak' },
                { dim: 'Cara Kritik', tolaki: 'Personal, menjaga izzah', muna: 'Lembut & tidak langsung', buton: 'Dengan tata krama hierarki' },
                { dim: 'Larangan Utama', tolaki: 'Mempermalukan publik', muna: 'Konfrontasi & berteriak', buton: 'Merendahkan martabat' },
                { dim: 'Digital Etiquette', tolaki: 'Jaga harmoni di grup', muna: 'Respons tenang di konflik', buton: 'Komentar bermartabat' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-bold text-xs text-foreground uppercase tracking-wider">{row.dim}</td>
                  <td className="px-4 py-3 text-xs text-foreground"><span className="text-amber-700">{row.tolaki}</span></td>
                  <td className="px-4 py-3 text-xs text-foreground"><span className="text-blue-700">{row.muna}</span></td>
                  <td className="px-4 py-3 text-xs text-foreground"><span className="text-emerald-700">{row.buton}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}