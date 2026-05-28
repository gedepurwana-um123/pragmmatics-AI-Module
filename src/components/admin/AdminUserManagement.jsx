import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Users, Search, RefreshCw, GraduationCap, BookOpen, Building2, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SUBTABS = [
  { key: 'users', label: 'Pengguna', icon: Users, entity: 'User' },
  { key: 'enrollments', label: 'Enrollment', icon: GraduationCap, entity: 'Enrollment' },
  { key: 'classes', label: 'Kelas', icon: BookOpen, entity: 'Class' },
  { key: 'institutions', label: 'Institusi', icon: Building2, entity: 'Institution' },
  { key: 'lecturers', label: 'Profil Dosen', icon: UserCheck, entity: 'LecturerProfile' },
];

const ENTITY_COLS = {
  User: ['id', 'full_name', 'email', 'role', 'created_date'],
  Enrollment: ['student_email', 'class_id', 'status', 'level', 'xp_points', 'completion_percentage', 'streak_days'],
  Class: ['class_name', 'class_code', 'lecturer_email', 'semester', 'academic_year', 'enrolled_count', 'is_active'],
  Institution: ['institution_name', 'institution_code', 'address', 'email_domain', 'is_active'],
  LecturerProfile: ['full_name', 'user_email', 'academic_title', 'specialization', 'lecturer_code', 'total_classes', 'total_students'],
};

export default function AdminUserManagement() {
  const [sub, setSub] = useState('users');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [search, setSearch] = useState('');

  const loadData = async (key) => {
    const tab = SUBTABS.find(t => t.key === key);
    if (!tab) return;
    setLoading(p => ({ ...p, [key]: true }));
    const rows = await base44.entities[tab.entity].list('-created_date', 100).catch(() => []);
    setData(p => ({ ...p, [key]: rows }));
    setLoading(p => ({ ...p, [key]: false }));
  };

  useEffect(() => { loadData('users'); }, []);

  const handleSub = (key) => {
    setSub(key);
    setSearch('');
    if (!data[key]) loadData(key);
  };

  const tab = SUBTABS.find(t => t.key === sub);
  const cols = ENTITY_COLS[tab?.entity] || [];
  const rows = (data[sub] || []).filter(r => !search || JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      {/* Sub tabs */}
      <div className="flex gap-1.5 flex-wrap bg-secondary/40 rounded-xl p-1.5">
        {SUBTABS.map(t => (
          <button key={t.key} onClick={() => handleSub(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sub === t.key ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center justify-between">
          <h3 className="font-semibold font-montserrat text-sm">{tab?.label} — {rows.length} record</h3>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari..." className="pl-8 h-8 text-xs w-44" />
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => loadData(sub)}>
              <RefreshCw className="w-3 h-3" />Refresh
            </Button>
          </div>
        </div>

        {loading[sub] ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Memuat data...</div>
        ) : rows.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Tidak ada data</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  {cols.map(c => (
                    <th key={c} className="text-left px-4 py-2.5 font-semibold text-muted-foreground whitespace-nowrap">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 60).map((row, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-secondary/10 transition-colors">
                    {cols.map(c => (
                      <td key={c} className="px-4 py-2.5 text-foreground/80 max-w-[180px] truncate">
                        {typeof row[c] === 'boolean' ? (row[c] ? '✓ Ya' : '✗ Tidak') : String(row[c] ?? '—').substring(0, 60)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}