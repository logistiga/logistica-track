import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DetentionContainer } from '@/types/detention';
import logistigaLogo from '@/assets/logistiga-logo-full.png';

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
    // Logo centré et grand format prenant tout l'en-tête
    const logoWidth = 120;
    const logoHeight = 35;
    const logoX = (pageWidth - logoWidth) / 2; // Centrer horizontalement
    
    try {
      doc.addImage(logistigaLogo, 'PNG', logoX, startY, logoWidth, logoHeight);
    } catch (e) {
      console.error('Erreur lors du chargement du logo:', e);
    }

    return startY + logoHeight + 15;
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
    // En-tête de section avec style moderne
    doc.setFillColor(220, 53, 69);
    doc.roundedRect(20, startY, pageWidth - 40, 10, 2, 2, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('CALCUL DU MONTANT', 25, startY + 7);
    
    // Fond du contenu
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, startY + 10, pageWidth - 40, 28, 2, 2, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(20, startY + 10, pageWidth - 40, 28, 2, 2, 'S');

    // Informations de calcul
    const contentY = startY + 18;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // Ligne 1: Jours de dépassement
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('Jours de dépassement:', 25, contentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${container.joursDepassement}`, 75, contentY);

    // Ligne 1 suite: Tarif par jour
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('Tarif par jour:', pageWidth / 2 + 5, contentY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`${this.formatCurrency(container.coutParJour)} FCFA`, pageWidth / 2 + 35, contentY);

    // Section CLIENT PAIE avec calcul complet
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(25, contentY + 8, pageWidth - 50, 10, 2, 2, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 53, 69);
    doc.setFontSize(11);
    doc.text('CLIENT PAIE:', 30, contentY + 15);
    
    // Calcul détaillé
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const calculText = `${container.joursDepassement} jours × ${this.formatCurrency(container.coutParJour)} = ${this.formatCurrency(container.montantTotal)} FCFA`;
    doc.text(calculText, 70, contentY + 15);

    return startY + 43;
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
    const footerY = pageHeight - 40;
    
    // Ligne de séparation élégante
    doc.setDrawColor(220, 53, 69);
    doc.setLineWidth(0.8);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);

    // Fond subtil pour le footer
    doc.setFillColor(250, 250, 250);
    doc.rect(20, footerY, pageWidth - 40, 35, 'F');

    // Informations entreprise bien espacées
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    let currentY = footerY + 5;
    
    // Ligne 1: Nom et adresse
    doc.setFont('helvetica', 'bold');
    doc.text('LOGISTIGA S.A.R.L', 25, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(' - Zone Portuaire - Ouattara-SETTRAG', 60, currentY);
    
    currentY += 5;
    
    // Ligne 2: Contact
    doc.text('Tél: (+241) 01 76 42 30/07 10 45 45/02 22 31 71', 25, currentY);
    
    currentY += 5;
    
    // Ligne 3: Email et web
    doc.text('logistiga@logistiga.com - www.logistiga.com', 25, currentY);
    
    currentY += 5;
    
    // Ligne 4: Informations bancaires
    doc.setFontSize(7);
    doc.text('RIB CCB: 40002 00043 00000000001 84 - IBAN: 40000 00 100 410100600117 06', 25, currentY);
    
    currentY += 5;
    
    // Ligne 5: Capital et autres infos
    doc.text('Capital: 18 000 000 F CFA - NIF: 7431071 - RCCM: 2011 - F - 00001', 25, currentY);

    // Numéro de page dans un cadre moderne
    doc.setFillColor(220, 53, 69);
    doc.roundedRect(pageWidth - 30, footerY + 12, 20, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Page 1', pageWidth - 20, footerY + 17, { align: 'center' });
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