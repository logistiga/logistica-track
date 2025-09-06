import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/apiService";

interface DetentionSummaryProps {
  armateurId: string | null;
}

interface DetentionStats {
  total_detentions: number;
  detention_active: number;
  total_montant: number;
  moyenne_jours: number;
  derniere_detention: string | null;
}

export function DetentionSummary({ armateurId }: DetentionSummaryProps) {
  const { data: detentionStats, isLoading } = useQuery({
    queryKey: ['detention-stats', armateurId],
    queryFn: async () => {
      if (!armateurId) return null;
      const response = await apiService.get(`/armateurs/${armateurId}/detention-stats`);
      return response.data as DetentionStats;
    },
    enabled: !!armateurId,
  });

  if (!armateurId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Sélectionnez un armateur pour voir le récapitulatif des détentions
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Chargement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!detentionStats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Aucune donnée de détention disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          Récapitulatif des détentions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Total détentions</span>
            </div>
            <p className="text-lg font-semibold">{detentionStats.total_detentions}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">En cours</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">{detentionStats.detention_active}</p>
              {detentionStats.detention_active > 0 && (
                <Badge variant="destructive" className="text-xs">Actif</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Montant total</span>
            </div>
            <p className="text-lg font-semibold">
              {new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'XOF',
                minimumFractionDigits: 0 
              }).format(detentionStats.total_montant)}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Moy. jours</span>
            </div>
            <p className="text-lg font-semibold">{detentionStats.moyenne_jours.toFixed(1)}</p>
          </div>
        </div>

        {detentionStats.derniere_detention && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Dernière détention: {new Date(detentionStats.derniere_detention).toLocaleDateString('fr-FR')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}