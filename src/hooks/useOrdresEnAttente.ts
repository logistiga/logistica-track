import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OrdreTravail } from "@/types/logistique.types";
import { apiService } from "@/services/apiService";

const SYNC_INTERVAL = 30000; // 30 secondes

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

  // Valider un ordre (changer le statut à "termine")
  const validateMutation = useMutation({
    mutationFn: async (ordreId: number) => {
      const response = await apiService.put(
        `/ordres-externes/${ordreId}/status`,
        { status: "termine", notes: "Validé depuis Logistiga" }
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
