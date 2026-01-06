import { CalendarIcon } from "lucide-react";
import { calculateDetentionStatus, formatDateLimite, getDetentionAlertMessage } from "@/utils/detentionCalculations";

interface DetentionAlertProps {
  dateSortie: Date;
  joursGratuits: number;
  prixParJour: number;
  dateFinFranchise?: string;
}

export function DetentionAlert({ 
  dateSortie, 
  joursGratuits, 
  prixParJour, 
  dateFinFranchise 
}: DetentionAlertProps) {
  const status = calculateDetentionStatus(dateSortie, joursGratuits, prixParJour, dateFinFranchise);
  const alert = getDetentionAlertMessage(status, prixParJour);
  
  const bgColors = {
    error: 'bg-red-100 border-red-300 text-red-700',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-700',
    success: 'bg-green-100 border-green-300 text-green-700'
  };

  return (
    <div className="p-3 bg-orange-50 border border-orange-200 rounded">
      <div className="flex items-center gap-2 text-orange-700">
        <CalendarIcon className="w-4 h-4" />
        <span className="font-medium">
          Le conteneur doit être retourné au port avant le {formatDateLimite(status.dateLimite)}
        </span>
      </div>
      
      <div className={`mt-2 p-2 ${bgColors[alert.type]} border rounded text-sm`}>
        {alert.icon} <strong>{alert.title}:</strong> {alert.message}
        {dateFinFranchise && (
          <div className="mt-1 text-xs">
            📅 Date de fin personnalisée: {formatDateLimite(status.dateLimite, "dd/MM/yyyy")}
          </div>
        )}
      </div>
    </div>
  );
}
