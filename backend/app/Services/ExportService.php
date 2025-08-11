<?php

namespace App\Services;

use App\Models\SortieConteneur;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SortieConteneurExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ExportService
{
    /**
     * Exporter les sorties de conteneurs
     */
    public function exportSorties(array $filters, string $format = 'excel')
    {
        $sorties = $this->getSortiesForExport($filters);

        if ($format === 'pdf') {
            return $this->exportToPdf($sorties, $filters);
        }

        return $this->exportToExcel($sorties, $filters);
    }

    /**
     * Récupérer les sorties pour l'export
     */
    private function getSortiesForExport(array $filters)
    {
        $query = SortieConteneur::with(['armateur', 'camion', 'remorque']);

        // Appliquer les filtres
        if (isset($filters['date_debut'])) {
            $query->whereDate('date_sortie', '>=', $filters['date_debut']);
        }

        if (isset($filters['date_fin'])) {
            $query->whereDate('date_sortie', '<=', $filters['date_fin']);
        }

        if (isset($filters['statut']) && $filters['statut'] !== 'tous') {
            $query->where('statut', $filters['statut']);
        }

        if (isset($filters['code_armateur']) && $filters['code_armateur'] !== 'tous') {
            $query->where('code_armateur', $filters['code_armateur']);
        }

        if (isset($filters['camion_id']) && $filters['camion_id'] !== 'tous') {
            $query->where('camion_id', $filters['camion_id']);
        }

        return $query->orderBy('date_sortie', 'desc')->get();
    }

    /**
     * Export Excel
     */
    private function exportToExcel($sorties, $filters)
    {
        $filename = 'sorties-conteneurs-' . now()->format('Y-m-d-H-i-s') . '.xlsx';
        $path = storage_path('app/exports/' . $filename);

        // Créer le dossier s'il n'existe pas
        if (!file_exists(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        Excel::store(new SortieConteneurExport($sorties, $filters), 'exports/' . $filename);

        return storage_path('app/exports/' . $filename);
    }

    /**
     * Export PDF
     */
    private function exportToPdf($sorties, $filters)
    {
        $filename = 'sorties-conteneurs-' . now()->format('Y-m-d-H-i-s') . '.pdf';
        $path = storage_path('app/exports/' . $filename);

        // Créer le dossier s'il n'existe pas
        if (!file_exists(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $pdf = Pdf::loadView('exports.sorties-pdf', [
            'sorties' => $sorties,
            'filters' => $filters,
            'date_export' => now()->format('d/m/Y H:i'),
        ]);

        $pdf->save($path);

        return $path;
    }
}