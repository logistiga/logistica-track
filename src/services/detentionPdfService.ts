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
    name: 'LOGISTIGA GABON',
    address: '123 Boulevard de l\'Indépendance, Libreville, Gabon',
    phone: '+241 01 XX XX XX',
    email: 'contact@logistiga-gabon.com'
  };

  /**
   * Génère une note de débit moderne pour une détention
   */
  generateDebitNote(container: DetentionContainer): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Couleurs ultra-modernes
    const primaryColor: [number, number, number] = [30, 39, 73]; // Bleu navy moderne
    const accentColor: [number, number, number] = [255, 107, 107]; // Rouge corail
    const successColor: [number, number, number] = [88, 214, 141]; // Vert moderne
    const warningColor: [number, number, number] = [255, 195, 18]; // Orange moderne
    const lightBg: [number, number, number] = [248, 250, 252]; // Gris très clair
    
    let yPosition = 15;

    // === EN-TÊTE ULTRA-MODERNE AVEC GRADIENT VISUEL ===
    yPosition = this.addUltraModernHeader(doc, pageWidth, yPosition, primaryColor, accentColor);
    yPosition += 10; // Plus d'espace après l'en-tête

    // === LAYOUT EN DEUX COLONNES AVEC ESPACEMENT OPTIMISÉ ===
    const margin = 20;
    const columnGap = 15;
    const leftColWidth = (pageWidth - (2 * margin) - columnGap) * 0.55; // 55% pour la gauche
    const rightColWidth = (pageWidth - (2 * margin) - columnGap) * 0.45; // 45% pour la droite
    const leftX = margin;
    const rightX = leftX + leftColWidth + columnGap;

    // COLONNE GAUCHE: Informations détaillées
    let leftY = yPosition;
    
    // Carte d'informations conteneur - compacte
    leftY = this.addCompactContainerCard(doc, container, leftX, leftY, leftColWidth, lightBg, primaryColor);
    leftY += 8;

    // Chronologie visuelle des dates - compacte
    leftY = this.addCompactTimeline(doc, container, leftX, leftY, leftColWidth, successColor, accentColor);
    leftY += 8;

    // Analyse détaillée de la détention - compacte
    leftY = this.addCompactDetentionAnalysis(doc, container, leftX, leftY, leftColWidth, primaryColor, warningColor);

    // COLONNE DROITE: Calculs et totaux
    let rightY = yPosition;
    
    // Carte de calcul moderne - compacte
    rightY = this.addCompactCalculationCard(doc, container, rightX, rightY, rightColWidth, accentColor, primaryColor);
    rightY += 8;

    // Tableau récapitulatif des montants par responsabilité - compacte
    rightY = this.addCompactResponsibilityBreakdown(doc, container, rightX, rightY, rightColWidth, primaryColor, accentColor);

    // === FOOTER MODERNE EN BAS ===
    this.addUltraModernFooter(doc, pageWidth, pageHeight, primaryColor);

    // Sauvegarder
    const fileName = `note-debit-${container.numeroConteneur}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  private addUltraModernHeader(doc: jsPDF, pageWidth: number, yPos: number, primaryColor: [number, number, number], accentColor: [number, number, number]): number {
    // Gradient simulé avec rectangles dégradés
    for (let i = 0; i < 35; i++) {
      const alpha = i / 35;
      const r = primaryColor[0] + (accentColor[0] - primaryColor[0]) * alpha;
      const g = primaryColor[1] + (accentColor[1] - primaryColor[1]) * alpha;
      const b = primaryColor[2] + (accentColor[2] - primaryColor[2]) * alpha;
      doc.setFillColor(r, g, b);
      doc.rect(0, i, pageWidth, 1, 'F');
    }

    // Logo simulé (cercle moderne)
    doc.setFillColor(255, 255, 255);
    doc.circle(25, 20, 8, 'F');
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.circle(25, 20, 6, 'F');

    // Nom entreprise moderne - LOGISTIGA
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('LOGISTIGA GABON', 40, 18);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Service Portuaire Premium', 40, 25);

    // NOTE DE DÉBIT stylée
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const noteText = 'NOTE DE DÉBIT';
    const noteWidth = doc.getTextWidth(noteText);
    
    // Fond blanc pour le texte
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - noteWidth - 25, 10, noteWidth + 10, 15, 2, 2, 'F');
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(noteText, pageWidth - noteWidth - 20, 20);

    // Informations document dans l'en-tête
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const docNumber = `N° ND-${new Date().getFullYear()}`;
    const currentDate = new Date().toLocaleDateString('fr-FR');
    doc.text(docNumber, pageWidth - 80, 27);
    doc.text(currentDate, pageWidth - 80, 32);

    return yPos + 40;
  }

  private addCompactContainerCard(doc: jsPDF, container: DetentionContainer, x: number, y: number, width: number, bgColor: [number, number, number], primaryColor: [number, number, number]): number {
    const cardHeight = 35; // Réduit de 45 à 35
    
    // Fond de carte avec ombre
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x + 1, y + 1, width, cardHeight, 3, 3, 'F'); // Ombre réduite
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.roundedRect(x, y, width, cardHeight, 3, 3, 'F');

    // En-tête de carte
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(x, y, width, 10, 3, 3, 'F'); // Réduit de 12 à 10
    doc.rect(x, y + 7, width, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9); // Réduit de 10 à 9
    doc.setFont('helvetica', 'bold');
    doc.text('CONTENEUR & CLIENT', x + 5, y + 7);

    // Contenu en deux colonnes - plus compact
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8); // Réduit de 9 à 8
    doc.setFont('helvetica', 'normal');
    
    const leftCol = x + 5;
    const rightCol = x + width/2 + 5;
    let contentY = y + 16; // Ajusté

    // Colonne gauche - espacement réduit
    doc.setFont('helvetica', 'bold');
    doc.text('Conteneur:', leftCol, contentY);
    doc.setFont('helvetica', 'normal');
    doc.text(container.numeroConteneur, leftCol + 25, contentY);
    
    contentY += 5; // Réduit de 6 à 5
    doc.setFont('helvetica', 'bold');
    doc.text('Armateur:', leftCol, contentY);
    doc.setFont('helvetica', 'normal');
    doc.text(container.codeArmateur, leftCol + 25, contentY);

    contentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Type:', leftCol, contentY);
    doc.setFont('helvetica', 'normal');
    doc.text(container.typeConteneur, leftCol + 25, contentY);

    // Colonne droite
    contentY = y + 16;
    doc.setFont('helvetica', 'bold');
    doc.text('Client:', rightCol, contentY);
    doc.setFont('helvetica', 'normal');
    const clientName = container.nomClient.length > 12 ? container.nomClient.substring(0, 12) + '...' : container.nomClient;
    doc.text(clientName, rightCol + 15, contentY);

    contentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Sortie:', rightCol, contentY);
    doc.setFont('helvetica', 'normal');
    doc.text(container.dateSortie, rightCol + 15, contentY);

    contentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Retour:', rightCol, contentY);
    doc.setFont('helvetica', 'normal');
    doc.text(container.dateRetour || 'En cours', rightCol + 15, contentY);

    return y + cardHeight + 3; // Espacement réduit
  }

  private addCompactTimeline(doc: jsPDF, container: DetentionContainer, x: number, y: number, width: number, successColor: [number, number, number], accentColor: [number, number, number]): number {
    const timelineHeight = 25; // Réduit de 35 à 25
    
    // Fond de timeline
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, width, timelineHeight, 3, 3, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(x, y, width, timelineHeight, 3, 3, 'S');

    // Titre
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9); // Réduit
    doc.setFont('helvetica', 'bold');
    doc.text('CHRONOLOGIE DES JOURS', x + 5, y + 8);

    // Barre de progression visuelle
    const barY = y + 12; // Ajusté
    const barHeight = 6; // Réduit de 8 à 6
    const barWidth = width - 20;
    const barX = x + 10;

    // Fond de la barre
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(barX, barY, barWidth, barHeight, 3, 3, 'F');

    // Jours autorisés (vert)
    const totalJours = Math.max(container.joursRealises, container.joursBAT);
    const authorizedRatio = container.joursBAT / totalJours;
    const authorizedWidth = barWidth * authorizedRatio;
    doc.setFillColor(successColor[0], successColor[1], successColor[2]);
    doc.roundedRect(barX, barY, authorizedWidth, barHeight, 3, 3, 'F');

    // Jours de dépassement (rouge)
    if (container.joursDepassement > 0) {
      const excessRatio = container.joursDepassement / totalJours;
      const excessWidth = barWidth * excessRatio;
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.roundedRect(barX + authorizedWidth, barY, excessWidth, barHeight, 3, 3, 'F');
    }

    // Labels - plus compacts
    doc.setFontSize(7); // Réduit
    doc.setTextColor(0, 0, 0);
    doc.text(`${container.joursBAT}j autorisés`, barX, barY + barHeight + 3);
    doc.text(`${container.joursDepassement}j dépassement`, barX + barWidth - 40, barY + barHeight + 3);

    return y + timelineHeight + 3;
  }

  private addCompactDetentionAnalysis(doc: jsPDF, container: DetentionContainer, x: number, y: number, width: number, primaryColor: [number, number, number], warningColor: [number, number, number]): number {
    const analysisHeight = 40; // Réduit de 55 à 40
    
    // Carte d'analyse
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, width, analysisHeight, 3, 3, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(x, y, width, analysisHeight, 3, 3, 'S');

    // En-tête
    doc.setFillColor(warningColor[0], warningColor[1], warningColor[2]);
    doc.roundedRect(x, y, width, 10, 3, 3, 'F'); // Réduit
    doc.rect(x, y + 7, width, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9); // Réduit
    doc.setFont('helvetica', 'bold');
    doc.text('ANALYSE DE LA DÉTENTION', x + 5, y + 7);

    // Statistiques clés - format compact
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8); // Réduit
    let statsY = y + 16;

    const stats = [
      { label: 'Durée hors port', value: `${container.joursRealises} jours`, icon: '⏱️' },
      { label: 'Dépassement', value: `${container.joursDepassement} jours`, icon: '⚠️' },
      { label: 'Coût/jour', value: `${this.formatCurrency(container.coutParJour)} FCFA`, icon: '💰' }
    ];

    stats.forEach((stat, index) => {
      const statY = statsY + (index * 6); // Espacement réduit
      doc.setFont('helvetica', 'normal');
      doc.text(`${stat.icon} ${stat.label}:`, x + 5, statY);
      doc.setFont('helvetica', 'bold');
      doc.text(stat.value, x + 70, statY); // Position ajustée
    });

    // Responsabilité si définie - plus compact
    if (container.responsabilite) {
      statsY += 22;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('🎯 Responsabilité:', x + 5, statsY);
      doc.setFont('helvetica', 'normal');
      const respText = this.getResponsabiliteText(container);
      const shortRespText = respText.length > 35 ? respText.substring(0, 35) + '...' : respText;
      doc.text(shortRespText, x + 5, statsY + 4);
    }

    return y + analysisHeight + 3;
  }

  private addCompactCalculationCard(doc: jsPDF, container: DetentionContainer, x: number, y: number, width: number, accentColor: [number, number, number], primaryColor: [number, number, number]): number {
    const cardHeight = 60; // Réduit de 80 à 60
    
    // Carte de calcul avec design moderne
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x + 1, y + 1, width, cardHeight, 3, 3, 'F'); // Ombre
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(x, y, width, cardHeight, 3, 3, 'F');

    // En-tête rouge pour le montant
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.roundedRect(x, y, width, 12, 3, 3, 'F');
    doc.rect(x, y + 9, width, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CALCUL DU MONTANT', x + 5, y + 8);

    // Détail du calcul - plus compact
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8); // Réduit
    let calcY = y + 18;

    // Base de calcul
    doc.setFont('helvetica', 'normal');
    doc.text('Base de calcul:', x + 5, calcY);
    calcY += 5;
    doc.setFont('helvetica', 'bold');
    const calcText = `${container.joursDepassement} jours × ${this.formatCurrency(container.coutParJour)} FCFA`;
    doc.text(calcText, x + 5, calcY);

    calcY += 8;
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.line(x + 5, calcY, x + width - 5, calcY);

    calcY += 6;
    // Sous-total
    doc.setFont('helvetica', 'normal');
    doc.text('Sous-total HT:', x + 5, calcY);
    doc.setFont('helvetica', 'bold');
    doc.text(`${this.formatCurrency(container.montantTotal)} FCFA`, x + width - 70, calcY);

    calcY += 6;
    // Total final avec design spécial
    const totalBoxHeight = 14; // Légèrement plus grand pour la lisibilité
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(x + 5, calcY, width - 10, totalBoxHeight, 2, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL À PAYER', x + 8, calcY + 5);
    doc.setFontSize(10);
    doc.text(`${this.formatCurrency(container.montantTotal)} FCFA`, x + 8, calcY + 11);

    return y + cardHeight + 3;
  }

  private addCompactResponsibilityBreakdown(doc: jsPDF, container: DetentionContainer, x: number, y: number, width: number, primaryColor: [number, number, number], accentColor: [number, number, number]): number {
    const breakdownHeight = 55; // Réduit de 70 à 55
    
    // Carte de répartition
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, width, breakdownHeight, 3, 3, 'F');
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(1);
    doc.roundedRect(x, y, width, breakdownHeight, 3, 3, 'S');

    // En-tête
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(x, y, width, 10, 3, 3, 'F'); // Réduit
    doc.rect(x, y + 7, width, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('RÉPARTITION', x + 5, y + 7);

    // Calcul des montants selon la responsabilité
    let montantClient = 0;
    let montantLogistiga = 0;

    if (container.responsabilite === 'client') {
      montantClient = container.montantTotal;
      montantLogistiga = 0;
    } else if (container.responsabilite === 'logistiga') {
      montantClient = 0;
      montantLogistiga = container.montantTotal;
    } else if (container.responsabilite === 'partagee') {
      const coutParJour = typeof container.coutParJour === 'string' ? parseFloat(container.coutParJour) : container.coutParJour;
      montantClient = (container.joursClient || 0) * coutParJour;
      montantLogistiga = (container.joursLogistiga || 0) * coutParJour;
    }

    // Contenu du tableau - plus compact
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    let contentY = y + 15;

    // Ligne Client
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT:', x + 5, contentY);
    doc.setFont('helvetica', 'normal');
    
    let joursText = '0 jour';
    if (container.responsabilite === 'partagee') {
      joursText = `${container.joursClient || 0} jours`;
    } else if (container.responsabilite === 'client') {
      joursText = `${container.joursDepassement} jours`;
    }
    doc.text(joursText, x + 35, contentY);
    
    // Montant client
    doc.setFont('helvetica', 'bold');
    if (montantClient > 0) {
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    }
    doc.text(`${this.formatCurrency(montantClient)} FCFA`, x + width - 60, contentY);

    contentY += 6; // Espacement réduit
    // Ligne Logistiga
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('LOGISTIGA:', x + 5, contentY);
    doc.setFont('helvetica', 'normal');
    
    joursText = '0 jour';
    if (container.responsabilite === 'partagee') {
      joursText = `${container.joursLogistiga || 0} jours`;
    } else if (container.responsabilite === 'logistiga') {
      joursText = `${container.joursDepassement} jours`;
    }
    doc.text(joursText, x + 35, contentY);
    
    // Montant Logistiga
    doc.setFont('helvetica', 'bold');
    if (montantLogistiga > 0) {
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    }
    doc.text(`${this.formatCurrency(montantLogistiga)} FCFA`, x + width - 60, contentY);

    contentY += 8;
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.line(x + 5, contentY, x + width - 5, contentY);

    contentY += 6;
    // Total final
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', x + 5, contentY);
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${this.formatCurrency(container.montantTotal)} FCFA`, x + width - 60, contentY);

    return y + breakdownHeight + 3;
  }

  private addUltraModernFooter(doc: jsPDF, pageWidth: number, pageHeight: number, primaryColor: [number, number, number]): void {
    const footerHeight = 25;
    const footerY = pageHeight - footerHeight;

    // Fond dégradé inverse pour le footer
    for (let i = 0; i < footerHeight; i++) {
      const alpha = i / footerHeight;
      const grayValue = 250 - (alpha * 50);
      doc.setFillColor(grayValue, grayValue, grayValue);
      doc.rect(0, footerY + i, pageWidth, 1, 'F');
    }

    // Ligne décorative
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(2);
    doc.line(20, footerY + 5, pageWidth - 20, footerY + 5);

    // Informations en trois colonnes
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    
    // Colonne 1: Adresse
    doc.text(this.companyInfo.address, 20, footerY + 12);
    
    // Colonne 2: Contact
    const contactX = pageWidth / 2 - 40;
    doc.text(`📞 ${this.companyInfo.phone}`, contactX, footerY + 12);
    doc.text(`✉️ ${this.companyInfo.email}`, contactX, footerY + 18);
    
    // Colonne 3: Document info
    const docInfoX = pageWidth - 120;
    doc.text(`Généré le ${new Date().toLocaleString('fr-FR')}`, docInfoX, footerY + 12);
    doc.text('Document confidentiel - Répartition des coûts', docInfoX, footerY + 18);
  }

  private getResponsabiliteText(container: DetentionContainer): string {
    switch (container.responsabilite) {
      case 'client':
        return 'La totalité de la détention est imputable au client.';
      case 'logistiga':
        return 'La totalité de la détention est imputable à Logistiga Gabon.';
      case 'partagee':
        return 'La responsabilité de la détention est partagée entre le client et Logistiga.';
      default:
        return 'Responsabilité à déterminer.';
    }
  }

  private formatCurrency(amount: number | string): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    // Utiliser l'espace insécable pour les milliers (comme en français)
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    }).format(numAmount).replace(/\s/g, ' '); // Remplacer l'espace par un espace insécable
  }
}

export const detentionPdfService = new DetentionPdfService();