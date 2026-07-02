import { jsPDF } from 'jspdf';
import { studentGuide } from './studentGuideData';
import { lecturerGuide } from './lecturerGuideData';

const COLORS = {
  primary: [79, 70, 229],
  dark: [30, 27, 75],
  accent: [6, 182, 212],
  light: [238, 242, 255],
  muted: [71, 85, 105],
  white: [255, 255, 255],
  green: [16, 185, 129],
  amber: [217, 119, 6],
  rose: [244, 63, 94],
  lightGreen: [236, 253, 245],
  lightAmber: [255, 251, 235],
  lightIndigo: [238, 242, 255],
  lightCyan: [236, 254, 255],
  stepBg: [248, 250, 252],
  footerLine: [203, 213, 225],
};

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;

function setFill(doc, c) { doc.setFillColor(c[0], c[1], c[2]); }
function setText(doc, c) { doc.setTextColor(c[0], c[1], c[2]); }
function setDraw(doc, c) { doc.setDrawColor(c[0], c[1], c[2]); }

function checkPage(doc, y, threshold = 30) {
  if (y > PAGE_H - threshold) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

// Justified text rendering: distributes extra space across words in each line
function renderJustifiedLine(doc, words, x, y, maxWidth, isLastLine) {
  if (isLastLine || words.length <= 1) {
    doc.text(words.join(' '), x, y);
    return;
  }
  // Measure total width of the joined text
  const joined = words.join(' ');
  const textW = doc.getTextWidth(joined);
  const totalGap = maxWidth - textW;
  const gapPerSpace = totalGap / (words.length - 1);
  const spaceW = doc.getTextWidth(' ');

  let curX = x;
  for (let i = 0; i < words.length; i++) {
    doc.text(words[i], curX, y);
    curX += doc.getTextWidth(words[i]) + spaceW + gapPerSpace;
  }
}

// Render paragraphs with justified alignment and proper spacing
function renderParagraphs(doc, paragraphs, startY, opts = {}) {
  const { fontSize = 11, lineHeight = 6.5, color = COLORS.dark, indent = 0 } = opts;
  const maxWidth = CONTENT_W - indent;
  let y = startY;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  setText(doc, color);

  paragraphs.forEach((para, pIdx) => {
    const words = para.split(/\s+/);
    const lines = [];
    let currentLine = [];

    words.forEach(word => {
      const testLine = [...currentLine, word].join(' ');
      const testW = doc.getTextWidth(testLine);
      if (testW > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = [word];
      } else {
        currentLine.push(word);
      }
    });
    if (currentLine.length > 0) lines.push(currentLine);

    lines.forEach((lineWords, lIdx) => {
      y = checkPage(doc, y);
      const isLastLine = lIdx === lines.length - 1;
      const x = MARGIN + indent;
      renderJustifiedLine(doc, lineWords, x, y, maxWidth, isLastLine);
      y += lineHeight;
    });
    // Extra gap between paragraphs
    if (pIdx < paragraphs.length - 1) y += 3;
  });
  return y;
}

// Section header bar with larger fonts
function renderSectionBar(doc, title, subtitle, startY, color = COLORS.primary) {
  let y = startY;
  y = checkPage(doc, y, 45);

  const barHeight = subtitle ? 22 : 16;
  setFill(doc, color);
  doc.roundedRect(MARGIN, y, CONTENT_W, barHeight, 3, 3, 'F');
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, MARGIN + 6, y + 9);
  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(subtitle, MARGIN + 6, y + 17);
  }
  return y + barHeight + 8;
}

