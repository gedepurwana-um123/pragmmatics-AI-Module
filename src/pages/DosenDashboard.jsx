import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import {
  Users, BookOpen, TrendingUp, Brain, Search, ChevronDown,
  ChevronUp, MessageSquare, Star, AlertTriangle, CheckCircle2,
  FileText, Send, Filter, BarChart3, Award, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

export default function DosenDashboard() {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [scores, setScores] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    base44.auth.me().then(async u => {
      if (!u) return;
      setUser(u);
      const cls = await base44.entities.Class.filter({ lecturer_email: u.email }).catch(() => []);
      setClasses(cls);
      if (cls.length > 0) loadClass(cls[0], u.email);
      else setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const loadClass = async (cls, lecturerEmail) => {
    setLoading(true);
    setSelectedClass(cls);
    const [enrs, allScores] = await Promise.all([
      base44.entities.Enrollment.filter({ class_id: cls.id }).catch(() => []),
      base44.entities.PragmaticScore.filter({ class_id: cls.id }).catch(() => []),
    ]);
    setEnrollments(enrs);
    setScores(allScores);

    // Build student list with latest scores
    const studentMap = {};
    enrs.forEach(e => {
      studentMap[e.student_email] = { ...e, latestScore: null };
    });
    allScores.forEach(s => {
      if (studentMap[s.student_email]) {
        const existing = studentMap[s.student_email].latestScore;
        if (!existing || new Date(s.date) > new Date(existing.date)) {
          studentMap[s.student_email].latestScore = s;
        }
      }
    });
    setStudents(Object.values(studentMap));
    setLoading(false);
  };

  const saveNote = async (studentEmail) => {
    if (!noteInput.trim()) return;
    setSavingNote(true);
    // Save note to student profile or enrollment
    const enr = enrollments.find(e => e.student_email === studentEmail);
    if (enr) {
      await base44.entities.Enrollment.update(enr.id, {
        ...enr,
        // store notes as JSON in a text field via session_notes
      }).catch(() => {});
    }
    setNotes(prev => ({
      ...prev,
      [studentEmail]: [...(prev[studentEmail] || []), {
        text: noteInput,
        date: new Date().toISOString(),
        from: user?.full_name || 'Dosen'
      }]
    }));
    setNoteInput('');
    setSavingNote(false);
  };

  const getScoreColor = (val) => {
    if (val == null) return 'text-muted-foreground';
    if (val >= 75) return 'text-emerald-600';
    if (val >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getStatusBadge = (enr) => {
    const score = enr.latestScore;
    if (!score) return { label: 'Belum ada data', color: 'bg-secondary text-muted-foreground' };
    const avg = ((score.pragmatic_competence || 0) + (score.politeness_score || 0)) / 2;
    if (avg >= 75) return { label: 'Baik', color: 'bg-emerald-100 text-emerald-700' };
    if (avg >= 50) return { label: 'Perlu Perhatian', color: 'bg-amber-100 text-amber-700' };
    return { label: 'Perlu Bimbingan', color: 'bg-rose-100 text-rose-700' };
  };

  const filteredStudents = students.filter(s => {
    const matchSearch = !search || s.student_email.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filterLevel === 'all') return true;
    const badge = getStatusBadge(s);
    if (filterLevel === 'baik') return badge.label === 'Baik';
    if (filterLevel === 'perhatian') return badge.label === 'Perlu Perhatian';
    if (filterLevel === 'bimbingan') return badge.label === 'Perlu Bimbingan';
    return true;
  });

  const avgClass = students.length > 0 ? {
    pragmatic: Math.round(students.filter(s => s.latestScore).reduce((a, s) => a + (s.latestScore?.pragmatic_competence || 0), 0) / (students.filter(s => s.latestScore).length || 1)),
    politeness: Math.round(students.filter(s => s.latestScore).reduce((a, s) => a + (s.latestScore?.politeness_score || 0), 0) / (students.filter(s => s.latestScore).length || 1)),
    toxicity: Math.round(students.filter(s => s.latestScore).reduce((a, s) => a + (s.latestScore?.toxicity_score || 0), 0) / (students.filter(s => s.latestScore).length || 1)),
  } : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">DASBOR DOSEN</span>
        </div>
        <h1 className="text-2xl font-bold font-montserrat">Selamat datang, {user?.full_name?.split(' ')[0] || 'Dosen'} 👋</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Pantau kemajuan mahasiswa Anda dan berikan bimbingan personal.</p>
      </motion.div>

      {/* Class selector */}
      {classes.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {classes.map(c => (
            <button key={c.id} onClick={() => loadClass(c, user?.email)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                selectedClass?.id === c.id ? 'bg-primary text-white border-primary' : 'bg-white border-border hover:border-primary/40 text-foreground'
              }`}>
              {c.class_name} <span className="text-xs opacity-70">({c.class_code})</span>
            </button>
          ))}
        </div>
      )}

      {classes.length === 0 && !loading && (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
          <h3 className="font-semibold text-foreground mb-1">Belum ada kelas</h3>
          <p className="text-sm text-muted-foreground">Buat kelas terlebih dahulu di menu Manajemen Kelas.</p>
        </div>
      )}

      {selectedClass && (
        <>
          {/* Class stats */}
          {avgClass && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Total Mahasiswa', value: students.length, color: 'from-indigo-500 to-violet-600' },
                { icon: Brain, label: 'Avg Pragmatik', value: `${avgClass.pragmatic}%`, color: 'from-cyan-500 to-blue-600' },
                { icon: TrendingUp, label: 'Avg Kesantunan', value: `${avgClass.politeness}%`, color: 'from-emerald-500 to-teal-600' },
                { icon: AlertTriangle, label: 'Avg Toxicity', value: `${avgClass.toxicity}%`, color: 'from-amber-500 to-orange-600' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
                    <c.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xl font-bold font-montserrat">{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Student list */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex flex-wrap gap-3 items-center justify-between">
              <h2 className="font-bold font-montserrat flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Daftar Mahasiswa — {selectedClass.class_name}
              </h2>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Cari mahasiswa..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-8 text-xs w-44" />
                </div>
                <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
                  className="h-8 px-3 rounded-lg border border-border text-xs bg-white text-foreground">
                  <option value="all">Semua Status</option>
                  <option value="baik">Baik</option>
                  <option value="perhatian">Perlu Perhatian</option>
                  <option value="bimbingan">Perlu Bimbingan</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Memuat data mahasiswa...</div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Tidak ada mahasiswa ditemukan</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredStudents.map((student, i) => {
                  const badge = getStatusBadge(student);
                  const isExpanded = expandedStudent === student.student_email;
                  const score = student.latestScore;
                  const studentNotes = notes[student.student_email] || [];

                  // Radar data for individual student
                  const radarData = score ? [
                    { subject: 'Pragmatik', A: score.pragmatic_competence || 0 },
                    { subject: 'Kesantunan', A: score.politeness_score || 0 },
                    { subject: 'Empati', A: score.empathy_score || 0 },
                    { subject: 'Etika', A: score.ethical_awareness || 0 },
                    { subject: 'Kultural', A: score.cultural_sensitivity || 0 },
                  ] : [];

                  return (
                    <motion.div key={student.student_email} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      {/* Row */}
                      <div
                        className="flex items-center gap-4 p-4 hover:bg-secondary/20 transition-colors cursor-pointer"
                        onClick={() => setExpandedStudent(isExpanded ? null : student.student_email)}
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                          {student.student_email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{student.student_email}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>{badge.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {student.xp_points || 0} XP · Level {student.level || 'Pemula'}
                            </span>
                          </div>
                        </div>
                        <div className="hidden sm:flex gap-4 text-center">
                          <div>
                            <p className={`text-sm font-bold ${getScoreColor(score?.pragmatic_competence)}`}>{score?.pragmatic_competence ?? '-'}{score ? '%' : ''}</p>
                            <p className="text-[10px] text-muted-foreground">Pragmatik</p>
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${getScoreColor(score?.politeness_score)}`}>{score?.politeness_score ?? '-'}{score ? '%' : ''}</p>
                            <p className="text-[10px] text-muted-foreground">Kesantunan</p>
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${getScoreColor(score?.toxicity_score)}`}>{score?.toxicity_score ?? '-'}{score ? '%' : ''}</p>
                            <p className="text-[10px] text-muted-foreground">Toxicity</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          className="px-4 pb-5 bg-secondary/10 border-t border-border">
                          <div className="grid lg:grid-cols-3 gap-4 mt-4">
                            {/* Radar */}
                            <div className="bg-white rounded-2xl border border-border p-4">
                              <p className="text-xs font-bold text-muted-foreground mb-2">Profil Kompetensi</p>
                              {radarData.length > 0 ? (
                                <div className="h-40">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData}>
                                      <PolarGrid stroke="rgba(0,0,0,0.07)" />
                                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
                                      <Radar dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={2} />
                                      <Tooltip />
                                    </RadarChart>
                                  </ResponsiveContainer>
                                </div>
                              ) : (
                                <div className="h-40 flex items-center justify-center text-xs text-muted-foreground">Belum ada skor</div>
                              )}
                            </div>

                            {/* Progress info */}
                            <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
                              <p className="text-xs font-bold text-muted-foreground">Progress Belajar</p>
                              {[
                                { label: 'Interaksi AI', val: student.total_ai_interactions || 0, suffix: 'sesi' },
                                { label: 'Total Refleksi', val: student.total_reflections || 0, suffix: 'refleksi' },
                                { label: 'Penyelesaian', val: `${student.completion_percentage || 0}%`, suffix: '' },
                                { label: 'Streak', val: student.streak_days || 0, suffix: 'hari' },
                                { label: 'Lencana', val: (student.badges || []).length, suffix: 'badge' },
                              ].map((item, j) => (
                                <div key={j} className="flex items-center justify-between text-xs">
                                  <span className="text-muted-foreground">{item.label}</span>
                                  <span className="font-semibold text-foreground">{item.val} {item.suffix}</span>
                                </div>
                              ))}
                            </div>

                            {/* Notes */}
                            <div className="bg-white rounded-2xl border border-border p-4">
                              <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5" /> Catatan Dosen
                              </p>
                              <div className="space-y-2 max-h-24 overflow-y-auto mb-3">
                                {studentNotes.length === 0 ? (
                                  <p className="text-xs text-muted-foreground italic">Belum ada catatan.</p>
                                ) : studentNotes.map((n, j) => (
                                  <div key={j} className="bg-indigo-50 rounded-lg p-2 border border-indigo-100">
                                    <p className="text-xs text-foreground">{n.text}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{n.from} · {new Date(n.date).toLocaleDateString('id-ID')}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Tulis catatan atau instruksi..."
                                  value={expandedStudent === student.student_email ? noteInput : ''}
                                  onChange={e => setNoteInput(e.target.value)}
                                  className="text-xs h-8 flex-1"
                                  onKeyDown={e => e.key === 'Enter' && saveNote(student.student_email)}
                                />
                                <Button size="sm" onClick={() => saveNote(student.student_email)} disabled={savingNote}
                                  className="h-8 px-2.5 bg-primary text-white rounded-lg">
                                  <Send className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}