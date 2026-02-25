import jsPDF from 'jspdf';
import { SAMPLE_QUESTIONS } from './questions-data';
import { THEMES, ThemeId } from './constants';

export function generateQuestionsPDF() {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const addPageIfNeeded = (neededSpace: number) => {
    if (y + neededSpace > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Le Test Civique', pageWidth / 2, y, { align: 'center' });
  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Questionnaire complet de préparation', pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('letestcivique.org — contact@letestcivique.org', pageWidth / 2, y, { align: 'center' });
  doc.setTextColor(0);
  y += 15;

  // Group questions by theme
  const themes = Object.keys(THEMES) as ThemeId[];

  for (const themeId of themes) {
    const theme = THEMES[themeId];
    const themeQuestions = SAMPLE_QUESTIONS.filter(q => q.theme === themeId);
    if (themeQuestions.length === 0) continue;

    addPageIfNeeded(20);

    // Theme header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 80, 160);
    doc.text(theme.name, margin, y);
    doc.setTextColor(0);
    y += 3;
    doc.setDrawColor(30, 80, 160);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    themeQuestions.forEach((q, idx) => {
      addPageIfNeeded(50);

      // Question
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      const qLines = doc.splitTextToSize(`${idx + 1}. ${q.question}`, maxWidth);
      doc.text(qLines, margin, y);
      y += qLines.length * 5 + 2;

      // Difficulty badge
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`[${q.difficulty}]`, margin, y);
      doc.setTextColor(0);
      y += 5;

      // Options
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      q.options.forEach((opt, i) => {
        const prefix = i === q.correct_answer ? '✓' : '○';
        const optLines = doc.splitTextToSize(`  ${prefix}  ${opt}`, maxWidth - 5);
        
        if (i === q.correct_answer) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 120, 60);
        }
        
        doc.text(optLines, margin + 2, y);
        
        if (i === q.correct_answer) {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0);
        }
        
        y += optLines.length * 4 + 1;
      });

      // Explanation
      if (q.explanation) {
        addPageIfNeeded(15);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(80);
        const expLines = doc.splitTextToSize(`💡 ${q.explanation}`, maxWidth - 5);
        doc.text(expLines, margin + 2, y);
        doc.setTextColor(0);
        y += expLines.length * 4 + 2;
      }

      y += 5;
    });

    y += 5;
  }

  // Footer on last page
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(130);
  doc.text(
    `Généré le ${new Date().toLocaleDateString('fr-FR')} — letestcivique.org`,
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  doc.save('test-civique-questionnaire.pdf');
}
