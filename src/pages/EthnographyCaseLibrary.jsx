import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Brain, Search, Tag, Globe, AlertTriangle, Shield, Eye, RefreshCw, Sparkles, FileText, X, Plus, CheckCircle2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const PLATFORM_OPTIONS = ['Instagram', 'Twitter/X', 'TikTok', 'WhatsApp', 'Facebook', 'Forum Online', 'YouTube', 'Lainnya'];
const PLATFORM_ICONS = { 'Instagram': '📸', 'Twitter/X': '🐦', 'TikTok': '🎵', 'WhatsApp': '💬', 'Facebook': '👤', 'Forum Online': '🗨️', 'YouTube': '▶️', 'Lainnya': '📱' };

const SAMPLE_LIBRARY = [
  { id: 's1', title: 'Hate Speech di Postingan Akademik', platform: 'Instagram', uploader: 'Demo', text: 'Dasar gak punya malu, sok-sokan posting hal yang lo gak ngerti!', context: 'Komentar pada postingan akademik mahasiswa', tags: ['hate speech', 'FTA'], toxicity_score: 85, politeness_score: 5, annotation: null },
  { id: 's2', title: 'Sarkasme Terselubung', platform: 'Twitter/X', uploader: 'Demo', text: 'Wah, penelitian kalian bagus sekali 🙄 Pasti dapat A dari dosen yang buta itu.', context: 'Respons terhadap pengumuman kelulusan skripsi', tags: ['sarkasme', 'implikatur'], toxicity_score: 65, politeness_score: 22, annotation: null },
  { id: 's3', title: 'Mediasi Konflik Santun', platform: 'WhatsApp', uploader: 'Demo', text: 'Maaf, saya merasa ada yang perlu kita diskusikan bersama dengan tenang. Boleh saya sampaikan pendapat?', context: 'Pesan grup organisasi meredakan konflik', tags: ['mediasi', 'kesantunan', 'direktif'], toxicity_score: 2, politeness_score: 95, annotation: null },
];

export default function EthnographyCaseLibrary() {
  const { user } = useAuth();
  const [library, setLibrary] = useState(SAMPLE_LIBRARY);
  const [selected, setSelected] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [analyzing, setAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Upload form state
  const [form, setForm] = useState({ title: '', platform: '', text: '', context: '', tags: '', imageFile: null });
  const [uploading, setUploading] = useState(false);

  const filtered = library.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.text.toLowerCase().includes(search.toLowerCase());
    const matchPlat = filterPlatform === 'all' || c.platform === filterPlatform;
    return matchSearch && matchPlat;
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, imageFile: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.title || !form.platform || !form.text) return;
    setUploading(true);

    let imageUrl = null;
    if (form.imageFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: form.imageFile });
      imageUrl = file_url;
    }

    // AI quick analysis on upload
    const quickAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Analisis cepat teks komunikasi digital ini:
Teks: "${form.text}"
Konteks: ${form.context || 'tidak ada konteks tambahan'}
Platform: ${form.platform}

Berikan skor singkat: toxicity (0-100), politeness (0-100), dan 3 tag pragmatik yang relevan.`,
      response_json_schema: {
        type: 'object',
        properties: {
          toxicity_score: { type: 'number' },
          politeness_score: { type: 'number' },
          auto_tags: { type: 'array', items: { type: 'string' } },
        }
      }
    });

    const newCase = {
      id: 'u' + Date.now(),
      title: form.title,
      platform: form.platform,
      uploader: user?.full_name || 'Anonim',
      text: form.text,
      context: form.context,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : quickAnalysis.auto_tags || [],
      toxicity_score: quickAnalysis.toxicity_score || 50,
      politeness_score: quickAnalysis.politeness_score || 50,
      image_url: imageUrl,
      annotation: null,
    };

    setLibrary(prev => [newCase, ...prev]);
    setForm({ title: '', platform: '', text: '', context: '', tags: '', imageFile: null });
    setImagePreview(null);
    setShowUploadForm(false);
    setSelected(newCase);
    setUploading(false);
  };

  const handleAnalyze = async (caseItem) => {
    setAnalyzing(true);
    const prompt = `Kamu adalah ahli pragmatik dan etnografi digital yang menganalisis komunikasi di media sosial.

