<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    use ApiResponseTrait;

    /**
     * Display a listing of users
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::query();

            // Filter by role if provided
            if ($request->filled('role')) {
                $query->where('role', $request->role);
            }

            // Filter by active status if provided
            if ($request->filled('actif')) {
                $query->where('actif', $request->boolean('actif'));
            }

            // Search by name or email
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $users = $query->orderBy('name')->paginate(15);

            return $this->successResponse([
                'users' => UserResource::collection($users->items()),
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des utilisateurs', 500);
        }
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'role' => 'required|in:admin,manager,operator,viewer',
                'telephone' => 'nullable|string|max:20',
                'departement' => 'nullable|string|max:100',
                'actif' => 'boolean',
            ]);

            $validated['password'] = Hash::make($validated['password']);
            $validated['actif'] = $validated['actif'] ?? true;

            $user = User::create($validated);

            return $this->successResponse(
                new UserResource($user),
                'Utilisateur créé avec succès',
                201
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de l\'utilisateur', 500);
        }
    }

    /**
     * Display the specified user
     */
    public function show(User $user): JsonResponse
    {
        try {
            return $this->successResponse(new UserResource($user));
        } catch (\Exception $e) {
            return $this->errorResponse('Utilisateur non trouvé', 404);
        }
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
                'role' => 'sometimes|in:admin,manager,operator,viewer',
                'telephone' => 'nullable|string|max:20',
                'departement' => 'nullable|string|max:100',
                'actif' => 'sometimes|boolean',
            ]);

            $user->update($validated);

            return $this->successResponse(
                new UserResource($user->fresh()),
                'Utilisateur mis à jour avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de l\'utilisateur', 500);
        }
    }

    /**
     * Remove the specified user
     */
    public function destroy(User $user): JsonResponse
    {
        try {
            $user->delete();
            return $this->successResponse(null, 'Utilisateur supprimé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de l\'utilisateur', 500);
        }
    }

    /**
     * Activate user
     */
    public function activate(User $user): JsonResponse
    {
        try {
            $user->update(['actif' => true]);
            return $this->successResponse(
                new UserResource($user->fresh()),
                'Utilisateur activé avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'activation de l\'utilisateur', 500);
        }
    }

    /**
     * Deactivate user
     */
    public function deactivate(User $user): JsonResponse
    {
        try {
            $user->update(['actif' => false]);
            return $this->successResponse(
                new UserResource($user->fresh()),
                'Utilisateur désactivé avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la désactivation de l\'utilisateur', 500);
        }
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validate([
                'password' => 'required|string|min:8',
            ]);

            $user->update([
                'password' => Hash::make($validated['password'])
            ]);

            return $this->successResponse(null, 'Mot de passe réinitialisé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la réinitialisation du mot de passe', 500);
        }
    }
}