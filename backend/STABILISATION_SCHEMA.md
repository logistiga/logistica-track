# Guide de Stabilisation du Schéma de Base de Données

## ⚠️ IMPORTANT - Action Requise

Les migrations de stabilisation du schéma ont été créées mais **doivent être exécutées** pour que l'application fonctionne correctement.

## 🚀 Étapes d'Exécution

### 1. Arrêter le serveur Laravel (si en cours d'exécution)
```bash
# Arrêter avec Ctrl+C si vous utilisez php artisan serve
```

### 2. Exécuter les migrations
```bash
cd backend
php artisan migrate
```

### 3. Vérifier que les migrations ont réussi
```bash
php artisan migrate:status
```

Vous devriez voir ces nouvelles migrations avec le statut "Ran":
- `2025_12_01_000001_add_vehicule_management_columns`
- `2025_12_01_000002_fix_operations_columns`
- `2025_12_01_000003_add_detention_archive_columns`
- `2025_12_01_000004_update_vehicule_service`

### 4. Nettoyer tous les caches
```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan optimize:clear
```

### 5. Redémarrer le serveur Laravel
```bash
php artisan serve
```

## 📋 Modifications Apportées

### Table `vehicules`
**Nouvelles colonnes ajoutées:**
- `statut` (enum: 'disponible', 'en_mission', 'maintenance') - Statut actuel du véhicule
- `prochaine_revision` (date, nullable) - Date de la prochaine révision
- `derniere_revision` (date, nullable) - Date de la dernière révision
- `kilometrage` (integer) - Kilométrage actuel

### Table `operations`
**Nouvelles colonnes ajoutées:**
- `date_debut_execution` (datetime, nullable) - Date réelle de début d'exécution
- `date_fin_execution` (datetime, nullable) - Date réelle de fin d'exécution

**Données migrées:**
- Les valeurs de `statut` avec tirets ont été converties en underscores
  - `en-attente` → `en_attente`
  - `en-cours` → `en_cours`

### Table `detentions`
**Nouvelles colonnes ajoutées:**
- `jours_bat` (integer) - Jours BAT
- `jours_realises` (integer) - Jours réalisés
- `numero_facture` (string, nullable) - Numéro de facture associée
- `jours_client` (integer) - Jours à facturer au client
- `jours_logistiga` (integer) - Jours à la charge de Logistiga

### Mise à jour automatique des véhicules
Tous les véhicules existants sont automatiquement mis à jour:
- Véhicules actifs (`actif=true`) → `statut='disponible'`
- Véhicules inactifs (`actif=false`) → `statut='maintenance'`

## 🔍 Vérification Post-Migration

Après avoir exécuté les migrations, vérifiez que:

1. **Le Dashboard fonctionne** - Accédez à `/` et vérifiez qu'il n'y a pas d'erreurs 500
2. **Les statistiques des véhicules s'affichent** - Vérifiez les stats disponibles/en mission/maintenance
3. **La page Matériel fonctionne** - Accédez à `/materiel` et testez les opérations CRUD
4. **Les détentions s'affichent** - Accédez à `/detention` et vérifiez les archives

## 🐛 Dépannage

### Erreur: "Column not found: statut"
➡️ Les migrations n'ont pas été exécutées. Retournez à l'étape 2.

### Erreur: "Migration already ran"
➡️ Les migrations ont déjà été exécutées. Passez à l'étape 4 (nettoyage des caches).

### Le Dashboard affiche toujours des erreurs après migration
➡️ Exécutez le nettoyage complet des caches (étape 4) et redémarrez le serveur (étape 5).

### Erreur: "SQLSTATE[42000]: Syntax error"
➡️ Vérifiez que vous utilisez MySQL/MariaDB compatible. Les types ENUM sont requis.

## 📊 État du Schéma Avant/Après

### AVANT (Colonnes Manquantes)
```
vehicules: id, numero_parc, immatriculation, type, actif
operations: pas de date_debut_execution, date_fin_execution
detentions: colonnes archive manquantes
```

### APRÈS (Schéma Complet)
```
vehicules: + statut, prochaine_revision, derniere_revision, kilometrage
operations: + date_debut_execution, date_fin_execution
detentions: + jours_bat, jours_realises, numero_facture, jours_client, jours_logistiga
```

## 🎯 Prochaines Étapes Recommandées

Après stabilisation:
1. ✅ Tester tous les modules (Dashboard, Matériel, Détentions, Archives)
2. ✅ Vérifier les rapports PDF
3. ✅ Tester la création de nouvelles opérations
4. ✅ Valider les calculs de détention
5. 📝 Créer des tests unitaires pour valider la stabilité

## 📞 Support

Si vous rencontrez des problèmes après avoir suivi ce guide:
1. Vérifiez les logs Laravel: `backend/storage/logs/laravel.log`
2. Vérifiez les logs du serveur web
3. Consultez la documentation Laravel sur les migrations

---

**Date de création:** 2025-12-01  
**Version:** 1.0  
**Statut:** ⚠️ Action Requise - Migrations non exécutées
