import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  statut: string;
}

export const StatusBadge = ({ statut }: StatusBadgeProps) => {
  const variants = {
    en_cours: "default",
    livre_client: "secondary", 
    a_la_base: "outline",
    retourne_port: "destructive"
  };
  
  const labels = {
    en_cours: "En cours",
    livre_client: "Livré au client",
    a_la_base: "À la base", 
    retourne_port: "Retourné au port"
  };

  return (
    <Badge variant={variants[statut as keyof typeof variants] as any}>
      {labels[statut as keyof typeof labels]}
    </Badge>
  );
};