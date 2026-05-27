import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Globe, ShieldCheck, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const sections = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'notifications', label: 'Notifikasi', icon: Bell },
  { id: 'preferences', label: 'Preferensi', icon: Palette },
  { id: 'privacy', label: 'Privasi', icon: ShieldCheck },
];

export default function Settings() {
  const [active, setActive] = useState('profile');

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pengaturan</h1>
        <p className="text-muted-foreground mt-1 text-sm">Kelola profil, preferensi, dan privasi akun Anda.</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-3 border border-border shadow-sm h-fit"
        >
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all mb-1 ${
                active === s.id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <s.icon className="w-4 h-4 flex-shrink-0" />
              {s.label}
            </button>
          ))}
        </motion.div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-5">
          {active === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-5"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Profil Saya</h3>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">M</span>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="rounded-lg text-xs bg-white border-border">Ubah Foto</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG maks. 2MB</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Nama Lengkap', placeholder: 'Nama lengkap Anda' },
                  { label: 'Email', placeholder: 'email@univ.ac.id' },
                  { label: 'Program Studi', placeholder: 'Pendidikan Bahasa Indonesia' },
                  { label: 'NIM / NIP', placeholder: 'Nomor Induk' },
                  { label: 'Universitas', placeholder: 'Nama universitas' },
                  { label: 'Semester', placeholder: 'Semester ke-' },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">{f.label}</label>
                    <Input placeholder={f.placeholder} className="bg-secondary/30 border-border text-foreground text-sm" />
                  </div>
                ))}
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                <Save className="w-4 h-4 mr-2" /> Simpan Profil
              </Button>
            </motion.div>
          )}

          {active === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-5"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Pengaturan Notifikasi</h3>
              </div>
              {[
                { label: 'Umpan Balik AI', desc: 'Terima notifikasi saat AI memberikan umpan balik analisis', default: true },
                { label: 'Pengingat Belajar Harian', desc: 'Pengingat harian untuk melanjutkan modul pembelajaran', default: true },
                { label: 'Pencapaian Baru', desc: 'Notifikasi saat membuka badge atau pencapaian baru', default: true },
                { label: 'Pembaruan Modul', desc: 'Informasi tentang modul baru yang tersedia di platform', default: false },
                { label: 'Analisis Selesai', desc: 'Notifikasi saat analisis pragmatik selesai diproses', default: true },
                { label: 'Komentar & Diskusi', desc: 'Notifikasi aktivitas diskusi akademik di platform', default: false },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={n.default} />
                </div>
              ))}
            </motion.div>
          )}

          {active === 'preferences' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-5"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Preferensi Pembelajaran</h3>
              </div>
              {[
                { label: 'Bahasa Asisten AI', desc: 'Bahasa komunikasi asisten AI', value: 'Bahasa Indonesia' },
                { label: 'Tingkat AI Scaffolding', desc: 'Sesuaikan tingkat bantuan AI', value: 'Otomatis' },
                { label: 'Level Kesulitan Default', desc: 'Tingkat kesulitan modul pembelajaran', value: 'Menengah' },
                { label: 'Tema Tampilan', desc: 'Tampilan visual platform', value: 'Light' },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg text-xs bg-white border-border hover:bg-secondary">
                    {p.value}
                  </Button>
                </div>
              ))}
            </motion.div>
          )}

          {active === 'privacy' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-5"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Privasi & Keamanan</h3>
              </div>
              {[
                { label: 'Berbagi Data Analitik', desc: 'Izinkan data digunakan untuk riset pengembangan platform', default: true },
                { label: 'Profil Publik', desc: 'Tampilkan profil pragmatik kepada dosen dan peneliti', default: false },
                { label: 'Riwayat Interaksi AI', desc: 'Simpan riwayat percakapan dengan asisten AI', default: true },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                  <Switch defaultChecked={p.default} />
                </div>
              ))}
              <div className="pt-2">
                <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl text-sm bg-white">
                  Hapus Akun Saya
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}