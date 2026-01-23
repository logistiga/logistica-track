import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OrdreTravail } from "@/types/logistique.types";
import { apiService } from "@/services/apiService";

const SYNC_INTERVAL = 30000; // 30 secondes

export function useOrdresEnAttente() {
  const queryClient = useQueryClient();
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Récupérer les ordres de travail via le backend Laravel
  const {
    data: ordresData,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["ordres-en-attente"],
    queryFn: async () => {
      const response = await apiService.get("/external-logistique/ordres-travail");
      setLastSync(new Date());
      return response;
    },
    refetchInterval: SYNC_INTERVAL,
    retry: 2,
  });

  const ordres: OrdreTravail[] = ordresData?.data || [];
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

  // Valider un ordre (changer le statut à "termine")
  const validateMutation = useMutation({
    mutationFn: async (ordreId: number) => {
      const response = await apiService.put(
        `/external-logistique/ordres-travail/${ordreId}/status`,
        { status: "termine", notes: "Validé depuis Logistiga" }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordres-en-attente"] });
      toast.success("Ordre validé avec succès");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Rejeter un ordre (changer le statut à "annule" ou supprimer)
  const rejectMutation = useMutation({
    mutationFn: async (ordreId: number) => {
      const response = await apiService.put(
        `/external-logistique/ordres-travail/${ordreId}/status`,
        { status: "annule", notes: "Rejeté depuis Logistiga" }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordres-en-attente"] });
      toast.success("Ordre rejeté");
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  const validateOrdre = useCallback(async (ordreId: number) => {
    await validateMutation.mutateAsync(ordreId);
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
