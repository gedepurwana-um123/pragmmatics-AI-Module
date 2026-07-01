import React from 'react';
import { List, X } from 'lucide-react';

export default function GuideTableOfContents({ sections, activeId, onJump, role }) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="hidden xl:block sticky top-4 self-start w-[200px] flex-shrink-0">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-3">
        <div className="flex items-center gap-2 mb-2 px-1">
          <List className="w-4 h-4 text-primary" />
          <p className="text-[11px] font-bold text-foreground uppercase tracking-wide">Daftar Isi</p>
        </div>
        <div className="space-y-0.5 max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
          <button
            onClick={() => onJump('quick-start')}
            className={`w-full text-left text-[11px] px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
              activeId === 'quick-start'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <span className="text-[9px] font-bold opacity-50">★</span>
            Mulai Cepat
          </button>
          {sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => onJump(section.id)}
              className={`w-full text-left text-[11px] px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                activeId === section.id
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <span className="text-[9px] font-bold opacity-50">{String(idx + 1).padStart(2, '0')}</span>
              <span className="truncate">{section.title}</span>
            </button>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground text-center">
            {sections.length} modul · {role === 'dosen' ? 'Dosen' : 'Mahasiswa'}
          </p>
        </div>
      </div>
    </div>
  );
}