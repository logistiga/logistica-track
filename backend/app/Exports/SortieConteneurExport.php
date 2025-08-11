<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SortieConteneurExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $sorties;
    protected $filters;

    public function __construct($sorties, $filters = [])
    {
        $this->sorties = $sorties;
        $this->filters = $filters;
    }

    public function collection()
    {
        return $this->sorties;
    }

    public function headings(): array
    {
        return [
            'Numéro Conteneur',
            'Numéro BL',
            'Code Armateur',
            'Armateur',
            'Client',
            'Prime Chauffeur (FCFA)',
            'Destination',
            'Adresse Client',
            'Type Destination',
            'Jours BAD',
            'Date Fin Franchise',
            'Transitaire',
            'Camion',
            'Remorque',
            'Date Sortie',
            'Date Retour',
            'Statut',
            'Jours Hors Port',
        ];
    }

    public function map($sortie): array
    {
        return [
            $sortie->numero_conteneur,
            $sortie->numero_bl,
            $sortie->code_armateur,
            $sortie->armateur ? $sortie->armateur->nom : '',
            $sortie->nom_client,
            number_format($sortie->prime_chauffeur, 0, ',', ' '),
            $sortie->destination === 'base' ? 'Base' : 'Client',
            $sortie->adresse_client ?: '',
            $sortie->type_destination === 'bad' ? 'BAD' : 'Détention',
            $sortie->jours_bad ?: '',
            $sortie->date_fin_franchise ?: '',
            $sortie->nom_transitaire,
            $sortie->camion ? $sortie->camion->numero_parc : '',
            $sortie->remorque ? $sortie->remorque->numero_parc : '',
            $sortie->date_sortie->format('d/m/Y'),
            $sortie->date_retour ? $sortie->date_retour->format('d/m/Y') : '',
            $sortie->statut_label,
            $sortie->jours_hors_port,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12]],
        ];
    }

    public function title(): string
    {
        return 'Sorties Conteneurs';
    }
}