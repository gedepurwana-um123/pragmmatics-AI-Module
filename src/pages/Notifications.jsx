import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Bell, CheckCheck, Award, MessageSquare, AlertTriangle, Info, Zap, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TYPE_CONFIG = {
  achievement: { icon: Award, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
  feedback: { icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
  alert: { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200' },
  reminder: { icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
  info: { icon: Info, color: 'text-cyan-500', bg: 'bg-cyan-50 border-cyan-200' },
  system: { icon: Bell, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
};

const DEMO_NOTIFICATIONS = [
  { id: 'd1', title: '🏅 Badge Baru: Komunikator Santun!', message: 'Anda mencapai skor kesantunan 80%. Badge "Komunikator Santun" telah terbuka!', type: 'achievement', is_read: false, created_date: new Date().toISOString() },
  { id: 'd2', title: 'Feedback Dosen', message: 'Dr. Siti Aminah memberikan feedback untuk jurnal refleksi Anda pada Fase 6.', type: 'feedback', is_read: false, created_date: new Date(Date.now() - 3600000).toISOString() },
  { id: 'd3', title: 'Peringatan Interaksi AI', message: 'Sistem mendeteksi pola komunikasi yang memerlukan perhatian. Tinjau rekomendasi kearifan budaya.', type: 'alert', is_read: true, created_date: new Date(Date.now() - 7200000).toISOString() },
  { id: 'd4', title: 'Pengingat: Jurnal Refleksi', message: 'Anda belum menulis jurnal refleksi minggu ini. Lanjutkan perjalanan belajar Fase 6!', type: 'reminder', is_read: true, created_date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'd5', title: 'Modul Baru Tersedia', message: 'Modul "Etnografi Digital Lanjutan" telah ditambahkan ke kurikulum Anda.', type: 'info', is_read: true, created_date: new Date(Date.now() - 172800000).toISOString() },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    base44.entities.Notification.filter({})
      .then(data => {
        if (data && data.length > 0) {
          setNotifications([...data, ...DEMO_NOTIFICATIONS]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const deleteNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.is_read) : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return `${Math.floor(hours / 24)} hari lalu`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 bg-background min-h-screen space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-foreground">Notifikasi</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">{unreadCount} notifikasi belum dibaca</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 800);
            }}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={markAllRead}>
              <CheckCheck className="w-3.5 h-3.5" />Tandai Semua Dibaca
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: notifications.length, color: 'text-foreground' },
          { label: 'Belum Dibaca', value: unreadCount, color: 'text-rose-600' },
          { label: 'Pencapaian', value: notifications.filter(n => n.type === 'achievement').length, color: 'text-amber-600' },
          { label: 'Feedback', value: notifications.filter(n => n.type === 'feedback').length, color: 'text-indigo-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold font-montserrat ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 p-1 bg-secondary rounded-xl w-fit flex-wrap">
        {[
          { key: 'all', label: 'Semua' },
          { key: 'unread', label: 'Belum Dibaca' },
          { key: 'achievement', label: '🏅 Pencapaian' },
          { key: 'feedback', label: '💬 Feedback' },
          { key: 'alert', label: '⚠️ Alert' },
          { key: 'reminder', label: '⚡ Pengingat' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f.key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >{f.label}</button>
        ))}
      </div>

      {/* Notification list */}
      <motion.div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-border p-12 text-center">
            <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Tidak ada notifikasi</p>
          </div>
        ) : (
          filtered.map((notif, i) => {
            const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
            const Icon = cfg.icon;
            return (
              <motion.div key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${notif.is_read ? 'bg-white border-border' : `${cfg.bg}`}`}
                onClick={() => markRead(notif.id)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.is_read ? 'bg-secondary' : 'bg-white shadow-sm'}`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${notif.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>{notif.title}</p>
                    {!notif.is_read && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">{formatTime(notif.created_date)}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                  className="w-7 h-7 rounded-lg hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center text-muted-foreground transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}