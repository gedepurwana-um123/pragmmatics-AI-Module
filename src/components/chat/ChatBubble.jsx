import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

const POLITENESS_DOT = {
  'Sangat Santun': 'bg-emerald-400',
  'Santun': 'bg-emerald-400',
  'Netral': 'bg-blue-400',
  'Kurang Santun': 'bg-amber-400',
  'Tidak Santun': 'bg-rose-500',
};

export default function ChatBubble({ msg, isOwn }) {
  const dot = POLITENESS_DOT[msg.politeness_label] || 'bg-gray-300';
  const time = new Date(msg.created_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''} group`}>
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
        {(msg.sender_name || msg.sender_email || '?').charAt(0).toUpperCase()}
      </div>

      <div className={`max-w-[75%] space-y-0.5 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Name + role */}
        <div className={`flex items-center gap-1.5 text-[10px] text-muted-foreground ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="font-medium">{msg.sender_name || msg.sender_email?.split('@')[0]}</span>
          {msg.sender_role === 'dosen' && (
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700 font-semibold text-[9px]">Dosen</span>
          )}
          <span>{time}</span>
        </div>

        {/* Bubble */}
        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed relative ${
          isOwn
            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-tr-sm'
            : 'bg-white border border-border text-foreground rounded-tl-sm shadow-sm'
        } ${msg.toxicity_flag ? 'opacity-70' : ''}`}>
          {msg.is_deleted ? (
            <span className="italic opacity-50 text-xs">Pesan dihapus</span>
          ) : (
            msg.content
          )}
          {/* Politeness dot */}
          {msg.politeness_label && !msg.is_deleted && (
            <div className={`absolute -bottom-1 ${isOwn ? '-left-1' : '-right-1'} w-2.5 h-2.5 rounded-full border-2 border-white ${dot}`} title={msg.politeness_label} />
          )}
        </div>

        {/* AI warning — shown for ALL messages (including own) when kurang/tidak santun */}
        {msg.ai_suggestion && !msg.is_deleted && (
          <div className={`flex items-start gap-1.5 text-[10px] px-2.5 py-1.5 rounded-xl max-w-xs ${
            msg.politeness_score < 30
              ? 'text-rose-700 bg-rose-50 border border-rose-200'
              : 'text-amber-700 bg-amber-50 border border-amber-200'
          } ${isOwn ? 'self-end' : ''}`}>
            <AlertTriangle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${msg.politeness_score < 30 ? 'text-rose-500' : 'text-amber-500'}`} />
            <div>
              <span className="font-semibold">Peringatan AI: </span>
              <span>{msg.ai_suggestion}</span>
            </div>
          </div>
        )}

        {/* Toxicity flag badge */}
        {msg.toxicity_flag && !msg.is_deleted && (
          <div className={`flex items-center gap-1 text-[9px] font-semibold text-rose-600 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full ${isOwn ? 'self-end' : ''}`}>
            <AlertTriangle className="w-2.5 h-2.5" />
            Pesan Ditandai Toksis
          </div>
        )}
      </div>
    </div>
  );
}