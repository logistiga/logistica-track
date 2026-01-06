import { Badge } from "@/components/ui/badge";
import { 
  STOCKAGE_STATUS_CONFIG, 
  DEPOTAGE_STATUS_CONFIG, 
  DOUBLE_RELEVAGE_STATUS_CONFIG,
  type StockageStatut,
  type DepotageStatut,
  type DoubleRelevageStatut
} from "@/utils/baseUtils";

interface StatusBadgeProps {
  statut: string;
  type: 'stockage' | 'depotage' | 'double-relevage';
}

export function StatusBadge({ statut, type }: StatusBadgeProps) {
  if (type === 'stockage') {
    const config = STOCKAGE_STATUS_CONFIG[statut as StockageStatut];
    if (!config) return <Badge variant="secondary">{statut}</Badge>;
    
    // Stockage utilise des classes personnalisées
    if (config.bgClass) {
      return <Badge className={config.bgClass}>{config.label}</Badge>;
    }
    return <Badge variant="secondary">{config.label}</Badge>;
  }
  
  if (type === 'depotage') {
    const config = DEPOTAGE_STATUS_CONFIG[statut as DepotageStatut];
    if (!config) return <Badge variant="outline">{statut}</Badge>;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }
  
  if (type === 'double-relevage') {
    const config = DOUBLE_RELEVAGE_STATUS_CONFIG[statut as DoubleRelevageStatut];
    if (!config) return <Badge variant="outline">{statut}</Badge>;
    
    // Map custom variants to valid Badge variants or use className
    if (config.variant === 'success') {
      return <Badge className="bg-success text-success-foreground">{config.label}</Badge>;
    }
    if (config.variant === 'warning') {
      return <Badge className="bg-warning text-warning-foreground">{config.label}</Badge>;
    }
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }
  
  return <Badge variant="secondary">{statut}</Badge>;
}
