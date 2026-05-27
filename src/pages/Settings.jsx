import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-space">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">Kelola profil dan preferensi akun Anda.</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-light rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-primary" />
          <h3 className="font-semibold font-space">Profil</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Nama Lengkap</label>
            <Input placeholder="Nama lengkap" className="bg-background/50 border-border/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <Input placeholder="email@univ.ac.id" className="bg-background/50 border-border/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Program Studi</label>
            <Input placeholder="Pendidikan Bahasa Indonesia" className="bg-background/50 border-border/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">NIM</label>
            <Input placeholder="NIM" className="bg-background/50 border-border/50" />
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 rounded-xl">Simpan Profil</Button>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-light rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="font-semibold font-space">Notifikasi</h3>
        </div>
        {[
          { label: 'Umpan balik AI', desc: 'Terima notifikasi saat AI memberikan umpan balik' },
          { label: 'Pengingat belajar', desc: 'Pengingat harian untuk melanjutkan pembelajaran' },
          { label: 'Pencapaian baru', desc: 'Notifikasi saat membuka pencapaian baru' },
          { label: 'Pembaruan modul', desc: 'Informasi tentang modul baru yang tersedia' },
        ].map((n, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{n.label}</p>
              <p className="text-xs text-muted-foreground">{n.desc}</p>
            </div>
            <Switch defaultChecked />
          </div>
        ))}
      </motion.div>

      {/* Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-light rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="font-semibold font-space">Preferensi</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Bahasa Asisten AI</p>
            <p className="text-xs text-muted-foreground">Bahasa Indonesia (default)</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg text-xs">Bahasa Indonesia</Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Tingkat AI Scaffolding</p>
            <p className="text-xs text-muted-foreground">Sesuaikan tingkat bantuan AI</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg text-xs">Otomatis</Button>
        </div>
      </motion.div>
    </div>
  );
}