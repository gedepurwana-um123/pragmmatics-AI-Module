import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

// Daftar mata kuliah bawaan (fallback jika DB kosong)
const DEFAULT_COURSES = [
  { id: '__pragmatik_digital', course_name: 'Pragmatik Digital', course_code: 'PGD101' },
  { id: '__pragmatik_bahasa', course_name: 'Pragmatik Bahasa Indonesia', course_code: 'PBI201' },
  { id: '__etika_komunikasi', course_name: 'Etika Komunikasi Digital', course_code: 'EKD301' },
  { id: '__sosiolinguistik', course_name: 'Sosiolinguistik', course_code: 'SLG201' },
  { id: '__analisis_wacana', course_name: 'Analisis Wacana Digital', course_code: 'AWD302' },
  { id: '__komunikasi_antarbudaya', course_name: 'Komunikasi Antarbudaya', course_code: 'KAB202' },
  { id: '__semiotika', course_name: 'Semiotika Komunikasi', course_code: 'SEM301' },
  { id: '__linguistik_terapan', course_name: 'Linguistik Terapan', course_code: 'LGT401' },
];

export default function ClassFormModal({ item, courses, onSave, onClose }) {
  // Gabung: courses dari DB + default (hindari duplikat nama)
  const dbNames = courses.map(c => c.course_name.toLowerCase());
  const extraDefaults = DEFAULT_COURSES.filter(d => !dbNames.includes(d.course_name.toLowerCase()));
  const allCourses = [...courses, ...extraDefaults];

  const [form, setForm] = useState({
    course_id: item?.course_id || '',
    course_name_custom: '', // untuk kasus pilih default
    class_name: item?.class_name || '',
    semester: item?.semester || 'Ganjil 2024/2025',
    academic_year: item?.academic_year || '2024/2025',
    max_students: item?.max_students || 40,
    schedule: item?.schedule || '',
    room: item?.room || '',
    description: item?.description || '',
    is_active: item?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.class_name || !form.course_id) return;
    setSaving(true);

    let finalCourseId = form.course_id;

    // Jika pilih mata kuliah default (bukan dari DB), buat dulu di DB
    if (form.course_id.startsWith('__')) {
      const chosen = DEFAULT_COURSES.find(d => d.id === form.course_id);
      try {
        const u = await base44.auth.me();
        const created = await base44.entities.Course.create({
          course_name: chosen.course_name,
          course_code: chosen.course_code,
          lecturer_id: u.email,
          credits: 3,
          semester: form.semester,
          academic_year: form.academic_year,
          is_active: true,
        });
        finalCourseId = created.id;
      } catch (err) {
        // jika gagal, tetap pakai id placeholder — kelas tetap bisa dibuat
        finalCourseId = form.course_id;
      }
    }

    setSaving(false);
    onSave({ ...form, course_id: finalCourseId });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white">
          <h2 className="font-semibold font-montserrat">{item ? 'Edit Kelas' : 'Buat Kelas Baru'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Mata Kuliah *</label>
            <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white" required>
              <option value="">-- Pilih Mata Kuliah --</option>
              {courses.length > 0 && (
                <optgroup label="Mata Kuliah Saya">
                  {courses.map(c => <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>)}
                </optgroup>
              )}
              <optgroup label="Mata Kuliah Pragmatik & Komunikasi">
                {extraDefaults.map(c => <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>)}
              </optgroup>
            </select>
            <p className="text-[10px] text-muted-foreground mt-1">Jika memilih dari daftar standar, mata kuliah akan otomatis dibuat.</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Nama Kelas *</label>
            <Input value={form.class_name} onChange={e => setForm({ ...form, class_name: e.target.value })} placeholder="Kelas A / Kelas Reguler" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Semester</label>
              <Input value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} placeholder="Ganjil 2024/2025" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tahun Ajaran</label>
              <Input value={form.academic_year} onChange={e => setForm({ ...form, academic_year: e.target.value })} placeholder="2024/2025" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Jadwal</label>
              <Input value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} placeholder="Senin 08:00-10:00" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Ruangan</label>
              <Input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="Lab Bahasa 1" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Maks. Mahasiswa</label>
            <Input type="number" value={form.max_students} onChange={e => setForm({ ...form, max_students: parseInt(e.target.value) })} min={1} max={200} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" className="flex-1" disabled={saving}>{saving ? 'Menyimpan...' : item ? 'Simpan Perubahan' : 'Buat Kelas'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}