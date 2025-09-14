import { DetentionContainer } from '@/types/detention';

export interface TableColumn {
  key: keyof DetentionContainer | 'actions';
  label: string;
  className?: string;
  render?: (container: DetentionContainer) => React.ReactNode;
}

export const TABLE_COLUMNS: TableColumn[] = [
  { key: 'numeroConteneur', label: 'Conteneur', className: 'font-mono' },
  { key: 'codeArmateur', label: 'Armateur' },
  { key: 'typeConteneur', label: 'Type' },
  { key: 'joursBAT', label: 'Jours autorisés' },
  { key: 'joursRealises', label: 'Jours réalisés' },
  { key: 'joursDepassement', label: 'Dépassement', className: 'text-red-600' },
  { key: 'montantTotal', label: 'Montant (FCFA)', className: 'font-semibold' },
  { key: 'dateSortie', label: 'Sortie' },
  { key: 'dateRetour', label: 'Retour' },
  { key: 'nomClient', label: 'Client' },
  { key: 'responsabilite', label: 'Responsabilité' },
  { key: 'actions', label: 'Actions', className: 'text-center' },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};