Teks: "${caseItem.text}"
Konteks: ${caseItem.context || 'tidak ada'}
Platform: ${caseItem.platform}
${caseItem.image_url ? 'Ada screenshot yang dilampirkan.' : ''}

Berikan anotasi komprehensif mencakup:
1. Analisis speech act (Austin/Searle) lengkap
2. Implikatur Gricean (maksim yang dilanggar/dipatuhi)
3. Face Threat Analysis (Brown-Levinson)
4. Tingkat kesantunan dan strategi politeness
5. Konteks etika digital dan dampak sosial
6. Rekomendasi respons yang lebih etis
7. Relevansi budaya lokal Sulawesi Tenggara (jika ada)
8. Prinsip pragmatik yang berlaku`;

    const schema = {
      type: 'object',
      properties: {
        speech_act_type: { type: 'string' },
        speech_act_detail: { type: 'string' },
        gricean_analysis: { type: 'string' },
        face_threat: { type: 'boolean' },
        face_threat_detail: { type: 'string' },
        politeness_strategy: { type: 'string' },
        toxicity_explanation: { type: 'string' },
        ethical_impact: { type: 'string' },
        ethical_rating: { type: 'string' },
        better_alternative: { type: 'string' },
        cultural_note: { type: 'string' },
        pragmatic_principle: { type: 'string' },
        academic_reference: { type: 'string' },
        educational_value: { type: 'string' },
      }
    };

    const fileUrls = caseItem.image_url ? [caseItem.image_url] : undefined;
    const annotation = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: schema,
      ...(fileUrls && { file_urls: fileUrls }),
    });

    const updated = { ...caseItem, annotation };
    setLibrary(prev => prev.map(c => c.id === caseItem.id ? updated : c));
    setSelected(updated);
    setAnalyzing(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 mb-2">
          <Globe className="w-3.5 h-3.5 text-teal-500" />
          <span className="text-xs font-semibold text-teal-600">Upload & Analisis · Anotasi AI · Etnografi Digital</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Perpustakaan Kasus Etnografi</h1>
            <p className="text-muted-foreground mt-1 text-sm">Unggah cuplikan percakapan media sosial nyata dan dapatkan anotasi pragmatik & etika mendalam dari AI.</p>
          </div>
          <Button onClick={() => setShowUploadForm(true)}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Unggah Kasus Baru
          </Button>
        </div>
      </motion.div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && setShowUploadForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-border flex items-center justify-between p-5 rounded-t-3xl z-10">
                <h3 className="font-bold text-foreground flex items-center gap-2"><Upload className="w-4 h-4 text-teal-600" /> Unggah Kasus Baru</h3>
                <button onClick={() => setShowUploadForm(false)} className="w-8 h-8 rounded-xl hover:bg-secondary flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleUpload} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Judul Kasus *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                    placeholder="mis: Komentar Agresif di Postingan Akademik"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 bg-secondary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Platform *</label>
                  <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} required
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 bg-white">
                    <option value="">-- Pilih Platform --</option>
                    {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{PLATFORM_ICONS[p]} {p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Teks Percakapan (Anonim) *</label>
                  <Textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} required
                    placeholder="Salin teks percakapan/komentar yang sudah dianonimkan (hapus nama asli)..."
                    className="min-h-[100px] bg-secondary/20 border-border resize-none text-sm" />
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Pastikan semua identitas personal sudah dianonimkan.</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Konteks Sosial</label>
                  <input value={form.context} onChange={e => setForm(f => ({ ...f, context: e.target.value }))}
                    placeholder="Jelaskan konteks singkat percakapan ini..."
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 bg-secondary/20" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Tag (pisahkan dengan koma)</label>
                  <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    placeholder="mis: sarkasme, implikatur, FTA"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 bg-secondary/20" />
                </div>
                {/* Screenshot upload */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1.5">Screenshot (Opsional)</label>
                  <div onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-all">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="preview" className="max-h-32 mx-auto rounded-lg object-cover" />
                        <button type="button" onClick={e => { e.stopPropagation(); setImagePreview(null); setForm(f => ({ ...f, imageFile: null })); }}
                          className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Klik untuk unggah screenshot (JPG, PNG)</p>
                      </>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </div>
                <Button type="submit" disabled={uploading || !form.title || !form.platform || !form.text}
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl gap-2 h-11">
                  {uploading ? <><RefreshCw className="w-4 h-4 animate-spin" />Mengunggah & Menganalisis...</> : <><Upload className="w-4 h-4" />Unggah Kasus</>}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Library list */}
        <div className="lg:col-span-2 space-y-3">
          {/* Search & filter */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-4 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari kasus..."
                className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-secondary/20" />
            </div>
            <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}
              className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-primary/40">
              <option value="all">Semua Platform</option>
              {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{PLATFORM_ICONS[p]} {p}</option>)}
            </select>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Total Kasus', value: library.length, color: 'text-indigo-600' },
              { label: 'Sudah Anotasi', value: library.filter(c => c.annotation).length, color: 'text-emerald-600' },
              { label: 'Diunggah', value: library.filter(c => c.id.startsWith('u')).length, color: 'text-teal-600' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-3 text-center shadow-sm">
                <p className={`text-lg font-bold font-montserrat ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Case list */}
          <div className="space-y-2">
            {filtered.map((c, i) => (
              <motion.button key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(c)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${selected?.id === c.id ? 'bg-teal-50 border-teal-300 shadow-sm' : 'bg-white border-border hover:border-teal-200 hover:shadow-sm'}`}>
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="text-base flex-shrink-0">{PLATFORM_ICONS[c.platform] || '📱'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">{c.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{c.platform} · oleh {c.uploader}</p>
                  </div>
                  {c.annotation && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{c.text}</p>
                <div className="flex gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${c.toxicity_score > 60 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>Toxicity: {c.toxicity_score}%</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Santun: {c.politeness_score}%</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Analysis panel */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-dashed border-border p-16 flex flex-col items-center text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground/20 mb-3" />
              <p className="font-semibold text-foreground mb-1">Pilih Kasus untuk Dianalisis</p>
              <p className="text-sm text-muted-foreground max-w-xs">Pilih kasus dari daftar kiri atau unggah kasus baru untuk mendapatkan anotasi AI mendalam.</p>
            </div>
          ) : (
            <motion.div key={selected.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Case detail */}
              <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">{PLATFORM_ICONS[selected.platform] || '📱'}</span>
                  <div className="flex-1">
                    <h3 className="font-bold font-montserrat text-foreground text-lg">{selected.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{selected.platform} · Diunggah oleh {selected.uploader}</p>
                    {selected.context && <p className="text-xs text-muted-foreground mt-1 italic">📌 {selected.context}</p>}
                  </div>
                </div>

                {/* Screenshot preview */}
                {selected.image_url && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-border">
                    <img src={selected.image_url} alt="screenshot" className="w-full max-h-48 object-contain bg-secondary/20" />
                  </div>
                )}

                <div className="bg-secondary/40 rounded-xl p-4 border border-border mb-4">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Teks (Anonim)</p>
                  <p className="text-sm text-foreground italic leading-relaxed">"{selected.text}"</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className={`rounded-xl p-3 border text-center ${selected.toxicity_score > 60 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <p className={`text-xl font-bold font-montserrat ${selected.toxicity_score > 60 ? 'text-rose-600' : 'text-emerald-600'}`}>{selected.toxicity_score}%</p>
                    <p className="text-xs text-muted-foreground">Toxicity</p>
                  </div>
                  <div className={`rounded-xl p-3 border text-center ${selected.politeness_score > 60 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                    <p className={`text-xl font-bold font-montserrat ${selected.politeness_score > 60 ? 'text-emerald-600' : 'text-amber-600'}`}>{selected.politeness_score}%</p>
                    <p className="text-xs text-muted-foreground">Kesantunan</p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold font-montserrat text-indigo-600">{selected.tags?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Tag</p>
                  </div>
                </div>

                {selected.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selected.tags.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 bg-secondary border border-border rounded-full text-muted-foreground flex items-center gap-1">
                        <Tag className="w-3 h-3" />{t}
                      </span>
                    ))}
                  </div>
                )}

                {!selected.annotation && (
                  <Button onClick={() => handleAnalyze(selected)} disabled={analyzing}
                    className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl gap-2">
                    {analyzing ? <><RefreshCw className="w-4 h-4 animate-spin" />AI Menganalisis Mendalam...</> : <><Sparkles className="w-4 h-4" />Analisis Anotasi Pragmatik & Etika AI</>}
                  </Button>
                )}

                {analyzing && (
                  <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-3">
                    <Brain className="w-6 h-6 text-indigo-500 animate-pulse flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-indigo-700">AI sedang melakukan anotasi mendalam...</p>
                      <p className="text-xs text-indigo-600">Menganalisis speech act, implikatur, face threat, dan dimensi kultural</p>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Annotation Results */}
              <AnimatePresence>
                {selected.annotation && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-1">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-bold text-indigo-700">Anotasi AI Pragmatik & Etika</h4>
                        <span className="ml-auto text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 font-semibold">{selected.annotation.ethical_rating || 'Teranalisis'}</span>
                      </div>
                      <p className="text-xs text-indigo-600">Analisis komprehensif berbasis teori Austin, Searle, Grice, Brown-Levinson</p>
                    </div>

                    {/* Speech Act */}
                    <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
                      <h5 className="font-semibold text-sm text-foreground flex items-center gap-2">🗣️ Speech Act Analysis</h5>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                        <p className="text-xs font-bold text-indigo-600 mb-1">Jenis: {selected.annotation.speech_act_type}</p>
                        <p className="text-xs text-indigo-800">{selected.annotation.speech_act_detail}</p>
                      </div>
                    </div>

                    {/* Gricean + Face Threat */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-white border border-border rounded-2xl p-4">
                        <h5 className="font-semibold text-xs text-foreground mb-2 flex items-center gap-1.5">💬 Analisis Gricean</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">{selected.annotation.gricean_analysis}</p>
                      </div>
                      <div className={`rounded-2xl border p-4 ${selected.annotation.face_threat ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                        <h5 className="font-semibold text-xs text-foreground mb-2 flex items-center gap-1.5">
                          🎭 Face Threat
                          {selected.annotation.face_threat ? <AlertTriangle className="w-3 h-3 text-rose-500" /> : <Shield className="w-3 h-3 text-emerald-500" />}
                        </h5>
                        <p className="text-xs leading-relaxed">{selected.annotation.face_threat_detail}</p>
                      </div>
                    </div>

                    {/* Politeness + Ethics */}
                    <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
                      <h5 className="font-semibold text-sm text-foreground">⚖️ Strategi Kesantunan & Etika Digital</h5>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-xs font-bold text-amber-700 mb-1">Strategi Kesantunan:</p>
                        <p className="text-xs text-amber-800">{selected.annotation.politeness_strategy}</p>
                      </div>
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                        <p className="text-xs font-bold text-rose-700 mb-1">Dampak Etika Digital:</p>
                        <p className="text-xs text-rose-800">{selected.annotation.ethical_impact}</p>
                      </div>
                    </div>

                    {/* Better alternative + Cultural note */}
                    <div className="space-y-3">
                      {selected.annotation.better_alternative && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                          <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Alternatif Komunikasi Lebih Etis:</p>
                          <p className="text-sm text-emerald-800 italic font-medium">"{selected.annotation.better_alternative}"</p>
                        </div>
                      )}
                      {selected.annotation.cultural_note && (
                        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
                          <p className="text-xs font-bold text-violet-700 mb-1">🌿 Perspektif Budaya Lokal</p>
                          <p className="text-xs text-violet-800">{selected.annotation.cultural_note}</p>
                        </div>
                      )}
                      {selected.annotation.academic_reference && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                          <p className="text-xs font-bold text-indigo-700 mb-1">📚 Referensi Akademis</p>
                          <p className="text-xs text-indigo-800">{selected.annotation.academic_reference}</p>
                        </div>
                      )}
                    </div>

                    <Button onClick={() => { const c = { ...selected, annotation: null }; setLibrary(p => p.map(x => x.id === c.id ? c : x)); setSelected(c); }}
                      variant="outline" className="w-full rounded-xl">
                      <RefreshCw className="w-4 h-4 mr-2" /> Analisis Ulang
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}