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

        return Facturation::create([
            'numero_facture' => $numeroFacture,
            'sortie_conteneur_id' => $data['sortie_conteneur_id'] ?? null,
            'type_operation' => $data['type_operation'],
            'numero_conteneur' => $data['numero_conteneur'] ?? null,
            'nom_client' => $data['nom_client'] ?? null,
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
