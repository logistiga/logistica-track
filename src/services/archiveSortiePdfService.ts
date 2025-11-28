import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ArchiveSortie } from '@/types/archivesSortie';
import logistigaLogo from '@/assets/logistiga-logo-full.png';
import { formatCurrency } from '@/lib/currency';

class ArchiveSortiePdfService {
  generateArchivePdf(archive: ArchiveSortie): void {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    let currentY = 15;

    // Header avec logo
    currentY = this.addHeader(doc, pageWidth, currentY);
    currentY += 5;

    // Titre principal
    currentY = this.addTitle(doc, archive, pageWidth, currentY);
    currentY += 8;

    // Section Informations Conteneur
    currentY = this.addContainerInfo(doc, archive, pageWidth, currentY);
    currentY += 5;

    // Section Informations Transport
    currentY = this.addTransportInfo(doc, archive, pageWidth, currentY);
    currentY += 5;

    // Section Prime Chauffeur
    currentY = this.addPrimeInfo(doc, archive, pageWidth, currentY);
    currentY += 5;

    // Section Détention
    if (archive.montantTotalDetention && archive.montantTotalDetention > 0) {
      currentY = this.addDetentionInfo(doc, archive, pageWidth, currentY);
    }

    // Footer
    this.addFooter(doc, pageWidth, pageHeight);

    const fileName = `archive-${archive.numeroConteneur}-${new Date().getTime()}.pdf`;
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

    return startY + logoHeight + 8;
  }

  private addTitle(doc: jsPDF, archive: ArchiveSortie, pageWidth: number, startY: number): number {
    // Ligne de séparation
    doc.setDrawColor(34, 139, 34);
    doc.setLineWidth(0.8);
    doc.line(20, startY, pageWidth - 20, startY);
    
    // Titre principal avec fond coloré
    doc.setFillColor(34, 139, 34);
    doc.roundedRect(20, startY + 3, pageWidth - 40, 12, 2, 2, 'F');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DÉTAILS DE L\'ARCHIVE', pageWidth / 2, startY + 11, { align: 'center' });
    
