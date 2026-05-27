import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Users, Key, Copy, BarChart3, Mail, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClassDetailPanel({ classData, onClose }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Enrollment.filter({ class_id: classData.id }).then(e => {
      setEnrollments(e);
      setLoading(false);
    });
  }, [classData.id]);

  const copyCode = () => navigator.clipboard.writeText(classData.class_code);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:rounded-2xl sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
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

          {/* Daftar mahasiswa */}
          <div>
            <h3 className="font-semibold font-montserrat text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" /> Daftar Mahasiswa
            </h3>
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-6">Memuat...</p>
            ) : enrollments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Belum ada mahasiswa yang bergabung</p>
            ) : (
              <div className="space-y-2">
                {enrollments.map((enr, i) => (
                  <div key={enr.id} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{enr.student_email}</p>
                      <p className="text-xs text-muted-foreground">
                        Bergabung: {enr.joined_at ? new Date(enr.joined_at).toLocaleDateString('id-ID') : '-'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-indigo-600">{enr.completion_percentage || 0}%</p>
                      <p className="text-[10px] text-muted-foreground">Selesai</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${enr.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
                      {enr.status}
                    </span>
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