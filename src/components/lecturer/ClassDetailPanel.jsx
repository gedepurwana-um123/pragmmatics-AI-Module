import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Users, Key, Copy, BarChart3, UserPlus, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ClassDetailPanel({ classData, onClose }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState(null); // { type: 'success'|'error', text }
  const [removing, setRemoving] = useState(null);

  useEffect(() => { loadEnrollments(); }, [classData.id]);

  const loadEnrollments = async () => {
    setLoading(true);
    const e = await base44.entities.Enrollment.filter({ class_id: classData.id }).catch(() => []);
    setEnrollments(e);
    setLoading(false);
  };

  const copyCode = () => navigator.clipboard.writeText(classData.class_code);

  const handleEnroll = async () => {
    const email = enrollEmail.trim().toLowerCase();
    if (!email) return;
    setEnrolling(true);
    setEnrollMsg(null);

    // Check already enrolled
    const existing = enrollments.find(e => e.student_email === email);
    if (existing) {
      setEnrollMsg({ type: 'error', text: `${email} sudah terdaftar di kelas ini.` });
      setEnrolling(false);
      return;
    }

    await base44.entities.Enrollment.create({
      class_id: classData.id,
      student_email: email,
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

    // Update enrolled count
    await base44.entities.Class.update(classData.id, {
      enrolled_count: enrollments.length + 1,
    });

    setEnrollMsg({ type: 'success', text: `${email} berhasil didaftarkan ke kelas.` });
    setEnrollEmail('');
    loadEnrollments();
    setEnrolling(false);
  };

  const handleRemove = async (enr) => {
    setRemoving(enr.id);
    await base44.entities.Enrollment.delete(enr.id).catch(() => {});
    await base44.entities.Class.update(classData.id, {
      enrolled_count: Math.max(0, enrollments.length - 1),
    });
    setEnrollments(prev => prev.filter(e => e.id !== enr.id));
    setRemoving(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:rounded-2xl sm:max-w-2xl max-h-[92vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-semibold font-montserrat">{classData.class_name}</h2>
            <p className="text-xs text-muted-foreground">{classData.semester}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Kode kelas */}
          <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl">
            <Key className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Kode Akses Kelas</p>
              <code className="text-2xl font-bold text-indigo-700 font-montserrat tracking-widest">{classData.class_code}</code>
            </div>
            <Button size="sm" variant="outline" onClick={copyCode} className="gap-1.5">
              <Copy className="w-3.5 h-3.5" /> Salin
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-xl font-bold font-montserrat text-indigo-600">{enrollments.length}</p>
              <p className="text-xs text-muted-foreground">Mahasiswa</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-xl font-bold font-montserrat text-emerald-600">
                {enrollments.filter(e => e.status === 'active').length}
              </p>
              <p className="text-xs text-muted-foreground">Aktif</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-xl font-bold font-montserrat text-amber-600">{classData.max_students || 40}</p>
              <p className="text-xs text-muted-foreground">Kapasitas</p>
            </div>
          </div>

          {/* Enroll Mahasiswa */}
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 space-y-3">
            <h3 className="font-semibold font-montserrat text-sm flex items-center gap-2 text-cyan-800">
              <UserPlus className="w-4 h-4" /> Daftarkan Mahasiswa ke Kelas Ini
            </h3>
            <p className="text-xs text-cyan-700">Masukkan email mahasiswa yang terdaftar di platform ini untuk mendaftarkannya langsung ke kelas Anda.</p>
            <div className="flex gap-2">
              <Input
                placeholder="email@mahasiswa.ac.id"
                value={enrollEmail}
                onChange={e => setEnrollEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEnroll()}
                className="flex-1 text-sm"
              />
              <Button size="sm" onClick={handleEnroll} disabled={enrolling || !enrollEmail.trim()} className="gap-1.5 bg-cyan-600 hover:bg-cyan-700">
                {enrolling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                Daftarkan
              </Button>
            </div>
            {enrollMsg && (
              <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${enrollMsg.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {enrollMsg.type === 'success' ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                {enrollMsg.text}
              </div>
            )}
          </div>

          {/* Daftar mahasiswa */}
          <div>
            <h3 className="font-semibold font-montserrat text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Daftar Mahasiswa Terdaftar
            </h3>
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-6">Memuat...</p>
            ) : enrollments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Belum ada mahasiswa yang terdaftar di kelas ini</p>
            ) : (
              <div className="space-y-2">
                {enrollments.map((enr, i) => (
                  <div key={enr.id} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{enr.student_email}</p>
                      <p className="text-xs text-muted-foreground">
                        Bergabung: {enr.joined_at ? new Date(enr.joined_at).toLocaleDateString('id-ID') : '-'}
                      </p>
                    </div>
                    <div className="text-right mr-2">
                      <p className="text-xs font-semibold text-indigo-600">{enr.completion_percentage || 0}%</p>
                      <p className="text-[10px] text-muted-foreground">Progress</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${enr.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
                      {enr.status}
                    </span>
                    <button
                      onClick={() => handleRemove(enr)}
                      disabled={removing === enr.id}
                      className="w-7 h-7 rounded-lg hover:bg-rose-100 flex items-center justify-center text-muted-foreground hover:text-rose-500 transition-colors flex-shrink-0"
                      title="Keluarkan dari kelas"
                    >
                      {removing === enr.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}