import jsPDF from 'jspdf';
import { ArchiveBase } from '@/types/archives';
import { formatCurrencyForPdf } from '@/lib/currency';
import logistigaLogo from '@/assets/logistiga-logo-full.png';

class ArchiveBasePdfService {
  generateArchivePdf(archive: ArchiveBase): void {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    let currentY = 15;

    // Header avec logo
    currentY = this.addHeader(doc, pageWidth, currentY);
    currentY += 8;

    // Titre
    currentY = this.addTitle(doc, archive, pageWidth, currentY);
    currentY += 10;

    // Informations Client et Conteneur
    currentY = this.addClientInfo(doc, archive, pageWidth, currentY);
    currentY += 8;

    // Informations Transport
    currentY = this.addTransportInfo(doc, archive, pageWidth, currentY);
    currentY += 8;

    // Détails de l'opération
    currentY = this.addOperationDetails(doc, archive, pageWidth, currentY);
    currentY += 10;

    // Section Montant
    currentY = this.addAmountSection(doc, archive, pageWidth, currentY);

    // Footer
    this.addFooter(doc, pageWidth, pageHeight);

    const fileName = `archive-base-${archive.numeroFacture}-${Date.now()}.pdf`;
    doc.save(fileName);
  }

  private addHeader(doc: jsPDF, pageWidth: number, startY: number): number {
    const logoWidth = 80;
    const logoHeight = 23;
    const logoX = (pageWidth - logoWidth) / 2;
    
    try {
      doc.addImage(logistigaLogo, 'PNG', logoX, startY, logoWidth, logoHeight);
    } catch (e) {
      console.error('Erreur lors du chargement du logo:', e);
    }

    return startY + logoHeight;
  }

  private addTitle(doc: jsPDF, archive: ArchiveBase, pageWidth: number, startY: number): number {
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.line(15, startY, pageWidth - 15, startY);
    
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(15, startY + 2, pageWidth - 30, 14, 3, 3, 'F');
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    const operationType = archive.typeOperation === 'stockage' ? 'STOCKAGE' : 'DOUBLE RELEVAGE';
    doc.text(`FACTURE - ${operationType}`, pageWidth / 2, startY + 11, { align: 'center' });
    
    const infoY = startY + 20;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, infoY, pageWidth - 30, 10, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.roundedRect(15, infoY, pageWidth - 30, 10, 2, 2, 'S');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    
    doc.text('Date facturation:', 20, infoY + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const dateFacture = new Date(archive.dateFacturation).toLocaleDateString('fr-FR');
    doc.text(dateFacture, 20, infoY + 7.5);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('N° Facture:', pageWidth - 60, infoY + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(archive.numeroFacture, pageWidth - 60, infoY + 7.5);
    
    return infoY + 12;
  }

  private addClientInfo(doc: jsPDF, archive: ArchiveBase, pageWidth: number, startY: number): number {
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(15, startY, pageWidth - 30, 9, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('INFORMATIONS CLIENT', 20, startY + 6);
    
    const contentHeight = 20;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'S');
    
    const contentY = startY + 15;
    const colWidth = (pageWidth - 30) / 2;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Client:', 20, contentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text(archive.nomClient, 20, contentY + 5);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Numéro Conteneur:', 15 + colWidth, contentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text(archive.numeroConteneur, 15 + colWidth, contentY + 5);
    
    return startY + 9 + contentHeight;
  }

  private addTransportInfo(doc: jsPDF, archive: ArchiveBase, pageWidth: number, startY: number): number {
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(15, startY, pageWidth - 30, 9, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('INFORMATIONS TRANSPORT', 20, startY + 6);
    
    const contentHeight = 16;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'S');
    
    const contentY = startY + 15;
    const colWidth = (pageWidth - 30) / 2;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Camion Arrivée:', 20, contentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(archive.camionArrivee || 'N/A', 20, contentY + 4);
    
    if (archive.camionSortie) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Camion Sortie:', 15 + colWidth, contentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(archive.camionSortie, 15 + colWidth, contentY + 4);
    }
    
    return startY + 9 + contentHeight;
  }

  private addOperationDetails(doc: jsPDF, archive: ArchiveBase, pageWidth: number, startY: number): number {
    const typeLabel = archive.typeOperation === 'stockage' ? 'STOCKAGE' : 'DOUBLE RELEVAGE';
    
    doc.setFillColor(139, 92, 246);
    doc.roundedRect(15, startY, pageWidth - 30, 9, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`DÉTAILS - ${typeLabel}`, 20, startY + 6);
    
    const contentHeight = archive.typeOperation === 'stockage' ? 38 : 28;
    
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'S');
    
    let contentY = startY + 15;
    const colWidth = (pageWidth - 30) / 2;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Provenance:', 20, contentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(archive.provenance, 20, contentY + 4);
    
    contentY += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Date arrivée:', 20, contentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(new Date(archive.dateArriveeBase).toLocaleDateString('fr-FR'), 20, contentY + 4);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Date sortie:', 15 + colWidth, contentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(new Date(archive.dateSortieBase).toLocaleDateString('fr-FR'), 15 + colWidth, contentY + 4);
    
    if (archive.typeOperation === 'stockage') {
      contentY += 10;
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Jours gratuits:', 20, contentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(archive.joursGratuits?.toString() || '0', 20, contentY + 4);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Jours à facturer:', 15 + colWidth, contentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(220, 38, 38);
      doc.text(archive.joursPayants?.toString() || '0', 15 + colWidth, contentY + 4);
    }
    
    return startY + 9 + contentHeight;
  }

  private addAmountSection(doc: jsPDF, archive: ArchiveBase, pageWidth: number, startY: number): number {
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(15, startY, pageWidth - 30, 9, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('MONTANT À PAYER', 20, startY + 6);
    
    const contentHeight = 28;
    
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'S');
    
    let contentY = startY + 17;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Montant HT:', 20, contentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(formatCurrencyForPdf(archive.montantTotalFacture), pageWidth - 20, contentY, { align: 'right' });
    
    contentY += 8;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, contentY, pageWidth - 20, contentY);
    
    contentY += 8;
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(20, contentY - 5, pageWidth - 40, 12, 2, 2, 'F');
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('MONTANT TOTAL:', 25, contentY + 2);
    
    doc.setFontSize(16);
    doc.text(formatCurrencyForPdf(archive.montantTotalFacture), pageWidth - 25, contentY + 2, { align: 'right' });
    
    return startY + 9 + contentHeight;
  }

  private addFooter(doc: jsPDF, pageWidth: number, pageHeight: number): void {
    const footerY = pageHeight - 25;
    
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, pageWidth - 15, footerY);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('LOGISTIGA SARL', pageWidth / 2, footerY + 5, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Transport - Stockage - Manutention', pageWidth / 2, footerY + 9, { align: 'center' });
    doc.text('Zone Industrielle, Dakar, Sénégal', pageWidth / 2, footerY + 13, { align: 'center' });
    doc.text('Tél: +221 33 XXX XX XX | Email: contact@logistiga.com', pageWidth / 2, footerY + 17, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    const generationDate = new Date().toLocaleString('fr-FR');
    doc.text(`Document généré le ${generationDate}`, pageWidth / 2, footerY + 21, { align: 'center' });
  }
}

export const archiveBasePdfService = new ArchiveBasePdfService();
