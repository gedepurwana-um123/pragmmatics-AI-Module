import React from 'react';
import { Shield, AlertTriangle, CheckCircle2, Loader2, Sparkles, Ban } from 'lucide-react';

const LEVELS = {
  'Sangat Santun': { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2, iconColor: 'text-emerald-500' },
  'Santun':        { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2, iconColor: 'text-emerald-500' },
  'Netral':        { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Shield, iconColor: 'text-blue-500' },
  'Kurang Santun': { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500' },
  'Tidak Santun':  { color: 'text-rose-700 bg-rose-50 border-rose-200', icon: AlertTriangle, iconColor: 'text-rose-500' },
};

export default function PolitenessChecker({ checking, result, onApplySuggestion }) {
  if (checking) return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5">
      <Loader2 className="w-3 h-3 animate-spin" />
      <span>Menganalisis kesantunan pesan dengan AI...</span>
    </div>
  );

  if (!result) return null;

  const cfg = LEVELS[result.label] || LEVELS['Netral'];
  const Icon = cfg.icon;
  const isImpolite = result.score < 50;
  const isToxic = result.score < 30;

  return (
    <div className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border text-xs ${cfg.color} ${isToxic ? 'ring-1 ring-rose-300' : ''}`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.iconColor}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {isImpolite && <span className="font-bold uppercase text-[9px] tracking-wide">⚠ Peringatan AI</span>}
          <span className="font-semibold">{result.label}</span>
          <span className="opacity-70">({result.score}/100)</span>
        </div>
        {result.suggestion && (
          <div className="mt-1.5 flex items-start gap-1.5">
            <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" />
            <p className="flex-1 opacity-90">{result.suggestion}</p>
          </div>
        )}
        {isImpolite && result.suggestion && onApplySuggestion && (
          <button
            onClick={onApplySuggestion}
            className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-white bg-amber-500 hover:bg-amber-600 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Gunakan Saran AI
          </button>
        )}
        {isToxic && !result.suggestion && (
          <p className="mt-1 font-medium text-rose-700 flex items-center gap-1">
            <Ban className="w-3 h-3" />
            Pesan ini terdeteksi mengandung bahasa tidak santun. Mohon revisi sebelum mengirim.
          </p>
        )}
      </div>
    </div>
  );
}