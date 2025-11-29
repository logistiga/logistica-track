import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle } from "lucide-react";
import { FactureInterne } from "@/types/facturation";
import { formatCurrency } from "@/lib/currency";

interface FacturationTableProps {
  factures: FactureInterne[];
  loading?: boolean;
  onGeneratePDF: (facture: FactureInterne) => void;
  onConfirmPayment: (facture: FactureInterne) => void;
}

export function FacturationTable({ 
  factures,
  loading,
  onGeneratePDF, 
  onConfirmPayment 
}: FacturationTableProps) {
  
  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "payee":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Payé
          </Badge>
        );
      case "envoyee":
        return <Badge variant="secondary">Envoyée</Badge>;
      case "annulee":
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="outline">Brouillon</Badge>;
    }
  };

  const getOperationBadge = (type: string) => {
    switch (type) {
      case "stockage":
        return <Badge variant="outline">Stockage</Badge>;
      case "double_relevage":
        return <Badge variant="secondary">Double relevage</Badge>;
      case "depotage":
        return <Badge className="bg-purple-500">Dépotage</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Factures internes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : factures.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Aucune facture trouvée</div>
        ) : (
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
                  <TableCell className="font-medium">{formatCurrency(facture.montantAPayer)}</TableCell>
                  <TableCell>{facture.dateSortieOperation}</TableCell>
                  <TableCell>
                    {facture.typeOperation === "stockage" && (
                      <div className="text-xs text-muted-foreground">
                        Jours gratuits: {facture.joursGratuits || 0}
                        <br />
                        Jours payants: {facture.joursPayants || 0}
                      </div>
                    )}
                    {facture.typeOperation === "double_relevage" && (
                      <div className="text-xs text-muted-foreground">
                        Montant: {formatCurrency(facture.montantAPayer)}
                      </div>
                    )}
                    {facture.typeOperation === "depotage" && (
                      <div className="text-xs text-muted-foreground">
                        Montant dépotage: {formatCurrency(facture.montantAPayer)}
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
                      {facture.statutPaiement === "brouillon" && (
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
        )}
      </CardContent>
    </Card>
  );
}
