import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, BookOpen, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function LoginModal({ isOpen, onClose }) {
  const [selected, setSelected] = useState(null); // 'mahasiswa' | 'dosen'

  const handleLogin = () => {
    if (!selected) return;
    // Store role intent in sessionStorage so after redirect we can use it
    sessionStorage.setItem('login_role_intent', selected);
    const redirectUrl = window.location.origin + '/role-redirect';
    base44.auth.redirectToLogin(redirectUrl);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold font-montserrat text-foreground">Masuk ke PragmaticsAI</h2>
            <p className="text-sm text-muted-foreground mt-1">Pilih peran Anda untuk memulai</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Mahasiswa */}
            <button
              onClick={() => setSelected('mahasiswa')}
              className={`group relative rounded-2xl p-5 border-2 text-left transition-all duration-200 ${
                selected === 'mahasiswa'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-secondary/30 hover:border-primary/40 hover:bg-primary/3'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all ${
                selected === 'mahasiswa'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  : 'bg-secondary group-hover:bg-primary/10'
              }`}>
                <GraduationCap className={`w-5 h-5 ${selected === 'mahasiswa' ? 'text-white' : 'text-muted-foreground group-hover:text-primary'}`} />
              </div>
              <h3 className={`font-semibold font-montserrat text-sm ${selected === 'mahasiswa' ? 'text-primary' : 'text-foreground'}`}>
                Mahasiswa
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Akses modul & latihan</p>
              {selected === 'mahasiswa' && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </button>

            {/* Dosen */}
            <button
              onClick={() => setSelected('dosen')}
              className={`group relative rounded-2xl p-5 border-2 text-left transition-all duration-200 ${
                selected === 'dosen'
                  ? 'border-accent bg-accent/5 shadow-md'
                  : 'border-border bg-secondary/30 hover:border-accent/40 hover:bg-accent/3'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all ${
                selected === 'dosen'
                  ? 'bg-gradient-to-br from-cyan-500 to-teal-600'
                  : 'bg-secondary group-hover:bg-accent/10'
              }`}>
                <BookOpen className={`w-5 h-5 ${selected === 'dosen' ? 'text-white' : 'text-muted-foreground group-hover:text-accent'}`} />
              </div>
              <h3 className={`font-semibold font-montserrat text-sm ${selected === 'dosen' ? 'text-accent' : 'text-foreground'}`}>
                Dosen
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Pantau & kelola kelas</p>
              {selected === 'dosen' && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          </div>

          {/* Login button */}
          <Button
            onClick={handleLogin}
            disabled={!selected}
            className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white disabled:opacity-40 transition-all"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {selected
              ? `Masuk sebagai ${selected === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'}`
              : 'Pilih peran terlebih dahulu'}
            {selected && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Login menggunakan akun Google Anda. Aman & terenkripsi.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}