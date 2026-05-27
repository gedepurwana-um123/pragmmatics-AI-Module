import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  User, Lock, Bell, Globe, Brain, Shield, Database,
  CheckCircle2, Save, Eye, EyeOff, Camera, Zap, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TABS = ['Profil', 'Keamanan', 'Notifikasi', 'Preferensi AI', 'Data & Privasi'];

export default function Settings() {
  const [tab, setTab] = useState('Profil');
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '', institution: '', study_program: '',
    student_id: '', phone_number: '', class_group: '',
  });
  const [notifications, setNotifications] = useState({
    achievement: true, feedback: true, reminder: true,
    ai_response: true, system: false, weekly_report: true,
  });
  const [aiPrefs, setAiPrefs] = useState({
    scaffolding: 'moderat', cultural_focus: 'all',
    auto_analyze: true, show_reconstruction: true,
  });

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u) {
        setUser(u);
        setProfile(prev => ({ ...prev, full_name: u.full_name || '' }));
      }
    }).catch(() => {});
    base44.entities.StudentProfile.filter({}).then(profiles => {
      if (profiles?.length > 0) {
        const p = profiles[0];
        setProfile({
          full_name: p.user_email || '',
          institution: p.institution || '',
          study_program: p.study_program || '',
          student_id: p.student_id || '',
          phone_number: p.phone_number || '',
          class_group: p.class_group || '',
        });
      }
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">Pengaturan Akun</h1>
        <p className="text-muted-foreground mt-1 text-sm">Kelola profil, keamanan, dan preferensi platform Anda.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Profil ── */}
      {tab === 'Profil' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-6 max-w-2xl"
        >
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {user?.full_name?.[0] || 'U'}
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.full_name || 'Pengguna'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Button size="sm" variant="outline" className="mt-2 text-xs gap-1.5">
                <Camera className="w-3.5 h-3.5" />Ubah Foto
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Nama Lengkap', key: 'full_name', placeholder: 'Nama lengkap Anda' },
              { label: 'Institusi', key: 'institution', placeholder: 'Universitas/Sekolah' },
              { label: 'Program Studi', key: 'study_program', placeholder: 'Program studi' },
              { label: 'NIM', key: 'student_id', placeholder: 'Nomor Induk Mahasiswa' },
              { label: 'No. Telepon', key: 'phone_number', placeholder: '08xxxxxxxxxx' },
              { label: 'Kelompok Kelas', key: 'class_group', placeholder: 'Kelas A / B / C' },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">{f.label}</label>
                <Input
                  placeholder={f.placeholder}
                  value={profile[f.key]}
                  onChange={e => setProfile(prev => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <Button onClick={handleSave} className={`gap-2 ${saved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'} text-white`}>
            {saved ? <><CheckCircle2 className="w-4 h-4" />Tersimpan</> : <><Save className="w-4 h-4" />Simpan Perubahan</>}
          </Button>
        </motion.div>
      )}

      {/* ── Keamanan ── */}
      {tab === 'Keamanan' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5 max-w-lg"
        >
          <h3 className="font-semibold text-foreground flex items-center gap-2"><Lock className="w-4 h-4" />Ubah Password</h3>
          {['Password Lama', 'Password Baru', 'Konfirmasi Password Baru'].map((label, i) => (
            <div key={i}>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">{label}</label>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} placeholder="••••••••" />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <p className="text-xs font-semibold text-indigo-700 mb-2">🔒 Keamanan Akun</p>
            <ul className="space-y-1 text-xs text-indigo-600">
              <li>✓ Sesi JWT aktif</li>
              <li>✓ Enkripsi data end-to-end</li>
              <li>✓ Login terakhir: Hari ini</li>
            </ul>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"><Lock className="w-4 h-4" />Ubah Password</Button>
        </motion.div>
      )}

      {/* ── Notifikasi ── */}
      {tab === 'Notifikasi' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-3 max-w-lg"
        >
          <h3 className="font-semibold text-foreground flex items-center gap-2"><Bell className="w-4 h-4" />Preferensi Notifikasi</h3>
          {Object.entries({
            achievement: 'Pencapaian & Badge Baru',
            feedback: 'Feedback dari Dosen',
            reminder: 'Pengingat Belajar Harian',
            ai_response: 'Respons AI Selesai',
            system: 'Pembaruan Sistem',
            weekly_report: 'Laporan Mingguan',
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-secondary/20 transition-colors">
              <span className="text-sm text-foreground">{label}</span>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                className={`w-11 h-6 rounded-full transition-all ${notifications[key] ? 'bg-indigo-600' : 'bg-secondary border border-border'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-all mx-0.5 ${notifications[key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
          <Button onClick={handleSave} className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            {saved ? <><CheckCircle2 className="w-4 h-4" />Tersimpan</> : <><Save className="w-4 h-4" />Simpan</>}
          </Button>
        </motion.div>
      )}

      {/* ── Preferensi AI ── */}
      {tab === 'Preferensi AI' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5 max-w-lg"
        >
          <h3 className="font-semibold text-foreground flex items-center gap-2"><Brain className="w-4 h-4" />Konfigurasi AI Personal</h3>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Level Scaffolding AI</label>
            <div className="flex gap-2">
              {['minimal', 'moderat', 'intensif'].map(l => (
                <button key={l} onClick={() => setAiPrefs(prev => ({ ...prev, scaffolding: l }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${aiPrefs.scaffolding === l ? 'bg-indigo-100 border-indigo-400 text-indigo-700' : 'border-border text-muted-foreground hover:bg-secondary'}`}
                >{l}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Fokus Kearifan Budaya</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'tolaki', 'muna', 'buton'].map(l => (
                <button key={l} onClick={() => setAiPrefs(prev => ({ ...prev, cultural_focus: l }))}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${aiPrefs.cultural_focus === l ? 'bg-violet-100 border-violet-400 text-violet-700' : 'border-border text-muted-foreground hover:bg-secondary'}`}
                >{l === 'all' ? 'Semua Budaya' : l}</button>
              ))}
            </div>
          </div>

          {[
            { key: 'auto_analyze', label: 'Analisis Otomatis saat Input Teks' },
            { key: 'show_reconstruction', label: 'Tampilkan Rekonstruksi Komunikasi Etis' },
          ].map(opt => (
            <div key={opt.key} className="flex items-center justify-between p-3 rounded-xl border border-border">
              <span className="text-sm text-foreground">{opt.label}</span>
              <button onClick={() => setAiPrefs(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))}
                className={`w-11 h-6 rounded-full transition-all ${aiPrefs[opt.key] ? 'bg-indigo-600' : 'bg-secondary border border-border'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-all mx-0.5 ${aiPrefs[opt.key] ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}

          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            {saved ? <><CheckCircle2 className="w-4 h-4" />Tersimpan</> : <><Save className="w-4 h-4" />Simpan Preferensi</>}
          </Button>
        </motion.div>
      )}

      {/* ── Data & Privasi ── */}
      {tab === 'Data & Privasi' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="space-y-4 max-w-lg"
        >
          {[
            {
              title: 'Data Pembelajaran Anda', icon: Database, color: 'indigo',
              desc: 'Semua data pembelajaran, interaksi AI, dan jurnal refleksi disimpan dengan enkripsi.',
              action: 'Download Data', actionColor: 'bg-indigo-600',
            },
            {
              title: 'Log Aktivitas AI', icon: Activity, color: 'cyan',
              desc: 'Riwayat interaksi AI digunakan untuk meningkatkan akurasi sistem scaffolding adaptif.',
              action: 'Lihat Log', actionColor: 'bg-cyan-600',
            },
            {
              title: 'Hapus Akun', icon: Shield, color: 'rose',
              desc: 'Penghapusan akun bersifat permanen dan tidak dapat dibatalkan.',
              action: 'Hapus Akun', actionColor: 'bg-rose-600',
            },
          ].map((item, i) => (
            <div key={i} className={`bg-white rounded-2xl border border-${item.color}-200 shadow-sm p-5`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${item.color}-100 flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">{item.desc}</p>
                  <Button size="sm" className={`${item.actionColor} hover:opacity-90 text-white text-xs`}>{item.action}</Button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}