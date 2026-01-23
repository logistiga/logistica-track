import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCw, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Package,
  Ship,
  Calendar,
  User
} from "lucide-react";
import { OrdresEnAttenteTable } from "@/components/ordres-attente/OrdresEnAttenteTable";
import { OrdreDetailsDialog } from "@/components/ordres-attente/OrdreDetailsDialog";
import { OrdresEnAttenteStats } from "@/components/ordres-attente/OrdresEnAttenteStats";
import { useOrdresEnAttente } from "@/hooks/useOrdresEnAttente";
import { OrdreTravail } from "@/types/logistique.types";

export default function OrdresEnAttentePage() {
  const {
    ordres,
    loading,
    error,
    lastSync,
    refresh,
    validateOrdre,
    rejectOrdre,
    isRefreshing,
  } = useOrdresEnAttente();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrdre, setSelectedOrdre] = useState<OrdreTravail | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filtrer les ordres par statut
  const ordresEnAttente = useMemo(() => 
    ordres.filter(o => o.status === "brouillon" || o.status === "en_cours"),
    [ordres]
  );

  const ordresValides = useMemo(() => 
    ordres.filter(o => o.status === "termine" || o.status === "facture"),
    [ordres]
  );

  // Recherche
  const filterOrdres = (items: OrdreTravail[], query: string) => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase().trim();
    return items.filter(ordre => 
      ordre.numero?.toLowerCase().includes(lowerQuery) ||
      ordre.client?.nom?.toLowerCase().includes(lowerQuery) ||
      ordre.reference?.toLowerCase().includes(lowerQuery) ||
      ordre.booking_number?.toLowerCase().includes(lowerQuery) ||
      ordre.vessel_name?.toLowerCase().includes(lowerQuery) ||
      ordre.containers?.some(c => c.number?.toLowerCase().includes(lowerQuery))
    );
  };

  const filteredEnAttente = useMemo(() => 
    filterOrdres(ordresEnAttente, searchQuery),
    [ordresEnAttente, searchQuery]
  );

  const filteredValides = useMemo(() => 
    filterOrdres(ordresValides, searchQuery),
    [ordresValides, searchQuery]
  );

  const handleViewDetails = (ordre: OrdreTravail) => {
    setSelectedOrdre(ordre);
    setIsDetailsOpen(true);
  };

  const handleValidate = async (ordreId: number) => {
    await validateOrdre(ordreId);
  };

  const handleReject = async (ordreId: number) => {
    await rejectOrdre(ordreId);
  };

  if (error) {
    return (
      <div className="w-full px-4 lg:px-6 py-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <XCircle className="h-12 w-12 text-destructive" />
              <div>
                <h3 className="font-semibold text-lg">Erreur de connexion</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <Button onClick={refresh} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Ordres en Attente</h1>
          <p className="text-muted-foreground">
            Ordres de travail reçus de l'application externe
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          {lastSync && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Dernière sync: {new Date(lastSync).toLocaleTimeString('fr-FR')}
            </span>
          )}
          <Button 
            onClick={refresh} 
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Synchroniser
          </Button>
        </div>
      </div>

      {/* Stats */}
      <OrdresEnAttenteStats 
        ordresEnAttente={ordresEnAttente.length}
        ordresValides={ordresValides.length}
        totalConteneurs={ordres.reduce((acc, o) => acc + (o.containers?.length || 0), 0)}
      />

      {/* Search */}
      <Card>
        <CardContent className="pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par numéro, client, booking, navire, conteneur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="en-attente" className="space-y-4">
        <TabsList>
          <TabsTrigger value="en-attente" className="gap-2">
            <Clock className="h-4 w-4" />
            En attente ({filteredEnAttente.length})
          </TabsTrigger>
          <TabsTrigger value="valides" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Validés ({filteredValides.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="en-attente">
          <OrdresEnAttenteTable
            ordres={filteredEnAttente}
            loading={loading}
            onViewDetails={handleViewDetails}
            onValidate={handleValidate}
            onReject={handleReject}
            showActions={true}
          />
        </TabsContent>

        <TabsContent value="valides">
          <OrdresEnAttenteTable
            ordres={filteredValides}
            loading={loading}
            onViewDetails={handleViewDetails}
            showActions={false}
          />
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <OrdreDetailsDialog
        ordre={selectedOrdre}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onValidate={handleValidate}
        onReject={handleReject}
      />
    </div>
  );
}
