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
        // Tarif de fallback en FCFA (Franc CFA) 
        // Utilisé uniquement si l'armateur n'a pas de prix_par_jour défini
        // Les vrais tarifs sont configurés dans la page Armateurs (table: armateurs.prix_par_jour)
        'default' => 15000,
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