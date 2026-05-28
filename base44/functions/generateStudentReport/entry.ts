import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';

/**
 * Generate comprehensive academic PDF report for a student
 * Includes pragmatic competency summary, politeness trend chart, and personal development suggestions.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { student_email, class_id } = body;

    const targetEmail = student_email || user.email;

    // Fetch data
    const [scores, enrollment, chatLogs] = await Promise.all([
      base44.entities.PragmaticScore.filter({ student_email: targetEmail, ...(class_id ? { class_id } : {}) }),
      base44.entities.Enrollment.filter({ student_email: targetEmail, ...(class_id ? { class_id } : {}) }),
      base44.entities.AIChatLog.filter({ user_email: targetEmail }),
    ]);

    const enr = enrollment?.[0] || {};

    // Compute averages from scores
    const avgOf = (field) => {
      const vals = scores.map(s => s[field]).filter(v => typeof v === 'number');
      return vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    };

    const avgPragmatic = avgOf('pragmatic_competence') || enr.final_pragmatic_score || 0;
    const avgPoliteness = avgOf('politeness_score') || enr.final_politeness_score || 0;
    const avgToxicity = avgOf('toxicity_score') || enr.final_toxicity_score || 0;
    const avgCultural = avgOf('cultural_sensitivity') || 0;
    const avgEthical = avgOf('ethical_awareness') || 0;
    const avgEmpathy = avgOf('empathy_score') || 0;

    // AI-generated development suggestions
    const suggestionResult = await base44.integrations.Core.InvokeLLM({
      prompt: `Berikan 3 saran pengembangan personal yang singkat dan spesifik untuk mahasiswa dengan data berikut:
- Kompetensi Pragmatik: ${avgPragmatic}/100
- Kesantunan: ${avgPoliteness}/100
- Toxicity: ${avgToxicity}/100
- Sensitivitas Kultural: ${avgCultural}/100
- Kesadaran Etis: ${avgEthical}/100
- Empati: ${avgEmpathy}/100
- Total Interaksi AI: ${enr.total_ai_interactions || chatLogs.length}
- Total Refleksi: ${enr.total_reflections || 0}

Format: array of 3 string saran (Indonesia, maksimal 120 karakter per saran, fokus pada area paling perlu ditingkatkan).`,
      response_json_schema: {
        type: 'object',
        properties: {
          suggestions: { type: 'array', items: { type: 'string' } },
          overall_assessment: { type: 'string' },
        },
      },
    });

    const suggestions = suggestionResult?.suggestions || [
      'Tingkatkan frekuensi interaksi AI untuk memperkuat kompetensi pragmatik.',
      'Perbanyak penulisan jurnal reflektif untuk meningkatkan kesadaran etis.',
      'Eksplorasi kasus budaya lokal untuk memperdalam sensitivitas kultural.',
    ];
    const overallAssessment = suggestionResult?.overall_assessment || 'Perkembangan komunikasi digital menunjukkan kemajuan yang baik.';

    // --- Build PDF ---
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;
    const margin = 18;
    let y = 0;

    // Header gradient bar
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, W, 38, 'F');
    doc.setFillColor(6, 182, 212);
    doc.rect(W - 60, 0, 60, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN AKADEMIK PRAGMATIK', margin, 16);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('PragmaticsAI — Platform Pembelajaran Pragmatik Digital', margin, 24);
    doc.text(`Digenerate: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, 31);

    y = 50;

    // Student info box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, W - margin * 2, 22, 3, 3, 'F');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Mahasiswa:', margin + 4, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(targetEmail, margin + 32, y + 8);
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', margin + 4, y + 16);
    doc.setFont('helvetica', 'normal');
    doc.text(enr.status || 'active', margin + 18, y + 16);
    doc.text(`Level: ${enr.level || 'Pemula'}   XP: ${enr.xp_points || 0}`, margin + 80, y + 16);

    y += 30;

    // Section: Ringkasan Kompetensi
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('1. Ringkasan Kompetensi Pragmatik', margin, y);
    y += 8;

    const metrics = [
      { label: 'Kompetensi Pragmatik', value: avgPragmatic, color: [79, 70, 229] },
      { label: 'Tingkat Kesantunan', value: avgPoliteness, color: [16, 185, 129] },
      { label: 'Tingkat Toksisitas', value: avgToxicity, color: [239, 68, 68] },
      { label: 'Sensitivitas Kultural', value: avgCultural, color: [6, 182, 212] },
      { label: 'Kesadaran Etis', value: avgEthical, color: [124, 58, 237] },
      { label: 'Empati', value: avgEmpathy, color: [245, 158, 11] },
    ];

    const barW = (W - margin * 2 - 70) ;
    metrics.forEach((m) => {
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(m.label, margin, y + 4);
      doc.text(`${m.value}%`, W - margin - 10, y + 4, { align: 'right' });

      // Bar background
      doc.setFillColor(226, 232, 240);
      doc.roundedRect(margin + 65, y - 1, barW, 7, 2, 2, 'F');

      // Bar fill
      const fillW = Math.max(2, (m.value / 100) * barW);
      doc.setFillColor(...m.color);
      doc.roundedRect(margin + 65, y - 1, fillW, 7, 2, 2, 'F');

      y += 12;
    });

    y += 6;

    // Section: Tren Perkembangan Kesantunan
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('2. Tren Perkembangan Kesantunan', margin, y);
    y += 8;

    const recentScores = scores.slice(-8);
    if (recentScores.length > 0) {
      const chartH = 40;
      const chartW = W - margin * 2;
      const pointSpacing = chartW / Math.max(recentScores.length - 1, 1);

      // Chart background
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, chartW, chartH + 10, 3, 3, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, chartW, chartH + 10, 3, 3, 'S');

      // Grid lines & labels
      [25, 50, 75, 100].forEach(gridVal => {
        const gy = y + chartH + 5 - (gridVal / 100) * chartH;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.2);
        doc.line(margin + 2, gy, margin + chartW - 2, gy);
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(`${gridVal}`, margin + 3, gy + 1);
      });

      // Draw line
      const pts = recentScores.map((s, i) => ({
        x: margin + i * pointSpacing,
        y: y + chartH + 5 - ((s.politeness_score || 0) / 100) * chartH,
      }));

      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(1.2);
      for (let i = 0; i < pts.length - 1; i++) {
        doc.line(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
      }

      // Points
      pts.forEach((pt, i) => {
        doc.setFillColor(16, 185, 129);
        doc.circle(pt.x, pt.y, 1.5, 'F');
        doc.setFontSize(6);
        doc.setTextColor(51, 65, 85);
        const dateLabel = recentScores[i]?.date
          ? new Date(recentScores[i].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
          : `S${i + 1}`;
        doc.text(dateLabel, pt.x - 3, y + chartH + 14);
      });

      y += chartH + 20;
    } else {
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('Belum ada data skor pragmatik untuk periode ini.', margin, y + 6);
      y += 14;
    }

    y += 4;

    // Section: Statistik Aktivitas
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('3. Statistik Aktivitas Pembelajaran', margin, y);
    y += 8;

    const stats = [
      { label: 'Total Sesi Analitik', value: scores.length },
      { label: 'Interaksi AI', value: enr.total_ai_interactions || chatLogs.length },
      { label: 'Jurnal Refleksi', value: enr.total_reflections || 0 },
      { label: 'Streak Aktif', value: `${enr.streak_days || 0} hari` },
      { label: 'Lencana Diraih', value: (enr.badges || []).length },
      { label: 'Penyelesaian Kelas', value: `${enr.completion_percentage || 0}%` },
    ];

    const colW = (W - margin * 2) / 3;
    stats.forEach((s, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const bx = margin + col * colW;
      const by = y + row * 18;

      doc.setFillColor(241, 245, 249);
      doc.roundedRect(bx, by, colW - 3, 15, 2, 2, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(79, 70, 229);
      doc.text(String(s.value), bx + 4, by + 9);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(s.label, bx + 4, by + 13);
    });

    y += 46;

    // Section: Saran Pengembangan Personal
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('4. Saran Pengembangan Personal', margin, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(71, 85, 105);
    const assessLines = doc.splitTextToSize(overallAssessment, W - margin * 2);
    doc.text(assessLines, margin, y);
    y += assessLines.length * 5 + 4;

    suggestions.forEach((sug, i) => {
      doc.setFillColor(238, 242, 255);
      const sugLines = doc.splitTextToSize(`${i + 1}. ${sug}`, W - margin * 2 - 8);
      const boxH = sugLines.length * 5 + 6;
      doc.roundedRect(margin, y, W - margin * 2, boxH, 2, 2, 'F');
      doc.setTextColor(55, 48, 163);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(sugLines, margin + 4, y + 5);
      y += boxH + 3;
    });

    // Footer
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 282, W, 15, 'F');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('PragmaticsAI — Platform Pembelajaran Pragmatik Digital Berbasis Etnografi', margin, 290);
    doc.text(`Halaman 1 / 1`, W - margin, 290, { align: 'right' });

    const pdfBytes = doc.output('arraybuffer');

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=laporan_akademik_${targetEmail.split('@')[0]}.pdf`,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});