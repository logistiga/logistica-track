import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OrdreTravail, Container, LignePrestation } from "@/types/logistique.types";
import { apiService } from "@/services/apiService";

const SYNC_INTERVAL = 30000; // 30 secondes

interface ValidationData {
  containers: Container[];
  lignes_prestations: Omit<LignePrestation, 'id' | 'montant'>[];
}

export function useOrdresEnAttente() {
  const queryClient = useQueryClient();
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Récupérer les ordres de travail depuis la base locale
  const {
    data: ordresData,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["ordres-externes"],
    queryFn: async () => {
      const response = await apiService.get("/ordres-externes");
      setLastSync(new Date());
      return response;
    },
    refetchInterval: SYNC_INTERVAL,
    retry: 2,
  });

  // Transformer les données pour correspondre au type OrdreTravail
  const ordres: OrdreTravail[] = ordresData?.data?.data || ordresData?.data || [];
  const error = queryError ? (queryError as Error).message : null;

  // Rafraîchir manuellement
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Synchronisation réussie");
    } catch (err) {
      toast.error("Erreur lors de la synchronisation");
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  // Valider un ordre avec les données enrichies
  const validateMutation = useMutation({
    mutationFn: async ({ ordreId, data }: { ordreId: number; data?: ValidationData }) => {
      const payload: Record<string, unknown> = {
        status: "termine",
        notes: "Validé depuis Logistiga",
      };

      // Ajouter les données enrichies si fournies
      if (data?.containers) {
        payload.containers = data.containers.map(c => ({
          number: c.number,
          type: c.type,
          description: c.description || null,
        }));
      }

      if (data?.lignes_prestations) {
        payload.lignes_prestations = data.lignes_prestations.map(p => ({
          description: p.description,
          quantite: p.quantite,
          prix_unitaire: p.prix_unitaire,
        }));
      }

      const response = await apiService.put(
        `/ordres-externes/${ordreId}/status`,
        payload
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordres-externes"] });
      toast.success("Ordre validé avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Rejeter un ordre (changer le statut à "annule")
  const rejectMutation = useMutation({
    mutationFn: async (ordreId: number) => {
      const response = await apiService.put(
        `/ordres-externes/${ordreId}/status`,
        { status: "annule", notes: "Rejeté depuis Logistiga" }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordres-externes"] });
      toast.success("Ordre rejeté");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const validateOrdre = useCallback(async (ordreId: number, data?: ValidationData) => {
    await validateMutation.mutateAsync({ ordreId, data });
  }, [validateMutation]);

  const rejectOrdre = useCallback(async (ordreId: number) => {
    await rejectMutation.mutateAsync(ordreId);
  }, [rejectMutation]);

  return {
    ordres,
    loading,
    error,
    lastSync,
    refresh,
    validateOrdre,
    rejectOrdre,
    isRefreshing,
    isValidating: validateMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
}
