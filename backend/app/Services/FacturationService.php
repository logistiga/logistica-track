<?php

namespace App\Services;

use App\Models\Facturation;
use Carbon\Carbon;

class FacturationService
{
    /**
     * Créer une facture automatiquement pour une opération de base
     */
    public function createFactureFromBaseOperation(array $data): Facturation
    {
        $numeroFacture = $this->generateNumeroFacture();
        
        $montantTotal = $data['montant_detention'] ?? $data['montant_operation'] ?? 0;
        $montantTva = $montantTotal * 0.18; // 18% TVA
        $montantTtc = $montantTotal + $montantTva;

        // Construire details_operation selon le type
        $detailsOperation = $this->buildDetailsOperation($data);

        return Facturation::create([
            'numero_facture' => $numeroFacture,
            'sortie_conteneur_id' => $data['sortie_conteneur_id'] ?? null,
            'type_operation' => $data['type_operation'],
            'numero_conteneur' => $data['numero_conteneur'] ?? null,
            'nom_client' => $data['nom_client'] ?? null,
            'details_operation' => $detailsOperation,
            'date_facture' => now(),
            'date_echeance' => now()->addDays(30),
            'montant_transport' => 0,
            'montant_detention' => $data['montant_detention'] ?? 0,
            'montant_autres' => $data['montant_operation'] ?? 0,
            'montant_total' => $montantTotal,
            'montant_tva' => $montantTva,
            'montant_ttc' => $montantTtc,
            'statut' => 'brouillon',
            'notes' => $this->generateFactureNotes($data),
        ]);
    }

    /**
     * Générer un numéro de facture unique
     */
    private function generateNumeroFacture(): string
    {
        $date = Carbon::now();
        $year = $date->format('Y');
        $month = $date->format('m');
        
        // Compter les factures du mois
        $count = Facturation::whereYear('date_facture', $year)
                           ->whereMonth('date_facture', $month)
                           ->count() + 1;
        
        return sprintf('FACT-%s%s-%04d', $year, $month, $count);
    }

    /**
     * Construire les détails de l'opération
     */
    private function buildDetailsOperation(array $data): array
    {
        $details = [];
        
        if ($data['type_operation'] === 'stockage') {
            $details = [
                'plaque_camion' => $data['plaque_camion'] ?? null,
                'plaque_remorque' => $data['plaque_remorque'] ?? null,
                'jours_gratuits' => $data['jours_gratuits'] ?? 0,
                'jours_detention' => $data['jours_detention'] ?? 0,
                'prix_par_jour' => $data['prix_par_jour'] ?? 0,
                'date_arrivee' => $data['date_arrivee'] ?? null,
                'date_sortie' => $data['date_sortie'] ?? null,
            ];
        } elseif ($data['type_operation'] === 'double_relevage') {
            $details = [
                'camion_ameneur_plaque' => $data['camion_ameneur_plaque'] ?? null,
                'camion_ameneur_remorque' => $data['camion_ameneur_remorque'] ?? null,
                'camion_recuperateur_plaque' => $data['camion_recuperateur_plaque'] ?? null,
                'camion_recuperateur_remorque' => $data['camion_recuperateur_remorque'] ?? null,
                'montant_operation' => $data['montant_operation'] ?? 0,
            ];
        } elseif ($data['type_operation'] === 'depotage') {
            $details = [
                'plaque_camion' => $data['plaque_camion'] ?? null,
                'plaque_remorque' => $data['plaque_remorque'] ?? null,
                'type_marchandise' => $data['type_marchandise'] ?? null,
                'prix_depotage' => $data['prix_depotage'] ?? 0,
                'date_depotage' => $data['date_depotage'] ?? null,
            ];
        }
        
        return $details;
    }

    /**
     * Générer les notes de la facture
     */
    private function generateFactureNotes(array $data): string
    {
        $notes = [];
        
        if ($data['type_operation'] === 'stockage') {
            $notes[] = "Conteneur: {$data['numero_conteneur']}";
            $notes[] = "Client: {$data['nom_client']}";
            $notes[] = "Jours gratuits: {$data['jours_gratuits']}";
            $notes[] = "Jours payants: {$data['jours_detention']}";
        } elseif ($data['type_operation'] === 'double_relevage') {
            $notes[] = "Conteneur: {$data['numero_conteneur']}";
            $notes[] = "Client: {$data['nom_client']}";
            $notes[] = "Montant opération: " . number_format($data['montant_operation'], 0, ',', ' ') . ' FCFA';
        } elseif ($data['type_operation'] === 'depotage') {
            $notes[] = "Conteneur: {$data['numero_conteneur']}";
            $notes[] = "Montant dépotage: " . number_format($data['montant_operation'], 0, ',', ' ') . ' FCFA';
        }
        
        return implode("\n", $notes);
    }
}
