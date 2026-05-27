import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, GraduationCap, BookOpen, Mail, User, Building2, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localUser } from '@/lib/localUser';
import { useNavigate } from 'react-router-dom';

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!role) { setError('Pilih peran Anda terlebih dahulu.'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Masukkan alamat email yang valid.'); return; }
    if (!fullName.trim()) { setError('Masukkan nama lengkap Anda.'); return; }
    if (!institution.trim()) { setError('Masukkan nama institusi/kampus Anda.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    localUser.set({ email: email.trim().toLowerCase(), full_name: fullName.trim(), institution: institution.trim(), role });
    onClose?.();
    if (role === 'dosen') {
      navigate('/lecturer');
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-6 text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg font-montserrat">PragmaticsAI</h2>
                <p className="text-white/70 text-xs">Platform Pragmatik Digital</p>
              </div>
            </div>
            <p className="text-white/80 text-sm mt-2">Masuk untuk mengakses ekosistem pembelajaran pragmatik berbasis AI.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {/* Role selector */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Saya adalah:</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('mahasiswa')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === 'mahasiswa' ? 'border-indigo-500 bg-indigo-50' : 'border-border hover:border-indigo-200'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'mahasiswa' ? 'bg-indigo-100' : 'bg-secondary'}`}>
                    <GraduationCap className={`w-5 h-5 ${role === 'mahasiswa' ? 'text-indigo-600' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-bold ${role === 'mahasiswa' ? 'text-indigo-700' : 'text-foreground'}`}>Mahasiswa</p>
                    <p className="text-[10px] text-muted-foreground">Akses modul belajar</p>
                  </div>
                </button>
                <button type="button" onClick={() => setRole('dosen')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${role === 'dosen' ? 'border-cyan-500 bg-cyan-50' : 'border-border hover:border-cyan-200'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'dosen' ? 'bg-cyan-100' : 'bg-secondary'}`}>
                    <BookOpen className={`w-5 h-5 ${role === 'dosen' ? 'text-cyan-600' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-bold ${role === 'dosen' ? 'text-cyan-700' : 'text-foreground'}`}>Dosen</p>
                    <p className="text-[10px] text-muted-foreground">Akses dasbor pengajar</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Alamat Email"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-secondary/20" />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-secondary/20" />
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={institution} onChange={e => setInstitution(e.target.value)}
                  placeholder="Nama Institusi / Kampus"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-secondary/20" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              </div>
            )}

            <Button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white gap-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Masuk...</>
                : <><LogIn className="w-4 h-4" />Masuk ke PragmaticsAI</>}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Data disimpan di perangkat Anda secara lokal dan aman.</p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}