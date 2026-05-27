import React from 'react';
import { motion } from 'framer-motion';
import { Users, Brain, AlertTriangle, Shield, TrendingUp, Activity, BookOpen, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const classData = [
  { name: 'Kelas A', pragmatik: 78, kesantunan: 82, toxicity: 22 },
  { name: 'Kelas B', pragmatik: 72, kesantunan: 75, toxicity: 28 },
  { name: 'Kelas C', pragmatik: 85, kesantunan: 88, toxicity: 15 },
  { name: 'Kelas D', pragmatik: 68, kesantunan: 71, toxicity: 35 },
];

const competencyDist = [
  { name: 'Sangat Baik', value: 25, color: '#10b981' },
  { name: 'Baik', value: 40, color: '#4F46E5' },
  { name: 'Cukup', value: 25, color: '#f59e0b' },
  { name: 'Perlu Bimbingan', value: 10, color: '#ef4444' },
];

const trendData = [
  { week: 'W1', pragmatik: 68, toxicity: 40 },
  { week: 'W2', pragmatik: 71, toxicity: 35 },
  { week: 'W3', pragmatik: 74, toxicity: 30 },
  { week: 'W4', pragmatik: 76, toxicity: 25 },
  { week: 'W5', pragmatik: 79, toxicity: 22 },
  { week: 'W6', pragmatik: 82, toxicity: 18 },
];

const students = [
  { name: 'Ahmad Fauzi', kelas: 'A', pragmatik: 92, kesantunan: 88, toxicity: 8, status: 'Sangat Baik', ai: 45 },
  { name: 'Siti Nurhaliza', kelas: 'C', pragmatik: 85, kesantunan: 90, toxicity: 12, status: 'Baik', ai: 38 },
  { name: 'Budi Santoso', kelas: 'B', pragmatik: 68, kesantunan: 65, toxicity: 35, status: 'Cukup', ai: 22 },
  { name: 'Dewi Lestari', kelas: 'A', pragmatik: 78, kesantunan: 82, toxicity: 20, status: 'Baik', ai: 30 },
  { name: 'Raka Pratama', kelas: 'D', pragmatik: 55, kesantunan: 52, toxicity: 48, status: 'Perlu Bimbingan', ai: 15 },
  { name: 'Ayu Fitria', kelas: 'C', pragmatik: 88, kesantunan: 91, toxicity: 10, status: 'Sangat Baik', ai: 52 },
];

const statusConfig = {
  'Sangat Baik': { text: 'text-emerald-600', bg: 'bg-emerald-100' },
  'Baik': { text: 'text-blue-600', bg: 'bg-blue-100' },
  'Cukup': { text: 'text-amber-600', bg: 'bg-amber-100' },
  'Perlu Bimbingan': { text: 'text-rose-600', bg: 'bg-rose-100' },
};

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '8px 12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

export default function LecturerDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Dosen</h1>
        <p className="text-muted-foreground mt-1 text-sm">Pantau perkembangan mahasiswa dan tren komunikasi kelas secara real-time.</p>
      </motion.div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Mahasiswa', value: '128', sub: '4 kelas aktif', color: 'from-indigo-500 to-purple-600' },
          { icon: Brain, label: 'Rata-rata Pragmatik', value: '76%', sub: '+8% bulan ini', color: 'from-cyan-500 to-blue-600' },
          { icon: Shield, label: 'Rata-rata Kesantunan', value: '79%', sub: '+12% bulan ini', color: 'from-emerald-500 to-teal-600' },
          { icon: AlertTriangle, label: 'Risiko Toxicity', value: '25%', sub: '-15% bulan ini', color: 'from-amber-500 to-orange-600' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold font-montserrat text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Class performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">Performa Kompetensi per Kelas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="pragmatik" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Kompetensi Pragmatik" />
                <Bar dataKey="kesantunan" fill="#10B981" radius={[4, 4, 0, 0]} name="Tingkat Kesantunan" />
                <Bar dataKey="toxicity" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Toxicity %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 justify-center">
            {[['bg-indigo-500','Pragmatik'],['bg-emerald-500','Kesantunan'],['bg-amber-500','Toxicity']].map(([c,l],i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className={`w-3 h-3 rounded ${c}`} />{l}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Competency distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">Distribusi Kompetensi</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={competencyDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={72}>
                  {competencyDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {competencyDist.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-semibold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trend & Student table */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">Tren Pragmatik vs Toxicity</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="ldPragmatik" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ldToxicity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="pragmatik" stroke="#4F46E5" fill="url(#ldPragmatik)" name="Pragmatik" />
                <Area type="monotone" dataKey="toxicity" stroke="#F43F5E" fill="url(#ldToxicity)" name="Toxicity" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold text-foreground mb-4">Daftar Mahasiswa</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Nama', 'Kelas', 'Pragmatik', 'Kesantunan', 'Toxicity', 'Interaksi AI', 'Status'].map(h => (
                    <th key={h} className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const sc = statusConfig[s.status];
                  return (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 font-medium text-foreground pr-4">{s.name}</td>
                      <td className="py-3 text-muted-foreground pr-4">{s.kelas}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${s.pragmatik}%` }} />
                          </div>
                          <span className="text-xs font-medium">{s.pragmatik}%</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4"><span className="text-sm font-medium text-emerald-600">{s.kesantunan}%</span></td>
                      <td className="py-3 pr-4"><span className={`text-sm font-medium ${s.toxicity > 30 ? 'text-rose-600' : 'text-emerald-600'}`}>{s.toxicity}%</span></td>
                      <td className="py-3 pr-4 text-muted-foreground">{s.ai}</td>
                      <td className="py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${sc.bg} ${sc.text}`}>{s.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}