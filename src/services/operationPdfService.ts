import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Operation } from '@/types/operations';
import { formatCurrencyForPdf } from '@/lib/currency';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

class OperationPdfService {
  generateOperationPDF(operation: Operation) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Logo centré
    const logoWidth = 40;
    const logoHeight = 15;
    const logoX = (pageWidth - logoWidth) / 2;
    
    try {
      doc.addImage('/src/assets/logistiga-logo-full.png', 'PNG', logoX, 10, logoWidth, logoHeight);
    } catch (error) {
      console.error('Erreur chargement logo:', error);
    }

    // Titre avec fond coloré
    const titleY = 35;
    doc.setFillColor(41, 128, 185);
    doc.rect(0, titleY, pageWidth, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    
    const title = operation.typeOperation === 'location' 
      ? 'BON DE LOCATION' 
      : 'BON DE TRANSPORT';
    doc.text(title, pageWidth / 2, titleY + 8, { align: 'center' });

    // Reset couleur texte
    doc.setTextColor(0, 0, 0);
    let yPos = titleY + 20;

    // Section Client
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS CLIENT', 14, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Client: ${operation.client}`, 14, yPos);
    yPos += 6;
    doc.text(`Date: ${format(new Date(operation.dateDebut), 'dd MMMM yyyy', { locale: fr })}`, 14, yPos);
    yPos += 10;

    // Section Période/Transport
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    if (operation.typeOperation === 'location') {
      doc.text('PÉRIODE DE LOCATION', 14, yPos);
      yPos += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Du: ${format(new Date(operation.dateDebut), 'dd/MM/yyyy')}`, 14, yPos);
      yPos += 6;
      if (operation.dateFin) {
        doc.text(`Au: ${format(new Date(operation.dateFin), 'dd/MM/yyyy')}`, 14, yPos);
        yPos += 6;
      }
      if (operation.duree) {
        doc.text(`Durée: ${operation.duree} jour(s)`, 14, yPos);
        yPos += 10;
      }
    } else if (operation.typeOperation === 'transport') {
      doc.text('DÉTAILS DU TRANSPORT', 14, yPos);
      yPos += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      if (operation.lieuDepart) {
        doc.text(`Départ: ${operation.lieuDepart}`, 14, yPos);
        yPos += 6;
      }
      if (operation.destination) {
        doc.text(`Destination: ${operation.destination}`, 14, yPos);
        yPos += 10;
      }
    } else {
      yPos += 2;
    }

    // Section Véhicules
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('VÉHICULES', 14, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Camion: ${operation.camion}`, 14, yPos);
    yPos += 6;
    doc.text(`Remorque: ${operation.remorque}`, 14, yPos);
    yPos += 10;

    // Instructions
    if (operation.instructions) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('INSTRUCTIONS', 14, yPos);
      yPos += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const instructions = doc.splitTextToSize(operation.instructions, pageWidth - 28);
      doc.text(instructions, 14, yPos);
      yPos += instructions.length * 6 + 10;
    }

    // Section Montant
    yPos += 5;
    doc.setFillColor(240, 240, 240);
    doc.rect(14, yPos - 5, pageWidth - 28, 40, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    
    if (operation.typeOperation === 'location' && operation.tarifJournalier) {
      doc.text('Tarif Journalier:', 20, yPos);
      doc.text(formatCurrencyForPdf(operation.tarifJournalier), pageWidth - 20, yPos, { align: 'right' });
      yPos += 8;
      
      if (operation.duree) {
        doc.text(`Nombre de jours: ${operation.duree}`, 20, yPos);
        yPos += 12;
      }
    }
    
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text('MONTANT TOTAL:', 20, yPos);
    doc.text(formatCurrencyForPdf(operation.montant), pageWidth - 20, yPos, { align: 'right' });

    // Footer
    const footerY = doc.internal.pageSize.height - 30;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('LOGISTIGA SARL', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Zone Industrielle d\'Oloumi - Libreville, Gabon', pageWidth / 2, footerY + 5, { align: 'center' });
    doc.text('Tél: +241 XX XX XX XX | Email: contact@logistiga.ga', pageWidth / 2, footerY + 10, { align: 'center' });

    // Télécharger
    const fileName = `bon_${operation.typeOperation}_${operation.client}_${format(new Date(), 'ddMMyyyy')}.pdf`;
    doc.save(fileName);
  }
}

export const operationPdfService = new OperationPdfService();
