import { useApiHealth } from "@/hooks/useLogistiqueApi";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

export const LogistiqueApiStatus = () => {
  const { data, isLoading, isError } = useApiHealth();

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
