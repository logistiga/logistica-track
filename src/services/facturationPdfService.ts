import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FactureInterne } from '@/types/facturation';
import { formatCurrencyForPdf } from '@/lib/currency';
import logistigaLogo from '@/assets/logistiga-logo-full.png';

class FacturationPdfService {
  generateFacturePdf(facture: FactureInterne): void {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    let currentY = 15;

    // Header avec logo
    currentY = this.addHeader(doc, pageWidth, currentY);
    currentY += 8;

    // Titre principal
    currentY = this.addTitle(doc, facture, pageWidth, currentY);
    currentY += 10;

    // Section Informations Client (layout 2 colonnes)
    currentY = this.addClientInfo(doc, facture, pageWidth, currentY);
    currentY += 8;

    // Section Transport (Camion et Remorque)
    const details = facture.detailsOperation;
    const hasTransportInfo = details?.plaque_camion || details?.plaque_remorque || facture.camion || facture.remorque;
    
    if (hasTransportInfo) {
      currentY = this.addTransportInfo(doc, facture, pageWidth, currentY);
      currentY += 8;
    }

    // Section Détails de l'opération
    currentY = this.addOperationDetails(doc, facture, pageWidth, currentY);
    currentY += 10;

    // Section Montants - Format moderne
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

    return startY + logoHeight;
  }

  private addTitle(doc: jsPDF, facture: FactureInterne, pageWidth: number, startY: number): number {
    // Ligne de séparation supérieure
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.line(15, startY, pageWidth - 15, startY);
    
    // Titre principal avec fond coloré moderne
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(15, startY + 2, pageWidth - 30, 14, 3, 3, 'F');
    
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('NOTE DE FACTURATION INTERNE', pageWidth / 2, startY + 11, { align: 'center' });
    
    // Informations de référence (2 colonnes)
    const infoY = startY + 20;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, infoY, pageWidth - 30, 10, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.roundedRect(15, infoY, pageWidth - 30, 10, 2, 2, 'S');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    
    // Colonne gauche
    doc.text('Date d\'émission:', 20, infoY + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const dateFacture = new Date(facture.dateFacture).toLocaleDateString('fr-FR');
    doc.text(dateFacture, 20, infoY + 7.5);
    
    // Colonne droite
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('N° Facture:', pageWidth - 60, infoY + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(facture.numeroFacture, pageWidth - 60, infoY + 7.5);
    
    return infoY + 12;
  }

  private addClientInfo(doc: jsPDF, facture: FactureInterne, pageWidth: number, startY: number): number {
    // En-tête de section moderne
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(15, startY, pageWidth - 30, 9, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('INFORMATIONS CLIENT', 20, startY + 6);
    
    // Contenu avec layout 2 colonnes
    const contentHeight = 20;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'S');
    
    const contentY = startY + 15;
    const colWidth = (pageWidth - 30) / 2;
    
    // Colonne gauche - Client
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Client:', 20, contentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text(facture.nomClient || 'N/A', 20, contentY + 5);
    
    // Colonne droite - Numéro conteneur
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Numéro Conteneur:', 15 + colWidth, contentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text(facture.numeroConteneur || 'N/A', 15 + colWidth, contentY + 5);
    
    return startY + 9 + contentHeight;
  }

  private addTransportInfo(doc: jsPDF, facture: FactureInterne, pageWidth: number, startY: number): number {
    // Get info from detailsOperation first, fallback to direct properties
    const details = facture.detailsOperation;
    const camion = details?.plaque_camion || facture.camion;
    const remorque = details?.plaque_remorque || facture.remorque;

    // En-tête de section
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(15, startY, pageWidth - 30, 9, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('INFORMATIONS TRANSPORT', 20, startY + 6);
    
    // Contenu avec layout 2 colonnes
    const contentHeight = 16;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'S');
    
    const contentY = startY + 15;
    const colWidth = (pageWidth - 30) / 2;
    
    // Colonne gauche - Camion
    if (camion) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Camion:', 20, contentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.text(camion, 20, contentY + 5);
    }
    
    // Colonne droite - Remorque
    if (remorque) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Remorque:', 15 + colWidth, contentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.text(remorque, 15 + colWidth, contentY + 5);
    }
    
    return startY + 9 + contentHeight;
  }

  private addOperationDetails(doc: jsPDF, facture: FactureInterne, pageWidth: number, startY: number): number {
    const typeLabel = this.getOperationLabel(facture.typeOperation);
    const details = facture.detailsOperation;
    
    // En-tête de section
    doc.setFillColor(139, 92, 246);
    doc.roundedRect(15, startY, pageWidth - 30, 9, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`DÉTAILS - ${typeLabel.toUpperCase()}`, 20, startY + 6);
    
    // Calcul de la hauteur dynamique (compacte pour stockage)
    let contentHeight = 24;
    if (facture.typeOperation === 'stockage') {
      contentHeight = details?.date_arrivee ? 38 : 28;
    } else if (facture.typeOperation === 'double_relevage' && details) {
      contentHeight = 40;
    } else if (facture.typeOperation === 'depotage' && details?.type_marchandise) {
      contentHeight = 32;
    }
    
    // Contenu
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'S');
    
    let contentY = startY + 15;
    const colWidth = (pageWidth - 30) / 2;
    
