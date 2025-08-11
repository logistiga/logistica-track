import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, CreditCard, CheckCircle, Euro } from "lucide-react";
import { FactureInterne } from "@/types/facturation";
import { useToast } from "@/hooks/use-toast";

export default function Facturation() {
  const { toast } = useToast();
  const [factures, setFactures] = useState<FactureInterne[]>([
    {
      id: "1",
      numeroFacture: "FACT-2024-001",
      dateFacture: "2024-01-15",
      typeOperation: "stockage",
      numeroConteneur: "CONT001",
      nomClient: "Client ABC",
      montantAPayer: 350.00,
      dateSortieOperation: "2024-01-15",
      statutPaiement: "en-attente",
      joursGratuits: 5,
      joursPayants: 3,
      tarifJournalier: 116.67
    },
    {
      id: "2",
      numeroFacture: "FACT-2024-002",
      dateFacture: "2024-01-16",
      typeOperation: "double-relevage",
      numeroConteneur: "CONT002",
      nomClient: "Client XYZ",
      montantAPayer: 250.00,
      dateSortieOperation: "2024-01-16",
      statutPaiement: "en-attente"
    },
    {
      id: "3",
      numeroFacture: "FACT-2024-003",
      dateFacture: "2024-01-14",
      typeOperation: "stockage",
      numeroConteneur: "CONT003",
      nomClient: "Client DEF",
      montantAPayer: 180.00,
      dateSortieOperation: "2024-01-14",
      statutPaiement: "paye",
      joursGratuits: 7,
      joursPayants: 2,
      tarifJournalier: 90.00
    }
  ]);

  const handleGeneratePDF = (facture: FactureInterne) => {
    toast({
      title: "PDF généré",
      description: `Facture ${facture.numeroFacture} générée avec succès`
    });
  };

  const handleConfirmPayment = (facture: FactureInterne) => {
    setFactures(prev => prev.filter(f => f.id !== facture.id));
    toast({
      title: "Paiement confirmé",
      description: `La facture ${facture.numeroFacture} a été transférée aux archives.`
    });
  };

  const getStatusBadge = (statut: string) => {
    return statut === "paye" ? (
      <Badge variant="default" className="bg-green-500">
        <CheckCircle className="w-3 h-3 mr-1" />
        Payé
      </Badge>
    ) : (
      <Badge variant="destructive">
        <CreditCard className="w-3 h-3 mr-1" />
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

  const facturesEnAttente = factures.filter(f => f.statutPaiement === "en-attente");
  const facturesPayees = factures.filter(f => f.statutPaiement === "paye");
  const montantTotal = facturesEnAttente.reduce((acc, f) => acc + f.montantAPayer, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
        <p className="text-muted-foreground">
          Gestion des factures internes pour les opérations de base
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facturesEnAttente.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures payées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facturesPayees.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant en attente</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{montantTotal.toFixed(2)} €</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total factures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{factures.length}</div>
          </CardContent>
        </Card>
      </div>

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
                        onClick={() => handleGeneratePDF(facture)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      {facture.statutPaiement === "en-attente" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfirmPayment(facture)}
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
    </div>
  );
}