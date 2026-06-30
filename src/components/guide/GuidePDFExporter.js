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
  lightGreen: [236, 253, 245],
  lightAmber: [255, 251, 235],
  lightIndigo: [238, 242, 255],
};

function setFill(doc, color) { doc.setFillColor(color[0], color[1], color[2]); }
function setText(doc, color) { doc.setTextColor(color[0], color[1], color[2]); }
function setDraw(doc, color) { doc.setDrawColor(color[0], color[1], color[2]); }

// Helper: render justified paragraphs with proper spacing
function renderParagraphs(doc, paragraphs, startY, pageW, margin, opts = {}) {
  const { fontSize = 9, lineHeight = 5.5, color = COLORS.dark, indent = 0 } = opts;
  const maxWidth = pageW - margin * 2 - indent;
  let y = startY;
  const pageH = 297;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  setText(doc, color);

  paragraphs.forEach((para, pIdx) => {
    const lines = doc.splitTextToSize(para, maxWidth);
    lines.forEach((line, lIdx) => {
      if (y > pageH - 20) { doc.addPage(); y = margin; }
      // First line of each paragraph gets small indent
      const x = (lIdx === 0 && pIdx > 0) ? margin + 3 : margin + indent;
      doc.text(line, x, y);
      y += lineHeight;
    });
    // Extra gap between paragraphs
    if (pIdx < paragraphs.length - 1) y += 2;
  });
  return y;
}

// Helper: section header bar
function renderSectionBar(doc, title, subtitle, y, pageW, margin, color = COLORS.primary) {
  setFill(doc, color);
  doc.roundedRect(margin, y, pageW - margin * 2, 16, 2.5, 2.5, 'F');
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(title, margin + 5, y + 7);
  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(subtitle, margin + 5, y + 13);
  }
  return y + 24;
}

// Helper: numbered step blocks
function renderSteps(doc, steps, startY, pageW, margin) {
  const pageH = 297;
  const maxWidth = pageW - margin * 2 - 9;
  let y = startY;

  steps.forEach((step, sIdx) => {
    // Calculate height needed
    const detailLines = doc.splitTextToSize(step.detail, maxWidth);
    const blockHeight = 5 + detailLines.length * 4 + 4;

    if (y > pageH - 30) { doc.addPage(); y = margin; }

    // Light background for each step
    setFill(doc, [248, 250, 252]);
    doc.roundedRect(margin, y - 3, pageW - margin * 2, blockHeight, 1.5, 1.5, 'F');

    // Number circle
    setFill(doc, COLORS.primary);
    doc.circle(margin + 4, y + 1, 3, 'F');
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`${sIdx + 1}`, margin + 4, y + 2.5, { align: 'center' });

    // Step title
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(step.title, margin + 10, y + 2);

    // Step detail
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(detailLines, margin + 10, y + 7);
    y += blockHeight + 2;
  });
  return y;
}

// Helper: tips box
function renderTips(doc, tips, startY, pageW, margin) {
  if (!tips || tips.length === 0) return startY;
  const pageH = 297;

  // Calculate total height
  let totalHeight = 8;
  tips.forEach(tip => {
    const lines = doc.splitTextToSize(`• ${tip}`, pageW - margin * 2 - 10);
    totalHeight += lines.length * 4 + 2;
  });

  let y = startY;
  if (y > pageH - 25) { doc.addPage(); y = margin; }

  setFill(doc, COLORS.lightAmber);
  doc.roundedRect(margin, y, pageW - margin * 2, totalHeight + 4, 2, 2, 'F');

  setText(doc, COLORS.amber);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('TIPS PRAKTIS', margin + 4, y + 6);

  setText(doc, COLORS.dark);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  let tipY = y + 12;
  tips.forEach(tip => {
    const tipLines = doc.splitTextToSize(`• ${tip}`, pageW - margin * 2 - 12);
    doc.text(tipLines, margin + 4, tipY);
    tipY += tipLines.length * 4 + 2;
  });

  return y + totalHeight + 8;
}