    // Type d'opération et date (1ère ligne, 2 colonnes)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Type d\'opération:', 20, contentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(typeLabel, 20, contentY + 4);
    
    const dateOperation = new Date(facture.dateSortieOperation).toLocaleDateString('fr-FR');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Date de sortie:', 15 + colWidth, contentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(dateOperation, 15 + colWidth, contentY + 4);
    
    // Détails spécifiques selon le type
    if (facture.typeOperation === 'stockage') {
      contentY += 10;
      
      // Dates (compactes)
      if (details?.date_arrivee) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text('Date arrivée:', 20, contentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(new Date(details.date_arrivee).toLocaleDateString('fr-FR'), 20, contentY + 4);
        
        if (details.date_sortie) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(71, 85, 105);
          doc.text('Date sortie:', 15 + colWidth, contentY);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          doc.text(new Date(details.date_sortie).toLocaleDateString('fr-FR'), 15 + colWidth, contentY + 4);
        }
        contentY += 10;
      }
      
      // Jours (compacts)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Jours gratuits:', 20, contentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text((details?.jours_gratuits || facture.joursGratuits || 0).toString(), 20, contentY + 4);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Jours à facturer:', 15 + colWidth, contentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(220, 38, 38);
      doc.text((details?.jours_detention || facture.joursPayants || 0).toString(), 15 + colWidth, contentY + 4);
      
      // Tarif journalier (compact)
      const tarifJour = details?.prix_par_jour || facture.tarifJournalier;
      if (tarifJour !== undefined) {
        contentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text('Tarif journalier:', 20, contentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(formatCurrencyForPdf(tarifJour), 20, contentY + 4);
      }
    } else if (facture.typeOperation === 'double_relevage' && details) {
      contentY += 12;
      
      // Camion ameneur
      if (details.camion_ameneur_plaque) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text('Camion ameneur:', 20, contentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(details.camion_ameneur_plaque, 20, contentY + 4);
        
        if (details.camion_ameneur_remorque) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(71, 85, 105);
          doc.text('Remorque:', 15 + colWidth, contentY);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          doc.text(details.camion_ameneur_remorque, 15 + colWidth, contentY + 4);
        }
        contentY += 12;
      }
      
      // Camion récupérateur
      if (details.camion_recuperateur_plaque) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text('Camion récupérateur:', 20, contentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(details.camion_recuperateur_plaque, 20, contentY + 4);
        
        if (details.camion_recuperateur_remorque) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(71, 85, 105);
          doc.text('Remorque:', 15 + colWidth, contentY);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(15, 23, 42);
          doc.text(details.camion_recuperateur_remorque, 15 + colWidth, contentY + 4);
        }
      }
    } else if (facture.typeOperation === 'depotage') {
      contentY += 12;
      
      if (details?.date_depotage) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text('Date dépotage:', 20, contentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(new Date(details.date_depotage).toLocaleDateString('fr-FR'), 20, contentY + 4);
        contentY += 12;
      }
      
      if (details?.type_marchandise) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text('Type marchandise:', 20, contentY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(details.type_marchandise, 20, contentY + 4);
      }
    }
    
    return startY + 9 + contentHeight;
  }

  private addAmountSection(doc: jsPDF, facture: FactureInterne, pageWidth: number, startY: number): number {
    // En-tête de section
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(15, startY, pageWidth - 30, 9, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('MONTANT À PAYER', 20, startY + 6);
    
    // Calcul de la hauteur
    const hasTva = facture.montantTva !== undefined && facture.montantTva > 0;
    const contentHeight = hasTva ? 44 : 28;
    
    // Contenu
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(15, startY + 9, pageWidth - 30, contentHeight, 2, 2, 'S');
    
    let contentY = startY + 17;
    
    // Montant HT
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Montant HT:', 20, contentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(formatCurrencyForPdf(facture.montantAPayer), pageWidth - 20, contentY, { align: 'right' });
    
    // TVA si applicable
    if (hasTva) {
      contentY += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('TVA (18%):', 20, contentY);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.text(formatCurrencyForPdf(facture.montantTva!), pageWidth - 20, contentY, { align: 'right' });
    }
    
    // Ligne de séparation
    contentY += 8;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, contentY, pageWidth - 20, contentY);
    
    // MONTANT TOTAL (très visible)
    contentY += 8;
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(20, contentY - 5, pageWidth - 40, 12, 2, 2, 'F');
    
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('MONTANT TOTAL:', 25, contentY + 2);
    
    const montantFinal = facture.montantTtc !== undefined ? facture.montantTtc : facture.montantAPayer;
    doc.setFontSize(16);
    doc.text(formatCurrencyForPdf(montantFinal), pageWidth - 25, contentY + 2, { align: 'right' });
    
    return startY + 9 + contentHeight;
  }

  private addFooter(doc: jsPDF, pageWidth: number, pageHeight: number): void {
    const footerY = pageHeight - 25;
    
    // Ligne de séparation
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, pageWidth - 15, footerY);
    
    // Informations de l'entreprise
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
    
    // Date de génération
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    const generationDate = new Date().toLocaleString('fr-FR');
    doc.text(`Document généré le ${generationDate}`, pageWidth / 2, footerY + 21, { align: 'center' });
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
