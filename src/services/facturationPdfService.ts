import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FactureInterne } from '@/types/facturation';
import { formatCurrency } from '@/lib/currency';
import logistigaLogo from '@/assets/logistiga-logo-full.png';

class FacturationPdfService {
  generateFacturePdf(facture: FactureInterne): void {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    let currentY = 15;

    // Header avec logo
    currentY = this.addHeader(doc, pageWidth, currentY);
    currentY += 5;

    // Titre principal
    currentY = this.addTitle(doc, facture, pageWidth, currentY);
    currentY += 8;

    // Section Informations Client
    currentY = this.addClientInfo(doc, facture, pageWidth, currentY);
    currentY += 5;

    // Section Détails selon le type d'opération
    currentY = this.addOperationDetails(doc, facture, pageWidth, currentY);
    currentY += 5;

    // Section Montant
    currentY = this.addAmountSection(doc, facture, pageWidth, currentY);

    // Footer
    this.addFooter(doc, pageWidth, pageHeight);

    const fileName = `facture-${facture.numeroFacture}-${new Date().getTime()}.pdf`;
    doc.save(fileName);
  }

  private addHeader(doc: jsPDF, pageWidth: number, startY: number): number {
    // Logo centré
    const logoWidth = 80;
    const logoHeight = 23;
    const logoX = (pageWidth - logoWidth) / 2;
    
    try {
      doc.addImage(logistigaLogo, 'PNG', logoX, startY, logoWidth, logoHeight);
    } catch (e) {
      console.error('Erreur lors du chargement du logo:', e);
    }

    return startY + logoHeight + 8;
  }

  private addTitle(doc: jsPDF, facture: FactureInterne, pageWidth: number, startY: number): number {
    // Ligne de séparation
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.8);
    doc.line(20, startY, pageWidth - 20, startY);
    
    // Titre principal avec fond coloré
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(20, startY + 3, pageWidth - 40, 12, 2, 2, 'F');
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('NOTE DE FACTURATION INTERNE', pageWidth / 2, startY + 12, { align: 'center' });
    
