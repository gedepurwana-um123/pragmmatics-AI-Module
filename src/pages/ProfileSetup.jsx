import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Brain, GraduationCap, BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ROLES = [
  {
    key: 'mahasiswa',
    icon: GraduationCap,
    title: 'Mahasiswa',
    desc: 'Saya adalah mahasiswa yang ingin belajar pragmatik dan etika komunikasi digital.',
    color: 'from-indigo-500 to-violet-600',
    border: 'border-indigo-300',
    bg: 'bg-indigo-50',
    textColor: 'text-indigo-700',
  },
  {
    key: 'dosen',
    icon: BookOpen,
    title: 'Dosen / Pengajar',
    desc: 'Saya adalah dosen yang ingin memantau perkembangan mahasiswa dan mengelola kelas.',
    color: 'from-cyan-500 to-teal-600',
    border: 'border-cyan-300',
    bg: 'bg-cyan-50',
    textColor: 'text-cyan-700',
  },
];

export default function ProfileSetup() {
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u) { base44.auth.redirectToLogin(); return; }
      // Only skip setup if role is already one of the app-specific roles
      if (u.role === 'mahasiswa') {
        navigate('/dashboard', { replace: true });
        return;
      }
      if (u.role === 'dosen') {
        navigate('/dosen-dashboard', { replace: true });
        return;
      }
      if (u.role === 'admin') {
        navigate('/admin-panel', { replace: true });
        return;
      }
      // role === 'user' (Base44 default) or unset → show role selection
      setUser(u);
    }).catch(() => base44.auth.redirectToLogin());
  }, []);

  const handleContinue = async () => {
    if (!selected || saving) return;
    setSaving(true);
    try {
      await base44.auth.updateMe({ role: selected });
      // Small delay to ensure the update is reflected before redirect
      await new Promise(r => setTimeout(r, 500));
      if (selected === 'dosen') {
        navigate('/dosen-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Failed to save role:', err);
      setSaving(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex gap-2">
        {[0, 0.15, 0.3].map((d, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background neural-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-border shadow-xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold font-montserrat text-base text-foreground leading-none">PragmaticsAI</p>
            <p className="text-[10px] text-muted-foreground">Etika Komunikasi Digital</p>
          </div>
        </div>

        <h1 className="text-xl font-bold font-montserrat text-foreground mb-1">
          Selamat datang, {user.full_name?.split(' ')[0] || 'Pengguna'}! 👋
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Sebelum memulai, pilih peran Anda agar kami bisa menyesuaikan pengalaman belajar Anda.
        </p>

        {/* Role Cards */}
        <div className="space-y-3 mb-6">
          {ROLES.map(r => {
            const isSelected = selected === r.key;
            return (
              <button
                key={r.key}
                onClick={() => setSelected(r.key)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? `${r.border} ${r.bg} shadow-sm`
                    : 'border-border hover:border-primary/30 hover:bg-secondary/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center flex-shrink-0`}>
                    <r.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold font-montserrat text-sm ${isSelected ? r.textColor : 'text-foreground'}`}>
                      {r.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    isSelected ? `border-transparent bg-gradient-to-br ${r.color}` : 'border-border'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selected || saving}
          className="w-full h-11 rounded-xl font-semibold gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Menyimpan...</>
          ) : (
            <>Mulai Belajar <ChevronRight className="w-4 h-4" /></>
          )}
        </Button>
      </motion.div>
    </div>
  );
}