import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Globe, Search, BookOpen, Sparkles, RefreshCw, ChevronDown,
  ChevronUp, MapPin, Star, Zap, Shield, MessageSquare, Brain
} from 'lucide-react';

const CULTURAL_DB = {
  tolaki: {
    name: 'Tolaki Mekongga',
    region: 'Konawe, Kolaka — Sulawesi Tenggara',
    icon: '🏔️',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50 border-amber-200',
    textColor: 'text-amber-800',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-300',
    prinsip: 'Mombesara (penghormatan tertinggi)',
    sistem_sapaan: [
      { term: 'O ina / O ama', arti: 'Sapaan hormat untuk orang yang lebih tua (ibu/bapak)' },
      { term: 'O ana', arti: 'Sapaan kepada yang lebih muda dengan penuh kasih sayang' },
      { term: 'Iko / Iko ana', arti: 'Penyebutan "kamu" – harus hati-hati, bisa terasa kasar jika salah konteks' },
    ],
    nilai_utama: [
      { nilai: 'Mombesara', desc: 'Menghormati dengan tulus — jangan pernah merendahkan di depan umum' },
      { nilai: 'Mowaworaha', desc: 'Menjaga harmoni sosial — hindari konfrontasi langsung' },
      { nilai: 'Metonggu', desc: 'Setia dan konsisten — ucapan adalah ikatan' },
      { nilai: 'Mepokoaso', desc: 'Tolong-menolong — meminta tolong harus dengan kesantunan' },
    ],
    larangan: [
      'Mengkritik langsung di depan orang banyak (merusak "muka" — harga diri)',
      'Memotong pembicaraan orang tua atau yang dihormati',
      'Menggunakan bahasa kasar kepada orang baru dikenal',
      'Menolak undangan secara blak-blakan — gunakan alasan yang sopan',
    ],
    contoh_santun: [
      { situasi: 'Menolak pendapat', buruk: '"Salah itu!"', baik: '"Mungkin ada sudut pandang lain yang bisa kita diskusikan bersama..."' },
      { situasi: 'Meminta tolong', buruk: '"Kerjain ini!"', baik: '"Kalau berkenan, bolehkah saya minta bantuan untuk..."' },
      { situasi: 'Kritik konstruktif', buruk: '"Kontenmu jelek"', baik: '"Bagus! Mungkin bisa lebih kuat kalau ditambah referensi akademis."' },
    ],
    peribahasa: [
      { pb: 'Inae kona sara inae, o sara ie pinamodulu', terjemah: 'Siapa yang berpegang pada adat, adat itulah yang akan menjaganya.' },
      { pb: 'Mombesara koana wuta ono', terjemah: 'Menghormati adalah pondasi kebersamaan.' },
    ],
    digital_etika: 'Dalam ruang digital, budaya Tolaki menghendaki komunikasi yang menjaga "muka" (face) semua pihak. Komentar publik yang merendahkan dianggap pelanggaran serius terhadap nilai mombesara. AI harus mendeteksi potensi FTA (Face Threatening Act) dan merekomendasikan strategi kesantunan yang relevan.',
  },
  muna: {
    name: 'Muna',
    region: 'Pulau Muna — Sulawesi Tenggara',
    icon: '🌊',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-800',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-300',
    prinsip: 'Kabhanti (kelembutan dan keindahan tutur)',
    sistem_sapaan: [
      { term: 'Hadia / Hadia aini', arti: 'Sapaan hormat umum — menunjukkan keakraban yang sopan' },
      { term: 'Ikoo / Iko', arti: '"Kamu" — dapat kasar; lebih sopan mengganti dengan nama/gelar' },
      { term: 'Amani / Inani', arti: 'Panggilan ayah/ibu seseorang — bentuk penghormatan tinggi' },
    ],
    nilai_utama: [
      { nilai: 'Kabhanti', desc: 'Bertutur dengan kelembutan dan keindahan — bahasa adalah seni' },
      { nilai: 'Kaago-ago', desc: 'Saling menjaga dan melindungi — komunikasi tidak boleh menyakiti' },
      { nilai: 'Poangka-angkataka', desc: 'Saling mengangkat derajat — ucapan harus memuliakan' },
      { nilai: 'Mogena', desc: 'Keberanian berbicara kebenaran, namun dengan cara yang arif' },
    ],
    larangan: [
      'Berbicara tergesa-gesa saat menghadapi orang tua — dianggap tidak menghormati',
      'Mengucapkan sumpah serapah dalam diskusi — sangat tabu',
      'Menggunakan nada tinggi saat berdebat di ruang publik',
      'Menyebut nama seseorang dengan nada meremehkan',
    ],
    contoh_santun: [
      { situasi: 'Koreksi teman', buruk: '"Lo salah paham!"', baik: '"Mungkin ada yang terlewat — boleh saya tambahkan perspektifnya?"' },
      { situasi: 'Ketidaksetujuan', buruk: '"Gak mungkin itu bisa berhasil"', baik: '"Idenya menarik, bagaimana kalau kita pertimbangkan juga tantangannya?"' },
      { situasi: 'Komplain', buruk: '"Layanannya buruk banget"', baik: '"Saya harap ke depannya bisa lebih baik, karena pengalamannya kurang memuaskan."' },
    ],
    peribahasa: [
      { pb: 'Nopogau bhala, notando kuli', terjemah: 'Kata yang salah bisa melukai lebih dalam dari pisau.' },
      { pb: 'Kabhanti neisumala', terjemah: 'Tutur yang indah membuka semua pintu.' },
    ],
    digital_etika: 'Masyarakat Muna sangat menghargai kelembutan tutur (kabhanti) bahkan di media digital. Komentar bernada tinggi atau agresif di media sosial dianggap memalukan keluarga. AI harus memberikan skor rendah pada komunikasi yang menggunakan bahasa keras dan merekomendasikan versi yang lebih halus.',
  },
  buton: {
    name: 'Buton (Wolio)',
    region: 'Pulau Buton — Sulawesi Tenggara',
    icon: '⚓',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    textColor: 'text-emerald-800',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    prinsip: 'Bhinci-bhinciki Kuli (rasa kemanusiaan universal)',
    sistem_sapaan: [
      { term: 'Ya / Yaku', arti: 'Kata ganti "saya" — menunjukkan kerendahan hati' },
      { term: 'Ano / Ane', arti: 'Sapaan akrab — digunakan untuk teman sebaya yang dekat' },
      { term: 'Ompu / Latua', arti: 'Panggilan hormat untuk tetua — wajib dalam situasi formal' },
    ],
    nilai_utama: [
      { nilai: 'Bhinci-bhinciki Kuli', desc: 'Rasa kemanusiaan — perlakukan orang lain sebagaimana ingin diperlakukan' },
      { nilai: 'Pomaa-maasiaka', desc: 'Saling mengasihi — komunikasi harus mengandung kasih' },
      { nilai: 'Poangka-angkataka', desc: 'Saling memuliakan — ucapan harus mengangkat, bukan menjatuhkan' },
      { nilai: 'Popia-piara', desc: 'Saling menjaga — jaga perasaan orang lain dalam tutur' },
    ],
    larangan: [
      'Bicara kasar kepada tamu — sangat memalukan dalam budaya Buton',
      'Menyebut kelemahan seseorang di depan umum',
      'Berdebat dengan emosi di tempat umum — cari ruang pribadi',
      'Menggunakan kata-kata yang menyinggung silsilah atau keturunan seseorang',
    ],
    contoh_santun: [
      { situasi: 'Menegur', buruk: '"Kamu selalu telat!"', baik: '"Saya khawatir, ada kendala yang bisa kita selesaikan bersama?"' },
      { situasi: 'Ketidakpuasan', buruk: '"Hasilnya mengecewakan"', baik: '"Mungkin ada hal yang bisa kita tingkatkan bersama-sama?"' },
      { situasi: 'Penolakan', buruk: '"Nggak mau"', baik: '"Saat ini saya belum bisa, tapi mungkin bisa dibantu di lain waktu."' },
    ],
    peribahasa: [
      { pb: 'Yinda yindamo arata somanamo karo', terjemah: 'Lebih baik kehilangan harta daripada kehilangan martabat.' },
      { pb: 'Bhinci-bhinciki kuli, duka-ndukamo ngibi', terjemah: 'Rasa kemanusiaan adalah cermin jiwa yang sesungguhnya.' },
    ],
    digital_etika: 'Prinsip bhinci-bhinciki kuli dalam budaya Buton menekankan empati universal. Di era digital, prinsip ini menuntut bahwa setiap komentar online harus melewati filter: "Apakah ini akan menyakiti jika saya yang menerimanya?" AI harus menggunakan prinsip ini sebagai landasan analisis etika komunikasi digital.',
  },
  jawa: {
    name: 'Jawa',
    region: 'Jawa Tengah, Jawa Timur, DIY',
    icon: '🏛️',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50 border-violet-200',
    textColor: 'text-violet-800',
    badgeColor: 'bg-violet-100 text-violet-700 border-violet-300',
    prinsip: 'Unggah-ungguh (tatakrama bertingkat)',
    sistem_sapaan: [
      { term: 'Njenengan / Panjenengan', arti: '"Anda" tingkat sangat hormat — wajib untuk orang tua dan atasan' },
      { term: 'Sampeyan', arti: '"Kamu" tingkat menengah — untuk orang yang sudah dikenal' },
      { term: 'Kowe / Sliramu', arti: '"Kamu" akrab — hanya untuk teman sangat dekat atau bawahan' },
    ],
    nilai_utama: [
      { nilai: 'Unggah-ungguh', desc: 'Tatakrama berlapis — pilihan kata disesuaikan status dan relasi' },
      { nilai: 'Tepa selira', desc: 'Empati mendalam — bayangkan perasaan lawan bicara sebelum berkata' },
      { nilai: 'Rukun', desc: 'Menjaga harmoni — hindari konflik terbuka, gunakan sindiran halus' },
      { nilai: 'Andhap asor', desc: 'Rendah hati — merendahkan diri dalam tutur sebagai bentuk hormat' },
    ],
    larangan: [
      'Bicara dengan bahasa "ngoko" (kasar) kepada orang tua atau atasan',
      'Menolak langsung tanpa basa-basi — selalu gunakan kata pengantar',
      'Bicara terlalu keras atau sembrono di hadapan publik',
      'Menyebut nama seseorang tanpa gelar/panggilan hormat',
    ],
    contoh_santun: [
      { situasi: 'Koreksi atasan', buruk: '"Bapak salah!"', baik: '"Mohon maaf, mungkin ada yang terlewat dari sudut pandang saya..."' },
      { situasi: 'Ketidaksetujuan', buruk: '"Nggak setuju!"', baik: '"Kalau berkenan, izinkan saya menyampaikan perspektif yang berbeda..."' },
      { situasi: 'Permintaan', buruk: '"Tolong kerjain!"', baik: '"Nuwun sewu, kalau tidak merepotkan, mohon bantuannya..."' },
    ],
    peribahasa: [
      { pb: 'Ajining diri saka lathi', terjemah: 'Harga diri seseorang dinilai dari tutur katanya.' },
      { pb: 'Ngono ya ngono, ning aja ngono', terjemah: 'Boleh berkata begitu, tapi jangan seperti itu caranya.' },
    ],
    digital_etika: 'Budaya Jawa dengan sistem unggah-ungguh (tingkatan bahasa) memberikan kerangka analisis yang kaya untuk komunikasi digital. Pemilihan kata dalam komentar online mencerminkan posisi sosial dan niat penutur. AI harus mendeteksi ketidaksesuaian register bahasa dan memberikan rekomendasi yang mempertimbangkan konteks hierarki sosial.',
  },
  sunda: {
    name: 'Sunda',
    region: 'Jawa Barat, Banten',
    icon: '🌾',
    color: 'from-lime-500 to-green-600',
    bgColor: 'bg-lime-50 border-lime-200',
    textColor: 'text-lime-800',
    badgeColor: 'bg-lime-100 text-lime-700 border-lime-300',
    prinsip: 'Someah hade ka semah (ramah kepada tamu/sesama)',
    sistem_sapaan: [
      { term: 'Abdi', arti: '"Saya" — bentuk sopan dan rendah hati' },
      { term: 'Aranjeun / Maneh', arti: '"Kamu" — aranjeun lebih sopan, maneh untuk teman dekat' },
      { term: 'Akang / Teteh', arti: 'Kakak laki-laki/perempuan — sapaan hormat untuk yang lebih tua' },
    ],
    nilai_utama: [
      { nilai: 'Someah', desc: 'Ramah dan murah hati — selalu sambut dengan kehangatan' },
      { nilai: 'Silih asih', desc: 'Saling mengasihi — komunikasi harus menghidupkan kasih' },
      { nilai: 'Silih asah', desc: 'Saling mengasah — kritik untuk kemajuan bersama, bukan menjatuhkan' },
      { nilai: 'Silih asuh', desc: 'Saling mengasuh — jaga dan lindungi lewat kata-kata yang baik' },
    ],
    larangan: [
      'Bicara sombong atau meremehkan (takabur) — sangat tidak disukai',
      'Menghardik atau berteriak di depan umum',
      'Mempermalukan seseorang dengan membuka aib di hadapan banyak orang',
      'Menggunakan bahasa kasar kepada yang lebih tua',
    ],
    contoh_santun: [
      { situasi: 'Tegur sapa', buruk: '"Heh!"', baik: '"Wilujeng, Akang/Teteh!"' },
      { situasi: 'Kritik', buruk: '"Kamu ngga becus"', baik: '"Mungkin bisa lebih baik lagi, abdi siap bantu kalau perlu."' },
      { situasi: 'Penolakan', buruk: '"Malas ah"', baik: '"Hapunten, kali ini abdi belum bisa, insya Allah lain waktu."' },
    ],
    peribahasa: [
      { pb: 'Ulah nyebut jalma ku ngaran', terjemah: 'Jangan memanggil orang dengan sebutan yang merendahkan.' },
      { pb: 'Lamun nyarita kudu diteundeun heula dina simbut sabar', terjemah: 'Sebelum berbicara, selimutilah dulu dengan kesabaran.' },
    ],
    digital_etika: 'Falsafah Sunda "silih asih, silih asah, silih asuh" memberi landasan kuat untuk etika digital. Komunikasi online yang baik seharusnya mengasihi, mengasah (mendidik), dan mengasuh (membimbing) — bukan menyerang. AI harus menggunakan tiga prinsip ini sebagai rubrik penilaian etika komentar digital.',
  },
  minang: {
    name: 'Minangkabau',
    region: 'Sumatera Barat',
    icon: '🦌',
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50 border-red-200',
    textColor: 'text-red-800',
    badgeColor: 'bg-red-100 text-red-700 border-red-300',
    prinsip: 'Adat basandi syarak, syarak basandi Kitabullah',
    sistem_sapaan: [
      { term: 'Ambo', arti: '"Saya" — bentuk sopan, menunjukkan kerendahan hati' },
      { term: 'Ang / Waang', arti: '"Kamu" — informal, hanya untuk teman sangat dekat' },
      { term: 'Uni / Uda', arti: 'Kakak perempuan/laki-laki — sapaan hormat umum' },
    ],
    nilai_utama: [
      { nilai: 'Alua jo patuik', desc: 'Sesuai alur dan kepantasan — komunikasi harus kontekstual' },
      { nilai: 'Bulek aie dek pambuluah', desc: 'Mufakat dalam komunikasi — hindari keputusan sepihak' },
      { nilai: 'Kato nan ampek', desc: 'Empat jenis tutur: kepada yang tua, muda, sesama, dan lawan' },
      { nilai: 'Malu jo sopan', desc: 'Rasa malu sebagai kontrol sosial — jaga martabat dalam kata' },
    ],
    larangan: [
      'Bicara melampaui batas kepantasan sosial (tidak tahu diri)',
      'Membuka aib keluarga atau orang lain di ruang publik',
      'Berdebat dengan cara mempermalukan lawan bicara',
      'Menggunakan bahasa yang tidak sesuai dengan strata lawan bicara',
    ],
    contoh_santun: [
      { situasi: 'Pendapat berbeda', buruk: '"Salah itu!"', baik: '"Kalau boleh ambo tambahkan, mungkin ada sudut pandang yang berbeda..."' },
      { situasi: 'Permintaan', buruk: '"Kasih ke saya!"', baik: '"Kalau tak keberatan, bolehkah ambo minta bantuannya?"' },
      { situasi: 'Ketidaksetujuan', buruk: '"Nonsense!"', baik: '"Ambo rasa perlu kita pertimbangkan lebih dalam..."' },
    ],
    peribahasa: [
      { pb: 'Kato pusako alam', terjemah: 'Kata adalah warisan alam yang harus dijaga.' },
      { pb: 'Nan elok dipakai, nan buruak dibuang', terjemah: 'Ambil yang baik, buang yang buruk — dalam bertutur maupun bertindak.' },
    ],
    digital_etika: 'Budaya Minangkabau dengan prinsip "kato nan ampek" (empat jenis tutur) memberikan panduan kontekstual dalam komunikasi digital. Setiap komunikasi harus disesuaikan dengan siapa yang diajak bicara. AI harus mendeteksi ketidaksesuaian register dan nada berdasarkan konteks sosial yang terdeteksi.',
  },
};

