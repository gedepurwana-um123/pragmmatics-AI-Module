import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Brain, CheckCircle2, AlertTriangle, RefreshCw, Lightbulb, BookOpen, Send, ChevronRight, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const PRACTICE_SENTENCES = [
  { id: 1, text: 'Maaf, boleh saya bertanya sedikit?', context: 'Meminta izin secara sopan', level: 'Pemula', category: 'Kesantunan' },
  { id: 2, text: 'Dengan hormat, saya ingin menyampaikan pendapat saya.', context: 'Pembukaan direktif formal', level: 'Menengah', category: 'Speech Acts' },
  { id: 3, text: 'Saya rasa pendapat Anda perlu ditinjau ulang berdasarkan fakta ini.', context: 'Kritik konstruktif tanpa face threat', level: 'Lanjutan', category: 'Pragmatik' },
  { id: 4, text: 'Terima kasih atas masukannya, saya akan mempertimbangkan hal tersebut.', context: 'Respons asertif yang santun', level: 'Menengah', category: 'Kesantunan' },
  { id: 5, text: 'Apakah Anda berkenan mendiskusikan hal ini lebih lanjut?', context: 'Undangan diskusi face-saving', level: 'Pemula', category: 'Implikatur' },
  { id: 6, text: 'Saya memahami perasaan Anda, namun izinkan saya menjelaskan sudut pandang saya.', context: 'Empati + asertif dalam konflik', level: 'Lanjutan', category: 'Pragmatik' },
];

const LEVEL_COLORS = {
  Pemula: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Menengah: 'bg-amber-100 text-amber-700 border-amber-200',
  Lanjutan: 'bg-violet-100 text-violet-700 border-violet-200',
};