// Helper: benefits list with checkmarks
function renderBenefits(doc, title, items, startY, pageW, margin, accentColor = COLORS.green, bgColor = COLORS.lightGreen) {
  const pageH = 297;
  let y = startY;

  setText(doc, COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  if (y > pageH - 30) { doc.addPage(); y = margin; }
  doc.text(title, margin, y);
  y += 6;

  setText(doc, COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  items.forEach((item, idx) => {
    const lines = doc.splitTextToSize(item, pageW - margin * 2 - 8);
    const blockH = lines.length * 4 + 3;
    if (y > pageH - 20) { doc.addPage(); y = margin; }

    // Checkmark
    setFill(doc, accentColor);
    doc.circle(margin + 2, y - 0.5, 2, 'F');
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.text('✓', margin + 2, y + 0.5, { align: 'center' });

    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(lines, margin + 7, y);
    y += blockH;
  });
  return y + 4;
}

export function generateGuidePDF(role) {
  const data = role === 'dosen' ? lecturerGuide : studentGuide;
  const overview = data.overview;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const margin = 18;
  let y = 0;

  // =============================================
  // PAGE 1: COVER
  // =============================================
  setFill(doc, COLORS.dark);
  doc.rect(0, 0, pageW, pageH, 'F');

  // Decorative shapes
  setFill(doc, COLORS.primary);
  doc.circle(pageW - 20, 25, 55, 'F');
  setFill(doc, COLORS.accent);
  doc.circle(pageW - 35, 45, 30, 'F');
  setFill(doc, COLORS.dark);
  doc.rect(0, 0, pageW, 110, 'F');

  // Logo
  setFill(doc, COLORS.primary);
  doc.roundedRect(margin, 28, 14, 14, 3, 3, 'F');
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('P', margin + 7, 37, { align: 'center' });

  doc.setFontSize(9);
  setText(doc, [199, 210, 254]);
  doc.text('PRAGMATICS AI', margin + 20, 33);
  doc.setFontSize(7);
  setText(doc, [148, 163, 184]);
  doc.text('Etika Komunikasi Digital', margin + 20, 38);

  // Main title
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(data.title, margin, 75);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  setText(doc, [165, 180, 252]);
  doc.text(data.subtitle, margin, 84);

  // Role badge
  setFill(doc, role === 'dosen' ? COLORS.accent : COLORS.primary);
  doc.roundedRect(margin, 96, 60, 8, 2, 2, 'F');
  setText(doc, COLORS.white);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(role === 'dosen' ? 'UNTUK DOSEN / PENGAJAR' : 'UNTUK MAHASISWA', margin + 4, 101);

  // Date
  setText(doc, [148, 163, 184]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Dibuat: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, 115);

  // Bottom info card
  setFill(doc, [30, 27, 75]);
  doc.roundedRect(margin, pageH - 52, pageW - margin * 2, 35, 3, 3, 'F');
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Platform Pembelajaran Pragmatik Digital Berbasis AI', margin + 5, pageH - 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setText(doc, [148, 163, 184]);
  const infoLines = doc.splitTextToSize(
    `Panduan komprehensif ini mencakup penjelasan konseptual modul (apa itu, latar belakang, urgensi, manfaat) serta ${data.sections.length} modul fitur dengan instruksi langkah demi langkah dan tips praktis.`,
    pageW - margin * 2 - 10
  );
  doc.text(infoLines, margin + 5, pageH - 36);

  // =============================================
  // PAGE 2: TABLE OF CONTENTS
  // =============================================
  doc.addPage();
  y = margin;

  setText(doc, COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Daftar Isi', margin, y);
  y += 7;

  setDraw(doc, COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Part A: Conceptual
  setText(doc, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BAGIAN A — PENGENALAN MODUL', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const tocA = [
    'Apa Itu Modul Pragmatik AI?',
    'Latar Belakang Pengembangan',
    'Urgensi Modul Pragmatik AI',
    'Manfaat Platform',
  ];
  tocA.forEach((item, idx) => {
    setText(doc, COLORS.muted);
    doc.text(`${String(idx + 1).padStart(2, '0')}`, margin, y);
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(item, margin + 10, y);
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    const titleW = doc.getTextWidth(item);
    const dots = '.'.repeat(Math.floor((pageW - margin * 2 - 10 - titleW - 10) / 1.2));
    doc.text(dots, margin + 12 + titleW, y);
    doc.text(`${idx + 3}`, pageW - margin - 5, y, { align: 'right' });
    y += 6.5;
  });

  y += 4;

  // Part B: Feature guide
  setText(doc, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BAGIAN B — PANDUAN FITUR', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  data.sections.forEach((section, idx) => {
    if (y > pageH - 20) { doc.addPage(); y = margin; }
    setText(doc, COLORS.muted);
    doc.text(`${String(idx + 1).padStart(2, '0')}`, margin, y);
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin + 10, y);
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    const titleW = doc.getTextWidth(section.title);
    const dots = '.'.repeat(Math.floor((pageW - margin * 2 - 10 - titleW - 10) / 1.2));
    doc.text(dots, margin + 12 + titleW, y);
    doc.text(`${idx + 7}`, pageW - margin - 5, y, { align: 'right' });
    y += 6.5;
  });

  // =============================================
  // PAGES: CONCEPTUAL OVERVIEW
  // =============================================
  // A1: What Is
  doc.addPage();
  y = renderSectionBar(doc, 'Apa Itu Modul Pragmatik AI?', 'Definisi & konsep inti platform', margin, margin, COLORS.primary);
  y = renderParagraphs(doc, overview.what_is.paragraphs, y, pageW, margin, { fontSize: 9, lineHeight: 5.5, color: COLORS.dark });

  // A2: Background
  if (y > pageH - 60) { doc.addPage(); y = margin; } else { y += 6; }
  y = renderSectionBar(doc, 'Latar Belakang Pengembangan', 'Mengapa modul ini dikembangkan', margin, y, COLORS.accent);
  y = renderParagraphs(doc, overview.background.paragraphs, y, pageW, margin, { fontSize: 9, lineHeight: 5.5, color: COLORS.dark });

  // A3: Urgency
  if (y > pageH - 60) { doc.addPage(); y = margin; } else { y += 6; }
  y = renderSectionBar(doc, 'Urgensi Modul Pragmatik AI', 'Kepentingan & kebutuhan mendesak', margin, y, COLORS.amber);
  y = renderParagraphs(doc, overview.urgency.paragraphs, y, pageW, margin, { fontSize: 9, lineHeight: 5.5, color: COLORS.dark });

  // A4: Benefits
  if (y > pageH - 50) { doc.addPage(); y = margin; } else { y += 6; }
  y = renderSectionBar(doc, 'Manfaat Platform', 'Keunggulan & nilai yang diperoleh', margin, y, COLORS.green);
  y = renderBenefits(doc, 'Manfaat Umum', overview.benefits_general, y, pageW, margin);
  y = renderBenefits(
    doc,
    `Manfaat Khusus ${role === 'dosen' ? 'Dosen' : 'Mahasiswa'}`,
    role === 'dosen' ? overview.benefits_lecturer : overview.benefits_student,
    y, pageW, margin,
    COLORS.primary, COLORS.lightIndigo
  );

  // =============================================
  // PAGES: FEATURE SECTIONS
  // =============================================
  data.sections.forEach((section, idx) => {
    doc.addPage();
    y = margin;

    // Section header bar
    const sectionColor = role === 'dosen' ? COLORS.accent : COLORS.primary;
    setFill(doc, sectionColor);
    doc.roundedRect(margin, y, pageW - margin * 2, 16, 2.5, 2.5, 'F');
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${String(idx + 1).padStart(2, '0')}  ${section.title.toUpperCase()}`, margin + 5, y + 7);
    setText(doc, [255, 255, 255]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(section.description, margin + 5, y + 13);
    y += 24;

    // Intro paragraph (description as full paragraph)
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    const descLines = doc.splitTextToSize(section.description, pageW - margin * 2);
    doc.text(descLines, margin, y);
    y += descLines.length * 5 + 5;

    // Steps label
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Langkah-langkah Penggunaan', margin, y);
    y += 3;

    // Draw underline
    setDraw(doc, COLORS.primary);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + 50, y);
    y += 6;

    // Render steps
    y = renderSteps(doc, section.steps, y, pageW, margin);

    // Tips
    y = renderTips(doc, section.tips, y, pageW, margin);

    // Footer
    setDraw(doc, [226, 232, 240]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - 12, pageW - margin, pageH - 12);
    setText(doc, COLORS.muted);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('PragmaticsAI — Panduan Penggunaan', margin, pageH - 8);
    const pageNum = idx + 7;
    doc.text(`${data.title} | Halaman ${pageNum}`, pageW - margin, pageH - 8, { align: 'right' });
  });

  // =============================================
  // CLOSING PAGE
  // =============================================
  doc.addPage();
  y = margin;
  setFill(doc, COLORS.dark);
  doc.rect(0, 0, pageW, pageH, 'F');

  setFill(doc, COLORS.primary);
  doc.circle(pageW - 25, pageH - 25, 50, 'F');
  setFill(doc, COLORS.accent);
  doc.circle(pageW - 15, pageH - 15, 25, 'F');

  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Terima Kasih', margin, pageH / 2 - 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setText(doc, [165, 180, 252]);
  const closingLines = doc.splitTextToSize(
    'Panduan ini disusun untuk membantu Anda memanfaatkan PragmaticsAI secara optimal dalam pembelajaran etika komunikasi digital. Untuk pertanyaan lebih lanjut, hubungi dosen pengampu atau admin sistem institusi Anda.',
    pageW - margin * 2
  );
  doc.text(closingLines, margin, pageH / 2);

  doc.setFontSize(8);
  setText(doc, [148, 163, 184]);
  doc.text('PragmaticsAI © 2025 — Platform Etika Komunikasi Digital', margin, pageH / 2 + 20);
  doc.text('TKT-6 Implementation | Sulawesi Tenggara, Indonesia', margin, pageH / 2 + 25);

  doc.save(`Panduan_${role === 'dosen' ? 'Dosen' : 'Mahasiswa'}_PragmaticsAI.pdf`);
}