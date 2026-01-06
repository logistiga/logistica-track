import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, FileSpreadsheet, FileText, Calendar, Filter } from "lucide-react";
import { SortieConteneur } from "@/types/sortie-conteneur";
import { useToast } from "@/hooks/use-toast";
import { useArmateurs } from "@/hooks/useArmateurs";
import { useVehicules } from "@/hooks/useVehicules";
import { getStatutLabel, formatCurrency } from "@/utils/sortieUtils";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportDialogProps {
  sorties: SortieConteneur[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ExportFilters {
  dateDebut: string;
  dateFin: string;
  statut: string;
  armateur: string;
  camion: string;
}

const statutOptions = [
  { value: "tous", label: "Tous" },
  { value: "en_cours", label: "En cours" },
  { value: "retourne_port", label: "Retourné au port" },
  { value: "a_la_base", label: "À la base" },
  { value: "livre_client", label: "Livré au client" },
];

export const ExportDialog = ({ sorties, open, onOpenChange }: ExportDialogProps) => {
  const { toast } = useToast();
  const { getArmateurDisplay, getArmateurOptions } = useArmateurs();
  const { getVehiculeDisplay, getCamionOptions } = useVehicules();
  
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState<ExportFilters>({
    dateDebut: "",
    dateFin: "",
    statut: "tous",
    armateur: "tous",
    camion: "tous"
  });

  const filterSorties = () => {
    return sorties.filter(sortie => {
      // Filtre par date
      if (filters.dateDebut && sortie.dateSortie < filters.dateDebut) return false;
      if (filters.dateFin && sortie.dateSortie > filters.dateFin) return false;
      
      // Filtre par statut
      if (filters.statut !== "tous" && sortie.statut !== filters.statut) return false;
      
      // Filtre par armateur
      if (filters.armateur !== "tous" && sortie.codeArmateur !== filters.armateur) return false;
      
      // Filtre par camion
      if (filters.camion !== "tous" && sortie.camion !== filters.camion) return false;
      
      return true;
    });
  };

  const getCamionLabel = (camionId: number) => {
    return getVehiculeDisplay(camionId);
  };

  const getArmateurLabel = (id: number) => {
    return getArmateurDisplay(id);
  };

  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      const filteredSorties = filterSorties();
      
      const data = filteredSorties.map(sortie => ({
        'Numéro de conteneur': sortie.numeroConteneur,
        'Numéro BL': sortie.numeroBL,
        'Code armateur': getArmateurLabel(parseInt(sortie.codeArmateur)),
        'Client': sortie.nomClient,
        'Prime chauffeur': formatCurrency(sortie.primeChauffeur),
        'Destination': sortie.destination === "base" ? "Base" : "Client",
        'Adresse client': sortie.adresseClient || "",
        'Type destination': sortie.typeDestination,
        'Jours BAD': sortie.joursBAD || "",
        'Date fin franchise': sortie.dateFinFranchise || "",
        'Transitaire': sortie.nomTransitaire,
        'Camion': getCamionLabel(parseInt(sortie.camion)),
        'Remorque': sortie.remorque,
        'Date de sortie': sortie.dateSortie,
        'Date de retour': sortie.dateRetour || "",
        'Statut': getStatutLabel(sortie.statut)
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sorties Conteneurs");
      
      // Style des en-têtes
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[address]) continue;
        ws[address].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "366EF6" } }
        };
      }

      // Largeur des colonnes
      ws['!cols'] = [
        { wch: 15 }, // Conteneur
        { wch: 12 }, // BL
        { wch: 20 }, // Armateur
        { wch: 20 }, // Client
        { wch: 15 }, // Prime
        { wch: 12 }, // Destination
        { wch: 30 }, // Adresse
        { wch: 15 }, // Type dest
        { wch: 10 }, // Jours BAD
        { wch: 15 }, // Date franchise
        { wch: 20 }, // Transitaire
        { wch: 10 }, // Camion
        { wch: 10 }, // Remorque
        { wch: 12 }, // Date sortie
        { wch: 12 }, // Date retour
        { wch: 15 }  // Statut
      ];

      const fileName = `sortie-conteneurs-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast({
        title: "Export Excel réussi",
        description: `${filteredSorties.length} sorties exportées dans ${fileName}`
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export Excel",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      onOpenChange(false);
    }
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    try {
      const filteredSorties = filterSorties();
      const doc = new jsPDF('landscape');
      
      // Titre
      doc.setFontSize(18);
      doc.text('Export Sorties de Conteneurs', 14, 22);
      
      // Date d'export
      doc.setFontSize(10);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
      
      // Filtres appliqués
      let yPosition = 35;
      if (filters.dateDebut || filters.dateFin) {
        doc.text(`Période: ${filters.dateDebut || 'Début'} - ${filters.dateFin || 'Fin'}`, 14, yPosition);
        yPosition += 5;
      }
      if (filters.statut !== "tous") {
        doc.text(`Statut: ${statutOptions.find(s => s.value === filters.statut)?.label || filters.statut}`, 14, yPosition);
        yPosition += 5;
      }
      
      // Tableau
      const tableData = filteredSorties.map(sortie => [
        sortie.numeroConteneur,
        sortie.numeroBL,
        sortie.codeArmateur,
        sortie.nomClient,
        new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(sortie.primeChauffeur),
        sortie.destination === "base" ? "Base" : "Client",
        sortie.dateSortie,
        sortie.dateRetour || "-",
        getStatutLabel(sortie.statut)
      ]);
      
      autoTable(doc, {
        head: [['Conteneur', 'BL', 'Armateur', 'Client', 'Prime (FCFA)', 'Destination', 'Date Sortie', 'Date Retour', 'Statut']],
        body: tableData,
        startY: yPosition + 5,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [54, 110, 246] },
        columnStyles: {
          4: { halign: 'right' }, // Prime
          6: { halign: 'center' }, // Date sortie
          7: { halign: 'center' }  // Date retour
        }
      });
      
      const fileName = `sortie-conteneurs-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "Export PDF réussi",
        description: `${filteredSorties.length} sorties exportées dans ${fileName}`
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export PDF",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter les sorties de conteneurs
          </DialogTitle>
          <DialogDescription>
            Choisissez les critères de filtrage et le format d'export
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-4 h-4" />
                Critères de filtrage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Période */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  Période
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateDebut" className="text-sm text-muted-foreground">Date de début</Label>
                    <Input
                      id="dateDebut"
                      type="date"
                      value={filters.dateDebut}
                      onChange={(e) => setFilters({ ...filters, dateDebut: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateFin" className="text-sm text-muted-foreground">Date de fin</Label>
                    <Input
                      id="dateFin"
                      type="date"
                      value={filters.dateFin}
                      onChange={(e) => setFilters({ ...filters, dateFin: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Statut */}
              <div>
                <Label htmlFor="statut">Statut</Label>
                <Select value={filters.statut} onValueChange={(value) => setFilters({ ...filters, statut: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statutOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Armateur */}
              <div>
                <Label htmlFor="armateur">Armateur</Label>
                <Select value={filters.armateur} onValueChange={(value) => setFilters({ ...filters, armateur: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les armateurs</SelectItem>
                {getArmateurOptions().map((armateur) => (
                  <SelectItem key={armateur.value} value={armateur.value}>
                    {armateur.label}
                  </SelectItem>
                ))}
              </SelectContent>
                </Select>
              </div>

              {/* Camion */}
              <div>
                <Label htmlFor="camion">Camion</Label>
                <Select value={filters.camion} onValueChange={(value) => setFilters({ ...filters, camion: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les camions</SelectItem>
                {getCamionOptions().map((camion) => (
                  <SelectItem key={camion.value} value={camion.value}>
                    {camion.label}
                  </SelectItem>
                ))}
              </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Aperçu */}
          <div className="text-sm text-muted-foreground">
            <strong>{filterSorties().length}</strong> sortie(s) correspondent aux critères sélectionnés
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              onClick={exportToExcel}
              disabled={isExporting || filterSorties().length === 0}
              className="gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {isExporting ? "Export en cours..." : "Excel"}
            </Button>
            <Button 
              onClick={exportToPDF}
              disabled={isExporting || filterSorties().length === 0}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              {isExporting ? "Export en cours..." : "PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};