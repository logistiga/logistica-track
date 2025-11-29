import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArchiveBase } from "@/types/archives";
import { formatCurrency } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";

interface ArchiveDetailsDialogProps {
  archive: ArchiveBase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchiveDetailsDialog({ archive, open, onOpenChange }: ArchiveDetailsDialogProps) {
  if (!archive) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getOperationBadge = (type: string) => {
    return type === "stockage" ? (
      <Badge variant="outline">Stockage</Badge>
    ) : (
      <Badge variant="secondary">Double relevage</Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails de l'archive - {archive.numeroConteneur}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Type d'opération */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Type d'opération</label>
            <div className="mt-1">
              {getOperationBadge(archive.typeOperation)}
            </div>
          </div>

          {/* Informations client */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Client</label>
              <p className="text-base font-medium mt-1">{archive.nomClient}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Provenance</label>
              <p className="text-base mt-1">{archive.provenance}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date arrivée base</label>
              <p className="text-base mt-1">{formatDate(archive.dateArriveeBase)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date sortie base</label>
              <p className="text-base mt-1">{formatDate(archive.dateSortieBase)}</p>
            </div>
          </div>

          {/* Transport */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Camion arrivée</label>
              <p className="text-base mt-1">{archive.camionArrivee}</p>
            </div>
            {archive.camionSortie && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Camion sortie</label>
                <p className="text-base mt-1">{archive.camionSortie}</p>
              </div>
            )}
          </div>

          {/* Détails spécifiques stockage */}
          {archive.typeOperation === "stockage" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jours gratuits</label>
                <p className="text-base mt-1">{archive.joursGratuits || 0} jours</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jours payants</label>
                <p className="text-base font-medium text-red-600 mt-1">{archive.joursPayants || 0} jours</p>
              </div>
            </div>
          )}

          {/* Facturation */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Numéro de facture</label>
                <p className="text-base font-medium mt-1">{archive.numeroFacture}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date facturation</label>
                <p className="text-base mt-1">{formatDate(archive.dateFacturation)}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-sm font-medium text-muted-foreground">Montant total</label>
              <p className="text-2xl font-bold text-primary mt-1">
                {formatCurrency(archive.montantTotalFacture)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
