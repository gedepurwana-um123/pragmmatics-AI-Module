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
  lightCyan: [236, 254, 255],
  stepBg: [248, 250, 252],
  footerLine: [226, 232, 240],
};

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;

function setFill(doc, color) { doc.setFillColor(color[0], color[1], color[2]); }
function setText(doc, color) { doc.setTextColor(color[0], color[1], color[2]); }
function setDraw(doc, color) { doc.setDrawColor(color[0], color[1], color[2]); }

function checkPage(doc, y, threshold = 25) {
  if (y > PAGE_H - threshold) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function renderParagraphs(doc, paragraphs, startY, opts = {}) {
  const { fontSize = 9, lineHeight = 5.5, color = COLORS.dark, indent = 0 } = opts;
  const maxWidth = PAGE_W - MARGIN * 2 - indent;
  let y = startY;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  setText(doc, color);

  paragraphs.forEach((para, pIdx) => {
    const lines = doc.splitTextToSize(para, maxWidth);
    lines.forEach((line, lIdx) => {
      y = checkPage(doc, y);
      const x = (lIdx === 0 && pIdx > 0) ? MARGIN + 3 : MARGIN + indent;
      doc.text(line, x, y);
      y += lineHeight;
    });
    if (pIdx < paragraphs.length - 1) y += 2;
  });
  return y;
}

function renderSectionBar(doc, title, subtitle, startY, color = COLORS.primary) {
  let y = startY;
  y = checkPage(doc, y, 40);
  
  setFill(doc, color);
  doc.roundedRect(MARGIN, y, PAGE_W - MARGIN * 2, 16, 2.5, 2.5, 'F');
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(title, MARGIN + 5, y + 7);
  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(subtitle, MARGIN + 5, y + 13);
  }
  return y + 24;
}

function renderSteps(doc, steps, startY) {
  const maxWidth = PAGE_W - MARGIN * 2 - 9;
  let y = startY;

  steps.forEach((step, sIdx) => {
    const detailLines = doc.splitTextToSize(step.detail, maxWidth);
    const blockHeight = 5 + detailLines.length * 4 + 4;

    y = checkPage(doc, y, 35);

    setFill(doc, COLORS.stepBg);
    doc.roundedRect(MARGIN, y - 3, PAGE_W - MARGIN * 2, blockHeight, 1.5, 1.5, 'F');

    setFill(doc, COLORS.primary);
    doc.circle(MARGIN + 4, y + 1, 3, 'F');
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`${sIdx + 1}`, MARGIN + 4, y + 2.5, { align: 'center' });

    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(step.title, MARGIN + 10, y + 2);

    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(detailLines, MARGIN + 10, y + 7);
    y += blockHeight + 2;
  });
  return y;
}

function renderTips(doc, tips, startY) {
  if (!tips || tips.length === 0) return startY;

  let totalHeight = 8;
  tips.forEach(tip => {
    const lines = doc.splitTextToSize(`• ${tip}`, PAGE_W - MARGIN * 2 - 10);
    totalHeight += lines.length * 4 + 2;
  });

  let y = startY;
  y = checkPage(doc, y, 30);

  setFill(doc, COLORS.lightAmber);
  doc.roundedRect(MARGIN, y, PAGE_W - MARGIN * 2, totalHeight + 4, 2, 2, 'F');

  setText(doc, COLORS.amber);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('TIPS PRAKTIS', MARGIN + 4, y + 6);

  setText(doc, COLORS.dark);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  let tipY = y + 12;
  tips.forEach(tip => {
    const tipLines = doc.splitTextToSize(`• ${tip}`, PAGE_W - MARGIN * 2 - 12);
    tipLines.forEach(line => {
      doc.text(line, MARGIN + 4, tipY);
      tipY += 4;
    });
    tipY += 2;
  });

  return y + totalHeight + 8;
}

