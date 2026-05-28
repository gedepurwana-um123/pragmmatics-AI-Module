import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Users, Plus, Copy, BookOpen, Key, BarChart3, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClassFormModal from '@/components/lecturer/ClassFormModal';
import ClassDetailPanel from '@/components/lecturer/ClassDetailPanel';

export default function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u) { setCurrentUser(u); loadData(u.email); }
      else setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const loadData = async (email) => {
    setLoading(true);
    const userEmail = email || currentUser?.email;
    if (!userEmail) { setLoading(false); return; }
    const [cls, crs] = await Promise.all([
      base44.entities.Class.filter({ lecturer_email: userEmail }).catch(() => []),
      base44.entities.Course.filter({ lecturer_id: userEmail }).catch(() => []),
    ]);
    setClasses(cls);
    setCourses(crs);
    setLoading(false);
  };

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSave = async (data) => {
    if (editItem) {
      await base44.entities.Class.update(editItem.id, data);
    } else {
      await base44.entities.Class.create({
        ...data,
        lecturer_email: currentUser?.email,
        class_code: generateCode(),
        enrolled_count: 0,
      });
    }
    setShowForm(false);
    setEditItem(null);
    loadData(currentUser?.email);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  const stats = {
    totalClasses: classes.length,
    totalStudents: classes.reduce((a, c) => a + (c.enrolled_count || 0), 0),
    activeClasses: classes.filter(c => c.is_active).length,
    totalCourses: courses.length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-montserrat flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          Manajemen Kelas
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola kelas, kode akses, dan pantau mahasiswa Anda</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Kelas', value: stats.totalClasses, icon: BookOpen, color: 'from-indigo-500 to-violet-600' },
          { label: 'Total Mahasiswa', value: stats.totalStudents, icon: Users, color: 'from-cyan-500 to-blue-600' },
          { label: 'Kelas Aktif', value: stats.activeClasses, icon: BarChart3, color: 'from-emerald-500 to-teal-600' },
          { label: 'Mata Kuliah', value: stats.totalCourses, icon: BookOpen, color: 'from-amber-500 to-orange-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold font-montserrat">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={() => { setEditItem(null); setShowForm(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Buat Kelas Baru
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Memuat kelas...</div>
      ) : classes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-border">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-muted-foreground">Belum ada kelas</p>
          <p className="text-sm text-muted-foreground mt-1">Buat kelas pertama Anda</p>
          <Button className="mt-4 gap-2" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Buat Kelas
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls, i) => {
            const course = courses.find(c => c.id === cls.course_id);
            return (
              <motion.div key={cls.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold font-montserrat text-sm truncate">{cls.class_name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{course?.course_name || 'Mata kuliah'}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 ${cls.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
                      {cls.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 bg-indigo-50 rounded-xl mb-3">
                    <Key className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <code className="text-sm font-bold text-indigo-700 flex-1">{cls.class_code}</code>
                    <button onClick={() => copyCode(cls.class_code)}
                      className="w-7 h-7 rounded-lg hover:bg-indigo-100 flex items-center justify-center text-indigo-400 hover:text-indigo-600 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{cls.enrolled_count || 0}/{cls.max_students || 40} mahasiswa</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{cls.semester}</span>
                  </div>
                </div>

                <div className="border-t border-border px-5 py-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs gap-1" onClick={() => setSelectedClass(cls)}>
                    <Eye className="w-3.5 h-3.5" /> Detail
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs" onClick={() => { setEditItem(cls); setShowForm(true); }}>
                    Edit
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ClassFormModal
          item={editItem}
          courses={courses}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditItem(null); }}
        />
      )}

      {selectedClass && (
        <ClassDetailPanel
          classData={selectedClass}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
}