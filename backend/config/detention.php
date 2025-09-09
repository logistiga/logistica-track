<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuration des Détentions
    |--------------------------------------------------------------------------
    |
    | Configuration des tarifs et paramètres pour le calcul automatique
    | des détentions après retour de conteneurs
    |
    */

    'tarifs_par_jour' => [
        // Tarif par défaut en FCFA (Franc CFA)
        'default' => 15000,
        
        // Tarifs spécifiques par armateur (code armateur => tarif en FCFA)
        'MSC' => 20000,
        'CMA' => 18000,
        'COSCO' => 16000,
        'MAERSK' => 22000,
    ],

    'devise' => [
        'symbole' => 'FCFA',
        'nom' => 'Franc CFA',
        'position' => 'after', // 'before' ou 'after'
    ],

    'responsabilite_defaut' => null,

    'motifs' => [
        'automatique' => 'Dépassement automatique calculé après retour',
        'manuel' => 'Détention créée manuellement',
    ],
];