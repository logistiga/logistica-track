import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle } from "lucide-react";
import { DetentionContainer } from "@/types/detention";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";

interface DetentionTableProps {
  containers: DetentionContainer[];
  loading?: boolean;
  onIdentifyResponsability: (container: DetentionContainer) => void;
  onGeneratePDF: (container: DetentionContainer) => void;
  onConfirmPayment: (container: DetentionContainer) => void;
}

export function DetentionTable({ 
  containers, 
  loading,
  onIdentifyResponsability, 
  onGeneratePDF, 
  onConfirmPayment 
}: DetentionTableProps) {
  
  const getResponsabilityBadge = (container: DetentionContainer) => {
    if (!container.responsabilite) {
      return <Badge variant="outline">Non définie</Badge>;
    }

    const variants = {
      client: "destructive",
      logistica: "secondary",
      partagee: "default"
    };

    const labels = {
      client: "Client",
      logistica: "Logistica",
      partagee: `Partagée (${container.joursClient}j / ${container.joursLogistica}j)`
    };

    return (
      <Badge variant={variants[container.responsabilite] as any}>
        {labels[container.responsabilite]}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conteneurs en détention</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conteneur</TableHead>
              <TableHead>Armateur</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>BAT autorisés</TableHead>
              <TableHead>Jours réalisés</TableHead>
              <TableHead>Dépassement</TableHead>
              <TableHead>Montant Total</TableHead>
              <TableHead>Date sortie</TableHead>
              <TableHead>Date retour</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Responsabilité</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : containers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                  Aucune détention trouvée
                </TableCell>
              </TableRow>
            ) : (
              containers.map((container) => (
                <TableRow key={container.id}>
                  <TableCell className="font-medium">{container.numeroConteneur}</TableCell>
                  <TableCell>{container.codeArmateur}</TableCell>
                  <TableCell>{container.typeConteneur.toUpperCase()}</TableCell>
                  <TableCell>{container.joursBAT} jours</TableCell>
                  <TableCell>{container.joursRealises} jours</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{container.joursDepassement} jours</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-red-600">
                    {formatCurrency(container.montantTotal)}
                  </TableCell>
                  <TableCell>{container.dateSortie}</TableCell>
                  <TableCell>{container.dateRetour}</TableCell>
                  <TableCell>{container.nomClient}</TableCell>
                  <TableCell>{getResponsabilityBadge(container)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!container.responsabilite && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onIdentifyResponsability(container)}
                        >
                          <Users className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onGeneratePDF(container)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onConfirmPayment(container)}
                      >
                        <CheckCircle className="w-4 h-4" />
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