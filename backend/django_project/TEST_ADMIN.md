# Guide de Test du Panel Admin

## 🚀 Démarrage Rapide

### Option 1 : Script Batch (Windows)
```bash
cd backend\django_project
start_django.bat
```

### Option 2 : Script PowerShell
```powershell
cd backend\django_project
.\start_admin.ps1
```

### Option 3 : Manuel
```bash
# 1. Activer l'environnement virtuel
cd backend
venv\Scripts\activate

# 2. Aller dans le dossier django_project
cd django_project

# 3. Installer les dépendances (si nécessaire)
pip install -r requirements.txt

# 4. Créer les migrations
python manage.py makemigrations
python manage.py migrate

# 5. Créer un superutilisateur (si nécessaire)
python manage.py createsuperuser
# Utilisateur: admin
# Email: admin@ivoire.ai
# Mot de passe: admin

# 6. Lancer le serveur
python manage.py runserver 8001
```

## 📍 Accès au Panel Admin

Une fois le serveur démarré, accédez à :
- **URL**: http://localhost:8001/admin
- **Utilisateur**: `admin`
- **Mot de passe**: `admin`

⚠️ **Important**: Changez le mot de passe après la première connexion !

## 🧪 Tests à Effectuer

### 1. Connexion
- [ ] Se connecter avec admin/admin
- [ ] Vérifier que la page d'accueil s'affiche correctement
- [ ] Vérifier le titre "ivoire.ai Administration"

### 2. Gestion des Plantes
- [ ] Accéder à la section "Plantes"
- [ ] Créer une nouvelle plante
- [ ] Modifier une plante existante
- [ ] Vérifier l'aperçu des images
- [ ] Tester la recherche par nom scientifique
- [ ] Tester les filtres (type, famille, actif/inactif)
- [ ] Vérifier les propriétés médicinales
- [ ] Vérifier les usages traditionnels

### 3. Gestion des Feedbacks
- [ ] Accéder à la section "Feedbacks"
- [ ] Voir la liste des feedbacks
- [ ] Tester les filtres (statut, type, date)
- [ ] Approuver un feedback (action en masse)
- [ ] Rejeter un feedback (action en masse)
- [ ] Marquer comme utilisé (action en masse)
- [ ] Vérifier l'aperçu des images de feedback
- [ ] Tester la recherche

### 4. Fonctionnalités Avancées
- [ ] Vérifier les relations entre plantes et feedbacks
- [ ] Tester les champs en lecture seule (timestamp, hash)
- [ ] Vérifier les champsets (sections repliables)
- [ ] Tester les actions en masse
- [ ] Vérifier les métadonnées (créé le, modifié le)

## 📊 Structure des Données

### Modèle Plant
- Identifiant unique (plant_id)
- Informations botaniques (nom scientifique, nom commun, famille, etc.)
- Type de plante (arbre, arbuste, herbe, liane)
- Parties utilisées
- Images (JSON)
- Statut actif/inactif

### Modèle PredictionFeedback
- Informations utilisateur (session, user)
- Prédiction originale (plante, confiance, alternatives)
- Feedback (type, note, correction, commentaire)
- Statut (pending, approved, rejected, used)
- Curation (curateur, notes, date)

## 🔧 Commandes Utiles

### Créer un superutilisateur
```bash
python manage.py createsuperuser
```

### Créer des migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Accéder au shell Django
```bash
python manage.py shell
```

### Vider la base de données
```bash
python manage.py flush
```

## 🐛 Dépannage

### Le serveur ne démarre pas
1. Vérifier que l'environnement virtuel est activé
2. Vérifier que Django est installé : `pip list | findstr django`
3. Vérifier les migrations : `python manage.py showmigrations`

### Erreur de connexion à la base de données
- Vérifier que `db.sqlite3` existe dans `backend/django_project/`
- Si absent, exécuter : `python manage.py migrate`

### Erreur "No module named 'plants'" ou 'feedback'"
- Vérifier que les applications sont dans `INSTALLED_APPS` dans `settings.py`
- Vérifier que les dossiers `plants/` et `feedback/` contiennent `__init__.py`

### Port 8001 déjà utilisé
- Changer le port dans `runserver 8001` (ex: `runserver 8002`)
- Ou arrêter le processus utilisant le port 8001

## 📝 Notes

- La base de données SQLite est créée automatiquement au premier `migrate`
- Les images sont stockées dans `MEDIA_ROOT` (configuré dans settings.py)
- Le panel admin est en français (LANGUAGE_CODE = 'fr-fr')
- Le timezone est configuré pour l'Afrique de l'Ouest (Africa/Abidjan)

