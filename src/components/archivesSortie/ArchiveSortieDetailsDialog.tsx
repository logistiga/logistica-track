import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArchiveSortie } from "@/types/archivesSortie";
import { formatCurrency } from "@/lib/currency";

interface ArchiveSortieDetailsDialogProps {
  archive: ArchiveSortie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArchiveSortieDetailsDialog({ archive, open, onOpenChange }: ArchiveSortieDetailsDialogProps) {
  if (!archive) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const getResponsabilityLabel = () => {
    if (!archive.responsabilite) return "Non définie";
    
    const labels = {
      client: "Client",
      logistiga: "Logistiga",
      partagee: `Partagée (${archive.joursClient}j client / ${archive.joursLogistiga}j Logistiga)`
    };
    
    return labels[archive.responsabilite];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de l'archive - {archive.numeroConteneur}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du conteneur */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Informations du conteneur</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Numéro conteneur</span>
                <p className="font-medium">{archive.numeroConteneur}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Numéro BL</span>
                <p className="font-medium">{archive.numeroBL || "-"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Armateur</span>
                <p className="font-medium">{archive.codeArmateur}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Type conteneur</span>
                <p className="font-medium">{archive.typeConteneur}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Client</span>
                <p className="font-medium">{archive.nomClient}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Transitaire</span>
                <p className="font-medium">{archive.nomTransitaire || "-"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Destination</span>
                <p className="font-medium capitalize">{archive.destinationInitiale}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations transport */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Informations transport</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Camion</span>
                <p className="font-medium">{archive.camion || "-"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Remorque</span>
                <p className="font-medium">{archive.remorque || "-"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Chauffeur</span>
                <p className="font-medium">{archive.chauffeur || "-"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Date sortie port</span>
                <p className="font-medium">{formatDate(archive.dateSortiePort)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Date retour port</span>
                <p className="font-medium">{formatDate(archive.dateRetourPort)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Prime chauffeur */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Prime chauffeur</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Montant prime</span>
                <p className="font-medium text-lg text-primary">
                  {archive.montantPrime ? formatCurrency(archive.montantPrime) : "-"}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Date paiement</span>
                <p className="font-medium">{formatDate(archive.dateArchivage)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations détention */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Détention</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Jours autorisés (BAT)</span>
                <p className="font-medium">{archive.joursBAT} jours</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Jours réalisés</span>
                <p className="font-medium">{archive.joursRealises} jours</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Dépassement</span>
                <div className="font-medium">
                  {archive.joursDepassement > 0 ? (
                    <Badge variant="destructive">{archive.joursDepassement} jours</Badge>
                  ) : (
                    <Badge variant="outline">Aucun</Badge>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Responsabilité</span>
                <p className="font-medium">{getResponsabilityLabel()}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Montant détention</span>
                <div className="font-medium text-lg">
                  {archive.montantTotalDetention 
                    ? formatCurrency(archive.montantTotalDetention)
                    : <span className="text-muted-foreground">Sans frais</span>
                  }
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Statut paiement</span>
                <div className="font-medium">
                  {archive.statutPaiement === "paye" ? (
                    <Badge variant="default" className="bg-green-500">Payé</Badge>
                  ) : (
                    <Badge variant="outline">Sans frais</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Observations */}
          {archive.observations && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3">Observations</h3>
                <p className="text-sm">{archive.observations}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
