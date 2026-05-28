import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, X, Clock, MapPin, BookOpen, FileText, Megaphone, GraduationCap, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EVENT_TYPES = {
  sesi_kelas: { label: 'Sesi Kelas', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', icon: BookOpen },
  tugas: { label: 'Tugas', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500', icon: FileText },
  ujian: { label: 'Ujian', color: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-500', icon: GraduationCap },
  pengumuman: { label: 'Pengumuman', color: 'bg-cyan-100 text-cyan-700 border-cyan-200', dot: 'bg-cyan-500', icon: Megaphone },
};

function EventForm({ classes, onSave, onClose }) {
  const [form, setForm] = useState({
    class_id: '',
    title: '',
    description: '',
    event_type: 'sesi_kelas',
    start_datetime: '',
    end_datetime: '',
    location: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.class_id || !form.title || !form.start_datetime) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold font-montserrat text-sm">Tambah Jadwal</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Kelas *</label>
            <select value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white" required>
              <option value="">-- Pilih Kelas --</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Jenis Event *</label>
            <select value={form.event_type} onChange={e => setForm({ ...form, event_type: e.target.value })}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white">
              {Object.entries(EVENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Judul *</label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Judul sesi/tugas..." required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Deskripsi</label>
            <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Keterangan tambahan..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Mulai *</label>
              <Input type="datetime-local" value={form.start_datetime} onChange={e => setForm({ ...form, start_datetime: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Selesai</label>
              <Input type="datetime-local" value={form.end_datetime} onChange={e => setForm({ ...form, end_datetime: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Lokasi</label>
            <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Lab Bahasa / Online" />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" className="flex-1">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const DAYS = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];

export default function ClassCalendar({ mode = 'dosen', classes = [], studentEmail = '' }) {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    base44.auth.me().then(u => { setCurrentUser(u); loadEvents(u); }).catch(() => {});
  }, []);

  const loadEvents = async (u) => {
    if (!u) return;
    let evts = [];
    if (mode === 'dosen') {
      evts = await base44.entities.ClassEvent.filter({ lecturer_email: u.email }).catch(() => []);
    } else {
      // Mahasiswa: ambil events dari semua kelas yang di-enroll
      const enrollments = await base44.entities.Enrollment.filter({ student_email: u.email }).catch(() => []);
      const classIds = enrollments.map(e => e.class_id);
      if (classIds.length > 0) {
        const all = await base44.entities.ClassEvent.list().catch(() => []);
        evts = all.filter(e => classIds.includes(e.class_id));
      }
    }
    setEvents(evts);

    // Cek upcoming dalam 3 hari ke depan → reminder
    const now = new Date();
    const in3days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const upcoming = evts.filter(e => {
      const d = new Date(e.start_datetime);
      return d >= now && d <= in3days;
    });
    setUpcomingReminders(upcoming);
  };

  const handleSave = async (data) => {
    const u = await base44.auth.me();
    await base44.entities.ClassEvent.create({ ...data, lecturer_email: u.email });
    setShowForm(false);
    loadEvents(u);
  };

  const handleDelete = async (id) => {
    await base44.entities.ClassEvent.delete(id);
    loadEvents(currentUser);
  };

  // Events per tanggal
  const eventsOnDay = (d) => {
    return events.filter(e => {
      const ed = new Date(e.start_datetime);
      return ed.getFullYear() === year && ed.getMonth() === month && ed.getDate() === d;
    });
  };

  const selectedDayEvents = selectedDay ? eventsOnDay(selectedDay) : [];

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-4">
      {/* Reminder Banner */}
      {upcomingReminders.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Bell className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">🔔 Pengingat — {upcomingReminders.length} jadwal dalam 3 hari ke depan</p>
            <div className="mt-1 space-y-0.5">
              {upcomingReminders.map(r => (
                <p key={r.id} className="text-xs text-amber-700">
                  • <strong>{r.title}</strong> — {new Date(r.start_datetime).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Header Kalender */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold font-montserrat text-sm">Kalender Kelas</h3>
              <p className="text-[10px] text-muted-foreground">{mode === 'dosen' ? 'Jadwal & Tenggat Waktu' : 'Jadwal dari Dosen'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mode === 'dosen' && (
              <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5 text-xs h-8">
                <Plus className="w-3.5 h-3.5" /> Tambah
              </Button>
            )}
          </div>
        </div>

        {/* Nav Bulan */}
        <div className="flex items-center justify-between px-5 py-3 bg-secondary/30">
          <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground font-bold">‹</button>
          <h4 className="font-semibold font-montserrat text-sm">{MONTHS[month]} {year}</h4>
          <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground font-bold">›</button>
        </div>

        {/* Grid Hari */}
        <div className="p-3">
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvts = eventsOnDay(day);
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
              const isSelected = selectedDay === day;
              return (
                <button key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`relative flex flex-col items-center rounded-xl py-1.5 px-0.5 transition-all text-xs
                    ${isToday ? 'bg-primary text-white font-bold' : isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary'}
                  `}>
                  <span>{day}</span>
                  {dayEvts.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {dayEvts.slice(0, 3).map((e, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${EVENT_TYPES[e.event_type]?.dot || 'bg-gray-400'} ${isToday ? 'opacity-70' : ''}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="px-5 pb-4 flex flex-wrap gap-3">
          {Object.entries(EVENT_TYPES).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${v.dot}`} />
              <span className="text-[10px] text-muted-foreground">{v.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Hari Terpilih */}
      <AnimatePresence>
        {selectedDay && selectedDayEvents.length >= 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <h4 className="font-semibold font-montserrat text-sm mb-3">
              {selectedDay} {MONTHS[month]} {year}
            </h4>
            {selectedDayEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Tidak ada jadwal hari ini</p>
            ) : (
              <div className="space-y-2">
                {selectedDayEvents.map(evt => {
                  const et = EVENT_TYPES[evt.event_type];
                  const IconComp = et?.icon || Calendar;
                  const cls = classes.find(c => c.id === evt.class_id);
                  return (
                    <div key={evt.id} className={`flex items-start gap-3 p-3 rounded-xl border ${et?.color}`}>
                      <div className="w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{evt.title}</p>
                        {cls && <p className="text-xs opacity-70">{cls.class_name}</p>}
                        {evt.description && <p className="text-xs opacity-70 mt-0.5">{evt.description}</p>}
                        <div className="flex flex-wrap gap-3 mt-1.5">
                          {evt.start_datetime && (
                            <span className="flex items-center gap-1 text-[10px] opacity-80">
                              <Clock className="w-3 h-3" />
                              {new Date(evt.start_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                              {evt.end_datetime && ` – ${new Date(evt.end_datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
                            </span>
                          )}
                          {evt.location && (
                            <span className="flex items-center gap-1 text-[10px] opacity-80">
                              <MapPin className="w-3 h-3" />{evt.location}
                            </span>
                          )}
                        </div>
                      </div>
                      {mode === 'dosen' && (
                        <button onClick={() => handleDelete(evt.id)}
                          className="w-6 h-6 rounded-lg hover:bg-rose-100 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors flex-shrink-0">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showForm && mode === 'dosen' && (
        <EventForm classes={classes} onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}