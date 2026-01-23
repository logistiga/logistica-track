<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTrait;
use App\Models\OrdreTravailExterne;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrdreTravailExterneController extends Controller
{
    use ApiResponseTrait;

    /**
     * Liste des ordres de travail externes
     */
    public function index(Request $request): JsonResponse
    {
        $query = OrdreTravailExterne::query();

        // Filtrage par statut
        if ($request->has('status')) {
            if ($request->status === 'pending') {
                $query->enAttente();
            } elseif ($request->status === 'validated') {
                $query->valides();
            } else {
                $query->where('status', $request->status);
            }
        }

        // Recherche
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('numero', 'like', "%{$search}%")
                  ->orWhere('client_nom', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%")
                  ->orWhere('booking_number', 'like', "%{$search}%")
                  ->orWhere('vessel_name', 'like', "%{$search}%");
            });
        }

        // Filtrage par date
        if ($request->has('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        $ordres = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        // Transformer pour correspondre au format attendu par le frontend
        $transformed = $ordres->getCollection()->map(function ($ordre) {
            return $this->transformOrdre($ordre);
        });

        return $this->successResponse([
            'data' => $transformed,
            'current_page' => $ordres->currentPage(),
            'last_page' => $ordres->lastPage(),
            'per_page' => $ordres->perPage(),
            'total' => $ordres->total(),
        ]);
    }

    /**
     * Afficher un ordre specifique
     */
    public function show(int $id): JsonResponse
    {
        $ordre = OrdreTravailExterne::find($id);

        if (!$ordre) {
            return $this->errorResponse('Ordre non trouve', 404);
        }

        return $this->successResponse($this->transformOrdre($ordre));
    }

    /**
     * Creer un ordre de travail (recu de l'application externe)
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'booking_number' => 'required|string|max:100',
            'client_nom' => 'required|string|max:255',
            'transitaire_nom' => 'nullable|string|max:255',
            'external_id' => 'nullable|string|max:100',
            'date' => 'nullable|date',
            'containers' => 'required|array|min:1',
            'containers.*.numero_conteneur' => 'required|string|max:20',
            'client_email' => 'nullable|email|max:255',
            'client_telephone' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation echouee', 422, $validator->errors());
        }

        $data = $validator->validated();
        $data['numero'] = OrdreTravailExterne::generateNumero();
        $data['source'] = $request->header('X-Source', 'external');

        if (empty($data['date'])) {
            $data['date'] = now()->toDateString();
        }

        if (!empty($data['containers'])) {
            $data['containers'] = array_map(function ($c) {
                return [
                    'number' => $c['numero_conteneur'] ?? $c['number'] ?? '',
                    'type' => $c['type'] ?? null,
                    'description' => $c['description'] ?? null,
                ];
            }, $data['containers']);
        }

        $ordre = OrdreTravailExterne::create($data);

        return $this->successResponse(
            $this->transformOrdre($ordre),
            'Ordre cree avec succes',
            201
        );
    }

    /**
     * Mettre a jour un ordre
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $ordre = OrdreTravailExterne::find($id);

        if (!$ordre) {
            return $this->errorResponse('Ordre non trouve', 404);
        }

        $validator = Validator::make($request->all(), [
            'client_nom' => 'sometimes|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'client_telephone' => 'nullable|string|max:50',
            'date' => 'sometimes|date',
            'type' => 'sometimes|string|max:100',
            'reference' => 'nullable|string|max:100',
            'booking_number' => 'nullable|string|max:100',
            'vessel_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation echouee', 422, $validator->errors());
        }

        $ordre->update($validator->validated());

        return $this->successResponse(
            $this->transformOrdre($ordre->fresh()),
            'Ordre mis a jour'
        );
    }

    /**
     * Mettre a jour le statut d'un ordre
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $ordre = OrdreTravailExterne::find($id);

        if (!$ordre) {
            return $this->errorResponse('Ordre non trouve', 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:brouillon,en_cours,termine,facture,annule',
            'notes' => 'nullable|string|max:1000',
            'containers' => 'nullable|array',
            'containers.*.number' => 'required_with:containers|string|max:20',
            'containers.*.type' => 'nullable|string|max:10',
            'containers.*.description' => 'nullable|string|max:500',
            'lignes_prestations' => 'nullable|array',
            'lignes_prestations.*.description' => 'required_with:lignes_prestations|string|max:500',
            'lignes_prestations.*.quantite' => 'required_with:lignes_prestations|numeric|min:0',
            'lignes_prestations.*.prix_unitaire' => 'required_with:lignes_prestations|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation echouee', 422, $validator->errors());
        }

        $updateData = [
            'status' => $request->status,
        ];

        if ($request->has('containers')) {
            $updateData['containers'] = $request->containers;
        }

        if ($request->has('lignes_prestations')) {
            $updateData['lignes_prestations'] = $request->lignes_prestations;
            $updateData['montant_total'] = collect($request->lignes_prestations)->sum(function ($ligne) {
                return ($ligne['quantite'] ?? 0) * ($ligne['prix_unitaire'] ?? 0);
            });
        }

        if ($request->notes) {
            $updateData['notes'] = $ordre->notes
                ? $ordre->notes . "\n---\n" . $request->notes
                : $request->notes;
        }

        if ($request->status === 'termine' && $ordre->status !== 'termine') {
            $updateData['validated_by'] = Auth::id();
            $updateData['validated_at'] = now();
        }

        $ordre->update($updateData);

        return $this->successResponse(
            $this->transformOrdre($ordre->fresh()),
            'Statut mis a jour'
        );
    }

    /**
     * Supprimer un ordre
     */
    public function destroy(int $id): JsonResponse
    {
        $ordre = OrdreTravailExterne::find($id);

        if (!$ordre) {
            return $this->errorResponse('Ordre non trouve', 404);
        }

        if (in_array($ordre->status, ['termine', 'facture'])) {
            return $this->errorResponse('Impossible de supprimer un ordre valide ou facture', 400);
        }

        $ordre->delete();

        return $this->successResponse(null, 'Ordre supprime');
    }

    /**
     * Statistiques des ordres
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => OrdreTravailExterne::count(),
            'en_attente' => OrdreTravailExterne::enAttente()->count(),
            'valides' => OrdreTravailExterne::valides()->count(),
            'annules' => OrdreTravailExterne::annules()->count(),
            'montant_total' => OrdreTravailExterne::valides()->sum('montant_total'),
            'containers_count' => OrdreTravailExterne::all()->sum('containers_count'),
        ];

        return $this->successResponse($stats);
    }

    /**
     * Transformer un ordre pour le format API
     */
    private function transformOrdre(OrdreTravailExterne $ordre): array
    {
        $containers = is_array($ordre->containers) ? $ordre->containers : [];
        $lignes = is_array($ordre->lignes_prestations) ? $ordre->lignes_prestations : [];

        return [
            'id' => $ordre->id,
            'numero' => $ordre->numero,
            'client_id' => null,
            'client' => [
                'id' => null,
                'nom' => $ordre->client_nom,
                'email' => $ordre->client_email,
                'telephone' => $ordre->client_telephone,
            ],
            'transitaire_nom' => $ordre->transitaire_nom,
            'date' => $ordre->date ? $ordre->date->format('Y-m-d') : now()->format('Y-m-d'),
            'type' => $ordre->type,
            'status' => $ordre->status,
            'reference' => $ordre->reference,
            'booking_number' => $ordre->booking_number,
            'vessel_name' => $ordre->vessel_name,
            'containers' => array_map(function ($c, $i) {
                return [
                    'id' => $i + 1,
                    'number' => $c['number'] ?? '',
                    'type' => $c['type'] ?? null,
                    'description' => $c['description'] ?? null,
                ];
            }, $containers, array_keys($containers)),
            'lignes_prestations' => array_map(function ($l, $i) {
                $montant = ($l['quantite'] ?? 0) * ($l['prix_unitaire'] ?? 0);
                return [
                    'id' => $i + 1,
                    'description' => $l['description'] ?? '',
                    'quantite' => $l['quantite'] ?? 0,
                    'prix_unitaire' => $l['prix_unitaire'] ?? 0,
                    'montant' => $montant,
                ];
            }, $lignes, array_keys($lignes)),
            'montant_total' => (float) $ordre->montant_total,
            'notes' => $ordre->notes,
            'source' => $ordre->source,
            'validated_by' => $ordre->validated_by,
            'validated_at' => $ordre->validated_at?->toISOString(),
            'created_at' => $ordre->created_at->toISOString(),
            'updated_at' => $ordre->updated_at->toISOString(),
        ];
    }
}
