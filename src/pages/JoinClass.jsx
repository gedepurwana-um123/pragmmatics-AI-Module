import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Key, BookOpen, Users, CheckCircle, AlertCircle, Search, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { localUser } from '@/lib/localUser';

export default function JoinClass() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [myClasses, setMyClasses] = useState([]);
  const currentUser = localUser.get();

  useEffect(() => { loadMyClasses(); }, []);

  const loadMyClasses = async () => {
    const enrollments = await base44.entities.Enrollment.filter({ student_email: currentUser?.email });
    setMyClasses(enrollments);
  };

  const handleJoin = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    const classes = await base44.entities.Class.filter({ class_code: code.trim().toUpperCase() });
    if (classes.length === 0) {
      setError('Kode kelas tidak ditemukan. Pastikan kode yang Anda masukkan benar.');
      setLoading(false);
      return;
    }

    const cls = classes[0];

    // Cek sudah terdaftar
    const existing = await base44.entities.Enrollment.filter({
      class_id: cls.id,
      student_email: currentUser?.email,
    });

    if (existing.length > 0) {
      setError('Anda sudah terdaftar di kelas ini.');
      setLoading(false);
      return;
    }

    // Ambil info kursus
    const courses = await base44.entities.Course.filter({ id: cls.course_id });
    const course = courses[0];

    // Daftar ke kelas
    await base44.entities.Enrollment.create({
      class_id: cls.id,
      student_email: currentUser?.email,
      lecturer_email: cls.lecturer_email,
      course_id: cls.course_id,
      institution_id: cls.institution_id,
      status: 'active',
      joined_at: new Date().toISOString(),
      total_ai_interactions: 0,
      total_reflections: 0,
      completion_percentage: 0,
    });

    // Update jumlah mahasiswa di kelas
    await base44.entities.Class.update(cls.id, {
      enrolled_count: (cls.enrolled_count || 0) + 1,
    });

    setResult({ class: cls, course });
    loadMyClasses();
    setCode('');
    setLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-montserrat flex items-center gap-2">
          <Key className="w-6 h-6 text-indigo-500" />
          Bergabung ke Kelas
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Masukkan kode kelas yang diberikan oleh dosen Anda</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Join */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold font-montserrat">Masukkan Kode Kelas</h2>
              <p className="text-xs text-muted-foreground">Kode terdiri dari 6 karakter huruf/angka</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Contoh: ABC123"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              className="text-center text-xl font-bold tracking-widest h-14 font-montserrat"
              maxLength={6}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
            />

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {result && (
              <div className="flex items-start gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-800 text-sm">Berhasil bergabung!</p>
                  <p className="text-emerald-700 text-xs mt-0.5">{result.class.class_name}</p>
                  {result.course && <p className="text-emerald-600 text-xs">{result.course.course_name}</p>}
                </div>
              </div>
            )}

            <Button onClick={handleJoin} disabled={loading || code.length < 4} className="w-full h-12 text-base font-semibold">
              {loading ? 'Mencari kelas...' : 'Bergabung ke Kelas'}
            </Button>
          </div>
        </motion.div>

        {/* Kelas saya */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-border shadow-sm p-6"
        >
          <h2 className="font-semibold font-montserrat flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            Kelas Saya ({myClasses.length})
          </h2>

          {myClasses.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Belum bergabung ke kelas manapun</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myClasses.map((enr, i) => (
                <div key={enr.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Kelas ID: {enr.class_id.slice(-8)}</p>
                    <p className="text-xs text-muted-foreground">Bergabung: {new Date(enr.joined_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${enr.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
                    {enr.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}