function renderBenefits(doc, title, items, startY, accentColor = COLORS.green, bgColor = COLORS.lightGreen) {
  let y = startY;

  setText(doc, COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  y = checkPage(doc, y, 30);
  doc.text(title, MARGIN, y);
  y += 6;

  setText(doc, COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  items.forEach((item, idx) => {
    const lines = doc.splitTextToSize(item, PAGE_W - MARGIN * 2 - 8);
    const blockH = lines.length * 4 + 3;
    y = checkPage(doc, y, 20);

    setFill(doc, accentColor);
    doc.circle(MARGIN + 2, y - 0.5, 2, 'F');
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.text('✓', MARGIN + 2, y + 0.5, { align: 'center' });

    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(lines, MARGIN + 7, y);
    y += blockH;
  });
  return y + 4;
}

function renderFooter(doc, data, pageNum) {
  setDraw(doc, COLORS.footerLine);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, PAGE_H - 12, PAGE_W - MARGIN, PAGE_H - 12);
  setText(doc, COLORS.muted);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('PragmaticsAI — Panduan Penggunaan', MARGIN, PAGE_H - 8);
  doc.text(`${data.title} | Halaman ${pageNum}`, PAGE_W - MARGIN, PAGE_H - 8, { align: 'right' });
}

function renderCoverPage(doc, data, role) {
  setFill(doc, COLORS.dark);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  setFill(doc, COLORS.primary);
  doc.circle(PAGE_W - 20, 25, 55, 'F');
  setFill(doc, COLORS.accent);
  doc.circle(PAGE_W - 35, 45, 30, 'F');
  setFill(doc, COLORS.dark);
  doc.rect(0, 0, PAGE_W, 110, 'F');

  setFill(doc, COLORS.primary);
  doc.roundedRect(MARGIN, 28, 14, 14, 3, 3, 'F');
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('P', MARGIN + 7, 37, { align: 'center' });

  doc.setFontSize(9);
  setText(doc, [199, 210, 254]);
  doc.text('PRAGMATICS AI', MARGIN + 20, 33);
  doc.setFontSize(7);
  setText(doc, [148, 163, 184]);
  doc.text('Etika Komunikasi Digital', MARGIN + 20, 38);

  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(data.title, MARGIN, 75);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  setText(doc, [165, 180, 252]);
  doc.text(data.subtitle, MARGIN, 84);

  setFill(doc, role === 'dosen' ? COLORS.accent : COLORS.primary);
  doc.roundedRect(MARGIN, 96, 70, 8, 2, 2, 'F');
  setText(doc, COLORS.white);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(role === 'dosen' ? 'UNTUK DOSEN / PENGAJAR' : 'UNTUK MAHASISWA', MARGIN + 4, 101);

  setText(doc, [148, 163, 184]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Dibuat: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, MARGIN, 115);

  setFill(doc, [30, 27, 75]);
  doc.roundedRect(MARGIN, PAGE_H - 52, PAGE_W - MARGIN * 2, 35, 3, 3, 'F');
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Platform Pembelajaran Pragmatik Digital Berbasis AI', MARGIN + 5, PAGE_H - 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setText(doc, [148, 163, 184]);
  const infoLines = doc.splitTextToSize(
    `Panduan komprehensif ini mencakup penjelasan konseptual modul (apa itu, latar belakang, urgensi, manfaat) serta ${data.sections.length} modul fitur dengan instruksi langkah demi langkah dan tips praktis.`,
    PAGE_W - MARGIN * 2 - 10
  );
  doc.text(infoLines, MARGIN + 5, PAGE_H - 36);
}

function renderTableOfContents(doc, data) {
  let y = MARGIN;

  setText(doc, COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Daftar Isi', MARGIN, y);
  y += 7;

  setDraw(doc, COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 8;

  // Part A: Conceptual
  setText(doc, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BAGIAN A — PENGENALAN MODUL', MARGIN, y);
  y += 6;

  const tocA = [
    { title: 'Apa Itu Modul Pragmatik AI?', page: 3 },
    { title: 'Latar Belakang Pengembangan', page: null },
    { title: 'Urgensi Modul Pragmatik AI', page: null },
    { title: 'Manfaat Platform', page: null },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  tocA.forEach((item, idx) => {
    y = checkPage(doc, y, 15);
    setText(doc, COLORS.muted);
    doc.text(`${String(idx + 1).padStart(2, '0')}`, MARGIN, y);
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(item.title, MARGIN + 10, y);
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    const titleW = doc.getTextWidth(item.title);
    const dots = '.'.repeat(Math.max(0, Math.floor((PAGE_W - MARGIN * 2 - 10 - titleW - 10) / 1.2)));
    doc.text(dots, MARGIN + 12 + titleW, y);
    y += 6.5;
  });

  y += 4;

  // Part B: Feature guide
  y = checkPage(doc, y, 15);
  setText(doc, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BAGIAN B — PANDUAN FITUR', MARGIN, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  data.sections.forEach((section, idx) => {
    y = checkPage(doc, y, 15);
    setText(doc, COLORS.muted);
    doc.text(`${String(idx + 1).padStart(2, '0')}`, MARGIN, y);
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, MARGIN + 10, y);
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    const titleW = doc.getTextWidth(section.title);
    const dots = '.'.repeat(Math.max(0, Math.floor((PAGE_W - MARGIN * 2 - 10 - titleW - 10) / 1.2)));
    doc.text(dots, MARGIN + 12 + titleW, y);
    y += 6.5;
  });

  renderFooter(doc, data, 2);
}

function renderOverviewPages(doc, data, role) {
  let pageNum = 3;
  const overview = data.overview;

  // A1: What Is
  doc.addPage();
  let y = renderSectionBar(doc, 'Apa Itu Modul Pragmatik AI?', 'Definisi & konsep inti platform', MARGIN, COLORS.primary);
  y = renderParagraphs(doc, overview.what_is.paragraphs, y, { fontSize: 9, lineHeight: 5.5 });
  renderFooter(doc, data, pageNum);

  // A2: Background
  pageNum++;
  doc.addPage();
  y = MARGIN;
  y = renderSectionBar(doc, 'Latar Belakang Pengembangan', 'Mengapa modul ini dikembangkan', y, COLORS.accent);
  y = renderParagraphs(doc, overview.background.paragraphs, y, { fontSize: 9, lineHeight: 5.5 });
  renderFooter(doc, data, pageNum);

  // A3: Urgency
  pageNum++;
  doc.addPage();
  y = MARGIN;
  y = renderSectionBar(doc, 'Urgensi Modul Pragmatik AI', 'Kepentingan & kebutuhan mendesak', y, COLORS.amber);
  y = renderParagraphs(doc, overview.urgency.paragraphs, y, { fontSize: 9, lineHeight: 5.5 });
  renderFooter(doc, data, pageNum);

  // A4: Benefits
  pageNum++;
  doc.addPage();
  y = MARGIN;
  y = renderSectionBar(doc, 'Manfaat Platform', 'Keunggulan & nilai yang diperoleh', y, COLORS.green);
  y = renderBenefits(doc, 'Manfaat Umum', overview.benefits_general, y, COLORS.green, COLORS.lightGreen);
  y = renderBenefits(
    doc,
    `Manfaat Khusus ${role === 'dosen' ? 'Dosen' : 'Mahasiswa'}`,
    role === 'dosen' ? overview.benefits_lecturer : overview.benefits_student,
    y,
    COLORS.primary,
    COLORS.lightIndigo
  );
  renderFooter(doc, data, pageNum);

  return pageNum;
}

function renderFeatureSections(doc, data, role, startPageNum) {
  let pageNum = startPageNum;
  const sectionColor = role === 'dosen' ? COLORS.accent : COLORS.primary;

  data.sections.forEach((section, idx) => {
    doc.addPage();
    pageNum++;
    let y = MARGIN;

    // Section header bar
    setFill(doc, sectionColor);
    doc.roundedRect(MARGIN, y, PAGE_W - MARGIN * 2, 16, 2.5, 2.5, 'F');
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${String(idx + 1).padStart(2, '0')}  ${section.title.toUpperCase()}`, MARGIN + 5, y + 7);
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(section.description, MARGIN + 5, y + 13);
    y += 24;

    // Intro paragraph
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    const descLines = doc.splitTextToSize(section.description, PAGE_W - MARGIN * 2);
    descLines.forEach(line => {
      y = checkPage(doc, y);
      doc.text(line, MARGIN, y);
      y += 5;
    });
    y += 5;

    // Steps label
    y = checkPage(doc, y, 20);
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Langkah-langkah Penggunaan', MARGIN, y);
    y += 3;

    setDraw(doc, COLORS.primary);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, MARGIN + 50, y);
    y += 6;

    // Render steps
    y = renderSteps(doc, section.steps, y);

    // Tips
    y = renderTips(doc, section.tips, y);

    renderFooter(doc, data, pageNum);
  });

  return pageNum;
}

function renderClosingPage(doc) {
  doc.addPage();
  setFill(doc, COLORS.dark);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  setFill(doc, COLORS.primary);
  doc.circle(PAGE_W - 25, PAGE_H - 25, 50, 'F');
  setFill(doc, COLORS.accent);
  doc.circle(PAGE_W - 15, PAGE_H - 15, 25, 'F');

  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Terima Kasih', MARGIN, PAGE_H / 2 - 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  setText(doc, [165, 180, 252]);
  const closingLines = doc.splitTextToSize(
    'Panduan ini disusun untuk membantu Anda memanfaatkan PragmaticsAI secara optimal dalam pembelajaran etika komunikasi digital. Untuk pertanyaan lebih lanjut, hubungi dosen pengampu atau admin sistem institusi Anda.',
    PAGE_W - MARGIN * 2
  );
  doc.text(closingLines, MARGIN, PAGE_H / 2);

  doc.setFontSize(8);
  setText(doc, [148, 163, 184]);
  doc.text('PragmaticsAI © 2025 — Platform Etika Komunikasi Digital', MARGIN, PAGE_H / 2 + 20);
  doc.text('TKT-6 Implementation | Sulawesi Tenggara, Indonesia', MARGIN, PAGE_H / 2 + 25);
}

export function generateGuidePDF(role) {
  const data = role === 'dosen' ? lecturerGuide : studentGuide;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Page 1: Cover
  renderCoverPage(doc, data, role);

  // Page 2: Table of Contents
  doc.addPage();
  renderTableOfContents(doc, data);

  // Pages 3+: Conceptual Overview
  const lastOverviewPage = renderOverviewPages(doc, data, role);

  // Feature Sections
  const lastFeaturePage = renderFeatureSections(doc, data, role, lastOverviewPage);

  // Closing Page
  renderClosingPage(doc);

  const fileName = `Panduan_${role === 'dosen' ? 'Dosen' : 'Mahasiswa'}_PragmaticsAI.pdf`;
  doc.save(fileName);
}