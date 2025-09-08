export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getStatusColor = (statut: string): string => {
  switch (statut) {
    case "en_attente":
      return "bg-warning text-warning-foreground";
    case "confirme":
      return "bg-success text-success-foreground";
    case "annule":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

export const getStatusLabel = (statut: string): string => {
  switch (statut) {
    case "en_attente":
      return "En Attente";
    case "confirme":
      return "Confirmé";
    case "annule":
      return "Annulé";
    default:
      return statut;
  }
};