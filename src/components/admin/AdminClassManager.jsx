import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  BookOpen, Plus, Users, UserPlus, Trash2, Key, Copy, Search,
  ChevronDown, ChevronUp, Loader2, CheckCircle, AlertCircle, RefreshCw, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─── Create/Edit Class Modal ───────────────────────────────────────────────────
function ClassFormModal({ item, lecturers, courses, onSave, onClose }) {
  const [form, setForm] = useState({
    class_name: item?.class_name || '',
    lecturer_email: item?.lecturer_email || '',
    course_id: item?.course_id || '',
    semester: item?.semester || 'Ganjil 2024/2025',
    academic_year: item?.academic_year || '2024/2025',
    max_students: item?.max_students || 40,
    schedule: item?.schedule || '',
    room: item?.room || '',
    description: item?.description || '',
    is_active: item?.is_active !== false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.class_name || !form.lecturer_email) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const lecturerCourses = courses.filter(c => c.lecturer_id === form.lecturer_email);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white">
          <h3 className="font-bold font-montserrat">{item ? 'Edit Kelas' : 'Buat Kelas Baru'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nama Kelas *</label>
            <Input value={form.class_name} onChange={e => setForm(p => ({ ...p, class_name: e.target.value }))} placeholder="Kelas A - Pragmatik Digital" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Dosen Pengampu *</label>
            <select
              value={form.lecturer_email}
              onChange={e => setForm(p => ({ ...p, lecturer_email: e.target.value, course_id: '' }))}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="">-- Pilih Dosen --</option>
              {lecturers.map(l => (
                <option key={l.id} value={l.user_email}>{l.full_name} ({l.user_email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Mata Kuliah</label>
            <select
              value={form.course_id}
              onChange={e => setForm(p => ({ ...p, course_id: e.target.value }))}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="">-- Pilih Mata Kuliah --</option>
              {lecturerCourses.map(c => (
                <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>
              ))}
              {lecturerCourses.length === 0 && form.lecturer_email && (
                <option disabled>Dosen ini belum memiliki mata kuliah</option>
              )}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Semester</label>
              <Input value={form.semester} onChange={e => setForm(p => ({ ...p, semester: e.target.value }))} placeholder="Ganjil 2024/2025" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Kapasitas</label>
              <Input type="number" value={form.max_students} onChange={e => setForm(p => ({ ...p, max_students: Number(e.target.value) }))} min={1} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Jadwal</label>
              <Input value={form.schedule} onChange={e => setForm(p => ({ ...p, schedule: e.target.value }))} placeholder="Senin 08:00-10:00" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Ruangan</label>
              <Input value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))} placeholder="Gedung A-301" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="rounded" />
            <label htmlFor="isActive" className="text-sm">Kelas Aktif</label>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} disabled={saving || !form.class_name || !form.lecturer_email} className="gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {item ? 'Simpan Perubahan' : 'Buat Kelas'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Enroll Student Panel ──────────────────────────────────────────────────────
function EnrollPanel({ classData, enrollments, onEnrolled, onRemoved }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [removing, setRemoving] = useState(null);

  const handleEnroll = async () => {
    const studentEmail = email.trim().toLowerCase();
    if (!studentEmail) return;
    setLoading(true);
    setMsg(null);

    if (enrollments.find(e => e.student_email === studentEmail)) {
      setMsg({ type: 'error', text: `${studentEmail} sudah terdaftar.` });
      setLoading(false);
      return;
    }

    const enr = await base44.entities.Enrollment.create({
      class_id: classData.id,
      student_email: studentEmail,
      lecturer_email: classData.lecturer_email,
      course_id: classData.course_id || '',
      institution_id: classData.institution_id || '',
      status: 'active',
      joined_at: new Date().toISOString(),
      total_ai_interactions: 0,
      total_reflections: 0,
      completion_percentage: 0,
      xp_points: 0,
      streak_days: 0,
    });
    await base44.entities.Class.update(classData.id, {
      enrolled_count: enrollments.length + 1,
    });
    setMsg({ type: 'success', text: `${studentEmail} berhasil didaftarkan.` });
    setEmail('');
    onEnrolled(enr);
    setLoading(false);
  };

  const handleRemove = async (enr) => {
    setRemoving(enr.id);
    await base44.entities.Enrollment.delete(enr.id).catch(() => {});
    await base44.entities.Class.update(classData.id, {
      enrolled_count: Math.max(0, enrollments.length - 1),
    });
    onRemoved(enr.id);
    setRemoving(null);
  };

  return (
    <div className="mt-3 border-t border-border pt-4 space-y-3">
      {/* Input enroll */}
      <div className="flex gap-2">
        <Input
          placeholder="email mahasiswa..."
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleEnroll()}
          className="flex-1 text-xs h-8"
        />
        <Button size="sm" onClick={handleEnroll} disabled={loading || !email.trim()} className="h-8 text-xs gap-1 bg-cyan-600 hover:bg-cyan-700">
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
          Enroll
        </Button>
      </div>
      {msg && (
        <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${msg.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {msg.type === 'success' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {msg.text}
        </div>
      )}
      {/* Student list */}
      {enrollments.length > 0 && (
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {enrollments.map((enr, i) => (
            <div key={enr.id} className="flex items-center gap-2 p-2 bg-secondary/20 rounded-lg text-xs">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                {i + 1}
              </div>
              <span className="flex-1 truncate">{enr.student_email}</span>
              <span className={`px-1.5 py-0.5 rounded-full ${enr.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
                {enr.status}
              </span>
              <button onClick={() => handleRemove(enr)} disabled={removing === enr.id}
                className="w-5 h-5 rounded hover:bg-rose-100 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors">
                {removing === enr.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              </button>
            </div>
          ))}
        </div>
      )}
      {enrollments.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-3">Belum ada mahasiswa terdaftar</p>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminClassManager() {
  const [classes, setClasses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [allEnrollments, setAllEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [cls, lec, crs, enr] = await Promise.all([
      base44.entities.Class.list('-created_date', 200).catch(() => []),
      base44.entities.LecturerProfile.list().catch(() => []),
      base44.entities.Course.list().catch(() => []),
      base44.entities.Enrollment.list('-created_date', 500).catch(() => []),
    ]);
    setClasses(cls);
    setLecturers(lec);
    setCourses(crs);
    setAllEnrollments(enr);
    setLoading(false);
  };

  const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleSave = async (formData) => {
    if (editItem) {
      const updated = await base44.entities.Class.update(editItem.id, formData);
      setClasses(prev => prev.map(c => c.id === editItem.id ? { ...c, ...formData } : c));
    } else {
      const created = await base44.entities.Class.create({
        ...formData,
        class_code: generateCode(),
        enrolled_count: 0,
      });
      setClasses(prev => [created, ...prev]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  const handleDelete = async (cls) => {
    if (!window.confirm(`Hapus kelas "${cls.class_name}"? Semua data enrollment juga akan terhapus.`)) return;
    // Delete enrollments first
    const classEnrollments = allEnrollments.filter(e => e.class_id === cls.id);
    await Promise.all(classEnrollments.map(e => base44.entities.Enrollment.delete(e.id).catch(() => {})));
    await base44.entities.Class.delete(cls.id);
    setClasses(prev => prev.filter(c => c.id !== cls.id));
    setAllEnrollments(prev => prev.filter(e => e.class_id !== cls.id));
  };

  const handleEnrolled = (classId, newEnr) => {
    setAllEnrollments(prev => [...prev, newEnr]);
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, enrolled_count: (c.enrolled_count || 0) + 1 } : c));
  };

  const handleRemoved = (classId, enrId) => {
    setAllEnrollments(prev => prev.filter(e => e.id !== enrId));
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, enrolled_count: Math.max(0, (c.enrolled_count || 0) - 1) } : c));
  };

  const filtered = classes.filter(c =>
    !search ||
    c.class_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.lecturer_email?.toLowerCase().includes(search.toLowerCase()) ||
    c.class_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari kelas, dosen, kode..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" onClick={loadAll} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
        <Button onClick={() => { setEditItem(null); setShowForm(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Buat Kelas Baru
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Kelas', value: classes.length, color: 'text-indigo-600' },
          { label: 'Total Enrollment', value: allEnrollments.filter(e => e.status === 'active').length, color: 'text-emerald-600' },
          { label: 'Dosen Terdaftar', value: lecturers.length, color: 'text-cyan-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold font-montserrat ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Class List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" /> Memuat data kelas...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-border">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-muted-foreground">
            {search ? 'Kelas tidak ditemukan' : 'Belum ada kelas dibuat'}
          </p>
          {!search && (
            <Button className="mt-4 gap-2" onClick={() => { setEditItem(null); setShowForm(true); }}>
              <Plus className="w-4 h-4" /> Buat Kelas Pertama
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((cls) => {
            const course = courses.find(c => c.id === cls.course_id);
            const lecturer = lecturers.find(l => l.user_email === cls.lecturer_email);
            const classEnrollments = allEnrollments.filter(e => e.class_id === cls.id);
            const isExpanded = expandedId === cls.id;

            return (
              <motion.div key={cls.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
                {/* Class Header Row */}
                <div className="p-4 flex items-center gap-3 flex-wrap">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cls.is_active ? 'bg-gradient-to-br from-indigo-500 to-violet-600' : 'bg-secondary'}`}>
                    <BookOpen className={`w-5 h-5 ${cls.is_active ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold font-montserrat text-sm">{cls.class_name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cls.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
                        {cls.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {lecturer?.full_name || cls.lecturer_email} · {course?.course_name || 'Mata kuliah'} · {cls.semester}
                    </p>
                  </div>
                  {/* Kode */}
                  <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg">
                    <Key className="w-3.5 h-3.5 text-indigo-500" />
                    <code className="text-xs font-bold text-indigo-700 tracking-widest">{cls.class_code}</code>
                    <button onClick={() => navigator.clipboard.writeText(cls.class_code)}
                      className="w-5 h-5 rounded hover:bg-indigo-100 flex items-center justify-center">
                      <Copy className="w-3 h-3 text-indigo-400" />
                    </button>
                  </div>
                  {/* Student count */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>{classEnrollments.length}/{cls.max_students || 40}</span>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2 gap-1"
                      onClick={() => { setEditItem(cls); setShowForm(true); }}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                      onClick={() => handleDelete(cls)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : cls.id)}
                      className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expandable Enroll Panel */}
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <EnrollPanel
                      classData={cls}
                      enrollments={classEnrollments}
                      onEnrolled={(newEnr) => handleEnrolled(cls.id, newEnr)}
                      onRemoved={(enrId) => handleRemoved(cls.id, enrId)}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ClassFormModal
          item={editItem}
          lecturers={lecturers}
          courses={courses}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditItem(null); }}
        />
      )}
    </div>
  );
}