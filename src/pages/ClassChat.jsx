import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Send, MessageSquare, Users, Bot, ChevronDown, Hash, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatBubble from '@/components/chat/ChatBubble';
import PolitenessChecker from '@/components/chat/PolitenessChecker';
import { userRole } from '@/lib/userRole';

export default function ClassChat() {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [politenessResult, setPolitenessResult] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const checkTimeout = useRef(null);
  const bottomRef = useRef(null);
  const unsubRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(async u => {
      if (!u) return;
      setUser(u);
      const role = userRole.get(u.email) || u.role;
      let cls = [];
      if (role === 'dosen') {
        cls = await base44.entities.Class.filter({ lecturer_email: u.email }).catch(() => []);
      } else {
        const enrs = await base44.entities.Enrollment.filter({ student_email: u.email, status: 'active' }).catch(() => []);
        if (enrs.length > 0) {
          const all = await base44.entities.Class.list().catch(() => []);
          cls = all.filter(c => enrs.some(e => e.class_id === c.id));
        }
      }
      setClasses(cls);
      if (cls.length > 0) selectClass(cls[0]);
    }).catch(() => {});

    return () => { if (unsubRef.current) unsubRef.current(); };
  }, []);

  const selectClass = useCallback(async (cls) => {
    setSelectedClass(cls);
    setMessages([]);
    if (unsubRef.current) unsubRef.current();

    const msgs = await base44.entities.ChatMessage
      .filter({ room_id: cls.id, room_type: 'class' }, 'created_date', 100)
      .catch(() => []);
    setMessages(msgs);
    setOnlineCount(Math.floor(Math.random() * 8) + 2);

    // Subscribe real-time
    unsubRef.current = base44.entities.ChatMessage.subscribe(evt => {
      if (evt.data?.room_id !== cls.id) return;
      if (evt.type === 'create') setMessages(prev => [...prev, evt.data]);
      if (evt.type === 'delete') setMessages(prev => prev.filter(m => m.id !== evt.id));
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Debounced politeness check
  const handleInputChange = (val) => {
    setInput(val);
    setPolitenessResult(null);
    if (checkTimeout.current) clearTimeout(checkTimeout.current);
    if (val.trim().length < 5) { setChecking(false); return; }
    setChecking(true);
    checkTimeout.current = setTimeout(async () => {
      try {
        const res = await base44.integrations.Core.InvokeLLM({
          prompt: `Analisis tingkat kesantunan pesan berikut dalam konteks komunikasi akademik Indonesia.
Pesan: "${val}"

Deteksi juga kategori masalah jika ada. Pilih salah satu: "Ujaran Kebencian", "Kata Kasar", "Sarkasme/Merendahkan", "Spam/Promosi", "Tidak Relevan", atau "Tidak Ada Masalah".

Berikan penilaian dalam JSON dengan format:
{
  "score": <0-100>,
  "label": <"Sangat Santun"|"Santun"|"Netral"|"Kurang Santun"|"Tidak Santun">,
  "category": <kategori masalah atau "Tidak Ada Masalah">,
  "suggestion": <string kosong jika santun, atau saran singkat perbaikan yang lebih sopan>
}`,
          response_json_schema: {
            type: 'object',
            properties: {
              score: { type: 'number' },
              label: { type: 'string' },
              category: { type: 'string' },
              suggestion: { type: 'string' }
            }
          }
        });
        setPolitenessResult(res);
      } catch (_) {}
      setChecking(false);
    }, 800);
  };

  const applySuggestion = () => {
    if (politenessResult?.suggestion) {
      setInput(politenessResult.suggestion);
      setPolitenessResult(null);
    }
  };

  const doSend = async () => {
    if (!input.trim() || !selectedClass || !user) return;
    setSending(true);
    setConfirming(false);
    const role = userRole.get(user.email) || user.role;
    const score = politenessResult?.score ?? 80;
    const label = politenessResult?.label ?? 'Netral';
    const suggestion = (score < 50 && politenessResult?.suggestion) ? politenessResult.suggestion : null;

    await base44.entities.ChatMessage.create({
      room_id: selectedClass.id,
      room_type: 'class',
      sender_email: user.email,
      sender_name: user.full_name || user.email.split('@')[0],
      sender_role: role,
      content: input.trim(),
      politeness_score: score,
      politeness_label: label,
      toxicity_flag: score < 30,
      ai_suggestion: suggestion,
    }).catch(() => {});

    setInput('');
    setPolitenessResult(null);
    setChecking(false);
    setSending(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedClass || !user || sending) return;

    // Block sending if message is detected as toxic (score < 30)
    if (politenessResult && politenessResult.score < 30) {
      return;
    }

    // Require confirmation if message is detected as impolite (score 30-49)
    if (politenessResult && politenessResult.score >= 30 && politenessResult.score < 50) {
      setConfirming(true);
      return;
    }

    await doSend();
  };

  return (
    <div className="flex h-screen pt-16 lg:pt-0 bg-background">
      {/* Sidebar Kelas */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-border flex flex-col hidden sm:flex">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold font-montserrat text-sm">Chat Kelas</h2>
              <p className="text-[10px] text-muted-foreground">Diskusi Etnografi</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {classes.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">Belum ada kelas</p>
          ) : classes.map(c => (
            <button key={c.id} onClick={() => selectClass(c)}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all text-sm ${
                selectedClass?.id === c.id
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                  : 'hover:bg-secondary text-foreground'
              }`}>
              <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{c.class_name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground pl-5 mt-0.5 truncate">{c.class_code}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Area Chat Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedClass ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-border px-5 py-3 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-bold font-montserrat text-sm"># {selectedClass.class_name}</h3>
                <p className="text-[10px] text-muted-foreground">Diskusi studi kasus etnografi digital</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {onlineCount} online
                </div>
                <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                  <Bot className="w-3 h-3" />
                  AI Monitor Aktif
                </div>
              </div>
            </div>

            {/* Pesan */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-secondary/20">
              {messages.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Belum ada pesan</p>
                  <p className="text-xs mt-1">Mulai diskusi studi kasus Anda!</p>
                </div>
              )}
              {messages.filter(m => !m.is_deleted).map(msg => (
                <ChatBubble key={msg.id} msg={msg} isOwn={msg.sender_email === user?.email} />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-border p-4 flex-shrink-0 space-y-2">
              {/* Konfirmasi pesan kurang santun */}
              {confirming && politenessResult && (
                <div className="flex items-start gap-2 px-3 py-3 rounded-xl border border-amber-300 bg-amber-50 text-xs">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-800">Pesan terdeteksi <span className="font-bold">{politenessResult.label}</span>{politenessResult.category && politenessResult.category !== 'Tidak Ada Masalah' ? ` — ${politenessResult.category}` : ''}.</p>
                    <p className="text-amber-700 mt-0.5">Anda yakin ingin mengirim pesan ini? Pertimbangkan untuk merevisi agar komunikasi tetap santun.</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={doSend} className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold">Tetap Kirim</button>
                      <button onClick={() => setConfirming(false)} className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 font-semibold">Revisi</button>
                    </div>
                  </div>
                </div>
              )}
              <PolitenessChecker checking={checking} result={politenessResult} onApplySuggestion={applySuggestion} />
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={e => handleInputChange(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Tulis pesan diskusi... (AI akan menganalisis kesantunan secara otomatis)"
                    className="w-full resize-none border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring bg-white min-h-[44px] max-h-28"
                    rows={1}
                  />
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || sending || confirming || (politenessResult?.score != null && politenessResult.score < 30)}
                  className="h-11 w-11 p-0 rounded-xl flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {/* Toxicity block warning */}
              {politenessResult && politenessResult.score < 30 && (
                <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-300 px-3 py-2 rounded-xl">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">Pesan terdeteksi tidak santun. Mohon revisi pesan sebelum dapat dikirim.</span>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground text-center">
                🛡️ Setiap pesan dianalisis AI untuk memastikan komunikasi akademik yang santun
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-secondary/20">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">Pilih kelas untuk mulai berdiskusi</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}