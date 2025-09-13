import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DetentionContainer } from '@/types/detention';

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}

class DetentionPdfService {
  private companyInfo: CompanyInfo = {
    name: 'LOGISTICA GABON',
    address: '123 Boulevard de l\'Indépendance, Libreville, Gabon',
    phone: '+241 01 XX XX XX',
    email: 'contact@logistica-gabon.com'
  };

  /**
   * Génère une note de débit moderne pour une détention
   */
  generateDebitNote(container: DetentionContainer): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Couleurs modernes
    const primaryColor = [41, 128, 185]; // Bleu moderne
    const secondaryColor = [52, 73, 94]; // Gris foncé
    const accentColor = [231, 76, 60]; // Rouge pour les montants
    const lightGray = [236, 240, 241];
    
    let yPosition = 20;

    // === EN-TÊTE MODERNE ===
    this.addModernHeader(doc, pageWidth, yPosition, primaryColor);
    yPosition += 50;

    // === INFORMATIONS DOCUMENT ===
    yPosition = this.addDocumentInfo(doc, container, pageWidth, yPosition, secondaryColor);
    yPosition += 15;

    // === INFORMATIONS CLIENT/CONTENEUR ===
    yPosition = this.addContainerInfo(doc, container, pageWidth, yPosition, lightGray);
    yPosition += 15;

    // === DÉTAIL DE LA DÉTENTION ===
    yPosition = this.addDetentionDetails(doc, container, pageWidth, yPosition, primaryColor, accentColor);
    yPosition += 15;

    // === CALCUL DES COÛTS ===
    yPosition = this.addCostCalculation(doc, container, pageWidth, yPosition, lightGray, accentColor);
    yPosition += 15;

    // === RESPONSABILITÉ ===
    if (container.responsabilite) {
      yPosition = this.addResponsibilityInfo(doc, container, pageWidth, yPosition, primaryColor);
      yPosition += 15;
    }

    // === CONDITIONS DE PAIEMENT ===
    yPosition = this.addPaymentTerms(doc, pageWidth, yPosition, secondaryColor);
    yPosition += 10;

    // === PIED DE PAGE ===
    this.addModernFooter(doc, pageWidth, pageHeight, primaryColor);

