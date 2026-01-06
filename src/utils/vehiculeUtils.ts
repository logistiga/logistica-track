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
    camionsActifs: camions.filter(c => c.actif).length,
    remorquesActifs: remorques.filter(r => r.actif).length,
  };
}
