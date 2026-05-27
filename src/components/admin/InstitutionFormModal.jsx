import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function InstitutionFormModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({
    institution_name: item?.institution_name || '',
    institution_code: item?.institution_code || '',
    address: item?.address || '',
    email_domain: item?.email_domain || '',
    is_active: item?.is_active ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.institution_name || !form.institution_code) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-semibold font-montserrat">{item ? 'Edit Institusi' : 'Tambah Institusi'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Nama Institusi *</label>
            <Input value={form.institution_name} onChange={e => setForm({ ...form, institution_name: e.target.value })} placeholder="Universitas..." required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Kode Institusi *</label>
            <Input value={form.institution_code} onChange={e => setForm({ ...form, institution_code: e.target.value.toUpperCase() })} placeholder="UHO" required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Alamat</label>
            <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Jl. ..." />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Domain Email</label>
            <Input value={form.email_domain} onChange={e => setForm({ ...form, email_domain: e.target.value })} placeholder="uho.ac.id" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
            <label htmlFor="is_active" className="text-sm text-foreground">Aktif</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" className="flex-1">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
}