    // Informations de l'archive
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, startY + 18, pageWidth - 40, 9, 2, 2, 'F');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const dateArchive = new Date(archive.dateArchivage).toLocaleDateString('fr-FR');
    doc.text(`Date d'archivage: ${dateArchive}`, 25, startY + 24);
    doc.text(`Conteneur: ${archive.numeroConteneur}`, pageWidth - 25, startY + 24, { align: 'right' });
    
    return startY + 30;
  }

  private addContainerInfo(doc: jsPDF, archive: ArchiveSortie, pageWidth: number, startY: number): number {
    // En-tête de section
    doc.setFillColor(34, 139, 34);
    doc.roundedRect(20, startY, pageWidth - 40, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('INFORMATIONS DU CONTENEUR', 25, startY + 5.5);
    
    // Fond du contenu
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, startY + 8, pageWidth - 40, 35, 2, 2, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(20, startY + 8, pageWidth - 40, 35, 2, 2, 'S');
    
    // Contenu
    const contentY = startY + 14;
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    
    const leftCol = 25;
    const rightCol = pageWidth / 2 + 10;
    let currentY = contentY;
    
    // Colonne gauche
    this.addField(doc, 'Numéro conteneur:', archive.numeroConteneur, leftCol, currentY, true);
    currentY += 7;
    
    this.addField(doc, 'Numéro BL:', archive.numeroBL || '-', leftCol, currentY);
    currentY += 7;
    
    this.addField(doc, 'Armateur:', archive.codeArmateur, leftCol, currentY, true);
    currentY += 7;
    
    this.addField(doc, 'Client:', archive.nomClient, leftCol, currentY);
    
    // Colonne droite
    currentY = contentY;
    this.addField(doc, 'Type conteneur:', archive.typeConteneur, rightCol, currentY);
    currentY += 7;
    
    this.addField(doc, 'Transitaire:', archive.nomTransitaire || '-', rightCol, currentY);
    currentY += 7;
    
    this.addField(doc, 'Destination:', archive.destinationInitiale, rightCol, currentY);
    
    return startY + 45;
  }

  private addTransportInfo(doc: jsPDF, archive: ArchiveSortie, pageWidth: number, startY: number): number {
    // En-tête de section
    doc.setFillColor(34, 139, 34);
    doc.roundedRect(20, startY, pageWidth - 40, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('INFORMATIONS TRANSPORT', 25, startY + 5.5);
    
    // Fond du contenu
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, startY + 8, pageWidth - 40, 35, 2, 2, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(20, startY + 8, pageWidth - 40, 35, 2, 2, 'S');
    
    const contentY = startY + 14;
    const leftCol = 25;
    const rightCol = pageWidth / 2 + 10;
    let currentY = contentY;
    
    // Colonne gauche
    this.addField(doc, 'Camion:', archive.camion || '-', leftCol, currentY);
    currentY += 7;
    
    this.addField(doc, 'Remorque:', archive.remorque || '-', leftCol, currentY);
    currentY += 7;
    
    this.addField(doc, 'Chauffeur:', archive.chauffeur || '-', leftCol, currentY);
    
    // Colonne droite
    currentY = contentY;
    const dateSortie = new Date(archive.dateSortiePort).toLocaleDateString('fr-FR');
    this.addField(doc, 'Date sortie port:', dateSortie, rightCol, currentY);
    currentY += 7;
    
    const dateRetour = new Date(archive.dateRetourPort).toLocaleDateString('fr-FR');
    this.addField(doc, 'Date retour port:', dateRetour, rightCol, currentY);
    
    return startY + 45;
  }

  private addPrimeInfo(doc: jsPDF, archive: ArchiveSortie, pageWidth: number, startY: number): number {
    // En-tête de section
    doc.setFillColor(34, 139, 34);
    doc.roundedRect(20, startY, pageWidth - 40, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('PRIME CHAUFFEUR', 25, startY + 5.5);
    
    // Fond du contenu
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, startY + 8, pageWidth - 40, 20, 2, 2, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(20, startY + 8, pageWidth - 40, 20, 2, 2, 'S');
    
    const contentY = startY + 14;
    const leftCol = 25;
    const rightCol = pageWidth / 2 + 10;
    
    // Montant prime (gauche)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.text('Montant prime:', leftCol, contentY);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 139, 34);
    doc.setFontSize(10);
    const montantPrime = archive.montantPrime ? formatCurrency(archive.montantPrime) : '-';
    doc.text(montantPrime, leftCol, contentY + 6);
    
    // Date paiement (droite)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.text('Date paiement:', rightCol, contentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const datePaiement = new Date(archive.dateArchivage).toLocaleDateString('fr-FR');
    doc.text(datePaiement, rightCol, contentY + 6);
    
    return startY + 30;
  }

  private addDetentionInfo(doc: jsPDF, archive: ArchiveSortie, pageWidth: number, startY: number): number {
    // En-tête de section
    doc.setFillColor(220, 53, 69);
    doc.roundedRect(20, startY, pageWidth - 40, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DÉTENTION', 25, startY + 5.5);
    
    // Fond du contenu
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, startY + 8, pageWidth - 40, 42, 2, 2, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(20, startY + 8, pageWidth - 40, 42, 2, 2, 'S');
    
    const contentY = startY + 14;
    const leftCol = 25;
    const rightCol = pageWidth / 2 + 10;
    let currentY = contentY;
    
    // Colonne gauche
    this.addField(doc, 'Jours autorisés (BAT):', `${archive.joursBAT} jours`, leftCol, currentY);
    currentY += 7;
    
    this.addField(doc, 'Jours réalisés:', `${archive.joursRealises} jours`, leftCol, currentY);
    currentY += 7;
    
    if (archive.joursDepassement > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 53, 69);
      doc.text('Dépassement:', leftCol, currentY);
      doc.text(`${archive.joursDepassement} jours`, leftCol + 30, currentY);
    } else {
      this.addField(doc, 'Dépassement:', 'Aucun', leftCol, currentY);
    }
    currentY += 7;
    
    const responsabilite = this.getResponsabilityLabel(archive);
    this.addField(doc, 'Responsabilité:', responsabilite, leftCol, currentY);
    
    // Colonne droite
    currentY = contentY;
    
    if (archive.montantTotalDetention) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.text('Montant détention:', rightCol, currentY);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 53, 69);
      doc.setFontSize(11);
      doc.text(formatCurrency(archive.montantTotalDetention), rightCol, currentY + 6);
      doc.setFontSize(8);
      currentY += 13;
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.text('Statut paiement:', rightCol, currentY);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(archive.statutPaiement === 'paye' ? 34 : 100, 139, 34);
      doc.text(archive.statutPaiement === 'paye' ? 'Payé' : 'Sans frais', rightCol, currentY + 6);
    }
    
    return startY + 52;
  }

  private addField(doc: jsPDF, label: string, value: string, x: number, y: number, bold: boolean = false): void {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.text(label, x, y);
    
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(value, x + 35, y);
  }

  private getResponsabilityLabel(archive: ArchiveSortie): string {
    if (!archive.responsabilite) return 'Non définie';
    
    const labels: Record<string, string> = {
      client: 'Client',
      logistiga: 'Logistiga',
      partagee: `Partagée (${archive.joursClient}j / ${archive.joursLogistiga}j)`
    };
    
    return labels[archive.responsabilite] || 'Non définie';
  }

  private addFooter(doc: jsPDF, pageWidth: number, pageHeight: number): void {
    const footerY = pageHeight - 30;
    
    // Ligne de séparation
    doc.setDrawColor(34, 139, 34);
    doc.setLineWidth(0.5);
    doc.line(20, footerY - 3, pageWidth - 20, footerY - 3);

    // Fond subtil
    doc.setFillColor(250, 250, 250);
    doc.rect(20, footerY, pageWidth - 40, 27, 'F');

    // Informations entreprise
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    
    let currentY = footerY + 4;
    
    doc.setFont('helvetica', 'bold');
    doc.text('LOGISTIGA S.A.R.L', 25, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(' - Zone Portuaire - Ouattara-SETTRAG', 53, currentY);
    
    currentY += 4;
    doc.text('Tél: (+241) 01 76 42 30/07 10 45 45/02 22 31 71', 25, currentY);
    
    currentY += 4;
    doc.text('logistiga@logistiga.com - www.logistiga.com', 25, currentY);
    
    currentY += 4;
    doc.setFontSize(6);
    doc.text('RIB CCB: 40002 00043 00000000001 84 - IBAN: 40000 00 100 410100600117 06', 25, currentY);
    
    currentY += 4;
    doc.text('Capital: 18 000 000 F CFA - NIF: 7431071 - RCCM: 2011 - F - 00001', 25, currentY);

    // Numéro de page
    doc.setFillColor(34, 139, 34);
    doc.roundedRect(pageWidth - 28, footerY + 8, 18, 7, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Page 1', pageWidth - 19, footerY + 13, { align: 'center' });
  }
}

export const archiveSortiePdfService = new ArchiveSortiePdfService();
