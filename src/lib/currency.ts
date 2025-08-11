// Utilitaire pour formater les montants en Franc CFA (Gabon)
export function formatCurrency(amount: number): string {
  // Conversion du montant en entier (suppression des décimales)
  const roundedAmount = Math.round(amount);
  
  // Formatage avec des espaces comme séparateurs de milliers
  return new Intl.NumberFormat('fr-FR').format(roundedAmount) + ' FCFA';
}

// Fonction pour analyser un montant depuis une chaîne formatée
export function parseCurrency(formattedAmount: string): number {
  return parseInt(formattedAmount.replace(/\s/g, '').replace('FCFA', '')) || 0;
}

// Constante pour le symbole de devise
export const CURRENCY_SYMBOL = 'FCFA';
export const CURRENCY_NAME = 'Franc CFA';