import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, CheckCircle2, Bell, BookOpen, X, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localUser } from '@/lib/localUser';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export default function LecturerNotificationPanel({ classIds = [] }) {
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = localUser.get();

  useEffect(() => { loadNotifications(); }, [classIds.join(',')]);

  const loadNotifications = async () => {
    if (!currentUser?.email) return;
    setLoading(true);

    // Load system notifications sent to this lecturer
    const [systemNotifs, toxicLogs, recentReflections] = await Promise.all([
      base44.entities.Notification.filter({ recipient_email: currentUser.email }).catch(() => []),
      base44.entities.AIChatLog.filter({ flagged_for_review: true }).catch(() => []),
      base44.entities.JurnalReflektif.filter({}).catch(() => []),
    ]);

    // Get enrollments to filter by class
    const enrollments = classIds.length > 0
      ? await Promise.all(classIds.map(cid => base44.entities.Enrollment.filter({ class_id: cid }).catch(() => [])))
          .then(all => all.flat())
      : [];

    const studentEmails = new Set(enrollments.map(e => e.student_email));

    const notifs = [];

    // System notifications (from analyzeAndLogAI toxicity alerts)
    systemNotifs.slice(0, 8).forEach(n => {
      notifs.push({
        id: `sys_${n.id}`,
        type: n.type === 'alert' ? 'toxicity' : 'reflection',
        studentEmail: n.sender_email,
        message: n.title,
        detail: n.message,
        time: n.created_date,
        severity: n.type === 'alert' ? 'high' : 'info',
        dbId: n.id,
        isRead: n.is_read,
      });
    });

    // Also show recent flagged AI logs from students not yet in system notifs
    toxicLogs
      .filter(log => studentEmails.has(log.user_email))
      .slice(0, 3)
      .forEach(log => {
        const alreadyInSystem = notifs.some(n => n.detail?.includes(log.user_email));
        if (!alreadyInSystem) {
          notifs.push({
            id: `tox_${log.id}`,
            type: 'toxicity',
            studentEmail: log.user_email,
            message: `Toksisitas tinggi (${log.toxicity_score}%) dari ${log.user_email}`,
            detail: log.user_prompt?.substring(0, 80) + '...',
            time: log.created_date,
            severity: log.toxicity_score > 70 ? 'high' : 'medium',
          });
        }
      });

    // Reflection completion
    recentReflections
      .filter(r => studentEmails.has(r.user_email || r.created_by))
      .slice(0, 3)
      .forEach(ref => {
        notifs.push({
          id: `ref_${ref.id}`,
          type: 'reflection',
          studentEmail: ref.user_email || ref.created_by,
          message: `${ref.user_email || ref.created_by} menyelesaikan refleksi baru`,
          detail: ref.title || ref.prompt || 'Jurnal reflektif baru',
          time: ref.created_date,
          severity: 'info',
        });
      });

    notifs.sort((a, b) => new Date(b.time) - new Date(a.time));
    setNotifications(notifs);
    setLoading(false);
  };

  const unread = notifications.filter(n => !dismissed.includes(n.id));

  const dismissNotif = (id) => setDismissed(prev => [...prev, id]);
  const dismissAll = () => setDismissed(notifications.map(n => n.id));

  const getIcon = (type, severity) => {
    if (type === 'toxicity') return <AlertTriangle className={`w-4 h-4 ${severity === 'high' ? 'text-rose-500' : 'text-amber-500'}`} />;
    return <BookOpen className="w-4 h-4 text-emerald-500" />;
  };

  const getBg = (type, severity) => {
    if (type === 'toxicity') return severity === 'high' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200';
    return 'bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            {unread.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread.length}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold font-montserrat text-sm">Notifikasi Real-time</h3>
            <p className="text-[11px] text-muted-foreground">Aktivitas mahasiswa di kelas Anda</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" variant="ghost" onClick={loadNotifications} className="h-7 w-7 p-0">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          {unread.length > 0 && (
            <Button size="sm" variant="outline" onClick={dismissAll} className="h-7 text-xs px-2">
              Baca Semua
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : unread.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-300 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">Semua notifikasi sudah dibaca</p>
          <p className="text-xs text-muted-foreground mt-0.5">Tidak ada aktivitas baru dari mahasiswa</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {unread.map(notif => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10, height: 0 }}
                className={`flex gap-3 p-3 rounded-xl border ${getBg(notif.type, notif.severity)}`}
              >
                <div className="mt-0.5 flex-shrink-0">{getIcon(notif.type, notif.severity)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground leading-tight">{notif.message}</p>
                  {notif.detail && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate italic">"{notif.detail}"</p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {notif.time
                      ? formatDistanceToNow(new Date(notif.time), { addSuffix: true, locale: id })
                      : 'Baru saja'}
                  </p>
                </div>
                <button
                  onClick={() => dismissNotif(notif.id)}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-black/10 text-muted-foreground flex-shrink-0 mt-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}