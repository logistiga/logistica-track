import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle } from "lucide-react";

interface DoubleRelevageActionsProps {
  statut: string;
  onConfirm: () => void;
  onDelete: () => void;
  onEdit?: () => void;
}

export function DoubleRelevageActions({ 
  statut, 
  onConfirm, 
  onDelete, 
  onEdit 
}: DoubleRelevageActionsProps) {
  return (
    <div className="flex space-x-1">
      {onEdit && (
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="w-3 h-3" />
        </Button>
      )}
      <Button 
        variant="outline" 
        size="sm"
        onClick={onDelete}
        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
      {statut === "en_attente" && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onConfirm}
          className="text-success hover:bg-success hover:text-success-foreground"
        >
          <CheckCircle className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}