// Numbered step blocks with larger fonts
function renderSteps(doc, steps, startY) {
  const maxWidth = CONTENT_W - 12;
  let y = startY;

  steps.forEach((step, sIdx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const detailLines = doc.splitTextToSize(step.detail, maxWidth);
    const blockHeight = 7 + detailLines.length * 5 + 5;

    y = checkPage(doc, y, 40);

    setFill(doc, COLORS.stepBg);
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, blockHeight, 2, 2, 'F');

    // Number circle
    setFill(doc, COLORS.primary);
    doc.circle(MARGIN + 6, y + 1, 3.5, 'F');
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${sIdx + 1}`, MARGIN + 6, y + 3, { align: 'center' });

    // Step title
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(step.title, MARGIN + 13, y + 3);

    // Step detail
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(detailLines, MARGIN + 13, y + 9);
    y += blockHeight + 3;
  });
  return y;
}

// Tips box with larger fonts
function renderTips(doc, tips, startY) {
  if (!tips || tips.length === 0) return startY;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  let totalHeight = 12;
  tips.forEach(tip => {
    const lines = doc.splitTextToSize(`• ${tip}`, CONTENT_W - 14);
    totalHeight += lines.length * 5.5 + 3;
  });

  let y = startY;
  y = checkPage(doc, y, 35);

  setFill(doc, COLORS.lightAmber);
  doc.roundedRect(MARGIN, y, CONTENT_W, totalHeight + 6, 2.5, 2.5, 'F');

  setText(doc, COLORS.amber);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('💡 TIPS PRAKTIS', MARGIN + 5, y + 8);

  setText(doc, COLORS.dark);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  let tipY = y + 16;
  tips.forEach(tip => {
    const tipLines = doc.splitTextToSize(`• ${tip}`, CONTENT_W - 14);
    tipLines.forEach(line => {
      doc.text(line, MARGIN + 5, tipY);
      tipY += 5.5;
    });
    tipY += 3;
  });

  return y + totalHeight + 10;
}

// Benefits list with checkmarks and larger fonts
function renderBenefits(doc, title, items, startY, accentColor = COLORS.green) {
  let y = startY;

  setText(doc, COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  y = checkPage(doc, y, 35);
  doc.text(title, MARGIN, y);
  y += 8;

  items.forEach((item, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(item, CONTENT_W - 12);
    const blockH = lines.length * 5.5 + 4;
    y = checkPage(doc, y, 22);

    setFill(doc, accentColor);
    doc.circle(MARGIN + 3, y - 0.5, 2.5, 'F');
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('✓', MARGIN + 3, y + 1, { align: 'center' });

    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(lines, MARGIN + 9, y);
    y += blockH;
  });
  return y + 6;
}

function renderFooter(doc, data, pageNum) {
  setDraw(doc, COLORS.footerLine);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, PAGE_H - 14, PAGE_W - MARGIN, PAGE_H - 14);
  setText(doc, COLORS.muted);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('PragmaticsAI — Panduan Penggunaan', MARGIN, PAGE_H - 9);
  doc.text(`${data.title} | Halaman ${pageNum}`, PAGE_W - MARGIN, PAGE_H - 9, { align: 'right' });
}

function renderCoverPage(doc, data, role) {
  setFill(doc, COLORS.dark);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  setFill(doc, COLORS.primary);
  doc.circle(PAGE_W - 20, 25, 55, 'F');
  setFill(doc, COLORS.accent);
  doc.circle(PAGE_W - 35, 45, 30, 'F');
  setFill(doc, COLORS.dark);
  doc.rect(0, 0, PAGE_W, 120, 'F');

  // Logo
  setFill(doc, COLORS.primary);
  doc.roundedRect(MARGIN, 30, 16, 16, 3, 3, 'F');
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('P', MARGIN + 8, 41, { align: 'center' });

  doc.setFontSize(11);
  setText(doc, [199, 210, 254]);
  doc.text('PRAGMATICS AI', MARGIN + 22, 36);
  doc.setFontSize(9);
  setText(doc, [148, 163, 184]);
  doc.text('Etika Komunikasi Digital', MARGIN + 22, 42);

  // Main title
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(data.title, MARGIN, 80);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  setText(doc, [165, 180, 252]);
  doc.text(data.subtitle, MARGIN, 90);

  // Role badge
  setFill(doc, role === 'dosen' ? COLORS.accent : COLORS.primary);
  doc.roundedRect(MARGIN, 100, 80, 10, 2, 2, 'F');
  setText(doc, COLORS.white);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(role === 'dosen' ? 'UNTUK DOSEN / PENGAJAR' : 'UNTUK MAHASISWA', MARGIN + 5, 106);

  setText(doc, [148, 163, 184]);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Dibuat: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, MARGIN, 122);

  // Bottom info card
  setFill(doc, [30, 27, 75]);
  doc.roundedRect(MARGIN, PAGE_H - 55, CONTENT_W, 38, 3, 3, 'F');
  setText(doc, COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Platform Pembelajaran Pragmatik Digital Berbasis AI', MARGIN + 6, PAGE_H - 43);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  setText(doc, [148, 163, 184]);
  const infoLines = doc.splitTextToSize(
    `Panduan komprehensif ini mencakup penjelasan konseptual modul (apa itu, latar belakang, urgensi, manfaat) serta ${data.sections.length} modul fitur dengan instruksi langkah demi langkah dan tips praktis.`,
    CONTENT_W - 12
  );
  doc.text(infoLines, MARGIN + 6, PAGE_H - 36);
}

function renderTableOfContents(doc, data) {
  let y = MARGIN;

  setText(doc, COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Daftar Isi', MARGIN, y);
  y += 9;

  setDraw(doc, COLORS.primary);
  doc.setLineWidth(0.7);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;

  // Part A
  setText(doc, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('BAGIAN A — PENGENALAN MODUL', MARGIN, y);
  y += 8;

  const tocA = [
    'Apa Itu Modul Pragmatik AI?',
    'Latar Belakang Pengembangan',
    'Urgensi Modul Pragmatik AI',
    'Manfaat Platform',
  ];

  doc.setFontSize(11);
  tocA.forEach((item, idx) => {
    y = checkPage(doc, y, 18);
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.text(`${String(idx + 1).padStart(2, '0')}`, MARGIN, y);
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(item, MARGIN + 12, y);
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    const titleW = doc.getTextWidth(item);
    const dotSpace = CONTENT_W - 12 - titleW - 12;
    const dots = '.'.repeat(Math.max(0, Math.floor(dotSpace / 1.3)));
    doc.text(dots, MARGIN + 14 + titleW, y);
    y += 8;
  });

  y += 6;

  // Part B
  y = checkPage(doc, y, 18);
  setText(doc, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('BAGIAN B — PANDUAN FITUR', MARGIN, y);
  y += 8;

  doc.setFontSize(11);
  data.sections.forEach((section, idx) => {
    y = checkPage(doc, y, 18);
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.text(`${String(idx + 1).padStart(2, '0')}`, MARGIN, y);
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, MARGIN + 12, y);
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    const titleW = doc.getTextWidth(section.title);
    const dotSpace = CONTENT_W - 12 - titleW - 12;
    const dots = '.'.repeat(Math.max(0, Math.floor(dotSpace / 1.3)));
    doc.text(dots, MARGIN + 14 + titleW, y);
    y += 8;
  });

  renderFooter(doc, data, 2);
}

function renderOverviewPages(doc, data, role) {
  let pageNum = 3;
  const overview = data.overview;

  // A1: What Is
  doc.addPage();
  let y = renderSectionBar(doc, 'Apa Itu Modul Pragmatik AI?', 'Definisi & konsep inti platform', MARGIN, COLORS.primary);
  y = renderParagraphs(doc, overview.what_is.paragraphs, y, { fontSize: 11, lineHeight: 6.5 });
  renderFooter(doc, data, pageNum);

  // A2: Background
  pageNum++;
  doc.addPage();
  y = MARGIN;
  y = renderSectionBar(doc, 'Latar Belakang Pengembangan', 'Mengapa modul ini dikembangkan', y, COLORS.accent);
  y = renderParagraphs(doc, overview.background.paragraphs, y, { fontSize: 11, lineHeight: 6.5 });
  renderFooter(doc, data, pageNum);

  // A3: Urgency
  pageNum++;
  doc.addPage();
  y = MARGIN;
  y = renderSectionBar(doc, 'Urgensi Modul Pragmatik AI', 'Kepentingan & kebutuhan mendesak', y, COLORS.amber);
  y = renderParagraphs(doc, overview.urgency.paragraphs, y, { fontSize: 11, lineHeight: 6.5 });
  renderFooter(doc, data, pageNum);

  // A4: Benefits
  pageNum++;
  doc.addPage();
  y = MARGIN;
  y = renderSectionBar(doc, 'Manfaat Platform', 'Keunggulan & nilai yang diperoleh', y, COLORS.green);
  y = renderBenefits(doc, 'Manfaat Umum', overview.benefits_general, y, COLORS.green);
  y = renderBenefits(
    doc,
    `Manfaat Khusus ${role === 'dosen' ? 'Dosen' : 'Mahasiswa'}`,
    role === 'dosen' ? overview.benefits_lecturer : overview.benefits_student,
    y,
    COLORS.primary
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
    const barHeight = 22;
    setFill(doc, sectionColor);
    doc.roundedRect(MARGIN, y, CONTENT_W, barHeight, 3, 3, 'F');
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`${String(idx + 1).padStart(2, '0')}  ${section.title.toUpperCase()}`, MARGIN + 6, y + 9);
    setText(doc, COLORS.white);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(section.description, MARGIN + 6, y + 17);
    y += barHeight + 8;

    // Intro paragraph (description as italic paragraph)
    setText(doc, COLORS.muted);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10.5);
    const descLines = doc.splitTextToSize(section.description, CONTENT_W);
    descLines.forEach(line => {
      y = checkPage(doc, y);
      doc.text(line, MARGIN, y);
      y += 6;
    });
    y += 6;

    // Steps label
    y = checkPage(doc, y, 25);
    setText(doc, COLORS.dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Langkah-langkah Penggunaan', MARGIN, y);
    y += 4;

    setDraw(doc, COLORS.primary);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y, MARGIN + 55, y);
    y += 8;

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
  doc.setFontSize(22);
  doc.text('Terima Kasih', MARGIN, PAGE_H / 2 - 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  setText(doc, [165, 180, 252]);
  const closingLines = doc.splitTextToSize(
    'Panduan ini disusun untuk membantu Anda memanfaatkan PragmaticsAI secara optimal dalam pembelajaran etika komunikasi digital. Untuk pertanyaan lebih lanjut, hubungi dosen pengampu atau admin sistem institusi Anda.',
    CONTENT_W
  );
  doc.text(closingLines, MARGIN, PAGE_H / 2 + 2);

  doc.setFontSize(10);
  setText(doc, [148, 163, 184]);
  doc.text('PragmaticsAI © 2025 — Platform Etika Komunikasi Digital', MARGIN, PAGE_H / 2 + 25);
  doc.text('TKT-6 Implementation | Sulawesi Tenggara, Indonesia', MARGIN, PAGE_H / 2 + 31);
}

export function generateGuidePDF(role) {
  const data = role === 'dosen' ? lecturerGuide : studentGuide;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  renderCoverPage(doc, data, role);

  doc.addPage();
  renderTableOfContents(doc, data);

  const lastOverviewPage = renderOverviewPages(doc, data, role);

  renderFeatureSections(doc, data, role, lastOverviewPage);

  renderClosingPage(doc);

  const fileName = `Panduan_${role === 'dosen' ? 'Dosen' : 'Mahasiswa'}_PragmaticsAI.pdf`;
  doc.save(fileName);
}