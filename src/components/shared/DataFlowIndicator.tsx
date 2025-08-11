import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useDataFlow } from "@/hooks/useDataFlow";

interface DataFlowIndicatorProps {
  currentPage: string;
  showTransferButtons?: boolean;
  onTransfer?: (destination: string) => void;
}

export function DataFlowIndicator({ 
  currentPage, 
  showTransferButtons = false,
  onTransfer 
}: DataFlowIndicatorProps) {
  const { flowState } = useDataFlow();

  const getDestinations = (page: string) => {
    switch (page) {
      case "Operations":
        return ["Facturation"];
      case "Base":
        return ["Facturation", "Archives Base"];
      case "SortieConteneur":
        return ["Detention", "Base", "Facturation", "Ordre"];
      case "Detention":
        return ["Facturation", "Archives Sortie"];
      case "Facturation":
        return ["Archives Base", "Archives Sortie", "Archives Operation"];
      case "Ordre":
        return ["Facturation"];
      default:
        return [];
    }
  };

  const destinations = getDestinations(currentPage);

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      {flowState.isTransferring && (
        <Badge variant="secondary" className="animate-pulse">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          {flowState.lastTransfer}
        </Badge>
      )}
      
      {showTransferButtons && destinations.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{currentPage}</span>
          {destinations.map((dest) => (
            <Button
              key={dest}
              variant="outline"
              size="sm"
              onClick={() => onTransfer?.(dest)}
              className="h-6 px-2 text-xs"
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              {dest}
            </Button>
          ))}
        </div>
      )}
      
      {flowState.transferCount > 0 && (
        <Badge variant="outline">
          {flowState.transferCount} transferts
        </Badge>
      )}
    </div>
  );
}