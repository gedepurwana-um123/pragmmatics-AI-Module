import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Database, RefreshCw, Search, Activity, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SEVERITY_STYLE = {
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-rose-50 text-rose-700 border-rose-200',
  critical: 'bg-red-100 text-red-800 border-red-300',
};
const SEVERITY_ICON = {
  info: Info, warning: AlertTriangle, error: AlertTriangle, critical: AlertTriangle,
};

export default function AdminSystemLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.SystemLog.list('-created_date', 100).catch(() => []);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = logs.filter(l => {
    const matchSearch = !search || JSON.stringify(l).toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || l.severity === filter || l.category === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    total: logs.length,
    error: logs.filter(l => l.severity === 'error' || l.severity === 'critical').length,
    warning: logs.filter(l => l.severity === 'warning').length,
    info: logs.filter(l => l.severity === 'info').length,
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Log', value: counts.total, icon: Database, color: 'from-indigo-500 to-violet-600' },
          { label: 'Info', value: counts.info, icon: Info, color: 'from-blue-500 to-cyan-600' },
          { label: 'Warning', value: counts.warning, icon: AlertTriangle, color: 'from-amber-500 to-orange-600' },
          { label: 'Error/Critical', value: counts.error, icon: AlertTriangle, color: 'from-rose-500 to-red-600' },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-border shadow-sm">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-2`}>
              <c.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold font-montserrat">{c.value}</p>
            <p className="text-[10px] text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'info', 'warning', 'error', 'auth', 'ai_interaction', 'admin'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${filter === f ? 'bg-indigo-100 text-indigo-700' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                {f === 'all' ? 'Semua' : f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari log..." className="pl-8 h-8 text-xs w-44" />
            </div>
            <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={load}>
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Memuat system logs...</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="text-sm">Tidak ada log ditemukan</p>
          </div>
        ) : (
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {filtered.slice(0, 80).map((log, i) => {
              const Icon = SEVERITY_ICON[log.severity] || Info;
              return (
                <div key={i} className="px-4 py-3 hover:bg-secondary/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center border ${SEVERITY_STYLE[log.severity] || 'bg-secondary'}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-xs font-semibold text-foreground">{log.action}</span>
                        {log.category && (
                          <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">{log.category}</span>
                        )}
                        {log.status && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${log.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{log.status}</span>
                        )}
                      </div>
                      {log.details && <p className="text-[10px] text-muted-foreground line-clamp-1">{log.details}</p>}
                      <div className="flex gap-3 mt-0.5">
                        {log.user_email && <span className="text-[10px] text-muted-foreground/70">{log.user_email}</span>}
                        <span className="text-[10px] text-muted-foreground/50">
                          {log.created_date ? new Date(log.created_date).toLocaleString('id-ID') : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}