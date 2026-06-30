import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lightbulb, CheckCircle2 } from 'lucide-react';

const iconMap = {
  Globe: '🌐', LayoutDashboard: '📊', Key: '🔑', BookOpen: '📚',
  Bot: '🤖', FlaskConical: '🧪', Mic: '🎤', PenLine: '✍️',
  Database: '🗄️', Swords: '⚔️', Hash: '💬', Users: '👥',
  TrendingUp: '📈', Award: '🏆', Bell: '🔔', BookMarked: '📑',
  BarChart3: '📊', Building2: '🏛️', Shield: '🛡️', FileText: '📄',
};

export default function GuideSection({ section, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-secondary/40 transition-colors"
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0`}>
          <span className="text-base">{iconMap[section.icon] || '📌'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground/60">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="font-bold font-montserrat text-sm text-foreground">{section.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{section.description}</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Steps */}
              <div className="space-y-2.5">
                {section.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex gap-3 p-3 bg-secondary/30 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-[11px] font-bold">
                      {sIdx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              {section.tips && section.tips.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Tips Praktis</p>
                  </div>
                  <ul className="space-y-1.5">
                    {section.tips.map((tip, tIdx) => (
                      <li key={tIdx} className="flex gap-2 text-xs text-amber-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}