import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, CheckCircle, Edit } from "lucide-react";
import { DetentionContainer } from "@/types/detention";
import { ResponsabiliteDialog } from "@/components/detention/ResponsabiliteDialog";
import { useToast } from "@/hooks/use-toast";

export default function Detention() {
  const { toast } = useToast();
  const [containers, setContainers] = useState<DetentionContainer[]>([
    {
      id: "1",
      numeroConteneur: "CONT001",
      codeArmateur: "MSC",
      typeConteneur: "20' DRY",
      joursBAT: 5,
      joursRealises: 8,
      joursDepassement: 3,
      dateSortie: "2024-01-15",
      dateRetour: "2024-01-23",
      nomClient: "Client ABC",
      noteDebitGeneree: true,
      paiementConfirme: false
    },
    {
      id: "2",
      numeroConteneur: "CONT002",
      codeArmateur: "CMA",
      typeConteneur: "40' HC",
      joursBAT: 7,
      joursRealises: 12,
      joursDepassement: 5,
      dateSortie: "2024-01-10",
      dateRetour: "2024-01-22",
      nomClient: "Client XYZ",
      noteDebitGeneree: true,
      paiementConfirme: false
    }
  ]);

  const [selectedContainer, setSelectedContainer] = useState<DetentionContainer | null>(null);
  const [isResponsabiliteDialogOpen, setIsResponsabiliteDialogOpen] = useState(false);

  const handleIdentifyResponsability = (container: DetentionContainer) => {
    setSelectedContainer(container);
    setIsResponsabiliteDialogOpen(true);
  };

  const handleConfirmResponsability = (data: any) => {
    if (!selectedContainer) return;

    setContainers(prev => prev.map(container =>
      container.id === selectedContainer.id
        ? {
            ...container,
            responsabilite: data.responsabilite,
            joursClient: data.joursClient,
            joursLogistica: data.joursLogistica
          }
        : container
    ));

    toast({
      title: "Responsabilité identifiée",
      description: "La responsabilité a été assignée avec succès."
    });

    setIsResponsabiliteDialogOpen(false);
    setSelectedContainer(null);
  };

  const handleGeneratePDF = (container: DetentionContainer) => {
    toast({
      title: "PDF généré",
      description: `Note de débit générée pour le conteneur ${container.numeroConteneur}`
    });
  };

  const handleConfirmPayment = (container: DetentionContainer) => {
    setContainers(prev => prev.filter(c => c.id !== container.id));
    toast({
      title: "Paiement confirmé",
      description: `Le conteneur ${container.numeroConteneur} a été transféré aux archives.`
    });
  };

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Détention</h1>
        <p className="text-muted-foreground">
          Gestion des conteneurs ayant dépassé leur franchise
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conteneurs en détention</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jours totaux de dépassement</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {containers.reduce((acc, c) => acc + c.joursDepassement, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente de paiement</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {containers.filter(c => !c.paiementConfirme).length}
            </div>
          </CardContent>
        </Card>
      </div>

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
                <TableHead>Date sortie</TableHead>
                <TableHead>Date retour</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Responsabilité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containers.map((container) => (
                <TableRow key={container.id}>
                  <TableCell className="font-medium">{container.numeroConteneur}</TableCell>
                  <TableCell>{container.codeArmateur}</TableCell>
                  <TableCell>{container.typeConteneur}</TableCell>
                  <TableCell>{container.joursBAT} jours</TableCell>
                  <TableCell>{container.joursRealises} jours</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{container.joursDepassement} jours</Badge>
                  </TableCell>
                  <TableCell>{container.dateSortie}</TableCell>
                  <TableCell>{container.dateRetour}</TableCell>
                  <TableCell>{container.nomClient}</TableCell>
                  <TableCell>{getResponsabilityBadge(container)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleIdentifyResponsability(container)}
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGeneratePDF(container)}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfirmPayment(container)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ResponsabiliteDialog
        isOpen={isResponsabiliteDialogOpen}
        onOpenChange={setIsResponsabiliteDialogOpen}
        selectedContainer={selectedContainer}
        onConfirm={handleConfirmResponsability}
      />
    </div>
  );
}