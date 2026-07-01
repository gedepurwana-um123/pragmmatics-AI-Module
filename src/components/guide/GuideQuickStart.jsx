import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, Key, Download, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GuideQuickStart({ role, onDownload, generating }) {
  const steps = [
    {
      icon: LogIn,
      label: '1. Akses Platform',
      desc: role === 'dosen'
        ? 'Login & pilih peran Dosen untuk masuk ke Dasbor Dosen.'
        : 'Login & pilih peran Mahasiswa untuk masuk ke Dashboard.',
      color: 'from-indigo-500 to-violet-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
    {
      icon: Key,
      label: role === 'dosen' ? '2. Buat & Bagikan Kelas' : '2. Ikuti Kelas',
      desc: role === 'dosen'
        ? 'Buat kelas baru, generate kode akses, dan bagikan ke mahasiswa.'
        : 'Masukkan kode kelas dari dosen untuk bergabung & mulai belajar.',
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      icon: Download,
      label: '3. Download Panduan PDF',
      desc: 'Simpan panduan lengkap offline untuk referensi kapan saja.',
      color: 'from-cyan-500 to-blue-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-100',
      action: true,
    },
  ];

  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`relative ${step.bg} ${step.border} border rounded-2xl p-4 flex flex-col gap-2`}
        >
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
            <step.icon className="w-5 h-5 text-white" />
          </div>
          <p className="font-bold font-montserrat text-sm text-foreground">{step.label}</p>
          <p className="text-xs text-muted-foreground leading-relaxed flex-1">{step.desc}</p>
          {step.action ? (
            <Button
              onClick={onDownload}
              disabled={generating !== 'none'}
              className="w-full gap-2 text-xs h-8 mt-1"
              size="sm"
            >
              {generating === role ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Membuat PDF...</>
              ) : (
                <><Download className="w-3.5 h-3.5" /> Unduh PDF {role === 'dosen' ? 'Dosen' : 'Mahasiswa'}</>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground mt-1">
              <span>Lihat detail di bawah</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}