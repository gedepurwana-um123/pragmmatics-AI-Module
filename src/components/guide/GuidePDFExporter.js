import { jsPDF } from 'jspdf';
import { studentGuide } from './studentGuideData';
import { lecturerGuide } from './lecturerGuideData';

const COLORS = {
  primary: [79, 70, 229],
  dark: [30, 27, 75],
  accent: [6, 182, 212],
  light: [238, 242, 255],
  muted: [100, 116, 139],
  white: [255, 255, 255],
  green: [16, 185, 129],
  amber: [245, 158, 11],
  rose: [244, 63, 94],
};

function setFill(doc, color) { doc.setFillColor(color[0], color[1], color[2]); }
function setText(doc, color) { doc.setTextColor(color[0], color[1], color[2]); }
function setDraw(doc, color) { doc.setDrawColor(color[0], color[1], color[2]); }

export function generateGuidePDF(role) {
  const data = role === 'dosen' ? lecturerGuide : studentGuide;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const margin = 18;
  let y = 0;

  // === COVER PAGE ===
  setFill(doc, COLORS.dark);
  doc.rect(0, 0, pageW, pageH, 'F');

  // Decorative gradient circles
  setFill(doc, COLORS.primary);
  doc.circle(pageW - 25, 30, 60, 'F');
  setFill(doc, COLORS.accent);
  doc.circle(pageW - 40, 50, 35, 'F');
  setFill(doc, COLORS.dark);
  doc.rect(0, 0, pageW, 120, 'F');

  // Logo box
  setFill(doc, COLORS.primary);
  doc.roundedRect(margin, 30, 14, 14, 3, 3, 'F');
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('P', margin + 7, 39, { align: 'center' });

  doc.setFontSize(9);
  setText(doc, [199, 210, 254]);
  doc.text('PRAGMATICS AI', margin + 20, 35);
  doc.setFontSize(7);
  setText(doc, [148, 163, 184]);
  doc.text('Etika Komunikasi Digital', margin + 20, 40);

  // Title
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(data.title, margin, 85);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  setText(doc, [165, 180, 252]);
  doc.text(data.subtitle, margin, 95);

  // Role badge
  setFill(doc, role === 'dosen' ? COLORS.accent : COLORS.primary);
  doc.roundedRect(margin, 108, 55, 8, 2, 2, 'F');
  setText(doc, COLORS.white);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(role === 'dosen' ? 'UNTUK DOSEN / PENGAJAR' : 'UNTUK MAHASISWA', margin + 4, 113);

  // Date
  setText(doc, [148, 163, 184]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Dibuat: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, 128);

  // Bottom info
  setFill(doc, [30, 27, 75]);
  doc.roundedRect(margin, pageH - 45, pageW - margin * 2, 28, 3, 3, 'F');
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Platform Pembelajaran Pragmatik Digital Berbasis AI', margin + 5, pageH - 35);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  setText(doc, [148, 163, 184]);
  const sections = data.sections.length;
  doc.text(`Panduan mencakup ${sections} modul fitur dengan instruksi langkah demi langkah.`, margin + 5, pageH - 28);
  doc.text('Setiap section dilengkapi tips praktis untuk penggunaan optimal.', margin + 5, pageH - 24);

  // === TABLE OF CONTENTS ===
  doc.addPage();
  y = margin;
  setText(doc, COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Daftar Isi', margin, y);
  y += 8;

  setDraw(doc, COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  data.sections.forEach((section, idx) => {
    if (y > pageH - 20) { doc.addPage(); y = margin; }
    setText(doc, COLORS.muted);
    doc.text(`${String(idx + 1).padStart(2, '0')}`, margin, y);
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin + 10, y);
    // Dotted line
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    const titleW = doc.getTextWidth(section.title);
    const dots = '.'.repeat(Math.floor((pageW - margin * 2 - 10 - titleW - 10) / 1.2));
    doc.text(dots, margin + 12 + titleW, y);
    doc.text(`${idx + 3}`, pageW - margin - 5, y, { align: 'right' });
    y += 7;
  });

  // === CONTENT PAGES ===
  data.sections.forEach((section, idx) => {
    doc.addPage();
    y = margin;

    // Section header bar
    setFill(doc, COLORS.primary);
    doc.roundedRect(margin, y, pageW - margin * 2, 14, 2, 2, 'F');
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`${String(idx + 1).padStart(2, '0')}  ${section.title.toUpperCase()}`, margin + 4, y + 9);
    y += 22;

    // Description
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const descLines = doc.splitTextToSize(section.description, pageW - margin * 2);
    doc.text(descLines, margin, y);
    y += descLines.length * 5 + 6;

    // Steps
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Langkah-langkah', margin, y);
    y += 7;

    section.steps.forEach((step, sIdx) => {
      if (y > pageH - 30) { doc.addPage(); y = margin; }

      // Number circle
      setFill(doc, COLORS.primary);
      doc.circle(margin + 3, y - 1, 3, 'F');
      setText(doc, COLORS.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`${sIdx + 1}`, margin + 3, y, { align: 'center' });

      // Step title
      setText(doc, COLORS.dark);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(step.title, margin + 9, y);

      // Step detail
      setText(doc, COLORS.muted);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const detailLines = doc.splitTextToSize(step.detail, pageW - margin * 2 - 9);
      doc.text(detailLines, margin + 9, y + 5);
      y += 5 + detailLines.length * 4 + 5;
    });

    // Tips
    if (section.tips && section.tips.length > 0) {
      if (y > pageH - 25) { doc.addPage(); y = margin; }
      y += 4;
      setFill(doc, COLORS.light);
      doc.roundedRect(margin, y, pageW - margin * 2, 4 + section.tips.length * 6 + 4, 2, 2, 'F');

      setText(doc, COLORS.amber);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('💡 TIPS PRAKTIS', margin + 4, y + 6);

      setText(doc, COLORS.dark);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      let tipY = y + 12;
      section.tips.forEach((tip, tIdx) => {
        const tipLines = doc.splitTextToSize(`• ${tip}`, pageW - margin * 2 - 12);
        doc.text(tipLines, margin + 4, tipY);
        tipY += tipLines.length * 4 + 2;
      });
    }

    // Footer
    setDraw(doc, [226, 232, 240]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - 12, pageW - margin, pageH - 12);
    setText(doc, COLORS.muted);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('PragmaticsAI — Panduan Penggunaan', margin, pageH - 8);
    doc.text(`${data.title} | Halaman ${idx + 3}`, pageW - margin, pageH - 8, { align: 'right' });
  });

  doc.save(`Panduan_${role === 'dosen' ? 'Dosen' : 'Mahasiswa'}_PragmaticsAI.pdf`);
}