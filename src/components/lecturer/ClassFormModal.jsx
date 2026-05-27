import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ClassFormModal({ item, courses, onSave, onClose }) {
  const [form, setForm] = useState({
    course_id: item?.course_id || '',
    class_name: item?.class_name || '',
    semester: item?.semester || 'Ganjil 2024/2025',
    academic_year: item?.academic_year || '2024/2025',
    max_students: item?.max_students || 40,
    schedule: item?.schedule || '',
    room: item?.room || '',
    description: item?.description || '',
    is_active: item?.is_active ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.class_name || !form.course_id) return;
    onSave(form);
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
            <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} className="w-full border border-input rounded-lg px-3 py-2 text-sm" required>
              <option value="">-- Pilih Mata Kuliah --</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>)}
            </select>
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
            <Button type="submit" className="flex-1">{item ? 'Simpan Perubahan' : 'Buat Kelas'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}