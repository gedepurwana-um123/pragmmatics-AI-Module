import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Shield, Globe, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

/**
 * Real-time Toxicity Alert System
 * Monitors text input and alerts when toxicity risk is detected before sending.
 * Use: <ToxicityAlert text={inputText} onDismiss={() => {}} />
 */
export default function ToxicityAlert({ text, onAlert, threshold = 50 }) {
  const [alert, setAlert] = useState(null);
  const [checking, setChecking] = useState(false);
  const debounceRef = useRef(null);
  const lastChecked = useRef('');

  useEffect(() => {
    if (!text || text.length < 20 || text === lastChecked.current) return;

    // Debounce: wait 1.5s after user stops typing
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (text === lastChecked.current) return;
      lastChecked.current = text;
      setChecking(true);

      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Analisis cepat teks ini untuk deteksi toxicity dan risiko komunikasi digital:
"${text}"
Berikan JSON dengan: toxicity_score (0-100), politeness_score (0-100), risk_level (rendah/sedang/tinggi/sangat_tinggi), warning_message (pesan peringatan singkat dalam bahasa Indonesia jika berisiko), cultural_note (catatan kearifan budaya jika ada, singkat).`,
        response_json_schema: {
          type: 'object',
          properties: {
            toxicity_score: { type: 'number' },
            politeness_score: { type: 'number' },
            risk_level: { type: 'string' },
            warning_message: { type: 'string' },
            cultural_note: { type: 'string' },
          }
        }
      }).catch(() => null);

      setChecking(false);
      if (!res) return;

      if (res.toxicity_score >= threshold) {
        setAlert(res);
        onAlert?.(res);
      } else {
        setAlert(null);
      }
    }, 1500);

    return () => clearTimeout(debounceRef.current);
  }, [text, threshold]);

  return (
    <>
      {/* Checking indicator */}
      {checking && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Memeriksa keamanan teks...</span>
        </div>
      )}

      {/* Alert banner */}
      <AnimatePresence>
        {alert && !checking && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className={`mt-2 rounded-xl border p-3 ${
              alert.risk_level === 'sangat_tinggi' || alert.toxicity_score > 75
                ? 'bg-rose-50 border-rose-300'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${alert.toxicity_score > 75 ? 'text-rose-500' : 'text-amber-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-xs font-bold ${alert.toxicity_score > 75 ? 'text-rose-700' : 'text-amber-700'}`}>
                    ⚠️ Peringatan Komunikasi — Risiko {alert.risk_level?.replace('_', ' ').toUpperCase()}
                  </p>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${alert.toxicity_score > 75 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    Toxicity: {alert.toxicity_score}%
                  </span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">{alert.warning_message}</p>
                {alert.cultural_note && (
                  <div className="flex items-start gap-1.5 mt-1.5">
                    <Globe className="w-3 h-3 text-violet-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-violet-700">{alert.cultural_note}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-24 h-1.5 bg-white/60 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${alert.toxicity_score > 75 ? 'bg-rose-500' : 'bg-amber-500'}`}
                      style={{ width: `${alert.toxicity_score}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">Pertimbangkan untuk merevisi pesan Anda.</span>
                </div>
              </div>
              <button onClick={() => setAlert(null)} className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}