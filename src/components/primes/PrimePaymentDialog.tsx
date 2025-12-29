import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, CheckCircle, Truck, Package, DollarSign } from "lucide-react";
import type { PrimeChauffeur } from "@/types/prime";
import { formatCurrency } from "@/lib/currency";
import { generatePrimePaymentPdf } from "@/services/primePdfService";

interface PrimePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPrimes: PrimeChauffeur[];
  onConfirmPayment: () => Promise<void>;
}

export function PrimePaymentDialog({
  open,
  onOpenChange,
  selectedPrimes,
  onConfirmPayment,
}: PrimePaymentDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Grouper par numéro de parc
  const parcNumber = selectedPrimes.length > 0 ? selectedPrimes[0].numero_parc : null;
  
  const totalAmount = selectedPrimes.reduce((sum, p) => sum + (p.prime_chauffeur || 0), 0);
  const containerCount = selectedPrimes.length;

  const handleDownloadPdf = () => {
    generatePrimePaymentPdf(selectedPrimes, parcNumber || 'N/A', totalAmount);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      await onConfirmPayment();
      onOpenChange(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Confirmation de paiement
          </DialogTitle>
          <DialogDescription>
            Vérifiez les détails avant de confirmer le paiement des primes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Numéro de parc */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Numéro de parc</p>
                <p className="text-xl font-bold">{parcNumber || 'N/A'}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {containerCount} conteneur{containerCount > 1 ? 's' : ''}
            </Badge>
          </div>

          <Separator />

          {/* Liste des conteneurs */}
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            <p className="text-sm font-medium text-muted-foreground">Conteneurs sélectionnés:</p>
            {selectedPrimes.map((prime) => (
              <div key={prime.id} className="flex items-center justify-between p-2 bg-background border rounded">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{prime.numero_tc}</span>
                </div>
                <span className="text-sm text-primary font-semibold">
                  {formatCurrency(prime.prime_chauffeur)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
            <span className="text-lg font-medium">Montant total à payer</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
          <Button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isProcessing ? 'Traitement...' : 'Confirmer le paiement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
