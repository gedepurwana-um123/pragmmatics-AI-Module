import React from 'react';
import { BookOpen, Users, Key } from 'lucide-react';

export default function ClassSelector({ classes, selected, onSelect }) {
  if (classes.length === 0) return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
      Belum ada kelas. Buat kelas terlebih dahulu di menu Manajemen Kelas.
    </div>
  );

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {classes.map(cls => (
        <button key={cls.id} onClick={() => onSelect(cls)}
          className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all ${selected?.id === cls.id ? 'bg-indigo-50 border-indigo-300 shadow-sm' : 'bg-white border-border hover:border-primary/30'}`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${selected?.id === cls.id ? 'bg-indigo-500' : 'bg-secondary'}`}>
            <BookOpen className={`w-4 h-4 ${selected?.id === cls.id ? 'text-white' : 'text-muted-foreground'}`} />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-semibold truncate ${selected?.id === cls.id ? 'text-indigo-700' : 'text-foreground'}`}>{cls.class_name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Key className="w-2.5 h-2.5" />{cls.class_code}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-2.5 h-2.5" />{cls.enrolled_count || 0}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}