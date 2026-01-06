<?php

namespace App\Services;

use App\Models\SortieConteneur;
use Illuminate\Support\Facades\DB;

class SortieArchiveService
{
    /**
     * Colonnes de base pour les requêtes d'archives
     */
    private function getArchiveSelectColumns(): array
    {
        return [
            'pa.id',
            'sc.numero_conteneur as numeroConteneur',
            'a.code as codeArmateur',
            'a.type_conteneur as typeConteneur',
            'pa.nom_client as nomClient',
            'sc.date_sortie as dateSortiePort',
            'sc.date_retour as dateRetourPort',
            'sc.destination as destinationInitiale',
            'a.jours_gratuits as joursBAT',
            DB::raw('DATEDIFF(sc.date_retour, sc.date_sortie) as joursRealises'),
            DB::raw('GREATEST(DATEDIFF(sc.date_retour, sc.date_sortie) - a.jours_gratuits, 0) as joursDepassement'),
            'd.responsabilite',
            DB::raw('COALESCE(d.jours_client, 0) as joursClient'),
            DB::raw('COALESCE(d.jours_logistiga, 0) as joursLogistiga'),
            DB::raw('COALESCE(d.cout_total, 0) as montantTotalDetention'),
            DB::raw("CASE WHEN d.id IS NOT NULL AND COALESCE(d.cout_total, 0) > 0 THEN 'paye' ELSE 'sans-frais' END as statutPaiement"),
            'pa.montant_prime as montantPrime',
            'vc.immatriculation as camion',
            'vr.immatriculation as remorque',
            'pa.chauffeur',
            'sc.numero_bl as numeroBL',
            'sc.nom_transitaire as nomTransitaire',
            'sc.numero_ordre as numeroOrdre',
            'sc.pv_sortie as pvSortie',
            'sc.pv_rentree_port as pvRentreePort',
            'pa.observations',
            'pa.date_paiement as dateArchivage'
        ];
    }

    /**
     * Construire la requête de base pour les archives
     */
    private function buildArchiveQuery()
    {
        return DB::table('prime_archives as pa')
            ->join('sortie_conteneurs as sc', 'pa.sortie_id', '=', 'sc.id')
            ->join('armateurs as a', 'sc.code_armateur', '=', 'a.code')
            ->leftJoin('detentions as d', 'sc.id', '=', 'd.sortie_conteneur_id')
            ->leftJoin('vehicules as vc', 'sc.camion_id', '=', 'vc.id')
            ->leftJoin('vehicules as vr', 'sc.remorque_id', '=', 'vr.id')
            ->select($this->getArchiveSelectColumns());
    }

    /**
     * Récupérer toutes les archives
     */
    public function getAllArchives()
    {
        return $this->buildArchiveQuery()
            ->orderBy('pa.date_paiement', 'desc')
            ->get();
    }

    /**
     * Rechercher dans les archives avec filtres
     */
    public function searchArchives(array $filters)
    {
        $query = $this->buildArchiveQuery();

        if (!empty($filters['dateDebut'])) {
            $query->where('pa.date_paiement', '>=', $filters['dateDebut']);
        }

        if (!empty($filters['dateFin'])) {
            $query->where('pa.date_paiement', '<=', $filters['dateFin']);
        }

        if (!empty($filters['armateur'])) {
            $query->where('a.code', 'like', '%' . $filters['armateur'] . '%');
        }

        if (!empty($filters['client'])) {
            $query->where('pa.nom_client', 'like', '%' . $filters['client'] . '%');
        }

        if (!empty($filters['numeroConteneur'])) {
            $query->where('sc.numero_conteneur', 'like', '%' . $filters['numeroConteneur'] . '%');
        }

        if (!empty($filters['statutPaiement'])) {
            if ($filters['statutPaiement'] === 'paye') {
                $query->whereNotNull('d.id')->where('d.cout_total', '>', 0);
            } elseif ($filters['statutPaiement'] === 'sans-frais') {
                $query->where(function($q) {
                    $q->whereNull('d.id')
                      ->orWhere('d.cout_total', '=', 0);
                });
            }
        }

        return $query->orderBy('pa.date_paiement', 'desc')->get();
    }

    /**
     * Calculer les statistiques des archives
     */
    public function getArchivesStats(array $filters = [])
    {
        $query = DB::table('prime_archives as pa')
            ->join('sortie_conteneurs as sc', 'pa.sortie_id', '=', 'sc.id')
            ->leftJoin('detentions as d', 'sc.id', '=', 'd.sortie_conteneur_id');

        if (!empty($filters['dateDebut'])) {
            $query->where('pa.date_paiement', '>=', $filters['dateDebut']);
        }

        if (!empty($filters['dateFin'])) {
            $query->where('pa.date_paiement', '<=', $filters['dateFin']);
        }

        return [
            'total_archives' => $query->count(),
            'total_primes' => $query->sum('pa.montant_prime'),
            'total_detention' => $query->sum('d.cout_total'),
            'moyenne_jours' => $query->avg(DB::raw('DATEDIFF(sc.date_retour, sc.date_sortie)')),
        ];
    }

    /**
     * Archiver une sortie
     */
    public function archiverSortie(SortieConteneur $sortie): bool
    {
        if ($sortie->statut !== 'retourne_port') {
            throw new \Exception('Seules les sorties retournées au port peuvent être archivées');
        }

        if (!$sortie->pv_sortie || !$sortie->pv_rentree_port || !$sortie->numero_ordre) {
            throw new \Exception('Les champs PV Sortie, PV Rentrée et N° Ordre sont obligatoires');
        }

        $camion = $sortie->camion;
        $chauffeur = $camion ? $camion->libelle_complet : 'Non défini';

        DB::table('prime_archives')->updateOrInsert(
            ['sortie_id' => $sortie->id],
            [
                'numero_conteneur' => $sortie->numero_conteneur,
                'chauffeur' => $chauffeur,
                'montant_prime' => $sortie->prime_chauffeur ?? 0,
                'date_sortie' => $sortie->date_sortie,
                'date_paiement' => now(),
                'numero_semaine' => date('W'),
                'nom_client' => $sortie->nom_client,
                'observations' => 'Archivé depuis Ordre - PV Sortie: ' . $sortie->pv_sortie . 
                    ', PV Rentrée: ' . $sortie->pv_rentree_port . 
                    ', N° Ordre: ' . $sortie->numero_ordre,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $sortie->update(['archived_at' => now()]);

        return true;
    }
}
