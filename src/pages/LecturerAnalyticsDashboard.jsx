import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Users, BarChart3, TrendingUp, Brain, Shield, AlertTriangle,
  BookOpen, Download, RefreshCw, Eye, Filter, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from 'recharts';
import { localUser } from '@/lib/localUser';
import StudentAnalyticsTable from '@/components/lecturer/StudentAnalyticsTable';
import ClassSelector from '@/components/lecturer/ClassSelector';
import LecturerNotificationPanel from '@/components/lecturer/LecturerNotificationPanel';

const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 12px', fontSize: 12 };

export default function LecturerAnalyticsDashboard() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = localUser.get();

  useEffect(() => { loadClasses(); }, []);
  useEffect(() => { if (selectedClass) loadClassData(); }, [selectedClass]);

  const loadClasses = async () => {
    const cls = await base44.entities.Class.filter({ lecturer_email: currentUser?.email });
    setClasses(cls);
    if (cls.length > 0) setSelectedClass(cls[0]);
    setLoading(false);
  };

  const loadClassData = async () => {
    if (!selectedClass) return;
    const [enr, sc] = await Promise.all([
      base44.entities.Enrollment.filter({ class_id: selectedClass.id }),
      base44.entities.PragmaticScore.filter({ class_id: selectedClass.id }),
    ]);
    setEnrollments(enr);
    setScores(sc);
  };

  // Aggregate stats
  const avgPragmatic = enrollments.length > 0
    ? Math.round(enrollments.reduce((a, e) => a + (e.final_pragmatic_score || 0), 0) / enrollments.length)
    : 0;
  const avgPoliteness = enrollments.length > 0
    ? Math.round(enrollments.reduce((a, e) => a + (e.final_politeness_score || 75), 0) / enrollments.length)
    : 0;
  const avgToxicity = enrollments.length > 0
    ? Math.round(enrollments.reduce((a, e) => a + (e.final_toxicity_score || 20), 0) / enrollments.length)
    : 0;
  const totalInteractions = enrollments.reduce((a, e) => a + (e.total_ai_interactions || 0), 0);

  // Chart data dari scores
  const trendData = scores.slice(-7).map((s, i) => ({
    date: new Date(s.date || s.created_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    pragmatik: s.pragmatic_competence || 0,
    kesantunan: s.politeness_score || 0,
    toxicity: s.toxicity_score || 0,
  }));

  const radarData = [
    { subject: 'Pragmatik', value: avgPragmatic || 75 },
    { subject: 'Kesantunan', value: avgPoliteness || 80 },
    { subject: 'Sensitivitas', value: 72 },
    { subject: 'Etika', value: 85 },
    { subject: 'Empati', value: 78 },
    { subject: 'Refleksi', value: enrollments.reduce((a, e) => a + (e.total_reflections || 0), 0) > 0 ? 80 : 50 },
  ];

  const downloadStudentPDF = async (studentEmail) => {
    const res = await base44.functions.invoke('generateStudentReport', {
      student_email: studentEmail,
      class_id: selectedClass?.id,
    });
    // res.data is parsed JSON - we need to trigger download differently
    // Re-fetch as blob via fetch directly
    const token = await base44.auth.getToken?.().catch(() => null);
    const fetchRes = await fetch('/api/functions/generateStudentReport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ student_email: studentEmail, class_id: selectedClass?.id }),
    });
    if (fetchRes.ok) {
      const blob = await fetchRes.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan_${studentEmail.split('@')[0]}.pdf`;
      a.click();
    }
  };

  const exportCSV = () => {
    const headers = ['Email', 'Skor Pragmatik', 'Kesantunan', 'Toxicity', 'Interaksi AI', 'Refleksi', 'Status'];
    const rows = enrollments.map(e => [
      e.student_email,
      e.final_pragmatic_score || 0,
      e.final_politeness_score || 0,
      e.final_toxicity_score || 0,
      e.total_ai_interactions || 0,
      e.total_reflections || 0,
      e.status,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analitik_kelas_${selectedClass?.class_code || 'export'}.csv`;
    a.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-montserrat flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            Dashboard Analitik Dosen
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Pantau perkembangan pragmatik & komunikasi mahasiswa secara real-time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadClassData} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <Button size="sm" onClick={exportCSV} className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Class Selector */}
      <ClassSelector classes={classes} selected={selectedClass} onSelect={setSelectedClass} />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Mahasiswa', value: enrollments.length, color: 'from-indigo-500 to-violet-600' },
          { icon: Brain, label: 'Rata-rata Pragmatik', value: `${avgPragmatic}%`, color: 'from-emerald-500 to-teal-600' },
          { icon: Shield, label: 'Rata-rata Kesantunan', value: `${avgPoliteness}%`, color: 'from-cyan-500 to-blue-600' },
          { icon: AlertTriangle, label: 'Rata-rata Toxicity', value: `${avgToxicity}%`, color: 'from-amber-500 to-orange-600' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold font-montserrat">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold font-montserrat mb-1">Tren Perkembangan Kelas</h3>
          <p className="text-xs text-muted-foreground mb-4">Pragmatik, kesantunan, dan toxicity mahasiswa</p>
          {trendData.length > 0 ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} /><stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gK" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="pragmatik" stroke="#4F46E5" fill="url(#gP)" strokeWidth={2} name="Pragmatik" />
                  <Area type="monotone" dataKey="kesantunan" stroke="#10B981" fill="url(#gK)" strokeWidth={2} name="Kesantunan" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
              Belum ada data skor untuk kelas ini
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-border shadow-sm"
        >
          <h3 className="font-semibold font-montserrat mb-2">Profil Kompetensi Kelas</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(0,0,0,0.07)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar name="Kelas" dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Notification Panel + Student Table */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2">
          <StudentAnalyticsTable enrollments={enrollments} onDownloadPDF={downloadStudentPDF} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <LecturerNotificationPanel classIds={classes.map(c => c.id)} />
        </motion.div>
      </div>
    </div>
  );
}