import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { FileText, Download, Loader2, Users, TrendingUp, Brain, Shield, Award, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userRole } from '@/lib/userRole';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import jsPDF from 'jspdf';

const SCORE_COLOR = (v) => v >= 75 ? '#10B981' : v >= 50 ? '#F59E0B' : '#EF4444';

function ScoreBar({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value != null ? `${Math.round(value)}%` : '-'}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value || 0}%`, backgroundColor: color || '#4F46E5' }} />
      </div>
    </div>
  );
}

export default function PragmaticReport() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('mahasiswa');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    base44.auth.me().then(async u => {
      if (!u) return;
      setUser(u);
      const r = userRole.get(u.email) || u.role;
      setRole(r);
      let cls = [];
      if (r === 'dosen' || r === 'admin') {
        cls = await base44.entities.Class.filter({ lecturer_email: u.email }).catch(() => []);
      } else {
        const enrs = await base44.entities.Enrollment.filter({ student_email: u.email, status: 'active' }).catch(() => []);
        const all = await base44.entities.Class.list().catch(() => []);
        cls = all.filter(c => enrs.some(e => e.class_id === c.id));
      }
      setClasses(cls);
      if (cls.length > 0) loadClassData(cls[0]);
    });
  }, []);

  const loadClassData = async (cls) => {
    setSelectedClass(cls);
    setLoading(true);
    const [enrs, sc] = await Promise.all([
      base44.entities.Enrollment.filter({ class_id: cls.id }).catch(() => []),
      base44.entities.PragmaticScore.filter({ class_id: cls.id }).catch(() => []),
    ]);
    setScores(sc);

    const studentMap = {};
    enrs.forEach(e => { studentMap[e.student_email] = { ...e, allScores: [], latestScore: null }; });
    sc.forEach(s => {
      if (studentMap[s.student_email]) {
        studentMap[s.student_email].allScores.push(s);
        const ex = studentMap[s.student_email].latestScore;
        if (!ex || new Date(s.date) > new Date(ex.date)) {
          studentMap[s.student_email].latestScore = s;
        }
      }
    });
    const list = Object.values(studentMap);
    setStudents(list);
    setSelectedStudents(list.map(s => s.student_email));
    setLoading(false);
  };

  const toggleStudent = (email) => {
    setSelectedStudents(prev => prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]);
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210, M = 15, TW = W - M * 2;
      let y = M;

      const addPage = () => { doc.addPage(); y = M; };
      const checkY = (need = 20) => { if (y + need > 275) addPage(); };

      // ── Cover ────────────────────────────────────────────────
      doc.setFillColor(67, 56, 202);
      doc.rect(0, 0, W, 60, 'F');
      doc.setFillColor(109, 40, 217);
      doc.rect(0, 45, W, 20, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18); doc.setFont('helvetica', 'bold');
      doc.text('LAPORAN PERKEMBANGAN PRAGMATIK', W / 2, 22, { align: 'center' });
      doc.setFontSize(11); doc.setFont('helvetica', 'normal');
      doc.text('& KESANTUNAN KOMUNIKASI DIGITAL', W / 2, 30, { align: 'center' });
      doc.setFontSize(9);
      doc.text(`Kelas: ${selectedClass?.class_name || '-'}   |   Kode: ${selectedClass?.class_code || '-'}`, W / 2, 38, { align: 'center' });
      doc.text(`Digenerate: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, W / 2, 44, { align: 'center' });

      doc.setTextColor(220, 220, 255);
      doc.setFontSize(8);
      doc.text('PragmaticsAI — Platform Edukasi Pragmatik Etnografi Digital', W / 2, 56, { align: 'center' });

      y = 72;
      doc.setTextColor(30, 30, 30);

      // ── Ringkasan Kelas ────────────────────────────────────
      const selStudents = students.filter(s => selectedStudents.includes(s.student_email));
      const withScore = selStudents.filter(s => s.latestScore);
      const avg = (key) => withScore.length ? Math.round(withScore.reduce((a, s) => a + (s.latestScore?.[key] || 0), 0) / withScore.length) : 0;

      doc.setFillColor(245, 245, 255);
      doc.roundedRect(M, y, TW, 36, 3, 3, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(67, 56, 202);
      doc.text('RINGKASAN KELAS', M + 4, y + 7);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(60, 60, 60);
      const summaryItems = [
        [`Total Mahasiswa: ${selStudents.length}`, `Dengan Data Skor: ${withScore.length}`],
        [`Rata-rata Pragmatik: ${avg('pragmatic_competence')}%`, `Rata-rata Kesantunan: ${avg('politeness_score')}%`],
        [`Rata-rata Empati: ${avg('empathy_score')}%`, `Rata-rata Etika: ${avg('ethical_awareness')}%`],
      ];
      summaryItems.forEach((row, i) => {
        doc.text(row[0], M + 4, y + 14 + i * 7);
        doc.text(row[1], M + 95, y + 14 + i * 7);
      });
      y += 44;

      // ── Per-mahasiswa ────────────────────────────────────
      doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(30, 30, 30);
      doc.text('DATA PER MAHASISWA', M, y + 6);
      y += 12;

      selStudents.forEach((student, idx) => {
        checkY(55);
        const s = student.latestScore;
        const bgColor = idx % 2 === 0 ? [248, 248, 255] : [255, 255, 255];

        doc.setFillColor(...bgColor);
        doc.roundedRect(M, y, TW, s ? 52 : 24, 2, 2, 'F');
        doc.setDrawColor(220, 220, 240);
        doc.roundedRect(M, y, TW, s ? 52 : 24, 2, 2, 'S');

        // Nama & status
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(30, 30, 30);
        doc.text(`${idx + 1}. ${student.student_email?.split('@')[0] || '-'}`, M + 4, y + 7);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(100, 100, 120);
        doc.text(student.student_email, M + 4, y + 13);
        doc.text(`Level: ${student.level || 'Pemula'}  |  XP: ${student.xp_points || 0}  |  Streak: ${student.streak_days || 0} hari`, M + 4, y + 19);

        if (s) {
          // Score bars (simplified as text)
          const metrics = [
            { label: 'Pragmatik', val: s.pragmatic_competence },
            { label: 'Kesantunan', val: s.politeness_score },
            { label: 'Empati', val: s.empathy_score },
            { label: 'Etika', val: s.ethical_awareness },
            { label: 'Kultural', val: s.cultural_sensitivity },
          ];
          metrics.forEach((m, mi) => {
            const col = mi < 3 ? M + 4 : M + 95;
            const rowY = mi < 3 ? y + 26 + mi * 8 : y + 26 + (mi - 3) * 8;
            doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(80, 80, 100);
            doc.text(`${m.label}:`, col, rowY);
            const val = m.val || 0;
            doc.setTextColor(val >= 75 ? 16 : val >= 50 ? 180 : 220, val >= 75 ? 185 : val >= 50 ? 120 : 50, val >= 75 ? 129 : 30);
            doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
            doc.text(`${val}%`, col + 22, rowY);
            // Mini bar
            doc.setFillColor(230, 230, 245);
            doc.rect(col + 30, rowY - 3.5, 40, 3, 'F');
            doc.setFillColor(val >= 75 ? 16 : val >= 50 ? 245 : 239, val >= 75 ? 185 : val >= 50 ? 158 : 68, val >= 75 ? 129 : val >= 50 ? 11 : 68);
            doc.rect(col + 30, rowY - 3.5, 40 * (val / 100), 3, 'F');
          });
          doc.text(`Tanggal Skor: ${new Date(s.date).toLocaleDateString('id-ID')}`, M + 4, y + 49);
        } else {
          doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(160, 160, 180);
          doc.text('Belum ada data skor', M + 4, y + 22);
        }
        y += (s ? 57 : 28);
      });

      // ── Footer setiap halaman ────────────────────────────────
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(245, 245, 255);
        doc.rect(0, 284, W, 13, 'F');
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(120, 120, 150);
        doc.text(`PragmaticsAI — Laporan Pragmatik & Kesantunan Komunikasi Digital  |  Halaman ${i} dari ${pageCount}`, W / 2, 291, { align: 'center' });
      }

      doc.save(`laporan_pragmatik_${selectedClass?.class_code || 'kelas'}_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.pdf`);
    } catch (err) {
      console.error(err);
    }
    setGenerating(false);
  };

  const selStudents = students.filter(s => selectedStudents.includes(s.student_email));
  const withScore = selStudents.filter(s => s.latestScore);

  const radarData = [
    { subject: 'Pragmatik', A: withScore.length ? Math.round(withScore.reduce((a, s) => a + (s.latestScore?.pragmatic_competence || 0), 0) / withScore.length) : 0 },
    { subject: 'Kesantunan', A: withScore.length ? Math.round(withScore.reduce((a, s) => a + (s.latestScore?.politeness_score || 0), 0) / withScore.length) : 0 },
    { subject: 'Empati', A: withScore.length ? Math.round(withScore.reduce((a, s) => a + (s.latestScore?.empathy_score || 0), 0) / withScore.length) : 0 },
    { subject: 'Etika', A: withScore.length ? Math.round(withScore.reduce((a, s) => a + (s.latestScore?.ethical_awareness || 0), 0) / withScore.length) : 0 },
    { subject: 'Kultural', A: withScore.length ? Math.round(withScore.reduce((a, s) => a + (s.latestScore?.cultural_sensitivity || 0), 0) / withScore.length) : 0 },
  ];

  const barData = selStudents.filter(s => s.latestScore).map(s => ({
    name: s.student_email.split('@')[0].substring(0, 10),
    pragmatik: s.latestScore?.pragmatic_competence || 0,
    kesantunan: s.latestScore?.politeness_score || 0,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 min-h-screen bg-background">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">LAPORAN PDF</span>
            </div>
            <h1 className="text-2xl font-bold font-montserrat">Laporan Perkembangan Pragmatik</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Generate laporan nilai & kesantunan untuk kebutuhan administrasi institusi</p>
          </div>
          <Button onClick={generatePDF} disabled={generating || !selectedClass || students.length === 0}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md px-6">
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Download className="w-4 h-4" /> Unduh PDF</>}
          </Button>
        </div>
      </motion.div>

      {/* Pilih Kelas */}
      {classes.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {classes.map(c => (
            <button key={c.id} onClick={() => loadClassData(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                selectedClass?.id === c.id ? 'bg-primary text-white border-primary' : 'bg-white border-border hover:border-primary/40'
              }`}>
              {c.class_name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : !selectedClass ? (
        <div className="bg-white rounded-2xl border border-border p-10 text-center text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Pilih kelas untuk melihat laporan</p>
        </div>
      ) : (
        <>
          {/* Charts */}
          {withScore.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                <h3 className="font-bold font-montserrat text-sm mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Rata-rata Kompetensi Kelas
                </h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(0,0,0,0.06)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                      <Radar dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {barData.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                  <h3 className="font-bold font-montserrat text-sm mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Perbandingan Skor Mahasiswa
                  </h3>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} barSize={12}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 9 }} domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="pragmatik" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Pragmatik" />
                        <Bar dataKey="kesantunan" fill="#10B981" radius={[4, 4, 0, 0]} name="Kesantunan" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tabel Mahasiswa */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-bold font-montserrat text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Data Mahasiswa — {selectedClass.class_name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <button onClick={() => setSelectedStudents(students.map(s => s.student_email))}
                  className="hover:text-primary underline">Pilih Semua</button>
                <span>·</span>
                <button onClick={() => setSelectedStudents([])} className="hover:text-primary underline">Hapus Semua</button>
                <span className="text-foreground font-medium">({selectedStudents.length}/{students.length} dipilih)</span>
              </div>
            </div>
            <div className="divide-y divide-border">
              {students.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">Belum ada mahasiswa terdaftar</p>
              ) : students.map((student, i) => {
                const s = student.latestScore;
                const isSelected = selectedStudents.includes(student.student_email);
                return (
                  <div key={student.student_email} onClick={() => toggleStudent(student.student_email)}
                    className={`flex items-center gap-4 p-4 cursor-pointer transition-all ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-secondary/30 opacity-50'}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary border-primary' : 'border-border'}`}>
                      {isSelected && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                      {student.student_email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{student.student_email?.split('@')[0]}</p>
                      <p className="text-xs text-muted-foreground truncate">{student.student_email}</p>
                    </div>
                    <div className="hidden md:flex gap-5 text-center">
                      {s ? [
                        { label: 'Pragmatik', val: s.pragmatic_competence },
                        { label: 'Kesantunan', val: s.politeness_score },
                        { label: 'Empati', val: s.empathy_score },
                      ].map((m, j) => (
                        <div key={j}>
                          <p className="text-sm font-bold" style={{ color: SCORE_COLOR(m.val || 0) }}>{m.val != null ? `${m.val}%` : '-'}</p>
                          <p className="text-[10px] text-muted-foreground">{m.label}</p>
                        </div>
                      )) : (
                        <span className="text-xs text-muted-foreground italic">Belum ada skor</span>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-foreground">{student.level || 'Pemula'}</p>
                      <p className="text-[10px] text-muted-foreground">{student.xp_points || 0} XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}