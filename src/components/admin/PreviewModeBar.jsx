import React from 'react';
import { Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PreviewModeBar({ previewRole, onExit }) {
  if (!previewRole) return null;
  const label = previewRole === 'mahasiswa' ? 'Mahasiswa' : 'Dosen';
  const color = previewRole === 'mahasiswa' ? 'bg-indigo-600' : 'bg-cyan-600';
  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] ${color} text-white flex items-center justify-between px-4 py-2 shadow-lg`}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Eye className="w-4 h-4" />
        Mode Preview — Tampilan sebagai <span className="uppercase font-bold">{label}</span>
      </div>
      <Button size="sm" variant="ghost" onClick={onExit} className="text-white hover:bg-white/20 gap-1.5 h-7 text-xs">
        <X className="w-3.5 h-3.5" /> Keluar Preview
      </Button>
    </div>
  );
}