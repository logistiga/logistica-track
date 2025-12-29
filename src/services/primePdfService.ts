import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PrimeChauffeur } from '@/types/prime';

export function generatePrimePaymentPdf(
  primes: PrimeChauffeur[],
  parcNumber: string,
  totalAmount: number
): void {
  const doc = new jsPDF();
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR');
  const weekNumber = getWeekNumber(now);
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FICHE DE PAIEMENT DES PRIMES', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Semaine ${weekNumber} - ${now.getFullYear()}`, 105, 28, { align: 'center' });
  
  // Info section
  doc.setFontSize(11);
  doc.text(`Date: ${dateStr}`, 14, 45);
  doc.text(`Numéro de Parc: ${parcNumber}`, 14, 52);
  doc.text(`Nombre de conteneurs: ${primes.length}`, 14, 59);
  
  // Total box
  doc.setFillColor(240, 240, 240);
  doc.rect(120, 40, 76, 25, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('MONTANT TOTAL:', 125, 50);
  doc.setFontSize(14);
  doc.text(formatCurrency(totalAmount), 125, 60);
  
  // Table
  const tableData = primes.map((prime, index) => [
    (index + 1).toString(),
    prime.numero_tc,
    prime.chauffeur || 'N/A',
    prime.date_sortie ? new Date(prime.date_sortie).toLocaleDateString('fr-FR') : '-',
    prime.date_retour ? new Date(prime.date_retour).toLocaleDateString('fr-FR') : '-',
    formatCurrency(prime.prime_chauffeur),
  ]);

  autoTable(doc, {
    startY: 75,
    head: [['#', 'N° Conteneur', 'Chauffeur', 'Date Sortie', 'Date Retour', 'Montant']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 35 },
      2: { cellWidth: 40 },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 30, halign: 'center' },
      5: { cellWidth: 30, halign: 'right' },
    },
    foot: [['', '', '', '', 'TOTAL', formatCurrency(totalAmount)]],
    footStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
  });
  
  // Signature section
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Signature du responsable:', 14, finalY);
  doc.line(14, finalY + 20, 80, finalY + 20);
  
  doc.text('Signature du chauffeur:', 120, finalY);
  doc.line(120, finalY + 20, 186, finalY + 20);
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text(`Document généré le ${dateStr} à ${now.toLocaleTimeString('fr-FR')}`, 105, pageHeight - 10, { align: 'center' });
  
  // Save
  const fileName = `paiement_primes_${parcNumber}_S${weekNumber}_${now.getFullYear()}.pdf`;
  doc.save(fileName);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
