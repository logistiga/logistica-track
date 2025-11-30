import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface CompactCardField {
  label: string;
  value: ReactNode;
  badge?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface CompactCardProps {
  title: string;
  subtitle?: string;
  fields: CompactCardField[];
  actions?: ReactNode;
  onClick?: () => void;
  status?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

/**
 * Carte compacte pour affichage mobile optimisé
 * Affiche les informations de manière hiérarchique et lisible
 */
export function CompactCard({
  title,
  subtitle,
  fields,
  actions,
  onClick,
  status
}: CompactCardProps) {
  const highPriorityFields = fields.filter(f => !f.priority || f.priority === 'high');
  const mediumPriorityFields = fields.filter(f => f.priority === 'medium');
  const lowPriorityFields = fields.filter(f => f.priority === 'low');

  return (
    <Card
      className={cn(
        "p-4 space-y-3",
        onClick && "cursor-pointer hover:bg-muted/50 active:scale-[0.98] transition-all"
      )}
      onClick={onClick}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        {status && (
          <Badge variant={status.variant || 'default'} className="flex-shrink-0">
            {status.label}
          </Badge>
        )}
      </div>

      {/* Champs haute priorité */}
      {highPriorityFields.length > 0 && (
        <div className="space-y-2">
          {highPriorityFields.map((field, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">{field.label}</span>
              {field.badge ? (
                <Badge variant="outline" className="font-medium">
                  {field.value}
                </Badge>
              ) : (
                <span className="text-sm font-medium text-right">{field.value}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Champs moyenne priorité (grid compact) */}
      {mediumPriorityFields.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t">
          {mediumPriorityFields.map((field, index) => (
            <div key={index} className="min-w-0">
              <div className="text-xs text-muted-foreground truncate">{field.label}</div>
              <div className="text-sm font-medium truncate">{field.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Champs basse priorité (liste compacte en bas) */}
      {lowPriorityFields.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {lowPriorityFields.map((field, index) => (
            <div key={index} className="text-xs text-muted-foreground">
              {field.label}: <span className="text-foreground font-medium">{field.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions ou indicateur de détails */}
      {(actions || onClick) && (
        <div className="flex items-center justify-between pt-2 border-t">
          {actions ? (
            <div className="flex gap-2 flex-1">{actions}</div>
          ) : onClick ? (
            <div className="flex items-center justify-end w-full text-xs text-muted-foreground">
              Voir détails
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