    // Informations de la facture
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, startY + 18, pageWidth - 40, 9, 2, 2, 'F');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const dateFacture = new Date(facture.dateFacture).toLocaleDateString('fr-FR');
    doc.text(`Date d'émission: ${dateFacture}`, 25, startY + 24);
    doc.text(`N° Facture: ${facture.numeroFacture}`, pageWidth - 25, startY + 24, { align: 'right' });
    
    return startY + 30;
  }

  private addClientInfo(doc: jsPDF, facture: FactureInterne, pageWidth: number, startY: number): number {
    // En-tête de section
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(20, startY, pageWidth - 40, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('INFORMATIONS CLIENT', 25, startY + 5.5);
    
    // Fond du contenu
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, startY + 8, pageWidth - 40, 22, 2, 2, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.1);
    doc.roundedRect(20, startY + 8, pageWidth - 40, 22, 2, 2, 'S');
    
    // Contenu
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    let contentY = startY + 14;
    
    this.addField(doc, 'Client:', facture.nomClient, 25, contentY);
    contentY += 6;
    this.addField(doc, 'Numéro Conteneur:', facture.numeroConteneur, 25, contentY);
    
    return startY + 32;
  }

  private addOperationDetails(doc: jsPDF, facture: FactureInterne, pageWidth: number, startY: number): number {
    // En-tête de section
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(20, startY, pageWidth - 40, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    
    const typeLabel = this.getOperationLabel(facture.typeOperation);
    doc.text(`DÉTAILS - ${typeLabel.toUpperCase()}`, 25, startY + 5.5);
    
    // Calcul de la hauteur selon le type d'opération
    let contentHeight = 22;
    if (facture.typeOperation === 'stockage' && (facture.joursGratuits || facture.joursPayants)) {
      contentHeight = 34;
    }
    
    // Fond du contenu
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, startY + 8, pageWidth - 40, contentHeight, 2, 2, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.1);
    doc.roundedRect(20, startY + 8, pageWidth - 40, contentHeight, 2, 2, 'S');
    
    // Contenu selon le type
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    let contentY = startY + 14;
    
    this.addField(doc, 'Type d\'opération:', typeLabel, 25, contentY);
    contentY += 6;
    
    const dateOperation = new Date(facture.dateSortieOperation).toLocaleDateString('fr-FR');
    this.addField(doc, 'Date de sortie:', dateOperation, 25, contentY);
    
    if (facture.typeOperation === 'stockage') {
      contentY += 6;
      if (facture.joursGratuits !== undefined) {
        this.addField(doc, 'Jours gratuits:', facture.joursGratuits.toString(), 25, contentY);
      }
      
      contentY += 6;
      if (facture.joursPayants !== undefined) {
        this.addField(doc, 'Jours payants:', facture.joursPayants.toString(), 25, contentY);
      }
      
      if (facture.tarifJournalier !== undefined) {
        contentY += 6;
        this.addField(doc, 'Tarif journalier:', formatCurrency(facture.tarifJournalier), 25, contentY);
      }
    }
    
    if (facture.notes) {
      contentY += 8;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(80, 80, 80);
      doc.text('Notes:', 25, contentY);
      const splitNotes = doc.splitTextToSize(facture.notes, pageWidth - 50);
      doc.text(splitNotes, 25, contentY + 4);
    }
    
    return startY + contentHeight + 10;
  }

  private addAmountSection(doc: jsPDF, facture: FactureInterne, pageWidth: number, startY: number): number {
    // En-tête de section
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(20, startY, pageWidth - 40, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('MONTANT À PAYER', 25, startY + 5.5);
    
    // Calcul de la hauteur
    let contentHeight = 16;
    if (facture.montantTva || facture.montantTtc) {
      contentHeight = 28;
    }
    
    // Fond du contenu
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, startY + 8, pageWidth - 40, contentHeight, 2, 2, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.1);
    doc.roundedRect(20, startY + 8, pageWidth - 40, contentHeight, 2, 2, 'S');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    let contentY = startY + 14;
    
    this.addField(doc, 'Montant HT:', formatCurrency(facture.montantAPayer), 25, contentY);
    
    if (facture.montantTva !== undefined) {
      contentY += 6;
      this.addField(doc, 'TVA (18%):', formatCurrency(facture.montantTva), 25, contentY);
    }
    
    // Montant total avec fond accentué
    contentY += 8;
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(25, contentY - 4, pageWidth - 50, 8, 1, 1, 'F');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('MONTANT TOTAL:', 30, contentY + 1.5);
    
    const montantFinal = facture.montantTtc !== undefined ? facture.montantTtc : facture.montantAPayer;
    doc.text(formatCurrency(montantFinal), pageWidth - 30, contentY + 1.5, { align: 'right' });
    
    return startY + contentHeight + 10;
  }

  private addFooter(doc: jsPDF, pageWidth: number, pageHeight: number): void {
    const footerY = pageHeight - 25;
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, footerY, pageWidth - 20, footerY);
    
    // Informations de l'entreprise
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    
    doc.text('LOGISTIGA SARL', pageWidth / 2, footerY + 5, { align: 'center' });
    doc.text('Zone Industrielle, Dakar, Sénégal', pageWidth / 2, footerY + 9, { align: 'center' });
    doc.text('Tél: +221 33 XXX XX XX | Email: contact@logistiga.com', pageWidth / 2, footerY + 13, { align: 'center' });
    
    // Date de génération
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    const generationDate = new Date().toLocaleString('fr-FR');
    doc.text(`Document généré le ${generationDate}`, pageWidth / 2, footerY + 18, { align: 'center' });
  }

  private addField(doc: jsPDF, label: string, value: string, x: number, y: number): void {
    doc.setFont('helvetica', 'bold');
    doc.text(label, x, y);
    
    doc.setFont('helvetica', 'normal');
    const labelWidth = doc.getTextWidth(label);
    doc.text(value, x + labelWidth + 2, y);
  }

  private getOperationLabel(type: string): string {
    switch(type) {
      case 'stockage':
        return 'Stockage';
      case 'double_relevage':
        return 'Double Relevage';
      case 'depotage':
        return 'Dépotage';
      default:
        return type;
    }
  }
}

export const facturationPdfService = new FacturationPdfService();
