import React from 'react';
import { Shield, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

const LEVELS = {
  'Sangat Santun': { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2, iconColor: 'text-emerald-500' },
  'Santun':        { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2, iconColor: 'text-emerald-500' },
  'Netral':        { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Shield, iconColor: 'text-blue-500' },
  'Kurang Santun': { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertTriangle, iconColor: 'text-amber-500' },
  'Tidak Santun':  { color: 'text-rose-700 bg-rose-50 border-rose-200', icon: AlertTriangle, iconColor: 'text-rose-500' },
};

export default function PolitenessChecker({ checking, result }) {
  if (checking) return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground px-3 py-1.5">
      <Loader2 className="w-3 h-3 animate-spin" />
      <span>Menganalisis kesantunan...</span>
    </div>
  );

  if (!result) return null;

  const cfg = LEVELS[result.label] || LEVELS['Netral'];
  const Icon = cfg.icon;

  return (
    <div className={`flex items-start gap-2 px-3 py-2 rounded-xl border text-xs ${cfg.color}`}>
      <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${cfg.iconColor}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{result.label}</span>
          <span className="opacity-70">({result.score}/100)</span>
        </div>
        {result.suggestion && (
          <p className="mt-0.5 opacity-80">💡 {result.suggestion}</p>
        )}
      </div>
    </div>
  );
}