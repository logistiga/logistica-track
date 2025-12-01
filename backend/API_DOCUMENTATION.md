# 📚 Documentation API Logistiga

**Version:** 1.0  
**Base URL:** `https://your-domain.com/api`  
**Authentification:** Sanctum (Bearer Token)

---

## 📑 Table des Matières

1. [Authentification](#authentification)
2. [Dashboard](#dashboard)
3. [Armateurs](#armateurs)
4. [Véhicules](#vehicules)
5. [Sorties Conteneur](#sorties-conteneur)
6. [Opérations](#operations)
7. [Détentions](#detentions)
8. [Facturations](#facturations)
9. [Base (Stockage, Double Relevage, Dépotage)](#base)
10. [Primes Chauffeur](#primes-chauffeur)
11. [Archives](#archives)
12. [Notifications](#notifications)
13. [Emails](#emails)
14. [Utilisateurs & Rôles](#utilisateurs--rôles)
15. [Système](#système)
16. [Codes d'Erreur](#codes-derreur)

---

## 🔐 Authentification

### Connexion
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "admin"
    },
    "token": "1|abcdef123456..."
  }
}
```

### Inscription
```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Déconnexion
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### Utilisateur Connecté
```http
GET /api/auth/user
Authorization: Bearer {token}
```

---

## 📊 Dashboard

### Tableau de Bord Principal
```http
GET /api/dashboard
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "sorties": {
        "total": 150,
        "en_cours": 25,
        "retournees": 120,
        "aujourd_hui": 5
      },
      "vehicules": {
        "total": 50,
        "disponibles": 30,
        "en_mission": 15,
        "maintenance": 5
      },
      "operations": {
        "total": 200,
        "planifiees": 20,
        "en_cours": 30,
        "terminees": 140,
        "revenue_total": 500000
      }
    },
    "recent_activities": [...],
    "alerts": [...],
    "charts": {...}
  }
}
```

### Statistiques par Période
```http
GET /api/dashboard/stats?period=month
Authorization: Bearer {token}
```

**Paramètres:**
- `period` (string): `day`, `week`, `month`, `year`

### Activités Récentes
```http
GET /api/dashboard/recent-activity?limit=10
Authorization: Bearer {token}
```

### Alertes Système
```http
GET /api/dashboard/alerts
Authorization: Bearer {token}
```

---

## 🏢 Armateurs

### Liste des Armateurs
```http
GET /api/armateurs?search=MSC&page=1&per_page=15
Authorization: Bearer {token}
```

**Paramètres:**
- `search` (string, optional): Recherche par code ou nom
- `page` (integer, optional): Numéro de page (défaut: 1)
- `per_page` (integer, optional): Éléments par page (défaut: 15)

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code_armateur": "MSC",
      "nom_armateur": "Mediterranean Shipping Company",
      "contact": "contact@msc.com",
      "telephone": "+225 01 02 03 04",
      "adresse": "Abidjan, Côte d'Ivoire",
      "actif": true,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "total": 50,
    "current_page": 1,
    "per_page": 15,
    "last_page": 4
  }
}
```

### Créer un Armateur
```http
POST /api/armateurs
Authorization: Bearer {token}
Role: admin, manager
```

**Body:**
```json
{
  "code_armateur": "MSC",
  "nom_armateur": "Mediterranean Shipping Company",
  "contact": "contact@msc.com",
  "telephone": "+225 01 02 03 04",
  "adresse": "Abidjan, Côte d'Ivoire",
  "actif": true
}
```

### Détails d'un Armateur
```http
GET /api/armateurs/{id}
Authorization: Bearer {token}
```

### Modifier un Armateur
```http
PUT /api/armateurs/{id}
Authorization: Bearer {token}
Role: admin, manager
```

### Supprimer un Armateur
```http
DELETE /api/armateurs/{id}
Authorization: Bearer {token}
Role: admin
```

### Statistiques Armateurs
```http
GET /api/armateurs/stats
Authorization: Bearer {token}
```

---

## 🚛 Véhicules

### Liste des Véhicules
```http
GET /api/vehicules?type=camion&statut=disponible&search=TR37
Authorization: Bearer {token}
```

**Paramètres:**
- `type` (string, optional): `camion`, `remorque`
- `statut` (string, optional): `disponible`, `en_mission`, `maintenance`
- `search` (string, optional): Recherche par numéro ou immatriculation

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero_parc": "TR 37",
      "immatriculation": "CI 3456 AB",
      "type": "camion",
      "actif": true,
      "statut": "disponible",
      "prochaine_revision": "2025-03-15",
      "kilometrage": 125000
    }
  ]
}
```

### Créer un Véhicule
```http
POST /api/vehicules
Authorization: Bearer {token}
Role: admin, manager
```

**Body:**
```json
{
  "numero_parc": "TR 37",
  "immatriculation": "CI 3456 AB",
  "type": "camion",
  "actif": true,
  "statut": "disponible"
}
```

### Modifier un Véhicule
```http
PUT /api/vehicules/{id}
Authorization: Bearer {token}
Role: admin, manager
```

### Supprimer un Véhicule
```http
DELETE /api/vehicules/{id}
Authorization: Bearer {token}
Role: admin
```

### Véhicules Disponibles
```http
GET /api/vehicules/disponibles
Authorization: Bearer {token}
```

### Véhicules en Mission
```http
GET /api/vehicules/en-mission
Authorization: Bearer {token}
```

### Véhicules en Maintenance
```http
GET /api/vehicules/maintenance
Authorization: Bearer {token}
```

### Recherche Camions
```http
GET /api/vehicules/search/camions?query=TR
Authorization: Bearer {token}
```

### Recherche Remorques
```http
GET /api/vehicules/search/remorques?query=R
Authorization: Bearer {token}
```

---

## 📦 Sorties Conteneur

### Liste des Sorties
```http
GET /api/sorties?statut=en_cours&page=1&per_page=20
Authorization: Bearer {token}
```

**Paramètres:**
- `statut` (string, optional): `en_cours`, `retourne_port`, `archive`
- `armateur_id` (integer, optional): Filtrer par armateur
- `date_debut` (date, optional): Date de début (YYYY-MM-DD)
- `date_fin` (date, optional): Date de fin (YYYY-MM-DD)
- `search` (string, optional): Recherche par numéro conteneur

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero_tc": "ABCD1234567",
      "code_armateur": "MSC",
      "nom_armateur": "Mediterranean Shipping Company",
      "date_sortie": "2024-12-01",
      "date_retour": null,
      "statut": "en_cours",
      "camion": "TR 37",
      "remorque": "R 01",
      "chauffeur": "Jean Dupont",
      "destination": "Yamoussoukro",
      "bl": "BL123456",
      "client": "ABC Trading",
      "montant_prime": 7000,
      "statut_prime": "en_attente"
    }
  ],
  "meta": {
    "total": 150,
    "current_page": 1,
    "per_page": 20
  }
}
```

### Créer une Sortie
```http
POST /api/sorties
Authorization: Bearer {token}
Role: admin, manager, operator
```

**Body:**
```json
{
  "numero_tc": "ABCD1234567",
  "armateur_id": 1,
  "date_sortie": "2024-12-01",
  "camion_id": 5,
  "remorque_id": 12,
  "chauffeur": "Jean Dupont",
  "destination": "Yamoussoukro",
  "bl": "BL123456",
  "transitaire": "Transit Express",
  "client": "ABC Trading",
  "observations": "Livraison urgente"
}
```

### Détails d'une Sortie
```http
GET /api/sorties/{id}
Authorization: Bearer {token}
```

### Modifier une Sortie
```http
PUT /api/sorties/{id}
Authorization: Bearer {token}
Role: admin, manager
```

### Retour Conteneur
```http
POST /api/sorties/{id}/retour
Authorization: Bearer {token}
```

**Body:**
```json
{
  "date_retour": "2024-12-15",
  "camion_retour_id": 5,
  "remorque_retour_id": 12,
  "chauffeur_retour": "Jean Dupont",
  "observations_retour": "Retour sans incident"
}
```

### Recherche Sorties
```http
GET /api/sorties/search?query=ABCD&type=numero_tc
Authorization: Bearer {token}
```

**Paramètres:**
- `query` (string, required): Terme de recherche
- `type` (string, optional): `numero_tc`, `client`, `chauffeur`, `bl`

### Statistiques Sorties
```http
GET /api/sorties/stats?date_debut=2024-01-01&date_fin=2024-12-31
Authorization: Bearer {token}
```

### Export Excel
```http
GET /api/sorties/export?format=excel&date_debut=2024-01-01
Authorization: Bearer {token}
```

**Paramètres:**
- `format` (string): `excel`, `pdf`, `csv`
- Filtres identiques à la liste

---

## 🔧 Opérations

### Liste des Opérations
```http
GET /api/operations?statut=en_cours&type_operation=location
Authorization: Bearer {token}
```

**Paramètres:**
- `statut` (string): `planifiee`, `en_attente`, `en_cours`, `terminee`, `confirmee`, `annulee`
- `type_operation` (string): `location`, `transport`, `autre`
- `date_debut` (date): Date de début
- `date_fin` (date): Date de fin

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero_operation": "OP-2024-001",
      "type_operation": "location",
      "description": "Location conteneur frigorifique",
      "statut": "en_cours",
      "priorite": "haute",
      "date_debut": "2024-12-01",
      "date_fin": "2024-12-15",
      "duree": 14,
      "tarif_journalier": 7000,
      "cout_estime": 98000,
      "responsable": {
        "id": 2,
        "name": "Marie Martin"
      },
      "sortie_conteneur_id": 5,
      "lieu_depart": "Port d'Abidjan",
      "destination": "Yamoussoukro"
    }
  ]
}
```

### Créer une Opération
```http
POST /api/operations
Authorization: Bearer {token}
Role: admin, manager, operator
```

**Body:**
```json
{
  "numero_operation": "OP-2024-001",
  "type_operation": "location",
  "description": "Location conteneur frigorifique",
  "priorite": "haute",
  "statut": "planifiee",
  "date_debut": "2024-12-01",
  "date_fin": "2024-12-15",
  "tarif_journalier": 7000,
  "responsable_id": 2,
  "sortie_conteneur_id": 5,
  "lieu_depart": "Port d'Abidjan",
  "destination": "Yamoussoukro",
  "notes": "Client prioritaire"
}
```

### Démarrer une Opération
```http
POST /api/operations/{id}/start
Authorization: Bearer {token}
```

### Terminer une Opération
```http
POST /api/operations/{id}/complete
Authorization: Bearer {token}
```

### Confirmer une Opération
```http
POST /api/operations/{id}/confirm
Authorization: Bearer {token}
Role: admin, manager
```

### Annuler une Opération
```http
POST /api/operations/{id}/cancel
Authorization: Bearer {token}
```

**Body:**
```json
{
  "motif": "Client a annulé la demande"
}
```

### Archiver une Opération
```http
POST /api/operations/{id}/archive
Authorization: Bearer {token}
```

### Statistiques Opérations
```http
GET /api/operations/stats?type_operation=location
Authorization: Bearer {token}
```

---

## ⏱️ Détentions

### Liste des Détentions
```http
GET /api/detentions?statut=active&responsabilite=client
Authorization: Bearer {token}
```

**Paramètres:**
- `statut` (string): `active`, `resolue`, `contestee`
- `responsabilite` (string): `client`, `logistiga`, `partagee`
- `date_debut` (date): Date de début
- `date_fin` (date): Date de fin

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sortie_conteneur": {
        "id": 5,
        "numero_tc": "ABCD1234567",
        "client": "ABC Trading"
      },
      "date_debut_detention": "2024-11-15",
      "date_fin_detention": "2024-11-30",
      "jours_detention": 15,
      "jours_client": 15,
      "jours_logistiga": 0,
      "cout_par_jour": 7000,
      "cout_total": 105000,
      "responsabilite": "client",
      "motif_detention": "Retard de paiement des droits de douane",
      "statut": "active",
      "observations": "Client informé par mail"
    }
  ]
}
```

### Créer une Détention
```http
POST /api/detentions
Authorization: Bearer {token}
Role: admin, manager
```

**Body:**
```json
{
  "sortie_conteneur_id": 5,
  "date_debut_detention": "2024-11-15",
  "date_fin_detention": "2024-11-30",
  "cout_par_jour": 7000,
  "responsabilite": "client",
  "jours_client": 15,
  "jours_logistiga": 0,
  "motif_detention": "Retard de paiement",
  "observations": "Client informé"
}
```

### Définir la Responsabilité
```http
POST /api/detentions/{id}/responsabilite
Authorization: Bearer {token}
```

**Body:**
```json
{
  "responsabilite": "partagee",
  "jours_client": 10,
  "jours_logistiga": 5
}
```

### Générer PDF Détention
```http
GET /api/detentions/{id}/pdf
Authorization: Bearer {token}
```

### Marquer comme Payée
```http
POST /api/detentions/{id}/payer
Authorization: Bearer {token}
Role: admin, manager
```

### Statistiques Détentions
```http
GET /api/detentions/stats
Authorization: Bearer {token}
```

---

## 💰 Facturations

### Liste des Factures
```http
GET /api/facturations?statut=brouillon&type_operation=stockage
Authorization: Bearer {token}
```

**Paramètres:**
- `statut` (string): `brouillon`, `envoyee`, `payee`, `annulee`
- `type_operation` (string): `stockage`, `double_relevage`, `depotage`, `location`, `transport`
- `date_debut` (date)
- `date_fin` (date)

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero_facture": "FACT-2024-001",
      "sortie_conteneur_id": 5,
      "numero_conteneur": "ABCD1234567",
      "nom_client": "ABC Trading",
      "type_operation": "stockage",
      "date_facture": "2024-12-01",
      "date_echeance": "2024-12-31",
      "montant_ht": 70000,
      "tva": 12600,
      "montant_total": 82600,
      "statut": "brouillon",
      "details_operation": {
        "date_arrivee": "2024-11-15",
        "date_sortie": "2024-12-01",
        "jours_gratuits": 3,
        "jours_detention": 13,
        "prix_par_jour": 7000,
        "plaque_camion": "TR 37",
        "plaque_remorque": "R 01"
      }
    }
  ]
}
```

### Créer une Facture
```http
POST /api/facturations
Authorization: Bearer {token}
Role: admin, manager
```

### Envoyer une Facture
```http
POST /api/facturations/{id}/envoyer
Authorization: Bearer {token}
```

**Body:**
```json
{
  "email_destinataire": "client@example.com",
  "message": "Veuillez trouver ci-joint votre facture"
}
```

### Marquer comme Payée
```http
POST /api/facturations/{id}/payer
Authorization: Bearer {token}
```

**Body:**
```json
{
  "date_paiement": "2024-12-15",
  "mode_paiement": "virement",
  "reference_paiement": "VIRT123456"
}
```

### Générer PDF Facture
```http
GET /api/facturations/{id}/pdf
Authorization: Bearer {token}
```

### Statistiques Facturations
```http
GET /api/facturations/stats
Authorization: Bearer {token}
```

---

## 🏭 Base (Stockage, Double Relevage, Dépotage)

### **STOCKAGE**

#### Liste des Stockages
```http
GET /api/base/stockages?statut=stocke
Authorization: Bearer {token}
```

**Paramètres:**
- `statut` (string): `stocke`, `en_attente_sortie`, `sorti`

#### Créer un Stockage
```http
POST /api/base/stockages
Authorization: Bearer {token}
```

**Body:**
```json
{
  "sortie_conteneur_id": 5,
  "numero_conteneur": "ABCD1234567",
  "client": "ABC Trading",
  "date_arrivee": "2024-12-01",
  "camion_id": 5,
  "remorque_id": 12,
  "zone_stockage": "Zone A",
  "observations": "Conteneur frigorifique"
}
```

#### Sortie de Stockage
```http
POST /api/base/stockages/{id}/sortie
Authorization: Bearer {token}
```

**Body:**
```json
{
  "date_sortie": "2024-12-15",
  "camion_id": 5,
  "remorque_id": 12,
  "observations": "Sortie normale"
}
```

#### Statistiques Stockages
```http
GET /api/base/stockages/stats
Authorization: Bearer {token}
```

---

### **DOUBLE RELEVAGE**

#### Liste des Double Relevages
```http
GET /api/base/double-relevages?statut=en_attente
Authorization: Bearer {token}
```

#### Créer un Double Relevage
```http
POST /api/base/double-relevages
Authorization: Bearer {token}
```

**Body:**
```json
{
  "sortie_conteneur_id": 5,
  "numero_conteneur": "ABCD1234567",
  "client": "ABC Trading",
  "date_operation": "2024-12-01",
  "camion_ameneur_id": 5,
  "remorque_ameneur_id": 12,
  "camion_recuperateur_id": 7,
  "remorque_recuperateur_id": 15,
  "zone_attente": "Zone B",
  "observations": "Changement de tracteur"
}
```

#### Confirmer un Double Relevage
```http
POST /api/base/double-relevages/{id}/confirmer
Authorization: Bearer {token}
```

#### Statistiques Double Relevages
```http
GET /api/base/double-relevages/stats
Authorization: Bearer {token}
```

---

### **DÉPOTAGE**

#### Liste des Dépotages
```http
GET /api/base/depotages?statut=en_attente
Authorization: Bearer {token}
```

#### Créer un Dépotage
```http
POST /api/base/depotages
Authorization: Bearer {token}
```

**Body:**
```json
{
  "sortie_conteneur_id": 5,
  "numero_conteneur": "ABCD1234567",
  "client": "ABC Trading",
  "date_depotage": "2024-12-01",
  "camion_id": 5,
  "remorque_id": 12,
  "type_marchandise": "Électronique",
  "poids_marchandise": 15000,
  "observations": "Fragile - manipuler avec précaution"
}
```

#### Terminer un Dépotage
```http
POST /api/base/depotages/{id}/terminer
Authorization: Bearer {token}
```

#### Statistiques Dépotages
```http
GET /api/base/depotages/stats
Authorization: Bearer {token}
```

---

## 💸 Primes Chauffeur

### Liste des Primes en Attente
```http
GET /api/primes?statut_prime=en_attente
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sortie_id": 5,
      "numero_tc": "ABCD1234567",
      "chauffeur": "Jean Dupont",
      "immatriculation": "TR 37",
      "date_sortie": "2024-12-01",
      "montant_prime": 7000,
      "statut_prime": "en_attente",
      "numero_semaine": 48,
      "observations": null
    }
  ]
}
```

### Payer en Lot
```http
POST /api/primes/payer-en-lot
Authorization: Bearer {token}
Role: admin, manager
```

**Body:**
```json
{
  "sortie_ids": [1, 2, 3, 4, 5],
  "date_paiement": "2024-12-15",
  "observations": "Paiement semaine 48"
}
```

### Archives Primes
```http
GET /api/primes/archives?date_debut=2024-01-01&date_fin=2024-12-31
Authorization: Bearer {token}
```

### Statistiques Primes
```http
GET /api/primes/stats
Authorization: Bearer {token}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "primes_en_attente": 25,
    "montant_total_en_attente": 175000,
    "primes_payees_mois": 80,
    "montant_paye_mois": 560000
  }
}
```

---

## 📁 Archives

### **ARCHIVES SORTIES**

#### Recherche Archives Sorties
```http
GET /api/archives/sorties/search?query=ABCD&date_debut=2024-01-01
Authorization: Bearer {token}
```

**Paramètres:**
- `query` (string): Recherche par numéro conteneur, client, chauffeur
- `date_debut` (date)
- `date_fin` (date)
- `code_armateur` (string)
- `statut_paiement` (string): `paye`, `sans-frais`, `non-paye`

#### Détails Archive Sortie
```http
GET /api/archives/sorties/{id}
Authorization: Bearer {token}
```

#### Export PDF Archive Sortie
```http
GET /api/archives/sorties/{id}/pdf
Authorization: Bearer {token}
```

#### Statistiques Archives Sorties
```http
GET /api/archives/sorties/stats?date_debut=2024-01-01
Authorization: Bearer {token}
```

---

### **ARCHIVES OPÉRATIONS**

#### Recherche Archives Opérations
```http
GET /api/archives/operations/search?type_operation=location
Authorization: Bearer {token}
```

#### Statistiques Archives Opérations
```http
GET /api/archives/operations/stats
Authorization: Bearer {token}
```

---

### **ARCHIVES BASE**

#### Recherche Archives Base
```http
GET /api/archives/base/search?type=stockage&date_debut=2024-01-01
Authorization: Bearer {token}
```

**Paramètres:**
- `type` (string): `stockage`, `double_relevage`, `depotage`
- `date_debut` (date)
- `date_fin` (date)
- `numero_conteneur` (string)

#### Export PDF Archive Base
```http
GET /api/archives/base/{id}/pdf
Authorization: Bearer {token}
```

#### Statistiques Archives Base
```http
GET /api/archives/base/stats
Authorization: Bearer {token}
```

---

## 🔔 Notifications

### Liste des Notifications
```http
GET /api/notifications?lues=false
Authorization: Bearer {token}
```

**Paramètres:**
- `lues` (boolean): Filtrer par statut de lecture

**Réponse (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "detention_critique",
      "titre": "Détention critique",
      "message": "Le conteneur ABCD1234567 est en détention depuis 15 jours",
      "priorite": "haute",
      "lue": false,
      "created_at": "2024-12-01T10:00:00Z",
      "data": {
        "sortie_id": 5,
        "numero_conteneur": "ABCD1234567"
      }
    }
  ]
}
```

### Marquer comme Lue
```http
POST /api/notifications/{id}/lire
Authorization: Bearer {token}
```

### Marquer Toutes comme Lues
```http
POST /api/notifications/lire-toutes
Authorization: Bearer {token}
```

### Supprimer une Notification
```http
DELETE /api/notifications/{id}
Authorization: Bearer {token}
```

### Statistiques Notifications
```http
GET /api/notifications/stats
Authorization: Bearer {token}
```

---

## 📧 Emails

### Configuration Email
```http
GET /api/emails/config
Authorization: Bearer {token}
Role: admin
```

### Historique Emails
```http
GET /api/emails/historique?date_debut=2024-01-01
Authorization: Bearer {token}
Role: admin, manager
```

### Envoyer Email Test
```http
POST /api/emails/test
Authorization: Bearer {token}
Role: admin
```

**Body:**
```json
{
  "destinataire": "test@example.com",
  "sujet": "Email de test",
  "message": "Ceci est un test"
}
```

---

## 👥 Utilisateurs & Rôles

### Liste des Utilisateurs
```http
GET /api/admin/users?role=operator
Authorization: Bearer {token}
Role: admin
```

**Paramètres:**
- `role` (string): `admin`, `manager`, `operator`, `viewer`
- `actif` (boolean)

### Créer un Utilisateur
```http
POST /api/admin/users
Authorization: Bearer {token}
Role: admin
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "operator",
  "actif": true
}
```

### Modifier un Utilisateur
```http
PUT /api/admin/users/{id}
Authorization: Bearer {token}
Role: admin
```

### Liste des Rôles
```http
GET /api/admin/roles
Authorization: Bearer {token}
Role: admin
```

---

## 🔧 Système

### Health Check
```http
GET /api/health
```

**Réponse (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-01T10:00:00Z",
  "services": {
    "database": "connected",
    "cache": "operational",
    "storage": "available"
  }
}
```

### Test CORS
```http
GET /api/cors-test
```

### Logs Système
```http
GET /api/admin/logs?level=error&date=2024-12-01
Authorization: Bearer {token}
Role: admin
```

### Statistiques Système
```http
GET /api/admin/stats/system
Authorization: Bearer {token}
Role: admin
```

---

## ❌ Codes d'Erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé |
| 204 | Pas de contenu (suppression réussie) |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Non autorisé (permissions insuffisantes) |
| 404 | Ressource non trouvée |
| 422 | Erreur de validation |
| 429 | Trop de requêtes (rate limit) |
| 500 | Erreur serveur |

### Format des Réponses d'Erreur

```json
{
  "success": false,
  "message": "Message d'erreur principal",
  "errors": {
    "field_name": [
      "Message d'erreur spécifique"
    ]
  }
}
```

---

## 📝 Notes Importantes

### Authentification
- Toutes les routes protégées nécessitent un Bearer Token dans le header `Authorization`
- Format: `Authorization: Bearer {votre_token}`

### Pagination
- Par défaut: 15 éléments par page
- Maximum: 100 éléments par page
- Format réponse: `data`, `meta` (total, current_page, per_page, last_page)

### Dates
- Format: ISO 8601 (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm:ssZ`)
- Timezone: UTC

### Devises
- Toutes les montants sont en FCFA (Francs CFA)
- Format: entiers (ex: 70000 pour 70 000 FCFA)

### Filtres
- Les filtres sont cumulatifs (AND)
- Les champs vides sont ignorés
- La recherche est insensible à la casse

### Rate Limiting
- 60 requêtes par minute par IP
- 1000 requêtes par heure par utilisateur authentifié

---

## 🔄 Versions

**Version actuelle:** 1.0  
**Dernière mise à jour:** 2024-12-01

Pour toute question ou problème, consultez les logs ou contactez l'administrateur système.
