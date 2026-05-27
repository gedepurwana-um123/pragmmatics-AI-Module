import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function FacultyManager({ institutions }) {
  const [faculties, setFaculties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ institution_id: '', faculty_name: '', faculty_code: '', dean_name: '' });

  useEffect(() => { loadFaculties(); }, []);

  const loadFaculties = async () => {
    const data = await base44.entities.Faculty.list('-created_date');
    setFaculties(data);
  };

  const getInstitutionName = (id) => institutions.find(i => i.id === id)?.institution_name || id;

  const handleSave = async (e) => {
    e.preventDefault();
    if (editItem) {
      await base44.entities.Faculty.update(editItem.id, form);
    } else {
      await base44.entities.Faculty.create(form);
    }
    setShowForm(false);
    setEditItem(null);
    setForm({ institution_id: '', faculty_name: '', faculty_code: '', dean_name: '' });
    loadFaculties();
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ institution_id: item.institution_id, faculty_name: item.faculty_name, faculty_code: item.faculty_code, dean_name: item.dean_name || '' });
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditItem(null); setForm({ institution_id: '', faculty_name: '', faculty_code: '', dean_name: '' }); setShowForm(true); }} className="gap-2" size="sm">
          <Plus className="w-4 h-4" /> Tambah Fakultas
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-border p-5 space-y-3">
          <h3 className="font-semibold font-montserrat text-sm">{editItem ? 'Edit' : 'Tambah'} Fakultas</h3>
          <select value={form.institution_id} onChange={e => setForm({ ...form, institution_id: e.target.value })} className="w-full border border-input rounded-lg px-3 py-2 text-sm" required>
            <option value="">-- Pilih Institusi --</option>
            {institutions.map(i => <option key={i.id} value={i.id}>{i.institution_name}</option>)}
          </select>
          <Input value={form.faculty_name} onChange={e => setForm({ ...form, faculty_name: e.target.value })} placeholder="Nama Fakultas" required />
          <Input value={form.faculty_code} onChange={e => setForm({ ...form, faculty_code: e.target.value.toUpperCase() })} placeholder="Kode Fakultas (FKIP)" required />
          <Input value={form.dean_name} onChange={e => setForm({ ...form, dean_name: e.target.value })} placeholder="Nama Dekan (opsional)" />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Batal</Button>
            <Button type="submit" size="sm">Simpan</Button>
          </div>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculties.map(f => (
          <div key={f.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(f)} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={async () => { if (confirm('Hapus?')) { await base44.entities.Faculty.delete(f.id); loadFaculties(); } }} className="w-7 h-7 rounded-lg hover:bg-rose-50 flex items-center justify-center text-muted-foreground hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <h3 className="font-semibold text-sm font-montserrat mt-2">{f.faculty_name}</h3>
            <p className="text-xs text-muted-foreground">{f.faculty_code}</p>
            <p className="text-xs text-muted-foreground mt-1">{getInstitutionName(f.institution_id)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}