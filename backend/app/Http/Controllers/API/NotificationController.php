<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class NotificationController extends Controller
{
    use ApiResponseTrait;

    /**
     * Lister toutes les notifications de l'utilisateur
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $notifications = Notification::where('user_id', $user->id)
                ->when($request->status, function ($query, $status) {
                    return $query->where('statut', $status);
                })
                ->when($request->type, function ($query, $type) {
                    return $query->where('type', $type);
                })
                ->when($request->priority, function ($query, $priority) {
                    return $query->where('priorite', $priority);
                })
                ->orderBy('created_at', 'desc')
                ->paginate($request->input('per_page', 20));

            return $this->successResponse(
                NotificationResource::collection($notifications)->additional([
                    'meta' => [
                        'total' => $notifications->total(),
                        'per_page' => $notifications->perPage(),
                        'current_page' => $notifications->currentPage(),
                        'last_page' => $notifications->lastPage(),
                    ]
                ]),
                'Notifications récupérées avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notifications', 500);
        }
    }

    /**
     * Créer une nouvelle notification
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'type' => 'required|string',
                'titre' => 'required|string|max:255',
                'message' => 'required|string',
                'priorite' => 'sometimes|in:basse,normale,haute,critique',
                'user_id' => 'sometimes|exists:users,id',
                'metadata' => 'sometimes|array',
            ]);

            DB::beginTransaction();

            $notification = Notification::create([
                'type' => $request->type,
                'titre' => $request->titre,
                'message' => $request->message,
                'priorite' => $request->priorite ?? 'normale',
                'user_id' => $request->user_id ?? $request->user()->id,
                'metadata' => $request->metadata ?? [],
            ]);

            // Invalider le cache des notifications
            Cache::tags(['notifications'])->flush();

            // Logger l'activité
            logActivity('notification_created', $notification, 'Création d\'une notification');

            DB::commit();

            return $this->successResponse(
                new NotificationResource($notification),
                'Notification créée avec succès',
                201
            );

        } catch (ValidationException $e) {
            DB::rollback();
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            DB::rollback();
            return $this->errorResponse('Erreur lors de la création de la notification', 500);
        }
    }

    /**
     * Afficher une notification spécifique
     */
    public function show(Request $request, Notification $notification): JsonResponse
    {
        try {
            // Vérifier que la notification appartient à l'utilisateur
            if ($notification->user_id !== $request->user()->id) {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            return $this->successResponse(
                new NotificationResource($notification),
                'Notification récupérée avec succès'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de la notification', 500);
        }
    }

    /**
     * Notifications non lues
     */
    public function unread(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $notifications = Notification::where('user_id', $user->id)
                ->where('statut', 'non_lu')
                ->orderBy('created_at', 'desc')
                ->limit($request->input('limit', 10))
                ->get();

            return $this->successResponse(
                NotificationResource::collection($notifications)->additional([
                    'count' => $notifications->count()
                ]),
                'Notifications non lues récupérées'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notifications non lues', 500);
        }
    }

    /**
     * Notifications lues
     */
    public function read(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $notifications = Notification::where('user_id', $user->id)
                ->where('statut', 'lu')
                ->orderBy('lu_le', 'desc')
                ->paginate($request->input('per_page', 20));

            return $this->successResponse(
                NotificationResource::collection($notifications),
                'Notifications lues récupérées'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notifications lues', 500);
        }
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        try {
            // Vérifier que la notification appartient à l'utilisateur
            if ($notification->user_id !== $request->user()->id) {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            if ($notification->statut !== 'non_lu') {
                return $this->errorResponse('Cette notification est déjà marquée comme lue', 400);
            }

            $notification->update([
                'statut' => 'lu',
                'lu_le' => now(),
            ]);

            // Invalider le cache
            Cache::tags(['notifications'])->flush();

            // Logger l'activité
            logActivity('notification_read', $notification, 'Notification marquée comme lue');

            return $this->successResponse(
                new NotificationResource($notification),
                'Notification marquée comme lue'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de la notification', 500);
        }
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $count = Notification::where('user_id', $user->id)
                ->where('statut', 'non_lu')
                ->update([
                    'statut' => 'lu',
                    'lu_le' => now(),
                ]);

            // Invalider le cache
            Cache::tags(['notifications'])->flush();

            // Logger l'activité
            logActivity('notifications_mark_all_read', null, "Marqué $count notifications comme lues");

            return $this->successResponse(
                ['count' => $count],
                "$count notification(s) marquée(s) comme lue(s)"
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour des notifications', 500);
        }
    }

    /**
     * Supprimer une notification
     */
    public function destroy(Request $request, Notification $notification): JsonResponse
    {
        try {
            // Vérifier que la notification appartient à l'utilisateur
            if ($notification->user_id !== $request->user()->id) {
                return $this->errorResponse('Accès non autorisé', 403);
            }

            $notification->delete();

            // Invalider le cache
            Cache::tags(['notifications'])->flush();

            // Logger l'activité
            logActivity('notification_deleted', null, "Suppression de la notification {$notification->id}");

            return $this->successResponse(null, 'Notification supprimée avec succès');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la notification', 500);
        }
    }

    /**
     * Nettoyer les notifications lues anciennes
     */
    public function clearRead(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $days = $request->input('days', 30); // Supprimer les notifications lues de plus de 30 jours
            
            $count = Notification::where('user_id', $user->id)
                ->where('statut', 'lu')
                ->where('lu_le', '<', now()->subDays($days))
                ->delete();

            // Invalider le cache
            Cache::tags(['notifications'])->flush();

            // Logger l'activité
            logActivity('notifications_cleanup', null, "Nettoyage de $count notifications anciennes");

            return $this->successResponse(
                ['count' => $count],
                "$count notification(s) ancienne(s) supprimée(s)"
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du nettoyage des notifications', 500);
        }
    }

    /**
     * Statistiques des notifications
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $cacheKey = "notifications_stats_{$user->id}";
            
            $stats = Cache::remember($cacheKey, CACHE_MEDIUM, function () use ($user) {
                return [
                    'total' => Notification::where('user_id', $user->id)->count(),
                    'non_lues' => Notification::where('user_id', $user->id)->where('statut', 'non_lu')->count(),
                    'lues' => Notification::where('user_id', $user->id)->where('statut', 'lu')->count(),
                    'archivees' => Notification::where('user_id', $user->id)->where('statut', 'archive')->count(),
                    'par_priorite' => Notification::where('user_id', $user->id)
                        ->select('priorite', DB::raw('COUNT(*) as count'))
                        ->groupBy('priorite')
                        ->get(),
                    'par_type' => Notification::where('user_id', $user->id)
                        ->select('type', DB::raw('COUNT(*) as count'))
                        ->groupBy('type')
                        ->orderBy('count', 'desc')
                        ->limit(10)
                        ->get(),
                ];
            });

            return $this->successResponse($stats, 'Statistiques des notifications récupérées');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques', 500);
        }
    }
}