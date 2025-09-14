import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DetentionContainer } from '@/types/detention';

class DetentionPdfService {
  generateDebitNote(container: DetentionContainer): void {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    let currentY = 20;

    // Header avec logo et infos entreprise
    currentY = this.addHeader(doc, pageWidth, currentY);
    currentY += 10;

    // Titre principal
    currentY = this.addTitle(doc, pageWidth, currentY);
    currentY += 15;

    // Section Informations Conteneur
    currentY = this.addContainerInfo(doc, container, pageWidth, currentY);
    currentY += 10;

    // Section Détails de la Détention
    currentY = this.addDetentionDetails(doc, container, pageWidth, currentY);
    currentY += 10;

    // Section Calcul du Montant
    currentY = this.addAmountCalculation(doc, container, pageWidth, currentY);
    currentY += 10;

    // Montant Total
    currentY = this.addTotalAmount(doc, container, pageWidth, currentY);
    currentY += 15;

    // Note importante
    currentY = this.addImportantNote(doc, pageWidth, currentY);

    // Footer
    this.addFooter(doc, pageWidth, pageHeight);

    const fileName = `note-debit-${container.numeroConteneur}-${new Date().getTime()}.pdf`;
    doc.save(fileName);
  }

  private addHeader(doc: jsPDF, pageWidth: number, startY: number): number {
    // Logo simulé (cercle rouge avec "L")
    doc.setFillColor(220, 53, 69); // Rouge
    doc.circle(30, startY + 10, 12, 'F');
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('L', 27, startY + 13);

    // Nom de l'entreprise
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('LOGISTIGA', 50, startY + 10);

    // Sous-titre
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('TRANSPORT-STOCKAGE-MANUTENTION', 50, startY + 18);

    return startY + 25;
  }

  private addTitle(doc: jsPDF, pageWidth: number, startY: number): number {
    // Titre principal
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('NOTE DE DÉBIT', 20, startY);

    // Date et numéro
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date d'émission: ${new Date().toLocaleDateString('fr-FR')}`, 20, startY + 8);
    doc.text(`N° Note: DET-${Math.floor(Math.random() * 1000)}`, 20, startY + 14);

    return startY + 20;
  }

  private addContainerInfo(doc: jsPDF, container: DetentionContainer, pageWidth: number, startY: number): number {
    // Titre section avec fond rouge
    doc.setFillColor(220, 53, 69);
    doc.rect(20, startY, pageWidth - 40, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS CONTENEUR', 25, startY + 5);

    // Fond gris pour le contenu
    doc.setFillColor(248, 249, 250);
    doc.rect(20, startY + 8, pageWidth - 40, 25, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(20, startY + 8, pageWidth - 40, 25, 'D');

    // Contenu en deux colonnes
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    // Colonne gauche
    doc.text('Numéro:', 25, startY + 15);
    doc.setFont('helvetica', 'bold');
    doc.text(container.numeroConteneur, 80, startY + 15);

    doc.setFont('helvetica', 'normal');
    doc.text('Type:', 25, startY + 20);
    doc.setFont('helvetica', 'bold');
    doc.text('double_relevage', 80, startY + 20);

    doc.setFont('helvetica', 'normal');
    doc.text('Statut:', 25, startY + 25);
    doc.setFont('helvetica', 'bold');
    doc.text('en_cours', 80, startY + 25);

    // Colonne droite
    doc.setFont('helvetica', 'normal');
    doc.text('Armateur:', 120, startY + 15);
    doc.setFont('helvetica', 'bold');
    doc.text(container.codeArmateur, 160, startY + 15);

    doc.setFont('helvetica', 'normal');
    doc.text('Code:', 120, startY + 20);
    doc.setFont('helvetica', 'bold');
    doc.text(container.codeArmateur, 160, startY + 20);

    doc.setFont('helvetica', 'normal');
    doc.text('Responsabilité:', 120, startY + 25);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 53, 69);
    doc.text('CLIENT', 160, startY + 25);

    return startY + 38;
  }

  private addDetentionDetails(doc: jsPDF, container: DetentionContainer, pageWidth: number, startY: number): number {
    // Titre section avec fond rouge
    doc.setFillColor(220, 53, 69);
    doc.rect(20, startY, pageWidth - 40, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAILS DE LA DÉTENTION', 25, startY + 5);

    // Contenu
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    let detailY = startY + 15;
    const lineHeight = 5;

    const details = [
      ['Date début:', new Date(container.dateSortie).toLocaleDateString('fr-FR')],
      ['Date fin:', new Date(container.dateRetour).toLocaleDateString('fr-FR')],
      ['Jours franchise:', `${container.joursBAT} jours`],
      ['Jours facturables:', `${container.joursDepassement} jours`],
      ['Jours dépassement:', `${container.joursDepassement} jours`],
      ['Tarif journalier:', `${this.formatCurrency(container.coutParJour)} FCFA`],
    ];

    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'normal');
      doc.text(label, 25, detailY);
      doc.setFont('helvetica', 'bold');
      doc.text(value, 100, detailY);
      detailY += lineHeight;
    });