export default function AIPragmaticsTutor() {
  const [selectedSentence, setSelectedSentence] = useState(PRACTICE_SENTENCES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: '👋 Selamat datang di AI Pragmatics Tutor!\n\nPilih kalimat praktik di kiri, lalu klik tombol mikrofon untuk merekam ucapan Anda. Saya akan menganalisis aksen, intonasi, dan tingkat kesantunan Anda secara real-time.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);
  const timerRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Audio level visualization
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const updateLevel = () => {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setAudioLevel(avg);
      animFrameRef.current = requestAnimationFrame(updateLevel);
    };
    updateLevel();

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      cancelAnimationFrame(animFrameRef.current);
      setAudioLevel(0);
      stream.getTracks().forEach(t => t.stop());
      audioCtx.close();
      await processRecording();
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const processRecording = async () => {
    setIsAnalyzing(true);
    setFeedback(null);

    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const file = new File([blob], 'recording.webm', { type: 'audio/webm' });

    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const transcriptText = await base44.integrations.Core.TranscribeAudio({ audio_url: file_url });
    setTranscript(transcriptText);

    const prompt = `Kamu adalah AI Tutor Pragmatik yang menganalisis ucapan mahasiswa dalam pembelajaran komunikasi etis.

Kalimat target: "${selectedSentence.text}"
Konteks pragmatik: "${selectedSentence.context}"
Kategori: ${selectedSentence.category}
Level: ${selectedSentence.level}

Transkripsi ucapan mahasiswa: "${transcriptText}"

Berikan analisis mendalam dalam format JSON yang mencakup:
1. Keakuratan pengucapan (bandingkan transkripsi dengan kalimat target)
2. Estimasi intonasi berdasarkan teks (formal/informal/netral)
3. Tingkat kesantunan pragmatik dari ucapan
4. Saran perbaikan spesifik
5. Nilai keseluruhan 0-100`;

    const schema = {
      type: 'object',
      properties: {
        accuracy_score: { type: 'number' },
        intonation_assessment: { type: 'string' },
        intonation_score: { type: 'number' },
        politeness_score: { type: 'number' },
        pragmatic_appropriateness: { type: 'string' },
        pronunciation_notes: { type: 'string' },
        accent_feedback: { type: 'string' },
        intonation_tip: { type: 'string' },
        politeness_tip: { type: 'string' },
        overall_score: { type: 'number' },
        strengths: { type: 'array', items: { type: 'string' } },
        improvements: { type: 'array', items: { type: 'string' } },
        cultural_note: { type: 'string' },
        next_practice: { type: 'string' },
      }
    };

    const result = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: schema });
    setFeedback(result);
    setIsAnalyzing(false);

    setChatMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ Analisis selesai!\n\nSkor keseluruhan Anda: **${result.overall_score}/100**\n\nKekuatan: ${result.strengths?.slice(0, 2).join(', ')}\n\nArea peningkatan: ${result.improvements?.[0] || 'Terus berlatih!'}\n\nAda pertanyaan tentang hasil analisis? Silakan tanya!`
    }]);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatInput('');
    setChatLoading(true);

    const ctx = feedback
      ? `Konteks: mahasiswa sedang berlatih kalimat "${selectedSentence.text}" (${selectedSentence.context}). Skor terakhir: ${feedback.overall_score}/100, kesantunan: ${feedback.politeness_score}%.`
      : `Konteks: mahasiswa sedang berlatih kalimat "${selectedSentence.text}" (${selectedSentence.context}).`;

    const prompt = `Kamu adalah AI Tutor Pragmatik yang membantu mahasiswa meningkatkan kemampuan komunikasi etis. ${ctx}

Pertanyaan mahasiswa: "${msg}"

Berikan jawaban yang edukatif, spesifik, dan mudah dipahami. Fokus pada pragmatik, intonasi, kesantunan, dan konteks sosial. Gunakan bahasa Indonesia yang ramah dan supportif.`;

    const res = await base44.integrations.Core.InvokeLLM({ prompt });
    setChatMessages(prev => [...prev, { role: 'assistant', content: res }]);
    setChatLoading(false);
  };

  const ScoreBar = ({ label, value, color }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-bold ${color}`}>{value}%</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }}
          className={`h-full rounded-full bg-gradient-to-r ${value >= 80 ? 'from-emerald-400 to-teal-500' : value >= 60 ? 'from-amber-400 to-orange-500' : 'from-rose-400 to-red-500'}`} />
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 mb-2">
          <Radio className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-xs font-semibold text-violet-600">AI Voice Analysis · Real-time Pragmatic Feedback</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">AI Pragmatics Tutor</h1>
        <p className="text-muted-foreground mt-1 text-sm">Rekam ucapan Anda dan dapatkan analisis aksen, intonasi, dan kesantunan berbasis AI secara real-time.</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* LEFT: Sentence selector + Recorder + Feedback */}
        <div className="lg:col-span-3 space-y-5">
          {/* Sentence selector */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Pilih Kalimat Praktik
            </h3>
            <div className="space-y-2">
              {PRACTICE_SENTENCES.map((s) => (
                <button key={s.id} onClick={() => { setSelectedSentence(s); setFeedback(null); setTranscript(''); }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${selectedSentence.id === s.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-secondary/30'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`font-medium ${selectedSentence.id === s.id ? 'text-primary' : 'text-foreground'}`}>{s.text}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${LEVEL_COLORS[s.level]}`}>{s.level}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.context} · {s.category}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recorder */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <h3 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
              <Mic className="w-4 h-4 text-rose-500" /> Rekam Ucapan Anda
            </h3>

            {/* Target sentence display */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-5">
              <p className="text-xs text-indigo-500 font-semibold mb-1">Ucapkan kalimat berikut:</p>
              <p className="text-base font-semibold text-indigo-800">"{selectedSentence.text}"</p>
              <p className="text-xs text-indigo-600 mt-1">📌 {selectedSentence.context}</p>
            </div>

            {/* Audio level visualizer */}
            <div className="flex items-center justify-center gap-1 h-12 mb-5">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div key={i}
                  animate={{ height: isRecording ? Math.max(4, (audioLevel / 255) * 40 * (0.5 + Math.random() * 0.5)) : 4 }}
                  transition={{ duration: 0.1 }}
                  className={`w-1.5 rounded-full transition-colors ${isRecording ? 'bg-rose-400' : 'bg-border'}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              {!isRecording ? (
                <Button onClick={startRecording} disabled={isAnalyzing}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl px-8 py-6 text-base font-semibold gap-3">
                  <Mic className="w-5 h-5" /> Mulai Rekam
                </Button>
              ) : (
                <Button onClick={stopRecording}
                  className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl px-8 py-6 text-base font-semibold gap-3 animate-pulse">
                  <MicOff className="w-5 h-5" /> Stop ({recordingTime}s)
                </Button>
              )}
              {feedback && (
                <Button variant="outline" onClick={() => { setFeedback(null); setTranscript(''); }} className="rounded-xl">
                  <RefreshCw className="w-4 h-4 mr-2" /> Ulang
                </Button>
              )}
            </div>

            {transcript && (
              <div className="mt-4 p-3 bg-secondary/50 rounded-xl border border-border">
                <p className="text-xs text-muted-foreground font-semibold mb-1">📝 Transkripsi:</p>
                <p className="text-sm text-foreground italic">"{transcript}"</p>
              </div>
            )}
          </div>

          {/* Analysis loading */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-border shadow-sm p-8 flex flex-col items-center">
                <div className="relative w-14 h-14 mb-3">
                  <Brain className="w-14 h-14 text-violet-300" />
                  <div className="absolute inset-0 rounded-full border-2 border-violet-400 animate-ping opacity-40" />
                </div>
                <p className="font-semibold text-sm text-foreground">AI menganalisis ucapan Anda...</p>
                <p className="text-xs text-muted-foreground mt-1">Mengevaluasi aksen, intonasi, dan kesantunan pragmatik</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback results */}
          <AnimatePresence>
            {feedback && !isAnalyzing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Overall score */}
                <div className={`rounded-2xl border p-5 ${feedback.overall_score >= 80 ? 'bg-emerald-50 border-emerald-200' : feedback.overall_score >= 60 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Skor Keseluruhan</p>
                      <p className={`text-4xl font-bold font-montserrat ${feedback.overall_score >= 80 ? 'text-emerald-600' : feedback.overall_score >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {feedback.overall_score}<span className="text-lg">/100</span>
                      </p>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${feedback.overall_score >= 80 ? 'bg-emerald-100' : feedback.overall_score >= 60 ? 'bg-amber-100' : 'bg-rose-100'}`}>
                      {feedback.overall_score >= 80 ? '🌟' : feedback.overall_score >= 60 ? '👍' : '💪'}
                    </div>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-3">
                  <h4 className="font-semibold text-sm text-foreground">Detail Evaluasi</h4>
                  <ScoreBar label="Akurasi Pengucapan" value={feedback.accuracy_score} color="text-indigo-600" />
                  <ScoreBar label="Intonasi" value={feedback.intonation_score} color="text-cyan-600" />
                  <ScoreBar label="Kesantunan Pragmatik" value={feedback.politeness_score} color="text-emerald-600" />
                </div>

                {/* Detailed feedback */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-border shadow-sm p-4">
                    <p className="text-xs font-bold text-emerald-600 mb-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Kekuatan</p>
                    <ul className="space-y-1">
                      {feedback.strengths?.map((s, i) => (
                        <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl border border-border shadow-sm p-4">
                    <p className="text-xs font-bold text-amber-600 mb-2 flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5" /> Area Peningkatan</p>
                    <ul className="space-y-1">
                      {feedback.improvements?.map((s, i) => (
                        <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                          <span className="text-amber-500 mt-0.5">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-violet-50 rounded-2xl border border-violet-200 p-5 space-y-2">
                  <h4 className="font-semibold text-sm text-violet-700 flex items-center gap-2"><Volume2 className="w-4 h-4" /> Tips Spesifik</h4>
                  {feedback.intonation_tip && (
                    <div className="text-xs text-violet-800 bg-white rounded-xl p-3 border border-violet-200">
                      🎵 <strong>Intonasi:</strong> {feedback.intonation_tip}
                    </div>
                  )}
                  {feedback.politeness_tip && (
                    <div className="text-xs text-violet-800 bg-white rounded-xl p-3 border border-violet-200">
                      🤝 <strong>Kesantunan:</strong> {feedback.politeness_tip}
                    </div>
                  )}
                  {feedback.cultural_note && (
                    <div className="text-xs text-violet-800 bg-white rounded-xl p-3 border border-violet-200">
                      🌿 <strong>Catatan Kultural:</strong> {feedback.cultural_note}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: AI Chat Tutor */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border shadow-sm flex flex-col h-[640px] lg:sticky lg:top-8">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Tutor AI Pragmatik</h3>
                  <p className="text-xs text-emerald-600 font-medium">● Analisis Suara · Feedback Real-time</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line
                    ${msg.role === 'user' ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white' : 'bg-secondary/50 text-foreground border border-border'}`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-2 mt-1">
                    <Brain className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-secondary/50 border border-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">{[0, 0.15, 0.3].map((d, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}</div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="px-4 py-2 border-t border-border/50">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {['Tips intonasi?', 'Apa itu face-saving?', 'Contoh lain?', 'Skor saya kenapa rendah?'].map((q, i) => (
                  <button key={i} onClick={() => setChatInput(q)}
                    className="flex-shrink-0 text-xs px-2.5 py-1 bg-secondary rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Tanya tentang intonasi, kesantunan..."
                  className="flex-1 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground" />
                <Button onClick={handleChat} disabled={chatLoading || !chatInput.trim()} size="icon"
                  className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-xl w-10 h-10 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}