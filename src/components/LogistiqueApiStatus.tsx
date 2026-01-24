import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { apiService } from "@/services/apiService";

// Hook local pour vérifier la connexion à l'API backend
const useBackendHealth = () => {
  return useQuery({
    queryKey: ["backend", "health"],
    queryFn: async () => {
      // Utilise l'endpoint ordres-externes pour vérifier la connexion
      const response = await apiService.get("/ordres-externes?per_page=1");
      return { success: response?.success ?? true };
    },
    refetchInterval: 60000, // Vérifier toutes les minutes
    retry: 1,
  });
};

export const LogistiqueApiStatus = () => {
  const { data, isLoading, isError } = useBackendHealth();

  if (isLoading) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Connexion...
      </Badge>
    );
  }

  if (isError || !data?.success) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <WifiOff className="h-3 w-3" />
        API Déconnectée
      </Badge>
    );
  }

  return (
    <Badge className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
      <Wifi className="h-3 w-3" />
      API Connectée
    </Badge>
  );
};