    return detailY + 5;
  }

  private addAmountCalculation(doc: jsPDF, container: DetentionContainer, pageWidth: number, startY: number): number {
    // Titre section
    doc.setFillColor(248, 249, 250);
    doc.rect(20, startY, pageWidth - 40, 20, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(20, startY, pageWidth - 40, 20, 'D');

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('CALCUL DU MONTANT', 25, startY + 8);

    // Calcul
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Jours de dépassement: ${container.joursDepassement}`, 25, startY + 15);
    doc.text(`Tarif par jour: ${this.formatCurrency(container.coutParJour)} FCFA`, 120, startY + 15);

    // Section CLIENT PAIE avec fond gris
    doc.setFillColor(240, 240, 240);
    doc.rect(25, startY + 20, pageWidth - 90, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT PAIE:', 30, startY + 25);
    doc.text(`${container.joursDepassement} jours × ${this.formatCurrency(container.coutParJour)} = ${this.formatCurrency(container.montantTotal)} FCFA`, 90, startY + 25);

    return startY + 35;
  }

  private addTotalAmount(doc: jsPDF, container: DetentionContainer, pageWidth: number, startY: number): number {
    // Montant total avec fond rouge
    doc.setFillColor(220, 53, 69);
    doc.rect(20, startY, pageWidth - 40, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('MONTANT TOTAL:', 25, startY + 8);
    doc.text(`${this.formatCurrency(container.montantTotal)} FCFA`, pageWidth - 80, startY + 8);

    return startY + 15;
  }

  private addImportantNote(doc: jsPDF, pageWidth: number, startY: number): number {
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('NOTE IMPORTANTE:', 20, startY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("Cette note de débit est établie à l'identique selon les tarifs de l'armateur en vigueur.", 25, startY + 8);
    doc.text('Les montants et calculs respectent strictement les accords tarifaires convenus.', 25, startY + 14);

    return startY + 20;
  }

  private addFooter(doc: jsPDF, pageWidth: number, pageHeight: number): void {
    const footerY = pageHeight - 40;
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.line(20, footerY, pageWidth - 20, footerY);

    // Informations entreprise
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    doc.text('LOGISTIGA S.A.R.L - Zone Portuaire - Ouattara-SETTRAG', 20, footerY + 8);
    doc.text('Tél: (+241) 01 76 42 30/07 10 45 45/02 22 31 71 - logistiga@logistiga.com - www.logistiga.com', 20, footerY + 14);
    doc.text('RIB CCB: 40002 00043 00000000001 84 - IBAN: 40000 00 100 410100600117 06', 20, footerY + 20);
    doc.text('Capital: 18 000 000 F CFA - NIF: 7431071 - RCCM: 2011 - F - 00001', 20, footerY + 26);

    // Numéro de page
    doc.setTextColor(0, 0, 0);
    doc.text('Page 1', pageWidth - 30, footerY + 20);
  }

  private formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  }
}

export const detentionPdfService = new DetentionPdfService();