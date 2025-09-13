import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";
import { ArchiveSortie } from "@/types/archivesSortie";
import { formatCurrency } from "@/lib/currency";

interface ArchiveSortieTableProps {
  archives: ArchiveSortie[];
  onViewInvoice: (archive: ArchiveSortie) => void;
  onViewDetails: (archive: ArchiveSortie) => void;
}

export function ArchiveSortieTable({ archives, onViewInvoice, onViewDetails }: ArchiveSortieTableProps) {
  
  const getResponsabilityBadge = (archive: ArchiveSortie) => {
    if (archive.joursDepassement === 0) {
      return <Badge variant="outline">Sans détention</Badge>;
    }

    if (!archive.responsabilite) {
      return <Badge variant="outline">Non définie</Badge>;
    }

    const variants = {
      client: "destructive",
      logistiga: "secondary",
      partagee: "default"
    };

    const labels = {
      client: "Client",
      logistiga: "Logistiga",
      partagee: `Partagée (${archive.joursClient}j / ${archive.joursLogistiga}j)`
    };

    return (
      <Badge variant={variants[archive.responsabilite] as any}>
        {labels[archive.responsabilite]}
      </Badge>
    );
  };

  const getStatutBadge = (statut: string) => {
    return statut === "paye" ? (
      <Badge variant="default" className="bg-green-500">Payé</Badge>
    ) : (
      <Badge variant="outline">Sans frais</Badge>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Archives des sorties de conteneurs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conteneur</TableHead>
              <TableHead>Armateur</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Sortie</TableHead>
              <TableHead>Retour</TableHead>
              <TableHead>Jours</TableHead>
              <TableHead>Dépassement</TableHead>
              <TableHead>Responsabilité</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archives.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center text-muted-foreground py-8">
                  Aucune archive trouvée
                </TableCell>
              </TableRow>
            ) : (
              archives.map((archive) => (
                <TableRow key={archive.id}>
                  <TableCell className="font-medium">{archive.numeroConteneur}</TableCell>
                  <TableCell>{archive.codeArmateur}</TableCell>
                  <TableCell>{archive.typeConteneur}</TableCell>
                  <TableCell>{archive.nomClient}</TableCell>
                  <TableCell>{formatDate(archive.dateSortiePort)}</TableCell>
                  <TableCell>{formatDate(archive.dateRetourPort)}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{archive.joursBAT}j autorisés</div>
                      <div>{archive.joursRealises}j réalisés</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {archive.joursDepassement > 0 ? (
                      <Badge variant="destructive">{archive.joursDepassement}j</Badge>
                    ) : (
                      <Badge variant="outline">Aucun</Badge>
                    )}
                  </TableCell>
                  <TableCell>{getResponsabilityBadge(archive)}</TableCell>
                  <TableCell>
                    {archive.montantTotalDetention ? (
                      <div className="text-xs">
                      <div className="font-medium">{formatCurrency(archive.montantTotalDetention)}</div>
                        {archive.numeroFactureDetention && (
                          <div>{archive.numeroFactureDetention}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatutBadge(archive.statutPaiement)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {archive.numeroFactureDetention && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewInvoice(archive)}
                        >
                          <FileText className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(archive)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}