export default function PragmaticCulturalTour() {
  const [selectedCulture, setSelectedCulture] = useState('tolaki');
  const [expandedSection, setExpandedSection] = useState('nilai');
  const [analyzeText, setAnalyzeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('referensi');

  const culture = CULTURAL_DB[selectedCulture];
  const cultures = Object.entries(CULTURAL_DB).filter(([k, v]) =>
    !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAnalyze = async () => {
    if (!analyzeText.trim()) return;
    setAnalyzing(true);
    setAnalysisResult(null);

    const prompt = `Kamu adalah AI Pragmatik yang menggunakan database referensi budaya ${culture.name} (${culture.region}).

Prinsip budaya: ${culture.prinsip}
Nilai utama: ${culture.nilai_utama.map(v => `${v.nilai}: ${v.desc}`).join('; ')}
Larangan komunikasi: ${culture.larangan.join('; ')}
Etika digital spesifik: ${culture.digital_etika}

Analisis teks ini dari perspektif budaya ${culture.name}:
"${analyzeText}"

Berikan analisis dalam format JSON dengan field:
- kesesuaian_budaya: number (0-100)
- tingkat_kesantunan: number (0-100)  
- pelanggaran: array of strings (pelanggaran nilai budaya, kosong jika tidak ada)
- kesesuaian_detail: string (penjelasan 2 kalimat)
- rekomendasi_budaya: string (saran spesifik berbasis nilai ${culture.name})
- alternatif_kalimat: string (versi yang lebih sesuai budaya)
- prinsip_relevan: string (nilai budaya yang paling relevan)`;

    const schema = {
      type: 'object', properties: {
        kesesuaian_budaya: { type: 'number' },
        tingkat_kesantunan: { type: 'number' },
        pelanggaran: { type: 'array', items: { type: 'string' } },
        kesesuaian_detail: { type: 'string' },
        rekomendasi_budaya: { type: 'string' },
        alternatif_kalimat: { type: 'string' },
        prinsip_relevan: { type: 'string' },
      }
    };
    const res = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: schema });
    setAnalysisResult(res);
    setAnalyzing(false);
  };

  const toggleSection = (s) => setExpandedSection(prev => prev === s ? null : s);

  const SECTIONS = [
    { key: 'nilai', label: 'Nilai Utama', icon: Star },
    { key: 'sapaan', label: 'Sistem Sapaan', icon: MessageSquare },
    { key: 'larangan', label: 'Larangan Komunikasi', icon: Shield },
    { key: 'contoh', label: 'Contoh Santun vs Kasar', icon: BookOpen },
    { key: 'peribahasa', label: 'Peribahasa', icon: Sparkles },
    { key: 'digital', label: 'Etika Digital AI', icon: Brain },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-2">
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">Database Referensi Budaya Lokal Indonesia</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground">Wisata Budaya Pragmatik</h1>
        <p className="text-muted-foreground mt-1 text-sm">Jelajahi norma kesantunan spesifik berbagai budaya agar AI memberikan anotasi yang akurat dan kontekstual.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit mb-6">
        {[
          { key: 'referensi', label: '📚 Referensi Budaya' },
          { key: 'analisis', label: '🔍 Analisis Kultural' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === t.key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >{t.label}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Culture selector */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari budaya..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="space-y-2">
            {cultures.map(([key, c]) => (
              <button key={key} onClick={() => setSelectedCulture(key)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedCulture === key ? 'border-primary/50 bg-primary/5 shadow-sm' : 'border-border bg-white hover:border-primary/30'
                }`}
              >
                <span className="text-xl flex-shrink-0">{c.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{c.region}</p>
                </div>
              </button>
            ))}
          </div>
          {/* Stats */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-4 border border-indigo-200">
            <p className="text-xs font-bold text-indigo-700 mb-2">🗺️ Database Budaya</p>
            <p className="text-2xl font-bold font-montserrat text-indigo-600">{Object.keys(CULTURAL_DB).length}</p>
            <p className="text-xs text-indigo-600">budaya terdokumentasi</p>
            <div className="mt-3 space-y-1">
              {['Sistem Sapaan', 'Nilai Komunikasi', 'Larangan', 'Contoh Santun', 'Peribahasa', 'Etika Digital AI'].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-indigo-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Culture header */}
          <AnimatePresence mode="wait">
            <motion.div key={selectedCulture} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`rounded-2xl border p-5 ${culture.bgColor}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{culture.icon}</span>
                <div className="flex-1">
                  <h2 className={`text-xl font-bold font-montserrat ${culture.textColor}`}>{culture.name}</h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{culture.region}</p>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border text-xs font-semibold ${culture.badgeColor}`}>
                    <Star className="w-3 h-3" />{culture.prinsip}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {activeTab === 'referensi' && (
            <div className="space-y-3">
              {SECTIONS.map(sec => (
                <div key={sec.key} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <button onClick={() => toggleSection(sec.key)}
                    className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${culture.color} flex items-center justify-center`}>
                        <sec.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-foreground">{sec.label}</span>
                    </div>
                    {expandedSection === sec.key ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>

                  <AnimatePresence>
                    {expandedSection === sec.key && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-2">
                          {sec.key === 'nilai' && culture.nilai_utama.map((v, i) => (
                            <div key={i} className={`rounded-xl p-3 border ${culture.bgColor}`}>
                              <p className={`text-xs font-bold ${culture.textColor}`}>{v.nilai}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{v.desc}</p>
                            </div>
                          ))}
                          {sec.key === 'sapaan' && culture.sistem_sapaan.map((s, i) => (
                            <div key={i} className="flex gap-3 p-3 rounded-xl bg-secondary/30 border border-border">
                              <span className="font-bold text-sm text-primary font-montserrat w-24 flex-shrink-0">{s.term}</span>
                              <span className="text-xs text-muted-foreground">{s.arti}</span>
                            </div>
                          ))}
                          {sec.key === 'larangan' && culture.larangan.map((l, i) => (
                            <div key={i} className="flex gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200">
                              <span className="text-rose-500 flex-shrink-0">⚠</span>
                              <p className="text-xs text-rose-700">{l}</p>
                            </div>
                          ))}
                          {sec.key === 'contoh' && culture.contoh_santun.map((c, i) => (
                            <div key={i} className="rounded-xl border border-border overflow-hidden">
                              <div className="bg-secondary/30 px-3 py-1.5 text-xs font-bold text-muted-foreground">{c.situasi}</div>
                              <div className="grid grid-cols-2 divide-x divide-border">
                                <div className="p-3 bg-rose-50">
                                  <p className="text-[9px] font-bold text-rose-500 mb-1">❌ Kasar/Tidak Santun</p>
                                  <p className="text-xs text-rose-700 italic">"{c.buruk}"</p>
                                </div>
                                <div className="p-3 bg-emerald-50">
                                  <p className="text-[9px] font-bold text-emerald-600 mb-1">✓ Santun</p>
                                  <p className="text-xs text-emerald-700 italic">"{c.baik}"</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {sec.key === 'peribahasa' && culture.peribahasa.map((p, i) => (
                            <div key={i} className={`rounded-xl p-4 border ${culture.bgColor}`}>
                              <p className={`text-sm font-bold italic ${culture.textColor} mb-1`}>"{p.pb}"</p>
                              <p className="text-xs text-muted-foreground">→ {p.terjemah}</p>
                            </div>
                          ))}
                          {sec.key === 'digital' && (
                            <div className={`rounded-xl p-4 border ${culture.bgColor}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Brain className="w-4 h-4 text-indigo-500" />
                                <p className="text-xs font-bold text-indigo-600">Panduan AI Anotasi</p>
                              </div>
                              <p className={`text-sm leading-relaxed ${culture.textColor}`}>{culture.digital_etika}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analisis' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <h3 className="font-semibold text-sm text-foreground mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />Analisis Teks dari Perspektif Budaya {culture.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">AI akan menggunakan database referensi budaya {culture.name} untuk memberikan anotasi yang akurat.</p>
                <Textarea value={analyzeText} onChange={e => setAnalyzeText(e.target.value)}
                  placeholder="Masukkan teks komunikasi digital untuk dianalisis dari perspektif budaya lokal..."
                  className="min-h-[100px] bg-secondary/30 border-border resize-none text-sm mb-3" />
                <Button onClick={handleAnalyze} disabled={analyzing || !analyzeText.trim()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl gap-2">
                  {analyzing ? <><RefreshCw className="w-4 h-4 animate-spin" />Menganalisis dengan Referensi {culture.name}...</> : <><Zap className="w-4 h-4" />Analisis Budaya AI</>}
                </Button>
              </div>

              <AnimatePresence>
                {analysisResult && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Score cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Kesesuaian Budaya', value: analysisResult.kesesuaian_budaya, color: analysisResult.kesesuaian_budaya >= 70 ? 'text-emerald-600' : analysisResult.kesesuaian_budaya >= 40 ? 'text-amber-600' : 'text-rose-600' },
                        { label: 'Tingkat Kesantunan', value: analysisResult.tingkat_kesantunan, color: analysisResult.tingkat_kesantunan >= 70 ? 'text-emerald-600' : analysisResult.tingkat_kesantunan >= 40 ? 'text-amber-600' : 'text-rose-600' },
                      ].map((s, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-border shadow-sm p-4">
                          <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                          <p className={`text-3xl font-bold font-montserrat ${s.color}`}>{s.value}%</p>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-2">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 0.8 }}
                              className={`h-full rounded-full ${s.value >= 70 ? 'bg-emerald-500' : s.value >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Detail analysis */}
                    <div className={`rounded-2xl border p-5 ${culture.bgColor}`}>
                      <p className={`text-xs font-bold mb-2 ${culture.textColor}`}>{culture.icon} Analisis Perspektif Budaya {culture.name}</p>
                      <p className={`text-sm leading-relaxed ${culture.textColor}`}>{analysisResult.kesesuaian_detail}</p>
                      {analysisResult.prinsip_relevan && (
                        <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${culture.badgeColor}`}>
                          <Star className="w-3 h-3" />Prinsip: {analysisResult.prinsip_relevan}
                        </div>
                      )}
                    </div>

                    {analysisResult.pelanggaran?.length > 0 && (
                      <div className="bg-rose-50 rounded-2xl border border-rose-200 p-5">
                        <p className="text-xs font-bold text-rose-600 mb-2">⚠️ Pelanggaran Nilai Budaya Terdeteksi</p>
                        <ul className="space-y-1">
                          {analysisResult.pelanggaran.map((p, i) => (
                            <li key={i} className="flex gap-2 text-xs text-rose-700">
                              <span className="flex-shrink-0">•</span>{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
                      <p className="text-xs font-bold text-emerald-600 mb-2">✓ Rekomendasi Berbasis Budaya {culture.name}</p>
                      <p className="text-sm text-emerald-800 leading-relaxed">{analysisResult.rekomendasi_budaya}</p>
                      {analysisResult.alternatif_kalimat && (
                        <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-200">
                          <p className="text-xs text-muted-foreground mb-1">✏️ Alternatif kalimat yang lebih sesuai budaya:</p>
                          <p className="text-sm italic text-emerald-700 font-medium">"{analysisResult.alternatif_kalimat}"</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}