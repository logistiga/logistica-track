// Utilitaire pour formater les montants en Franc CFA (Gabon)
export function formatCurrency(amount: number): string {
  // Conversion du montant en entier (suppression des décimales)
  const roundedAmount = Math.round(amount);
  
  // Formatage avec des espaces comme séparateurs de milliers
  return new Intl.NumberFormat('fr-FR').format(roundedAmount) + ' FCFA';
}

// Version pour PDF qui utilise des espaces normaux au lieu d'espaces insécables
export function formatCurrencyForPdf(amount: number): string {
  const roundedAmount = Math.round(amount);
  // Formatage manuel avec espaces normaux pour éviter les problèmes d'encodage dans les PDFs
  const formatted = roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formatted + ' FCFA';
}

// Fonction pour analyser un montant depuis une chaîne formatée
export function parseCurrency(formattedAmount: string): number {
  return parseInt(formattedAmount.replace(/\s/g, '').replace('FCFA', '')) || 0;
}

// Constante pour le symbole de devise
export const CURRENCY_SYMBOL = 'FCFA';
export const CURRENCY_NAME = 'Franc CFA';