import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle } from "lucide-react";
import { FactureInterne } from "@/types/facturation";

interface FacturationTableProps {
  factures: FactureInterne[];
  onGeneratePDF: (facture: FactureInterne) => void;
  onConfirmPayment: (facture: FactureInterne) => void;
}

export function FacturationTable({ 
  factures, 
  onGeneratePDF, 
  onConfirmPayment 
}: FacturationTableProps) {
  
  const getStatusBadge = (statut: string) => {
    return statut === "paye" ? (
      <Badge variant="default" className="bg-green-500">
        <CheckCircle className="w-3 h-3 mr-1" />
        Payé
      </Badge>
    ) : (
      <Badge variant="destructive">
        En attente
      </Badge>
    );
  };

  const getOperationBadge = (type: string) => {
    return type === "stockage" ? (
      <Badge variant="outline">Stockage</Badge>
    ) : (
      <Badge variant="secondary">Double relevage</Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Factures internes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Facture</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type d'opération</TableHead>
              <TableHead>Conteneur</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date opération</TableHead>
              <TableHead>Détails</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factures.map((facture) => (
              <TableRow key={facture.id}>
                <TableCell className="font-medium">{facture.numeroFacture}</TableCell>
                <TableCell>{facture.dateFacture}</TableCell>
                <TableCell>{getOperationBadge(facture.typeOperation)}</TableCell>
                <TableCell>{facture.numeroConteneur}</TableCell>
                <TableCell>{facture.nomClient}</TableCell>
                <TableCell className="font-medium">{facture.montantAPayer.toFixed(2)} €</TableCell>
                <TableCell>{facture.dateSortieOperation}</TableCell>
                <TableCell>
                  {facture.typeOperation === "stockage" && facture.joursPayants && (
                    <div className="text-xs text-muted-foreground">
                      {facture.joursGratuits}j gratuits + {facture.joursPayants}j payants
                      <br />
                      ({facture.tarifJournalier?.toFixed(2)} €/jour)
                    </div>
                  )}
                  {facture.typeOperation === "double-relevage" && (
                    <div className="text-xs text-muted-foreground">
                      Opération forfaitaire
                    </div>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(facture.statutPaiement)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGeneratePDF(facture)}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    {facture.statutPaiement === "en-attente" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onConfirmPayment(facture)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}