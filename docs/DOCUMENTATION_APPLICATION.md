# 📚 Documentation Logistiga - Application de Gestion Logistique

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Authentification](#1-authentification---login)
3. [Tableau de Bord](#2-tableau-de-bord---dashboard)
4. [Gestion du Matériel](#3-gestion-du-matériel---materiel)
5. [Gestion des Armateurs](#4-gestion-des-armateurs---armateurs)
6. [Gestion des Utilisateurs](#5-gestion-des-utilisateurs---utilisateurs)
7. [Sorties de Conteneurs](#6-sorties-de-conteneurs---sorties)
8. [Gestion de la Base](#7-gestion-de-la-base---base)
9. [Gestion des Détentions](#8-gestion-des-détentions---detention)
10. [Facturation](#9-facturation---facturation)
11. [Opérations](#10-opérations---operations)
12. [Ordres](#11-ordres---ordres)
13. [Primes Chauffeur](#12-primes-chauffeur---primes)
14. [Notifications](#13-notifications---notifications)
15. [E-mails](#14-e-mails---emails)
16. [Archives Base](#15-archives-base---archives-base)
17. [Archives Sortie](#16-archives-sortie---archives-sortie)
18. [Archives Opérations](#17-archives-opérations---archives-operation)

---

## Vue d'ensemble

**Logistiga** est une application complète de gestion logistique conçue pour les entreprises de transport et de gestion de conteneurs. Elle permet de gérer l'ensemble du cycle de vie des opérations logistiques, de la sortie des conteneurs du port jusqu'à la facturation finale.

### Technologies utilisées
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Laravel PHP
- **Base de données**: MySQL/PostgreSQL
- **Authentification**: JWT Token

### Structure de navigation
L'application est organisée en plusieurs modules accessibles via la barre de navigation latérale :
- **Exploitation**: Dashboard, Sorties, Base, Opérations
- **Gestion**: Matériel, Armateurs, Utilisateurs
- **Finances**: Détention, Facturation, Primes
- **Archives**: Archives Base, Archives Sortie, Archives Opérations
- **Paramètres**: Notifications, E-mails

---

## 1. Authentification - `/login`

### Description
Page de connexion sécurisée permettant aux utilisateurs d'accéder à l'application.

### Fonctionnalités
| Fonctionnalité | Description |
|----------------|-------------|
| Connexion par email/mot de passe | Authentification avec les identifiants utilisateur |
| Afficher/Masquer mot de passe | Bouton toggle pour voir le mot de passe |
| Mot de passe oublié | Lien vers la récupération de mot de passe |
| Redirection automatique | Redirige vers le Dashboard si déjà connecté |

### Champs du formulaire
- **Email** (obligatoire): Adresse email de l'utilisateur
- **Mot de passe** (obligatoire): Mot de passe sécurisé

### Comportement
1. L'utilisateur saisit ses identifiants
2. Validation côté client
3. Envoi de la requête d'authentification au backend
4. Stockage du token JWT en cas de succès
5. Redirection vers le Dashboard

### Sécurité
- Protection CSRF
- Tokens JWT avec expiration
- Limitation des tentatives de connexion

---

## 2. Tableau de Bord - `/` (Dashboard)

### Description
Vue d'ensemble complète des opérations logistiques en temps réel.

### Composants principaux

#### Cartes de statistiques
| Indicateur | Description | Couleur |
|------------|-------------|---------|
| Conteneurs Actifs | Nombre de conteneurs en cours de livraison | Bleu (info) |
| Véhicules Disponibles | Véhicules disponibles sur le total | Vert (success) |
| Détentions en Cours | Conteneurs en dépassement de délai + montant | Orange (warning) |
| Factures en Attente | Factures non payées + montant | Gris (pending) |

#### Statistiques des opérations
- **Opérations Actives**: Nombre d'opérations en cours + planifiées
- **Locations**: Nombre de locations + revenus générés
- **Transports**: Nombre de transports + revenus générés

#### Graphiques
- **Graphique d'activité**: Évolution des opérations dans le temps

#### Activités récentes
Liste des 5 dernières opérations avec :
- Description de l'opération
- Utilisateur responsable
- Horodatage

#### Actions rapides
| Bouton | Action | Route |
|--------|--------|-------|
| Nouvelle Sortie | Créer une sortie de conteneur | `/sorties` |
| Ajouter Véhicule | Ajouter un camion/remorque | `/materiel` |
| Nouvel Armateur | Créer un armateur | `/armateurs` |
| Nouvelle Opération | Créer une opération | `/operations` |

### Alertes
Affichage des alertes système (retards, problèmes) avec navigation vers la page concernée.

---

## 3. Gestion du Matériel - `/materiel`

### Description
Gestion complète de la flotte de véhicules (camions et remorques).

### Onglets

#### Onglet Camions
Liste de tous les camions avec :
- Numéro de parc
- Immatriculation
- Statut (actif/inactif)
- Actions (modifier, supprimer)

#### Onglet Remorques
Liste de toutes les remorques avec les mêmes informations.

### Fonctionnalités

| Action | Description |
|--------|-------------|
| Ajouter un véhicule | Dialogue modal pour créer un camion ou une remorque |
| Modifier | Éditer les informations d'un véhicule existant |
| Supprimer | Suppression avec confirmation |
| Rechercher | Filtrer les véhicules par numéro de parc ou immatriculation |

### Cartes de statistiques
- Total des camions
- Total des remorques
- Véhicules actifs
- Véhicules en maintenance

### Formulaire d'ajout/modification
| Champ | Type | Obligatoire |
|-------|------|-------------|
| Type | Sélection (camion/remorque) | Oui |
| Numéro de parc | Texte | Oui |
| Immatriculation | Texte | Oui |
| Actif | Toggle | Non |

---

## 4. Gestion des Armateurs - `/armateurs`

### Description
Gestion des compagnies maritimes (armateurs) avec lesquelles l'entreprise travaille.

### Fonctionnalités

| Action | Description |
|--------|-------------|
| Ajouter un armateur | Créer une nouvelle compagnie maritime |
| Modifier | Éditer les informations d'un armateur |
| Supprimer | Suppression avec confirmation |
| Rechercher | Filtrer par nom ou code |

### Cartes de statistiques
- Total des armateurs
- Armateurs actifs
- Nouveaux ce mois

### Tableau des armateurs
| Colonne | Description |
|---------|-------------|
| Code | Code unique de l'armateur (ex: MSC, CMA) |
| Nom | Nom complet de la compagnie |
| Contact | Informations de contact |
| Conteneurs | Nombre de conteneurs en cours |
| Actions | Modifier, Supprimer |

---

## 5. Gestion des Utilisateurs - `/utilisateurs`

### Description
Administration des comptes utilisateurs et des rôles d'accès. **Réservé aux administrateurs**.

### Restriction d'accès
Seuls les utilisateurs avec le rôle `admin` peuvent accéder à cette page.

### Onglets

#### Onglet Utilisateurs
Gestion des comptes utilisateurs avec :
- Liste de tous les utilisateurs
- Création de nouveaux utilisateurs
- Modification des permissions

#### Onglet Rôles
Gestion des rôles système :
| Rôle | Description | Permissions |
|------|-------------|-------------|
| Administrateur | Accès complet | 39 |
| Manager | Supervision des opérations | 21 |
| Opérateur | Opérations courantes | 14 |
| Visiteur | Consultation uniquement | 5 |

### Formulaire de création d'utilisateur
| Champ | Type | Obligatoire |
|-------|------|-------------|
| Nom complet | Texte | Oui |
| Email | Email | Oui |
| Mot de passe | Password | Oui |
| Téléphone | Texte | Non |
| Département | Texte | Non |
| Rôle | Sélection | Oui |

### Cartes de statistiques
- Total des rôles configurés
- Utilisateurs actifs
- Nombre d'administrateurs
- Total des utilisateurs

---

## 6. Sorties de Conteneurs - `/sorties`

### Description
Gestion complète des sorties de conteneurs du port vers les clients.

### Onglets

#### Sorties en cours
Conteneurs actuellement en transit avec possibilité de :
- Modifier les informations
- Enregistrer le retour du conteneur
- Supprimer (avec confirmation)

#### Historique
Conteneurs déjà retournés avec accès aux détails.

### Fonctionnalités principales

| Action | Description |
|--------|-------------|
| Nouvelle Sortie | Créer une nouvelle sortie de conteneur |
| Modifier | Éditer les détails d'une sortie |
| Retour | Enregistrer le retour du conteneur au port |
| Exporter | Exporter la liste en PDF, Excel, CSV |
| Rechercher | Filtrer par numéro, client, BL, etc. |

### Formulaire de sortie
| Champ | Description | Obligatoire |
|-------|-------------|-------------|
| Numéro de conteneur | Identifiant unique du conteneur | Oui |
| Numéro BL | Numéro du connaissement | Oui |
| Nom du client | Destinataire | Oui |
| Code armateur | Compagnie maritime | Oui |
| Camion | Véhicule de transport | Oui |
| Remorque | Remorque utilisée | Oui |
| Transitaire | Nom du transitaire | Non |
| Date de sortie | Date de sortie du port | Oui |

### Dialogue de retour
| Champ | Description |
|-------|-------------|
| Date de retour | Date de réintégration au port |
| État du conteneur | Bon, Endommagé, etc. |
| Observations | Notes additionnelles |

### Statistiques affichées
- Total des sorties
- En cours
- Retournées ce mois
- En retard

---

## 7. Gestion de la Base - `/base`

### Description
Gestion des opérations sur la base logistique (stockage, dépotage, etc.).

### Onglets

#### Arrivées Base
Enregistrement des conteneurs arrivant à la base.

#### Stockage
Gestion des conteneurs en stockage :
- Suivi des durées de stockage
- Calcul automatique des frais
- Affectation des emplacements

#### Double Relevage
Opérations de double relevage des conteneurs :
- Transfert de remorque à remorque
- Suivi des mouvements

#### Dépotage
Opérations de dépotage :
- Vidage des conteneurs
- Suivi des marchandises

### Données requises pour chaque opération
| Champ | Description |
|-------|-------------|
| Conteneur | Sélection du conteneur |
| Camion | Véhicule utilisé |
| Remorque | Remorque utilisée |
| Date | Date de l'opération |
| Type | Type d'opération |

---

## 8. Gestion des Détentions - `/detention`

### Description
Suivi et gestion des conteneurs en dépassement de délai de franchise.

### Concept de détention
La détention s'applique lorsqu'un conteneur dépasse le délai de franchise accordé par l'armateur (généralement 5-7 jours).

### Fonctionnalités

| Action | Description |
|--------|-------------|
| Créer détentions manquantes | Génère automatiquement les détentions pour les conteneurs en retard |
| Identifier la responsabilité | Définir qui est responsable du retard (client ou Logistiga) |
| Générer PDF | Créer une note de débit pour le client |
| Confirmer paiement | Marquer la détention comme payée |

### Dialogue de responsabilité
| Champ | Description |
|-------|-------------|
| Responsabilité | Client, Logistiga, ou Partagée |
| Jours client | Nombre de jours facturés au client |
| Jours Logistiga | Nombre de jours à la charge de Logistiga |

### Statistiques
- Conteneurs en détention
- Montant total de détention
- Détentions résolues ce mois
- Moyenne de jours de retard

### Tableau des détentions
| Colonne | Description |
|---------|-------------|
| Conteneur | Numéro du conteneur |
| Client | Nom du client |
| Armateur | Compagnie maritime |
| Jours de retard | Nombre de jours au-delà de la franchise |
| Montant | Montant de la détention calculé |
| Responsabilité | Client/Logistiga/Partagée |
| Actions | Identifier, PDF, Payer |

---

## 9. Facturation - `/facturation`

### Description
Gestion des factures internes pour les opérations de base (stockage, dépotage, etc.).

### Types de factures
- Factures de stockage
- Factures de double relevage
- Factures de dépotage
- Factures d'opérations diverses

### Fonctionnalités

| Action | Description |
|--------|-------------|
| Générer PDF | Télécharger la facture en PDF |
| Confirmer paiement | Marquer comme payée |

### Statistiques
- Total des factures
- Montant en attente
- Montant payé
- Factures du mois

### Tableau des factures
| Colonne | Description |
|---------|-------------|
| Numéro | Référence de la facture |
| Client | Destinataire |
| Type | Type d'opération |
| Montant | Montant HT/TTC |
| Statut | En attente / Payée |
| Date | Date d'émission |
| Actions | PDF, Payer |

---

## 10. Opérations - `/operations`

### Description
Gestion des opérations de location et de transport de matériel.

### Types d'opérations
| Type | Description |
|------|-------------|
| Location | Location de véhicules/matériel |
| Transport | Services de transport |
| Manutention | Opérations de chargement/déchargement |

### Cycle de vie d'une opération
```
En attente → En cours → Terminée → Confirmée → Archivée
```

### Onglets

#### En cours
Opérations actives ou en attente de démarrage.

#### Terminées
Opérations finalisées en attente de confirmation.

#### Confirmées
Opérations validées prêtes pour la facturation.

### Fonctionnalités

| Action | Description |
|--------|-------------|
| Nouvelle opération | Créer une opération |
| Démarrer | Passer en statut "En cours" |
| Terminer | Marquer comme terminée |
| Confirmer | Valider pour facturation |
| Générer PDF | Bon de location/transport |
| Modifier | Éditer les détails |
| Supprimer | Annuler l'opération |

### Filtres disponibles
- Type d'opération
- Statut
- Période (date début/fin)
- Recherche textuelle

### Formulaire d'opération
| Champ | Description | Obligatoire |
|-------|-------------|-------------|
| Type | Location/Transport/Manutention | Oui |
| Client | Nom du client | Oui |
| Camion | Véhicule affecté | Oui |
| Remorque | Remorque affectée | Non |
| Date début | Début de l'opération | Oui |
| Date fin | Fin prévue | Non |
| Tarif | Prix de l'opération | Oui |
| Observations | Notes | Non |

### Indicateur de flux de données
Affiche la possibilité de transférer les opérations confirmées vers la facturation.

---

## 11. Ordres - `/ordres`

### Description
Validation finale des opérations et sorties standards avant archivage.

### Onglets

#### Opérations
Liste des opérations en attente de validation finale :
- Modifier les détails
- Confirmer pour archivage
- Supprimer

#### Sorties standards
Liste des sorties en attente de validation :
- Vérification des informations
- Confirmation finale

### Statistiques
- Opérations à valider
- Sorties à valider
- Validées ce jour

### Actions disponibles
| Action | Description |
|--------|-------------|
| Modifier | Corriger les informations avant validation |
| Confirmer | Valider et envoyer vers les archives |
| Supprimer | Annuler (avec justification) |

---

## 12. Primes Chauffeur - `/primes`

### Description
Gestion des primes de chauffeur basée sur les sorties effectuées.

### Mode de calcul
Les primes sont calculées par semaine en fonction des sorties réalisées par chaque chauffeur.

### Onglets

#### Primes en attente
Liste des primes à payer avec possibilité de :
- Modifier le montant
- Ajouter des observations
- Sélectionner pour paiement

#### Gestion Paiement
Interface de paiement en lot :
- Sélection multiple
- Paiement groupé par chauffeur

#### Archives
Historique des primes payées avec statistiques.

### Fonctionnalités

| Action | Description |
|--------|-------------|
| Modifier | Ajuster le montant de la prime |
| Payer | Marquer comme payée |
| Paiement en lot | Payer plusieurs primes d'un coup |

### Statistiques
- Total des primes en attente
- Montant total à payer
- Primes payées ce mois
- Nombre de chauffeurs

### Tableau des primes
| Colonne | Description |
|---------|-------------|
| Chauffeur | Nom du chauffeur |
| Période | Semaine concernée |
| Sorties | Nombre de sorties |
| Montant | Montant de la prime |
| Observations | Notes |
| Actions | Modifier, Payer |

---

## 13. Notifications - `/notifications`

### Description
Centre de notifications pour tous les événements importants de l'application.

### Types de notifications
| Type | Icône | Description |
|------|-------|-------------|
| Retard | ⚠️ | Conteneur en dépassement de délai |
| Rentrée | ✅ | Opération validée ou conteneur rentré |
| Alerte | 🔔 | Alertes système diverses |

### Niveaux de priorité
- **Urgent**: Requiert une action immédiate
- **Normal**: Information standard

### Fonctionnalités

| Action | Description |
|--------|-------------|
| Marquer comme lu | Masquer la notification |
| Naviguer | Aller à la page concernée |
| Configurer | Paramétrer les préférences |

### Configuration des notifications
Paramétrable par type :
| Type | In-App | Email |
|------|--------|-------|
| Retards | ✓ | ✓ |
| Rentrées | ✓ | ✗ |
| Alertes | ✓ | ✓ |

### Permission Push
Demande d'autorisation pour les notifications push du navigateur.

---

## 14. E-mails - `/emails`

### Description
Gestion des notifications par e-mail et configuration du serveur SMTP.

### Onglets

#### Historique
Liste de tous les e-mails envoyés avec :
| Colonne | Description |
|---------|-------------|
| Destinataire | Adresse email |
| Sujet | Objet du mail |
| Date d'envoi | Horodatage |
| Statut | Envoyé / Échec |
| Template | Modèle utilisé |

#### Configuration
Paramètres du serveur SMTP :
| Paramètre | Description |
|-----------|-------------|
| Expéditeur par défaut | Adresse d'envoi |
| Serveur SMTP | Adresse du serveur |
| Port | Port du serveur (587, 465, etc.) |
| SSL/TLS | Chiffrement activé |

### Statistiques
- E-mails envoyés
- E-mails en échec
- Taux de réussite

---

## 15. Archives Base - `/archives-base`

### Description
Historique complet des opérations de stockage et double relevage archivées.

### Fonctionnalités

| Action | Description |
|--------|-------------|
| Rechercher | Filtres multiples |
| Exporter | PDF, Excel, CSV |
| Voir facture | Télécharger le PDF de la facture |
| Voir détails | Afficher toutes les informations |

### Filtres disponibles
| Filtre | Options |
|--------|---------|
| Période | Date début / Date fin |
| Type d'opération | Stockage, Double relevage, Dépotage |
| Client | Liste des clients |
| Numéro de conteneur | Recherche textuelle |
| Statut paiement | Tous, Payé, Non payé |

### Statistiques
- Total des opérations archivées
- Montant total facturé
- Montant payé
- Montant en attente

### Tableau des archives
| Colonne | Description |
|---------|-------------|
| Numéro facture | Référence |
| Conteneur | Numéro du conteneur |
| Client | Nom du client |
| Type | Type d'opération |
| Date | Date de l'opération |
| Montant | Montant facturé |
| Statut | Payé / Non payé |
| Actions | Facture, Détails |

---

## 16. Archives Sortie - `/archives-sortie`

### Description
Historique complet des sorties de conteneurs et gestion de détention archivées.

### Fonctionnalités

| Action | Description |
|--------|-------------|
| Rechercher | Filtres multiples |
| Exporter | PDF, Excel, CSV |
| Voir note de débit | Télécharger le PDF de la détention |
| Voir détails | Afficher toutes les informations |

### Filtres disponibles
| Filtre | Options |
|--------|---------|
| Période | Date début / Date fin |
| Armateur | Liste des armateurs |
| Client | Liste des clients |
| Numéro de conteneur | Recherche textuelle |
| Statut paiement | Tous, Payé, Non payé |

### Statistiques
- Total des sorties archivées
- Conteneurs avec détention
- Montant total de détention
- Montant payé

### Informations archivées
- Numéro de conteneur
- Numéro BL
- Client
- Armateur
- Date de sortie
- Date de retour
- Jours de détention
- Montant de détention
- Responsabilité
- Statut de paiement

---

## 17. Archives Opérations - `/archives-operation`

### Description
Historique complet des opérations de location et transport archivées.

### Fonctionnalités
Similaires aux Archives Base avec les mêmes options de filtrage et d'export.

### Informations spécifiques
- Numéro d'opération
- Type d'opération
- Client
- Véhicules utilisés
- Période (début/fin)
- Montant facturé
- Statut de paiement

---

## Annexes

### A. Rôles et permissions

| Permission | Admin | Manager | Opérateur | Visiteur |
|------------|-------|---------|-----------|----------|
| Voir Dashboard | ✓ | ✓ | ✓ | ✓ |
| Gérer Sorties | ✓ | ✓ | ✓ | ✗ |
| Gérer Matériel | ✓ | ✓ | ✗ | ✗ |
| Gérer Utilisateurs | ✓ | ✗ | ✗ | ✗ |
| Gérer Facturation | ✓ | ✓ | ✗ | ✗ |
| Voir Archives | ✓ | ✓ | ✓ | ✓ |
| Exporter données | ✓ | ✓ | ✓ | ✗ |

### B. Flux de données

```
Sortie Conteneur → Base → Détention → Facturation → Archives
        ↓
    Opérations → Ordres → Facturation → Archives
        ↓
  Primes Chauffeur → Paiement → Archives
```

### C. Codes de statut des conteneurs

| Statut | Description |
|--------|-------------|
| `en_cours` | En transit chez le client |
| `retourne` | Rentré au port |
| `en_detention` | En dépassement de franchise |
| `facture` | Détention facturée |
| `paye` | Tout réglé, archivable |

### D. API Endpoints principaux

Voir la documentation API complète dans `backend/API_DOCUMENTATION.md`.

### E. Support

Pour toute question ou problème :
- Consulter la documentation API
- Contacter l'administrateur système
- Ouvrir un ticket de support

---

*Documentation générée le 29/12/2024 - Version 1.0*