    // Sauvegarder le PDF
    const fileName = `note-debit-${container.numeroConteneur}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  private addModernHeader(doc: jsPDF, pageWidth: number, yPos: number, color: number[]): void {
    // Bandeau de couleur en haut
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo et nom de l'entreprise
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(this.companyInfo.name, 20, 25);

    // Sous-titre
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Service de Manutention Portuaire', 20, 32);

    // NOTE DE DÉBIT - côté droit
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const noteText = 'NOTE DE DÉBIT';
    const noteWidth = doc.getTextWidth(noteText);
    doc.text(noteText, pageWidth - noteWidth - 20, 25);
  }

  private addDocumentInfo(doc: jsPDF, container: DetentionContainer, pageWidth: number, yPos: number, color: number[]): number {
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const currentDate = new Date().toLocaleDateString('fr-FR');
    const noteNumber = `ND-${container.numeroConteneur}-${new Date().getFullYear()}`;

    // Informations document - alignées à droite
    const rightX = pageWidth - 20;
    doc.text(`N° Note: ${noteNumber}`, rightX, yPos, { align: 'right' });
    doc.text(`Date: ${currentDate}`, rightX, yPos + 7, { align: 'right' });
    doc.text(`Conteneur: ${container.numeroConteneur}`, rightX, yPos + 14, { align: 'right' });

    return yPos + 25;
  }

  private addContainerInfo(doc: jsPDF, container: DetentionContainer, pageWidth: number, yPos: number, bgColor: number[]): number {
    // Titre de section
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(15, yPos - 5, pageWidth - 30, 12, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS CONTENEUR', 20, yPos + 2);

    yPos += 15;

    // Tableau d'informations
    const containerData = [
      ['Numéro conteneur', container.numeroConteneur],
      ['Code armateur', container.codeArmateur],
      ['Type conteneur', container.typeConteneur],
      ['Client', container.nomClient],
      ['Date sortie', container.dateSortie],
      ['Date retour', container.dateRetour || 'En cours']
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: containerData,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 80 }
      },
      margin: { left: 20, right: 20 },
      theme: 'plain',
      showHead: false
    });

    return yPos + (containerData.length * 8) + 10;
  }

  private addDetentionDetails(doc: jsPDF, container: DetentionContainer, pageWidth: number, yPos: number, primaryColor: number[], accentColor: number[]): number {
    // Titre de section
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(15, yPos - 5, pageWidth - 30, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAIL DE LA DÉTENTION', 20, yPos + 2);

    yPos += 20;

    // Graphique visuel des jours
    const chartWidth = 140;
    const chartHeight = 20;
    const chartX = 20;
    const chartY = yPos;

    // Jours autorisés (vert)
    const ratioAuthorized = container.joursBAT / container.joursRealises;
    const authorizedWidth = chartWidth * ratioAuthorized;
    doc.setFillColor(46, 204, 113); // Vert
    doc.rect(chartX, chartY, authorizedWidth, chartHeight, 'F');

    // Jours de dépassement (rouge)
    const excessWidth = chartWidth - authorizedWidth;
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(chartX + authorizedWidth, chartY, excessWidth, chartHeight, 'F');

    // Bordure du graphique
    doc.setDrawColor(0, 0, 0);
    doc.rect(chartX, chartY, chartWidth, chartHeight);

    // Légende
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`${container.joursBAT} jours autorisés`, chartX, chartY + chartHeight + 8);
    doc.text(`${container.joursDepassement} jours dépassement`, chartX + 80, chartY + chartHeight + 8);

    yPos += 40;

    // Tableau détaillé
    const detentionData = [
      ['Jours BAT autorisés', `${container.joursBAT} jours`, 'Franchise accordée'],
      ['Jours réalisés', `${container.joursRealises} jours`, 'Durée totale hors port'],
      ['Jours de dépassement', `${container.joursDepassement} jours`, 'Soumis à facturation'],
      ['Coût par jour', `${this.formatCurrency(container.coutParJour)} FCFA`, 'Tarif appliqué']
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Description', 'Valeur', 'Observation']],
      body: detentionData,
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      headStyles: {
        fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]] as [number, number, number],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      },
      margin: { left: 20, right: 20 }
    });

    return yPos + (detentionData.length * 10) + 20;
  }

  private addCostCalculation(doc: jsPDF, container: DetentionContainer, pageWidth: number, yPos: number, bgColor: number[], accentColor: number[]): number {
    // Titre de section
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(15, yPos - 5, pageWidth - 30, 12, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CALCUL DU MONTANT', 20, yPos + 2);

    yPos += 20;

    // Calcul détaillé
    const calculationData = [
      ['Base de calcul', `${container.joursDepassement} jours × ${this.formatCurrency(container.coutParJour)} FCFA`, `${this.formatCurrency(container.montantTotal)} FCFA`],
      ['TVA (18%)', 'Exemptée', '0 FCFA'],
      ['Autres frais', 'Néant', '0 FCFA']
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Description', 'Détail', 'Montant']],
      body: calculationData,
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        2: { halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 20, right: 20 }
    });

    yPos += (calculationData.length * 10) + 15;

    // TOTAL en encadré
    const totalBoxHeight = 20;
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(pageWidth - 120, yPos, 100, totalBoxHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL À PAYER', pageWidth - 115, yPos + 7);
    doc.setFontSize(16);
    doc.text(`${this.formatCurrency(container.montantTotal)} FCFA`, pageWidth - 115, yPos + 15);

    return yPos + 30;
  }

  private addResponsibilityInfo(doc: jsPDF, container: DetentionContainer, pageWidth: number, yPos: number, primaryColor: number[]): number {
    // Titre de section
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(15, yPos - 5, pageWidth - 30, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RESPONSABILITÉ', 20, yPos + 2);

    yPos += 15;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const responsabiliteText = this.getResponsabiliteText(container);
    doc.text(responsabiliteText, 20, yPos);

    if (container.responsabilite === 'partagee') {
      yPos += 10;
      doc.text(`• Jours imputés au client: ${container.joursClient}`, 25, yPos);
      yPos += 7;
      doc.text(`• Jours imputés à Logistica: ${container.joursLogistica}`, 25, yPos);
    }

    return yPos + 15;
  }

  private addPaymentTerms(doc: jsPDF, pageWidth: number, yPos: number, color: number[]): number {
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CONDITIONS DE PAIEMENT', 20, yPos);

    yPos += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const terms = [
      '• Paiement exigible à réception de la présente note',
      '• Règlement par chèque, virement bancaire ou espèces',
      '• Tout retard de paiement entraînera des pénalités de 1.5% par mois',
      '• En cas de litige, seuls les tribunaux de Libreville sont compétents'
    ];

    terms.forEach((term, index) => {
      doc.text(term, 20, yPos + (index * 6));
    });

    return yPos + (terms.length * 6) + 10;
  }

  private addModernFooter(doc: jsPDF, pageWidth: number, pageHeight: number, color: number[]): void {
    const footerY = pageHeight - 30;

    // Ligne de séparation
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(2);
    doc.line(20, footerY, pageWidth - 20, footerY);

    // Informations entreprise
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    doc.text(this.companyInfo.address, 20, footerY + 8);
    doc.text(`Tél: ${this.companyInfo.phone} | Email: ${this.companyInfo.email}`, 20, footerY + 15);

    // Numéro de page et date de génération
    const generatedText = `Généré le ${new Date().toLocaleString('fr-FR')} - Page 1/1`;
    const textWidth = doc.getTextWidth(generatedText);
    doc.text(generatedText, pageWidth - textWidth - 20, footerY + 15);
  }

  private getResponsabiliteText(container: DetentionContainer): string {
    switch (container.responsabilite) {
      case 'client':
        return 'La totalité de la détention est imputable au client.';
      case 'logistica':
        return 'La totalité de la détention est imputable à Logistica Gabon.';
      case 'partagee':
        return 'La responsabilité de la détention est partagée entre le client et Logistica.';
      default:
        return 'Responsabilité à déterminer.';
    }
  }

  private formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  }
}

export const detentionPdfService = new DetentionPdfService();