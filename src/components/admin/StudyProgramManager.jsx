import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Trash2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function StudyProgramManager({ institutions }) {
  const [programs, setPrograms] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ faculty_id: '', institution_id: '', program_name: '', program_code: '', degree_level: 'S1' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [p, f] = await Promise.all([
      base44.entities.StudyProgram.list('-created_date'),
      base44.entities.Faculty.list(),
    ]);
    setPrograms(p);
    setFaculties(f);
  };

  const getFacultyName = (id) => faculties.find(f => f.id === id)?.faculty_name || id;

  const handleSave = async (e) => {
    e.preventDefault();
    if (editItem) {
      await base44.entities.StudyProgram.update(editItem.id, form);
    } else {
      await base44.entities.StudyProgram.create(form);
    }
    setShowForm(false);
    setEditItem(null);
    setForm({ faculty_id: '', institution_id: '', program_name: '', program_code: '', degree_level: 'S1' });
    loadData();
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ faculty_id: item.faculty_id, institution_id: item.institution_id || '', program_name: item.program_name, program_code: item.program_code, degree_level: item.degree_level || 'S1' });
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditItem(null); setForm({ faculty_id: '', institution_id: '', program_name: '', program_code: '', degree_level: 'S1' }); setShowForm(true); }} className="gap-2" size="sm">
          <Plus className="w-4 h-4" /> Tambah Program Studi
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-border p-5 space-y-3">
          <h3 className="font-semibold font-montserrat text-sm">{editItem ? 'Edit' : 'Tambah'} Program Studi</h3>
          <select value={form.faculty_id} onChange={e => setForm({ ...form, faculty_id: e.target.value })} className="w-full border border-input rounded-lg px-3 py-2 text-sm" required>
            <option value="">-- Pilih Fakultas --</option>
            {faculties.map(f => <option key={f.id} value={f.id}>{f.faculty_name}</option>)}
          </select>
          <Input value={form.program_name} onChange={e => setForm({ ...form, program_name: e.target.value })} placeholder="Nama Program Studi" required />
          <Input value={form.program_code} onChange={e => setForm({ ...form, program_code: e.target.value.toUpperCase() })} placeholder="Kode Prodi (PBS)" required />
          <select value={form.degree_level} onChange={e => setForm({ ...form, degree_level: e.target.value })} className="w-full border border-input rounded-lg px-3 py-2 text-sm">
            {['D3', 'S1', 'S2', 'S3'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Batal</Button>
            <Button type="submit" size="sm">Simpan</Button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={async () => { if (confirm('Hapus?')) { await base44.entities.StudyProgram.delete(p.id); loadData(); } }} className="w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-muted-foreground hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <span className="inline-block text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium mt-2">{p.degree_level}</span>
            <h3 className="font-semibold text-sm font-montserrat mt-1">{p.program_name}</h3>
            <p className="text-xs text-muted-foreground">{p.program_code} · {getFacultyName(p.faculty_id)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}