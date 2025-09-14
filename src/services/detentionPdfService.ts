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
    doc.rect(20, startY, pageWidth - 40, 25, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(20, startY, pageWidth - 40, 25, 'D');

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('CALCUL DU MONTANT', 25, startY + 8);

    // Ligne 1: Jours de dépassement et tarif par jour
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Jours de dépassement: ${container.joursDepassement}`, 25, startY + 15);
    doc.text(`Tarif par jour: ${this.formatCurrency(container.coutParJour)} FCFA`, pageWidth - 120, startY + 15);

    // Section CLIENT PAIE avec calcul complet
    doc.setFillColor(240, 240, 240);
    doc.rect(25, startY + 18, pageWidth - 90, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT PAIE:', 30, startY + 22);
    
    // Calcul détaillé aligné à droite
    const calculText = `${container.joursDepassement} jours × ${this.formatCurrency(container.coutParJour)} = ${this.formatCurrency(container.montantTotal)} FCFA`;
    doc.text(calculText, pageWidth - 140, startY + 22);

    return startY + 30;
  }

  private addTotalAmount(doc: jsPDF, container: DetentionContainer, pageWidth: number, startY: number): number {
    // Montant total avec fond rouge
    doc.setFillColor(220, 53, 69);
    doc.rect(20, startY, pageWidth - 40, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('MONTANT TOTAL:', 25, startY + 8);
    
    // Montant aligné à droite avec espacement approprié
    const montantText = `${this.formatCurrency(container.montantTotal)} FCFA`;
    const textWidth = doc.getTextWidth(montantText);
    doc.text(montantText, pageWidth - 25 - textWidth, startY + 8);

    return startY + 15;
  }

  private addImportantNote(doc: jsPDF, pageWidth: number, startY: number): number {
    // Section NOTE IMPORTANTE
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('NOTE IMPORTANTE:', 20, startY);

    // Contenu de la note avec bon espacement
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("Cette note de débit est établie à l'identique selon les tarifs de l'armateur en vigueur.", 20, startY + 8);
    doc.text('Les montants et calculs respectent strictement les accords tarifaires convenus.', 20, startY + 16);

    return startY + 30; // Plus d'espace avant le footer
  }

  private addFooter(doc: jsPDF, pageWidth: number, pageHeight: number): void {
    const footerY = pageHeight - 35; // Position plus haute pour éviter le chevauchement
    
    // Ligne de séparation subtile
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);

    // Informations entreprise avec espacement correct
    doc.setTextColor(80, 80, 80); // Gris plus foncé pour meilleure lisibilité
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7); // Police légèrement plus petite
    
    // Ligne 1: Nom et adresse (bien espacée)
    doc.text('LOGISTIGA S.A.R.L - Zone Portuaire - Ouattara-SETTRAG', 20, footerY + 3);
    
    // Ligne 2: Contact (avec espacement vertical de 4mm)
    doc.text('Tél: (+241) 01 76 42 30/07 10 45 45/02 22 31 71 - logistiga@logistiga.com - www.logistiga.com', 20, footerY + 8);
    
    // Ligne 3: Informations bancaires (avec espacement vertical de 4mm)
    doc.text('RIB CCB: 40002 00043 00000000001 84 - IBAN: 40000 00 100 410100600117 06', 20, footerY + 13);
    
    // Ligne 4: Capital et autres infos (avec espacement vertical de 4mm)
    doc.text('Capital: 18 000 000 F CFA - NIF: 7431071 - RCCM: 2011 - F - 00001', 20, footerY + 18);

    // Numéro de page dans le coin droit avec un fond léger
    doc.setFillColor(248, 249, 250);
    doc.rect(pageWidth - 35, footerY + 10, 25, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Page 1', pageWidth - 30, footerY + 15);
  }

  private formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount).replace(/\s/g, ' '); // Assurer des espaces normaux
  }
}

export const detentionPdfService = new DetentionPdfService();