<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    use ApiResponseTrait;

    /**
     * Connexion utilisateur
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->validated();

            if (!Auth::attempt($credentials)) {
                return $this->errorResponse(
                    'Identifiants invalides. Veuillez vérifier votre email et mot de passe.',
                    401
                );
            }

            $user = Auth::user();
            
            // Vérifier si l'utilisateur est actif
            if (!$user->actif) {
                Auth::logout();
                return $this->errorResponse(
                    'Votre compte a été désactivé. Contactez l\'administrateur.',
                    403
                );
            }

            // Révoquer les anciens tokens
            $user->tokens()->delete();

            // Créer un nouveau token
            $token = $user->createToken('auth-token', ['*'], now()->addDays(30))->plainTextToken;

            // Mettre à jour la dernière connexion
            $user->update(['derniere_connexion' => now()]);

            // Logger l'activité
            logActivity('login', $user, 'Connexion réussie');

            return $this->successResponse([
                'user' => new UserResource($user),
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_at' => now()->addDays(30)->toISOString(),
            ], 'Connexion réussie');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la connexion', 500);
        }
    }

    /**
     * Récupérer l'utilisateur authentifié
     */
    public function user(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non trouvé', 404);
            }

            return $this->successResponse(
                new UserResource($user),
                'Utilisateur récupéré avec succès'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de l\'utilisateur', 500);
        }
    }

    /**
     * Déconnexion utilisateur
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Révoquer le token actuel
            $request->user()->currentAccessToken()->delete();

            // Logger l'activité
            logActivity('logout', $user, 'Déconnexion');

            return $this->successResponse(null, 'Déconnexion réussie');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la déconnexion', 500);
        }
    }

    /**
     * Informations utilisateur connecté
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load(['createdSorties', 'updatedSorties']);
            
            return $this->successResponse(
                new UserResource($user),
                'Informations utilisateur récupérées'
            );

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des informations', 500);
        }
    }

    /**
     * Rafraîchir le token
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Révoquer l'ancien token
            $request->user()->currentAccessToken()->delete();
            
            // Créer un nouveau token
            $token = $user->createToken('auth-token', ['*'], now()->addDays(30))->plainTextToken;

            return $this->successResponse([
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_at' => now()->addDays(30)->toISOString(),
            ], 'Token rafraîchi avec succès');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du rafraîchissement du token', 500);
        }
    }

    /**
     * Mettre à jour le profil
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $request->user()->id,
                'telephone' => 'sometimes|nullable|string|max:20',
                'departement' => 'sometimes|nullable|string|max:100',
            ]);

            $user = $request->user();
            $user->update($request->only(['name', 'email', 'telephone', 'departement']));

            // Logger l'activité
            logActivity('profile_update', $user, 'Mise à jour du profil');

            return $this->successResponse(
                new UserResource($user),
                'Profil mis à jour avec succès'
            );

        } catch (ValidationException $e) {
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour du profil', 500);
        }
    }

    /**
     * Changer le mot de passe
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'current_password' => 'required|string',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = $request->user();

            // Vérifier l'ancien mot de passe
            if (!Hash::check($request->current_password, $user->password)) {
                return $this->errorResponse('Mot de passe actuel incorrect', 422);
            }

            // Mettre à jour le mot de passe
            $user->update([
                'password' => Hash::make($request->password)
            ]);

            // Révoquer tous les tokens existants
            $user->tokens()->delete();

            // Logger l'activité
            logActivity('password_change', $user, 'Changement de mot de passe');

            return $this->successResponse(null, 'Mot de passe modifié avec succès');

        } catch (ValidationException $e) {
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du changement de mot de passe', 500);
        }
    }

    /**
     * Mot de passe oublié
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        try {
            $request->validate(['email' => 'required|email']);

            $status = Password::sendResetLink($request->only('email'));

            if ($status === Password::RESET_LINK_SENT) {
                return $this->successResponse(null, 'Lien de réinitialisation envoyé par email');
            }

            return $this->errorResponse('Impossible d\'envoyer le lien de réinitialisation', 400);

        } catch (ValidationException $e) {
            return $this->errorResponse('Email invalide', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'envoi du lien', 500);
        }
    }

    /**
     * Réinitialiser le mot de passe
     */
    public function resetPassword(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => 'required|min:8|confirmed',
            ]);

            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->save();

                    // Révoquer tous les tokens
                    $user->tokens()->delete();

                    // Logger l'activité
                    logActivity('password_reset', $user, 'Réinitialisation de mot de passe');
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return $this->successResponse(null, 'Mot de passe réinitialisé avec succès');
            }

            return $this->errorResponse('Erreur lors de la réinitialisation', 400);

        } catch (ValidationException $e) {
            return $this->errorResponse('Données invalides', 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la réinitialisation', 500);
        }
    }

    /**
     * Révoquer tous les tokens
     */
    public function revokeAllTokens(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->tokens()->delete();

            // Logger l'activité
            logActivity('revoke_all_tokens', $user, 'Révocation de tous les tokens');

            return $this->successResponse(null, 'Tous les tokens ont été révoqués');

        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la révocation des tokens', 500);
        }
    }
}