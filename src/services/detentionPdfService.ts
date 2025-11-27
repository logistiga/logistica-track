import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DetentionContainer } from '@/types/detention';
import logistigaLogo from '@/assets/logistiga-logo.png';

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

    // Footer
    this.addFooter(doc, pageWidth, pageHeight);

    const fileName = `note-debit-${container.numeroConteneur}-${new Date().getTime()}.pdf`;
    doc.save(fileName);
  }

  private addHeader(doc: jsPDF, pageWidth: number, startY: number): number {
    // Ajouter le logo de l'entreprise
    const logoSize = 25;
    const logoX = 20;
    
    try {
      doc.addImage(logistigaLogo, 'PNG', logoX, startY, logoSize, logoSize);
    } catch (e) {
      console.error('Erreur lors du chargement du logo:', e);
    }
    
    // Nom de l'entreprise
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('LOGISTIGA', logoX + logoSize + 8, startY + 12);

    // Sous-titre
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('TRANSPORT-STOCKAGE-MANUTENTION', logoX + logoSize + 8, startY + 20);

    return startY + logoSize + 10;
  }

  private addTitle(doc: jsPDF, pageWidth: number, startY: number): number {
    // Ligne de séparation décorative
    doc.setDrawColor(220, 53, 69);
    doc.setLineWidth(1);
    doc.line(20, startY, pageWidth - 20, startY);
    
    // Titre principal avec fond coloré moderne
    doc.setFillColor(220, 53, 69);
    doc.roundedRect(20, startY + 5, pageWidth - 40, 16, 2, 2, 'F');
    
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('NOTE DE DÉBIT', pageWidth / 2, startY + 16, { align: 'center' });
    
    // Informations de la note dans un cadre élégant
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, startY + 26, pageWidth - 40, 12, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const currentDate = new Date().toLocaleDateString('fr-FR');
    doc.text(`Date d'émission: ${currentDate}`, 25, startY + 33);
    doc.text(`N° Note: DET-${Date.now().toString().slice(-6)}`, pageWidth - 25, startY + 33, { align: 'right' });
    
    return startY + 46;
  }

  private addContainerInfo(doc: jsPDF, container: DetentionContainer, pageWidth: number, startY: number): number {
    // En-tête de section moderne avec coins arrondis
    doc.setFillColor(220, 53, 69);
    doc.roundedRect(20, startY, pageWidth - 40, 10, 2, 2, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('INFORMATIONS CONTENEUR', 25, startY + 7);
    
    // Fond du contenu avec bordure subtile
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, startY + 10, pageWidth - 40, 38, 2, 2, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(20, startY + 10, pageWidth - 40, 38, 2, 2, 'S');
    
    // Contenu
    const contentY = startY + 18;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const leftCol = 25;
    const rightCol = pageWidth / 2 + 10;
    let currentY = contentY;
    
    // Colonne gauche
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('Numéro:', leftCol, currentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(container.numeroConteneur, leftCol + 38, currentY);
    
    currentY += 9;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('Type:', leftCol, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('double_relevage', leftCol + 38, currentY);
    
    currentY += 9;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('Statut:', leftCol, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('en_cours', leftCol + 38, currentY);
    
    // Colonne droite
    currentY = contentY;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('Armateur:', rightCol, currentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(container.codeArmateur, rightCol + 38, currentY);
    
    currentY += 9;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('Code:', rightCol, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(container.codeArmateur, rightCol + 38, currentY);
    
    currentY += 9;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('Responsabilité:', rightCol, currentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 53, 69);
    doc.setFontSize(12);
    doc.text('CLIENT', rightCol + 38, currentY);
    
    return startY + 53;
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
    // Effet d'ombre subtile
    doc.setFillColor(200, 200, 200);
    doc.roundedRect(20, startY + 3, pageWidth - 40, 22, 3, 3, 'F');
    
    // Cadre moderne pour le montant total
    doc.setFillColor(220, 53, 69);
    doc.roundedRect(20, startY, pageWidth - 40, 22, 3, 3, 'F');
    
    // Texte "MONTANT TOTAL"
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('MONTANT TOTAL:', 25, startY + 14);
    
    // Montant avec grande police et mise en valeur
    const montantText = `${this.formatCurrency(container.montantTotal)} FCFA`;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const montantWidth = doc.getTextWidth(montantText);
    doc.text(montantText, pageWidth - 25 - montantWidth, startY + 14);
    
    return startY + 30;
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