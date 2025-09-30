<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display available roles
     */
    public function index(): JsonResponse
    {
        try {
            $roles = [
                [
                    'id' => 'admin',
                    'name' => 'admin',
                    'label' => 'Administrateur',
                    'description' => 'Accès complet au système'
                ],
                [
                    'id' => 'manager', 
                    'name' => 'manager',
                    'label' => 'Manager',
                    'description' => 'Gestion des opérations et équipes'
                ],
                [
                    'id' => 'operator',
                    'name' => 'operator', 
                    'label' => 'Opérateur',
                    'description' => 'Saisie et modification des données'
                ],
                [
                    'id' => 'viewer',
                    'name' => 'viewer',
                    'label' => 'Visiteur', 
                    'description' => 'Consultation en lecture seule'
                ]
            ];

            return $this->successResponse($roles);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des rôles', 500);
        }
    }

    /**
     * Store a newly created role (placeholder)
     */
    public function store(): JsonResponse
    {
        return $this->errorResponse('Création de rôles non implémentée', 501);
    }

    /**
     * Display the specified role (placeholder) 
     */
    public function show(): JsonResponse
    {
        return $this->errorResponse('Affichage de rôle non implémenté', 501);
    }

    /**
     * Update the specified role (placeholder)
     */
    public function update(): JsonResponse
    {
        return $this->errorResponse('Mise à jour de rôle non implémentée', 501);
    }

    /**
     * Remove the specified role (placeholder)
     */
    public function destroy(): JsonResponse
    {
        return $this->errorResponse('Suppression de rôle non implémentée', 501);
    }
}