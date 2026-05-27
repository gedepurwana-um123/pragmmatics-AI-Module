import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Building2, Plus, Edit2, Trash2, Search, Users, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InstitutionFormModal from '@/components/admin/InstitutionFormModal';
import FacultyManager from '@/components/admin/FacultyManager';
import StudyProgramManager from '@/components/admin/StudyProgramManager';

export default function InstitutionSetup() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('institutions');

  useEffect(() => { loadInstitutions(); }, []);

  const loadInstitutions = async () => {
    setLoading(true);
    const data = await base44.entities.Institution.list('-created_date');
    setInstitutions(data);
    setLoading(false);
  };

  const handleSave = async (data) => {
    if (editItem) {
      await base44.entities.Institution.update(editItem.id, data);
    } else {
      await base44.entities.Institution.create(data);
    }
    setShowForm(false);
    setEditItem(null);
    loadInstitutions();
  };

  const handleDelete = async (id) => {
    if (confirm('Hapus institusi ini?')) {
      await base44.entities.Institution.delete(id);
      loadInstitutions();
    }
  };

  const filtered = institutions.filter(i =>
    i.institution_name?.toLowerCase().includes(search.toLowerCase()) ||
    i.institution_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-montserrat flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-500" />
          Manajemen Institusi
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola universitas, fakultas, dan program studi</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: 'institutions', label: 'Institusi', icon: Building2 },
          { id: 'faculties', label: 'Fakultas', icon: BookOpen },
          { id: 'programs', label: 'Program Studi', icon: GraduationCap },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'institutions' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari institusi..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Button onClick={() => { setEditItem(null); setShowForm(true); }} className="gap-2">
              <Plus className="w-4 h-4" /> Tambah Institusi
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Memuat...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((inst, i) => (
                <motion.div key={inst.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer ${selected?.id === inst.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
                  onClick={() => setSelected(inst)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={e => { e.stopPropagation(); setEditItem(inst); setShowForm(true); }}
                        className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleDelete(inst.id); }}
                        className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-muted-foreground hover:text-rose-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm font-montserrat">{inst.institution_name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{inst.institution_code}</p>
                  {inst.address && <p className="text-xs text-muted-foreground mt-1 truncate">{inst.address}</p>}
                  <div className="mt-3 flex items-center gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inst.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
                      {inst.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'faculties' && <FacultyManager institutions={institutions} />}
      {activeTab === 'programs' && <StudyProgramManager institutions={institutions} />}

      {showForm && (
        <InstitutionFormModal
          item={editItem}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditItem(null); }}
        />
      )}
    </div>
  );
}