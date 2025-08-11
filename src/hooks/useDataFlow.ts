import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export interface DataFlowState {
  isTransferring: boolean;
  lastTransfer: string | null;
  transferCount: number;
}

export function useDataFlow() {
  const { toast } = useToast();
  const [flowState, setFlowState] = useState<DataFlowState>({
    isTransferring: false,
    lastTransfer: null,
    transferCount: 0
  });

  const transferToFacturation = useCallback((data: any, source: string) => {
    setFlowState(prev => ({ 
      isTransferring: true, 
      lastTransfer: `${source} → Facturation`,
      transferCount: prev.transferCount + 1
    }));
    
    setTimeout(() => {
      setFlowState(prev => ({ ...prev, isTransferring: false }));
      toast({
        title: "Transfert vers Facturation",
        description: `Données transférées depuis ${source} vers la facturation`
      });
    }, 1000);
  }, [toast]);

  const transferToArchives = useCallback((data: any, source: string, archiveType: string) => {
    setFlowState(prev => ({ 
      isTransferring: true, 
      lastTransfer: `${source} → Archives ${archiveType}`,
      transferCount: prev.transferCount + 1
    }));
    
    setTimeout(() => {
      setFlowState(prev => ({ ...prev, isTransferring: false }));
      toast({
        title: "Transfert vers Archives",
        description: `Données archivées depuis ${source} vers Archives ${archiveType}`
      });
    }, 1000);
  }, [toast]);

  const transferToDetention = useCallback((data: any, source: string) => {
    setFlowState(prev => ({ 
      isTransferring: true, 
      lastTransfer: `${source} → Détention`,
      transferCount: prev.transferCount + 1
    }));
    
    setTimeout(() => {
      setFlowState(prev => ({ ...prev, isTransferring: false }));
      toast({
        title: "Transfert vers Détention",
        description: `Données transférées depuis ${source} vers la gestion de détention`
      });
    }, 1000);
  }, [toast]);

  const transferToOrdre = useCallback((data: any, source: string) => {
    setFlowState(prev => ({ 
      isTransferring: true, 
      lastTransfer: `${source} → Ordre`,
      transferCount: prev.transferCount + 1
    }));
    
    setTimeout(() => {
      setFlowState(prev => ({ ...prev, isTransferring: false }));
      toast({
        title: "Transfert vers Ordre",
        description: `Données transférées depuis ${source} vers la validation des ordres`
      });
    }, 1000);
  }, [toast]);

  return {
    flowState,
    transferToFacturation,
    transferToArchives,
    transferToDetention,
    transferToOrdre
  };
}