import type { Vehicule } from '@/services/vehiculeService';

/**
 * Filtrer les véhicules par terme de recherche
 */
export function filterVehicles(vehicles: Vehicule[], searchTerm: string): Vehicule[] {
  if (!searchTerm.trim()) {
    return vehicles;
  }

  const term = searchTerm.toLowerCase();
  return vehicles.filter(vehicle =>
    vehicle.numero_parc.toLowerCase().includes(term) ||
    vehicle.immatriculation.toLowerCase().includes(term)
  );
}

/**
 * Obtenir le label de statut d'un véhicule
 */
export function getStatusLabel(statut: string | null | undefined): string {
  const labels: Record<string, string> = {
    disponible: 'Disponible',
    en_mission: 'En mission',
    maintenance: 'En maintenance',
    hors_service: 'Hors service',
  };
  return labels[statut || 'disponible'] || 'Actif';
}

/**
 * Obtenir la couleur de statut d'un véhicule
 */
export function getStatusColor(statut: string | null | undefined): string {
  const colors: Record<string, string> = {
    disponible: 'bg-success/10 text-success',
    en_mission: 'bg-info/10 text-info',
    maintenance: 'bg-warning/10 text-warning',
    hors_service: 'bg-destructive/10 text-destructive',
  };
  return colors[statut || 'disponible'] || 'bg-success/10 text-success';
}

/**
 * Transformer un véhicule en option pour les selects
 */
export function vehicleToOption(vehicle: Vehicule): { value: string; label: string } {
  return {
    value: vehicle.id.toString(),
    label: `${vehicle.numero_parc} - ${vehicle.immatriculation}`,
  };
}

/**
 * Calculer les statistiques des véhicules
 */
export function calculateVehicleStats(camions: Vehicule[], remorques: Vehicule[]) {
  return {
    totalCamions: camions.length,
    totalRemorques: remorques.length,
    totalVehicules: camions.length + remorques.length,
    camionsDisponibles: camions.filter(c => c.statut === 'disponible' || !c.statut).length,
    remorquesDisponibles: remorques.filter(r => r.statut === 'disponible' || !r.statut).length,
  };
}
