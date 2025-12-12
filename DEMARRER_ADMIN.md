# 🚀 Guide de Démarrage du Panel Admin

## ⚡ Démarrage Rapide

### Option 1 : Script Batch (CMD - Recommandé)
Ouvrez **CMD** (Invite de commandes) et exécutez :
```cmd
cd backend\django_project
.\start_django.bat
```

### Option 2 : Script PowerShell
Dans PowerShell, exécutez :
```powershell
cd backend\django_project
.\start_django.bat
```
**Note** : Si vous obtenez une erreur, utilisez `cmd /c start_django.bat`

### Option 3 : Depuis la racine du projet
```powershell
.\start_admin.ps1
```

### Option 4 : Manuel (si les scripts ne fonctionnent pas)
```cmd
REM 1. Aller dans le dossier django_project
cd backend\django_project

REM 2. Activer l'environnement virtuel
call ..\venv\Scripts\activate.bat

REM 3. Créer les migrations (si nécessaire)
python manage.py makemigrations
python manage.py migrate

REM 4. Créer le superutilisateur (si nécessaire)
python manage.py createsuperuser
REM Utilisateur: admin
REM Email: admin@ivoire.ai
REM Mot de passe: admin

REM 5. Lancer le serveur
python manage.py runserver 8001
```

## 📍 Accès au Panel

Une fois le serveur démarré, ouvrez votre navigateur :
- **URL** : http://localhost:8001/admin
- **Utilisateur** : `admin`
- **Mot de passe** : `admin`

⚠️ **Important** : Changez le mot de passe après la première connexion !

## 🧪 Tests à Effectuer

### 1. Connexion
- [ ] Se connecter avec `admin` / `admin`
- [ ] Vérifier l'affichage du tableau de bord

### 2. Gestion des Plantes
- [ ] Cliquer sur "Plantes" dans le menu
- [ ] Créer une nouvelle plante
- [ ] Modifier une plante existante
- [ ] Tester la recherche
- [ ] Tester les filtres (type, famille, actif/inactif)
- [ ] Vérifier l'aperçu des images

### 3. Gestion des Feedbacks
- [ ] Cliquer sur "Prediction feedbacks"
- [ ] Voir la liste des feedbacks
- [ ] Tester les filtres (statut, type, date)
- [ ] Sélectionner plusieurs feedbacks
- [ ] Utiliser les actions en masse :
  - Approuver les feedbacks sélectionnés
  - Rejeter les feedbacks sélectionnés
  - Marquer comme utilisé

### 4. Propriétés Médicinales
- [ ] Accéder à "Medicinal properties"
- [ ] Créer une propriété médicinale
- [ ] Lier à une plante

### 5. Usages Traditionnels
- [ ] Accéder à "Traditional uses"
- [ ] Créer un usage traditionnel
- [ ] Lier à une plante

## 🔧 Dépannage

### Erreur : "The term 'start_django.bat' is not recognized"
**Solution** : Utilisez `.\start_django.bat` avec le point et la barre oblique

### Erreur : "Cannot find path"
**Solution** : Assurez-vous d'être dans le bon répertoire :
```cmd
cd backend\django_project
dir
REM Vous devriez voir manage.py
```

### Erreur : "No module named 'django'"
**Solution** : Activez l'environnement virtuel :
```cmd
cd backend
venv\Scripts\activate.bat
pip install -r django_project\requirements.txt
```

### Port 8001 déjà utilisé
**Solution** : Changez le port :
```cmd
python manage.py runserver 8002
```

### Erreur de migration
**Solution** : Réinitialisez les migrations :
```cmd
python manage.py makemigrations
python manage.py migrate
```

## 📊 Structure du Panel

Le panel admin contient :
- **Plantes** : Gestion complète des plantes médicinales
- **Medicinal Properties** : Propriétés médicinales des plantes
- **Traditional Uses** : Usages traditionnels
- **Prediction Feedbacks** : Feedbacks des utilisateurs sur les prédictions

## 💡 Astuces

1. **Recherche rapide** : Utilisez la barre de recherche en haut de chaque liste
2. **Filtres** : Utilisez les filtres à droite pour affiner les résultats
3. **Actions en masse** : Sélectionnez plusieurs éléments et utilisez les actions en bas
4. **Aperçu** : Les images s'affichent automatiquement dans les formulaires

## 📝 Notes

- La base de données SQLite est dans `backend/django_project/db.sqlite3`
- Les migrations sont automatiques au démarrage
- Le superutilisateur est créé automatiquement s'il n'existe pas
- Le panel est en français (LANGUAGE_CODE = 'fr-fr')

