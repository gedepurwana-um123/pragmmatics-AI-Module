import React from 'react';
import { motion } from 'framer-motion';
import { Users, Brain, TrendingUp, BarChart3, BookOpen, AlertTriangle, Shield, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

const students = [
  { name: 'Ahmad Fauzi', pragmatik: 92, kesantunan: 88, toxicity: 8, status: 'Sangat Baik' },
  { name: 'Siti Nurhaliza', pragmatik: 85, kesantunan: 90, toxicity: 12, status: 'Baik' },
  { name: 'Budi Santoso', pragmatik: 68, kesantunan: 65, toxicity: 35, status: 'Cukup' },
  { name: 'Dewi Lestari', pragmatik: 78, kesantunan: 82, toxicity: 20, status: 'Baik' },
  { name: 'Raka Pratama', pragmatik: 55, kesantunan: 52, toxicity: 48, status: 'Perlu Bimbingan' },
];

const statusColors = { 'Sangat Baik': 'text-emerald-400', 'Baik': 'text-indigo-400', 'Cukup': 'text-amber-400', 'Perlu Bimbingan': 'text-rose-400' };
const tooltipStyle = { backgroundColor: 'hsl(222 47% 14%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 12px' };

export default function LecturerDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold font-space">Dashboard Dosen</h1>
        <p className="text-muted-foreground mt-1">Pantau perkembangan mahasiswa dan analisis komunikasi kelas.</p>
      </motion.div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Mahasiswa', value: '128', color: 'from-indigo-500 to-purple-600' },
          { icon: Brain, label: 'Rata-rata Pragmatik', value: '76%', color: 'from-cyan-500 to-blue-600' },
          { icon: Shield, label: 'Rata-rata Kesantunan', value: '79%', color: 'from-emerald-500 to-teal-600' },
          { icon: AlertTriangle, label: 'Risiko Toxicity', value: '25%', color: 'from-amber-500 to-orange-600' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-light rounded-2xl p-5"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold font-space">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Class performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-light rounded-2xl p-6"
        >
          <h3 className="font-semibold font-space mb-4">Performa per Kelas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="pragmatik" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Pragmatik" />
                <Bar dataKey="kesantunan" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Kesantunan" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Competency distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-light rounded-2xl p-6"
        >
          <h3 className="font-semibold font-space mb-4">Distribusi Kompetensi</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={competencyDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                  {competencyDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {competencyDist.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Student table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-light rounded-2xl p-6"
      >
        <h3 className="font-semibold font-space mb-4">Daftar Mahasiswa</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20 text-left">
                <th className="pb-3 text-muted-foreground font-medium text-xs">Nama</th>
                <th className="pb-3 text-muted-foreground font-medium text-xs">Pragmatik</th>
                <th className="pb-3 text-muted-foreground font-medium text-xs">Kesantunan</th>
                <th className="pb-3 text-muted-foreground font-medium text-xs">Toxicity</th>
                <th className="pb-3 text-muted-foreground font-medium text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="border-b border-border/10 hover:bg-background/30 transition-colors">
                  <td className="py-3 font-medium">{s.name}</td>
                  <td className="py-3">{s.pragmatik}%</td>
                  <td className="py-3">{s.kesantunan}%</td>
                  <td className="py-3"><span className={s.toxicity > 30 ? 'text-rose-400' : 'text-emerald-400'}>{s.toxicity}%</span></td>
                  <td className="py-3"><span className={`font-medium ${statusColors[s.status]}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}