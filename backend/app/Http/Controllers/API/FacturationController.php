<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\FacturationResource;
use App\Models\Facturation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FacturationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Facturation::with(['sortieConteneur']);

            // Filtres
            if ($request->has('statut')) {
                $query->where('statut', $request->statut);
            }

            if ($request->has('date_debut')) {
                $query->whereDate('date_facture', '>=', $request->date_debut);
            }

            if ($request->has('date_fin')) {
                $query->whereDate('date_facture', '<=', $request->date_fin);
            }

            $facturations = $query->orderBy('created_at', 'desc')->get();

            return $this->successResponse(
                FacturationResource::collection($facturations),
                'Facturations récupérées avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des facturations', 500);
        }
    }

    public function show($id)
    {
        try {
            $facturation = Facturation::with(['sortieConteneur'])->findOrFail($id);

            return $this->successResponse(
                new FacturationResource($facturation),
                'Facturation récupérée avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Facturation non trouvée', 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'sortie_conteneur_id' => 'required|exists:sortie_conteneurs,id',
                'montant_transport' => 'required|numeric',
                'montant_detention' => 'nullable|numeric',
                'montant_autres' => 'nullable|numeric',
                'montant_tva' => 'nullable|numeric',
                'notes' => 'nullable|string',
            ]);

            $montantTotal = $validated['montant_transport'] + 
                           ($validated['montant_detention'] ?? 0) + 
                           ($validated['montant_autres'] ?? 0);
            
            $montantTTC = $montantTotal + ($validated['montant_tva'] ?? 0);

            $facturation = Facturation::create([
                'numero_facture' => $this->generateNumeroFacture(),
                'date_facture' => now(),
                'date_echeance' => now()->addDays(30),
                'statut' => 'brouillon',
                'montant_total' => $montantTotal,
                'montant_ttc' => $montantTTC,
                ...$validated
            ]);

            return $this->successResponse(
                new FacturationResource($facturation->load('sortieConteneur')),
                'Facturation créée avec succès',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la facturation', 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $facturation = Facturation::findOrFail($id);

            $validated = $request->validate([
                'montant_transport' => 'sometimes|numeric',
                'montant_detention' => 'sometimes|numeric',
                'montant_autres' => 'sometimes|numeric',
                'montant_tva' => 'sometimes|numeric',
                'notes' => 'sometimes|string',
            ]);

            if (isset($validated['montant_transport']) || isset($validated['montant_detention']) || isset($validated['montant_autres'])) {
                $montantTotal = ($validated['montant_transport'] ?? $facturation->montant_transport) + 
                               ($validated['montant_detention'] ?? $facturation->montant_detention) + 
                               ($validated['montant_autres'] ?? $facturation->montant_autres);
                
                $validated['montant_total'] = $montantTotal;
                $validated['montant_ttc'] = $montantTotal + ($validated['montant_tva'] ?? $facturation->montant_tva);
            }

            $facturation->update($validated);

            return $this->successResponse(
                new FacturationResource($facturation->load('sortieConteneur')),
                'Facturation mise à jour avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de la facturation', 500);
        }
    }

    public function destroy($id)
    {
        try {
            $facturation = Facturation::findOrFail($id);
            $facturation->delete();

            return $this->successResponse(null, 'Facturation supprimée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la facturation', 500);
        }
    }

    public function send($id)
    {
        try {
            $facturation = Facturation::findOrFail($id);
            $facturation->update(['statut' => 'envoyee']);

            return $this->successResponse(
                new FacturationResource($facturation->load('sortieConteneur')),
                'Facturation envoyée avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'envoi de la facturation', 500);
        }
    }

    public function markAsPaid($id)
    {
        try {
            $facturation = Facturation::findOrFail($id);
            $facturation->update(['statut' => 'payee']);

            return $this->successResponse(
                new FacturationResource($facturation->load('sortieConteneur')),
                'Paiement confirmé'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la confirmation du paiement', 500);
        }
    }

    public function stats()
    {
        try {
            $stats = [
                'total_brouillons' => Facturation::where('statut', 'brouillon')->count(),
                'total_envoyees' => Facturation::where('statut', 'envoyee')->count(),
                'total_payees' => Facturation::where('statut', 'payee')->count(),
                'montant_total' => Facturation::sum('montant_total'),
                'montant_en_attente' => Facturation::whereIn('statut', ['brouillon', 'envoyee'])->sum('montant_total'),
            ];

            return $this->successResponse($stats, 'Statistiques récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }

    public function pdf($id)
    {
        try {
            $facturation = Facturation::with(['sortieConteneur'])->findOrFail($id);
            
            // TODO: Implement PDF generation
            return response()->json(['message' => 'PDF generation not implemented yet'], 501);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la génération du PDF', 500);
        }
    }

    private function generateNumeroFacture()
    {
        $year = date('Y');
        $month = date('m');
        $lastFacture = Facturation::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->orderBy('created_at', 'desc')
            ->first();

        $sequence = $lastFacture ? intval(substr($lastFacture->numero_facture, -4)) + 1 : 1;

        return sprintf('FACT-%s%s-%04d', $year, $month, $sequence);
    }
}
