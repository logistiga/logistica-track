# 📚 Documentation Complète - Application Logistiga

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture de l'Application](#architecture-de-lapplication)
3. [Pages et Fonctionnalités](#pages-et-fonctionnalités)
4. [Relations entre les Pages](#relations-entre-les-pages)
5. [Flux de Données](#flux-de-données)
6. [Glossaire](#glossaire)

---

## Vue d'ensemble

**Logistiga** est une application complète de gestion logistique pour le transport et la gestion de conteneurs. Elle permet de suivre le cycle de vie complet d'un conteneur depuis sa sortie du port jusqu'à son retour, en passant par les opérations à la base.

### Technologies utilisées
- **Frontend** : React, TypeScript, Tailwind CSS
- **Backend** : Laravel PHP, MySQL/PostgreSQL
- **Authentification** : JWT Token (Sanctum)

### Structure du Menu

```
📊 Tableau de Bord
│
├── 📦 OPÉRATIONS
│   ├── Sorties de Conteneurs
│   ├── Base (Stockage, Double Relevage, Dépotage)
│   └── Opérations (Location, Transport)
│
├── 📁 ARCHIVES
│   ├── Archives Sorties
│   ├── Archives Base
│   └── Archives Opérations
│
└── ⚙️ PARAMÈTRES
    ├── Utilisateurs
    ├── Notifications
    ├── Emails
    ├── Armateurs
    └── Matériel
```

---

## Architecture de l'Application

### Schéma Général

```
┌─────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LOGISTIGA                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐    │
│  │  PARAMÈTRES  │────▶│  OPÉRATIONS  │────▶│    ARCHIVES      │    │
│  │              │     │              │     │                  │    │
│  │ - Armateurs  │     │ - Sorties    │     │ - Archives       │    │
│  │ - Matériel   │     │ - Base       │     │   Sorties        │    │
│  │ - Users      │     │ - Opérations │     │ - Archives Base  │    │
│  └──────────────┘     └──────────────┘     │ - Archives Ops   │    │
│                              │              └──────────────────┘    │
│                              ▼                                      │
│                    ┌──────────────────┐                             │
│                    │   DÉTENTION &    │                             │
│                    │   FACTURATION    │                             │
│                    └──────────────────┘                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Pages et Fonctionnalités

---

### 1. 🔐 PAGE DE CONNEXION (`/login`)

#### Description
Page d'authentification sécurisée pour accéder à l'application.

#### Fonctionnalités
- Connexion avec email et mot de passe
- Option "Se souvenir de moi"
- Lien de récupération de mot de passe
- Protection CSRF et limitation des tentatives

#### Champs du Formulaire
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| Email | email | ✅ | Adresse email de l'utilisateur |
| Mot de passe | password | ✅ | Mot de passe sécurisé |

#### Relations
- **Après connexion** → Redirection vers le **Tableau de Bord**
- **Toutes les pages** nécessitent une authentification valide

---

### 2. 📊 TABLEAU DE BORD (`/`)

#### Description
Vue d'ensemble en temps réel de toutes les activités logistiques.

#### Sections

##### Statistiques Principales
| Statistique | Description |
|-------------|-------------|
| Sorties en cours | Nombre de conteneurs actuellement hors du port |
| Conteneurs à la base | Conteneurs en stockage/opération |
| Véhicules actifs | Camions et remorques en mission |
| Détentions critiques | Conteneurs dépassant la franchise |

##### Graphiques
- **Activité mensuelle** : Évolution des sorties par mois
- **Répartition par statut** : Camembert des statuts des conteneurs
- **Top Armateurs** : Armateurs les plus actifs

##### Actions Rapides
- Nouvelle sortie de conteneur
- Nouvelle opération
- Voir les détentions

#### Relations avec les autres pages
```
Tableau de Bord
    │
    ├──▶ Sorties de Conteneurs (via actions rapides)
    ├──▶ Opérations (via actions rapides)
    ├──▶ Détention (via alertes)
    └──▶ Base (via statistiques)
```

---

### 3. 📦 SORTIES DE CONTENEURS (`/sorties`)

#### Description
Gestion complète du cycle de vie des conteneurs depuis leur sortie du port.

#### Fonctionnalités
- Créer une nouvelle sortie
- Suivre les conteneurs en cours
- Enregistrer les retours
- Exporter les données (Excel, PDF)

#### États d'un Conteneur
```
┌─────────────┐    ┌───────────────┐    ┌────────────┐    ┌───────────────┐
│  EN_COURS   │───▶│ LIVRE_CLIENT  │───▶│  A_LA_BASE │───▶│ RETOURNE_PORT │
└─────────────┘    └───────────────┘    └────────────┘    └───────────────┘
     │                                         │
     └─────────────────────────────────────────┘
                    ou directement
```

#### Formulaire de Création
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| N° Conteneur | texte | ✅ | Identifiant unique du conteneur |
| N° BL | texte | ✅ | Numéro du connaissement |
| Armateur | sélection | ✅ | Compagnie maritime |
| Camion | sélection | ✅ | Véhicule tracteur |
| Remorque | sélection | ✅ | Châssis porte-conteneur |
| Client | texte | ✅ | Nom du destinataire |
| Transitaire | texte | ✅ | Agent de transit |
| Destination | choix | ✅ | Base ou Client |
| Type | choix | ✅ | BAD ou Détention |
| Date sortie | date | ✅ | Date de sortie du port |

#### Tableau des Sorties
| Colonne | Description |
|---------|-------------|
| N° Conteneur | Identifiant du conteneur |
| N° BL | Numéro BL |
| Armateur | Code armateur |
| Client | Nom du client |
| Destination | Base/Client |
| Statut | État actuel |
| Jours | Nombre de jours hors port |
| Actions | Modifier, Retour, Détails |

#### Relations
```
Sorties de Conteneurs
    │
    ├──▶ Armateurs (récupère la liste)
    ├──▶ Matériel (récupère camions/remorques)
    ├──▶ Base (si destination = base)
    ├──▶ Détention (calcul automatique)
    ├──▶ Primes Chauffeur (génération prime)
    └──▶ Archives Sorties (après retour)
```

---

### 4. 🏭 BASE (`/base`)

#### Description
Gestion des opérations effectuées à la base logistique sur les conteneurs.

#### Trois Types d'Opérations

##### 4.1 STOCKAGE
Conteneurs en attente à la base avant livraison ou retour.

| Champ | Description |
|-------|-------------|
| Client | Propriétaire de la marchandise |
| N° Conteneur | Identifiant |
| Provenance | Origine du conteneur |
| Date arrivée | Date d'entrée à la base |
| Jours gratuits | Période sans frais |
| Prix/jour | Tarif journalier après période gratuite |
| Camion/Remorque | Véhicule ayant amené le conteneur |

**Statuts** : `Stocké` → `En attente sortie` → `Sorti`

##### 4.2 DOUBLE RELEVAGE
Opération de transfert de conteneur entre deux véhicules.

| Champ | Description |
|-------|-------------|
| Camion ameneur | Véhicule qui amène le conteneur |
| Camion récupérateur | Véhicule qui récupère le conteneur |
| Montant opération | Coût du double relevage |

**Statuts** : `En attente` → `Confirmé` ou `Annulé`

##### 4.3 DÉPOTAGE
Déchargement du contenu d'un conteneur.

| Champ | Description |
|-------|-------------|
| Type marchandise | Nature du contenu |
| Prix dépotage | Coût de l'opération |

**Statuts** : `En cours` → `Terminé` ou `Annulé`

#### Relations
```
Base
    │
    ├──▶ Sorties (lien via sortie_conteneur_id)
    ├──▶ Matériel (véhicules utilisés)
    ├──▶ Facturation (génération facture auto)
    └──▶ Archives Base (après clôture)
```

---

### 5. 🔧 OPÉRATIONS (`/operations`)

#### Description
Gestion des opérations de location et transport de véhicules.

#### Types d'Opérations

##### LOCATION
Location de véhicules avec calcul automatique de durée et montant.

| Champ | Description |
|-------|-------------|
| Date début | Début de la location |
| Date fin | Fin de la location |
| Durée | Calculée automatiquement (jours) |
| Tarif journalier | Prix par jour |
| Montant total | Durée × Tarif |

##### TRANSPORT
Opérations de transport point à point.

| Champ | Description |
|-------|-------------|
| Lieu départ | Point de chargement |
| Destination | Point de livraison |
| Coût | Prix du transport |

#### Workflow des Opérations
```
┌──────────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│  PLANIFIÉE   │───▶│ EN_COURS  │───▶│ TERMINÉE  │───▶│ CONFIRMÉE │
└──────────────┘    └───────────┘    └───────────┘    └───────────┘
       │                                                    │
       └────────────────▶ ANNULÉE ◀─────────────────────────┘
```

#### Onglets
- **En cours** : Opérations actives
- **Terminées** : Opérations complétées en attente de confirmation
- **Confirmées** : Opérations validées

#### Relations
```
Opérations
    │
    ├──▶ Matériel (véhicules assignés)
    ├──▶ Utilisateurs (responsable)
    ├──▶ Sorties (lien optionnel)
    └──▶ Archives Opérations (après confirmation)
```

---

### 6. ⏱️ DÉTENTION (`/detention`)

#### Description
Suivi des conteneurs dépassant leur période de franchise (jours gratuits).

#### Calcul de la Détention
```
Jours de détention = Date actuelle - Date sortie - Jours franchise
Coût = Jours de détention × Tarif journalier armateur
```

#### Informations Affichées
| Colonne | Description |
|---------|-------------|
| N° Conteneur | Identifiant |
| Armateur | Compagnie maritime |
| Date sortie | Date de sortie du port |
| Jours franchise | Période gratuite |
| Jours détention | Jours au-delà de la franchise |
| Coût estimé | Montant à payer |
| Responsabilité | Client, Logistiga, ou Partagée |

#### Attribution de Responsabilité
- **Client** : Le client paie la totalité
- **Logistiga** : L'entreprise assume les frais
- **Partagée** : Division des coûts (% configurable)

#### Relations
```
Détention
    │
    ├──◀ Sorties (données source)
    ├──◀ Armateurs (tarifs détention)
    └──▶ Archives Sorties (historique)
```

---

### 7. 💰 FACTURATION (`/facturation`)

#### Description
Gestion des factures générées automatiquement pour les opérations de base.

#### Génération Automatique
Les factures sont créées automatiquement quand :
- Un stockage est clôturé (sortie)
- Un double relevage est confirmé
- Un dépotage est terminé

#### Statuts des Factures
```
┌───────────┐    ┌──────────┐    ┌─────────┐
│ BROUILLON │───▶│ ENVOYÉE  │───▶│  PAYÉE  │
└───────────┘    └──────────┘    └─────────┘
       │
       └──────────▶ ANNULÉE
```

#### Informations de la Facture
| Champ | Description |
|-------|-------------|
| N° Facture | Identifiant unique (FACT-YYYYMM-XXXX) |
| Type opération | Stockage, Double relevage, Dépotage |
| Client | Destinataire de la facture |
| Montant HT | Montant hors taxes |
| TVA | Taxe appliquée |
| Montant TTC | Total à payer |
| Échéance | Date limite de paiement |

#### Relations
```
Facturation
    │
    ├──◀ Base (opérations facturées)
    └──◀ Sorties (lien optionnel)
```

---

### 8. 💵 PRIMES CHAUFFEUR (`/primes`)

#### Description
Gestion des primes versées aux chauffeurs pour les sorties de conteneurs.

#### Fonctionnement
1. À chaque sortie de conteneur, une prime est générée
2. Les primes sont listées par chauffeur/véhicule
3. Paiement en lot possible
4. Historique des paiements archivé

#### Statuts des Primes
- **En attente** : Prime due, non payée
- **Payée** : Prime versée et archivée

#### Tableau des Primes
| Colonne | Description |
|---------|-------------|
| Véhicule | Camion concerné |
| N° Conteneur | Conteneur transporté |
| Date sortie | Date de l'opération |
| Montant | Prime à verser |
| Statut | En attente / Payée |

#### Relations
```
Primes Chauffeur
    │
    ├──◀ Sorties (source des primes)
    ├──◀ Matériel (véhicules/chauffeurs)
    └──▶ Archives Primes (après paiement)
```

---

### 9. 📁 ARCHIVES SORTIES (`/archives-sortie`)

#### Description
Historique complet de toutes les sorties de conteneurs retournées au port.

#### Critères d'Archivage
- Statut = `retourne_port`
- Prime chauffeur payée

#### Fonctionnalités
- Recherche avancée par période, armateur, client
- Export PDF et Excel
- Consultation des détails de détention
- Statistiques globales

#### Relations
```
Archives Sorties
    │
    └──◀ Sorties (après retour complet)
```

---

### 10. 📁 ARCHIVES BASE (`/archives-base`)

#### Description
Historique des opérations de base terminées (stockage, double relevage, dépotage).

#### Critères d'Archivage
- Opération complètement terminée
- Facture générée et payée (si applicable)

#### Fonctionnalités
- Filtrage par type d'opération
- Recherche par client ou conteneur
- Export des données

---

### 11. 📁 ARCHIVES OPÉRATIONS (`/archives-operations`)

#### Description
Historique des opérations de location et transport confirmées.

#### Critères d'Archivage
- Statut = `confirmee`

#### Fonctionnalités
- Filtrage par type (location/transport)
- Statistiques de durée et revenus
- Export PDF des bons

---

### 12. 👥 UTILISATEURS (`/utilisateurs`)

#### Description
Gestion des comptes utilisateurs et des rôles (accès admin uniquement).

#### Rôles Disponibles
| Rôle | Permissions |
|------|-------------|
| **Admin** | Accès complet, gestion utilisateurs |
| **Manager** | Toutes opérations, pas de gestion users |
| **Opérateur** | Création/modification opérations |
| **Visiteur** | Lecture seule |

#### Gestion des Utilisateurs
- Créer un nouvel utilisateur
- Modifier les informations
- Activer/Désactiver un compte
- Réinitialiser le mot de passe
- Attribuer un rôle

#### Relations
```
Utilisateurs
    │
    └──▶ Toutes les pages (audit: created_by, updated_by)
```

---

### 13. 🔔 NOTIFICATIONS (`/notifications`)

#### Description
Centre de gestion des notifications de l'application.

#### Types de Notifications
| Type | Déclencheur |
|------|-------------|
| Détention critique | Conteneur > 10 jours de détention |
| Véhicule à réviser | Date révision proche |
| Facture en retard | Échéance dépassée |
| Nouvelle sortie | Sortie créée |

#### Fonctionnalités
- Voir toutes les notifications
- Marquer comme lue
- Supprimer
- Configurer les préférences

---

### 14. 📧 EMAILS (`/emails`)

#### Description
Configuration et historique des emails automatiques.

#### Configuration SMTP
| Champ | Description |
|-------|-------------|
| Serveur SMTP | Adresse du serveur |
| Port | Port de connexion |
| Utilisateur | Identifiant |
| Mot de passe | Authentification |
| Email expéditeur | Adresse d'envoi |

#### Historique
- Liste des emails envoyés
- Statut (envoyé, échec)
- Destinataires

---

### 15. 🚢 ARMATEURS (`/armateurs`)

#### Description
Gestion des compagnies maritimes et leurs conditions tarifaires.

#### Informations par Armateur
| Champ | Description |
|-------|-------------|
| Code | Identifiant unique (ex: MSC, CMA) |
| Nom | Nom complet de la compagnie |
| Type conteneur | 20' ou 40' |
| Jours franchise | Période gratuite |
| Tarif détention | Prix par jour de dépassement |
| Contact | Informations de contact |

#### Importance
Les armateurs définissent les conditions de détention appliquées aux conteneurs.

#### Relations
```
Armateurs
    │
    ├──▶ Sorties (conditions appliquées)
    └──▶ Détention (calcul des coûts)
```

---

### 16. 🚛 MATÉRIEL (`/materiel`)

#### Description
Gestion de la flotte de véhicules (camions et remorques).

#### Types de Véhicules
- **Camions** : Véhicules tracteurs
- **Remorques** : Châssis porte-conteneurs

#### Informations par Véhicule
| Champ | Description |
|-------|-------------|
| N° Parc | Identifiant interne |
| Immatriculation | Plaque d'immatriculation |
| Type | Camion ou Remorque |
| Statut | Actif, En mission, Maintenance |

#### Relations
```
Matériel
    │
    ├──▶ Sorties (affectation véhicules)
    ├──▶ Base (véhicules utilisés)
    ├──▶ Opérations (véhicules assignés)
    └──▶ Primes (lien chauffeur)
```

---

## Relations entre les Pages

### Diagramme des Relations

```
                            ┌─────────────────┐
                            │   ARMATEURS     │
                            └────────┬────────┘
                                     │ définit conditions
                                     ▼
┌──────────────┐           ┌─────────────────┐           ┌──────────────┐
│   MATÉRIEL   │──────────▶│    SORTIES      │◀──────────│ UTILISATEURS │
└──────────────┘ véhicules └────────┬────────┘ créé par  └──────────────┘
       │                            │
       │                   ┌────────┼────────┐
       │                   │        │        │
       │                   ▼        ▼        ▼
       │            ┌──────────┐ ┌─────┐ ┌────────────┐
       └───────────▶│   BASE   │ │PRIME│ │ DÉTENTION  │
                    └────┬─────┘ └──┬──┘ └────────────┘
                         │          │
                         ▼          ▼
                    ┌──────────┐ ┌─────────────────┐
                    │FACTURATION│ │ARCHIVES SORTIES │
                    └──────────┘ └─────────────────┘
                         │
                         ▼
                    ┌──────────────┐
                    │ARCHIVES BASE │
                    └──────────────┘


┌──────────────┐                    ┌─────────────────────┐
│  OPÉRATIONS  │───────────────────▶│ ARCHIVES OPÉRATIONS │
└──────────────┘                    └─────────────────────┘
```

### Tableau des Dépendances

| Page Source | Page Cible | Type de Relation |
|-------------|------------|------------------|
| Sorties | Armateurs | Lecture (conditions) |
| Sorties | Matériel | Lecture (véhicules) |
| Sorties | Base | Création (si destination=base) |
| Sorties | Détention | Calcul automatique |
| Sorties | Primes | Génération automatique |
| Base | Sorties | Lecture (lien conteneur) |
| Base | Facturation | Création automatique |
| Base | Archives Base | Archivage |
| Opérations | Matériel | Lecture (véhicules) |
| Opérations | Archives Opérations | Archivage |
| Détention | Sorties | Lecture (données) |
| Détention | Armateurs | Lecture (tarifs) |
| Primes | Sorties | Lecture (source) |
| Facturation | Base | Lecture (opérations) |

---

## Flux de Données

### Cycle de Vie d'un Conteneur

```
1. CRÉATION SORTIE
   │
   ├─▶ Sélection armateur (conditions)
   ├─▶ Sélection véhicules (camion + remorque)
   ├─▶ Génération prime chauffeur
   │
   ▼
2. TRANSPORT
   │
   ├─▶ Suivi en temps réel
   ├─▶ Calcul détention (si dépassement franchise)
   │
   ▼
3. DESTINATION
   │
   ├─▶ Si CLIENT : Livraison directe
   │       └─▶ Retour au port (statut: retourne_port)
   │
   └─▶ Si BASE : Opération à la base
           │
           ├─▶ Stockage : Attente + sortie
           ├─▶ Double relevage : Transfert véhicule
           └─▶ Dépotage : Déchargement
           │
           └─▶ Génération facture automatique
           │
           └─▶ Retour au port
   │
   ▼
4. RETOUR AU PORT
   │
   ├─▶ Enregistrement date retour
   ├─▶ Calcul final détention
   ├─▶ Attribution responsabilité
   │
   ▼
5. PAIEMENT PRIME
   │
   └─▶ Paiement en lot ou individuel
   │
   ▼
6. ARCHIVAGE
   │
   └─▶ Transfert vers Archives Sorties
```

### Cycle d'une Opération

```
1. CRÉATION OPÉRATION
   │
   ├─▶ Type : Location ou Transport
   ├─▶ Affectation véhicules
   ├─▶ Calcul automatique (durée, montant)
   │
   ▼
2. EXÉCUTION
   │
   ├─▶ Démarrage (statut: en_cours)
   ├─▶ Suivi progression
   │
   ▼
3. FINALISATION
   │
   ├─▶ Completion (statut: terminee)
   ├─▶ Vérification par manager
   │
   ▼
4. CONFIRMATION
   │
   ├─▶ Validation (statut: confirmee)
   │
   ▼
5. ARCHIVAGE
   │
   └─▶ Transfert vers Archives Opérations
```

---

## Glossaire

| Terme | Définition |
|-------|------------|
| **Armateur** | Compagnie maritime propriétaire des conteneurs |
| **BAD** | Bon à Délivrer - Document autorisant la sortie |
| **BL** | Bill of Lading - Connaissement maritime |
| **Dépotage** | Opération de déchargement d'un conteneur |
| **Détention** | Frais appliqués au-delà de la période de franchise |
| **Double Relevage** | Transfert de conteneur entre deux véhicules |
| **Franchise** | Période gratuite accordée par l'armateur |
| **Prime** | Bonus versé au chauffeur pour une sortie |
| **Remorque** | Châssis porte-conteneur tracté par un camion |
| **Sortie** | Opération de sortie d'un conteneur du port |
| **Stockage** | Entreposage temporaire à la base |
| **Transitaire** | Agent gérant les formalités douanières |

---

## Support

Pour toute question ou assistance :
- **Email** : support@logistiga.com
- **Documentation technique** : `backend/API_DOCUMENTATION.md`

---

*Document généré le 23 janvier 2026*
*Version 1.0*
