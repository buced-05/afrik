# Django Admin pour ivoire.ai

Interface d'administration Django pour gérer les plantes et les feedbacks de l'application ivoire.ai.

## Installation

### Windows
```bash
cd backend/django_project
start_django.bat
```

### Linux/Mac
```bash
cd backend/django_project
chmod +x start_django.sh
./start_django.sh
```

## Accès à l'admin

Une fois le serveur démarré, accédez à:
- **URL**: http://localhost:8001/admin
- **Utilisateur**: admin
- **Mot de passe**: admin

⚠️ **Important**: Changez le mot de passe après la première connexion!

## Fonctionnalités

### Gestion des Plantes
- Ajouter/modifier/supprimer des plantes
- Gérer les propriétés médicinales
- Gérer les usages traditionnels
- Visualiser les images des plantes

### Gestion des Feedbacks
- Voir tous les feedbacks utilisateurs
- Approuver/rejeter les feedbacks
- Marquer les feedbacks comme utilisés dans l'entraînement
- Filtrer par statut, type, plante, etc.

## Créer un superutilisateur

Si vous voulez créer un autre superutilisateur:

```bash
python manage.py createsuperuser
```

## Migrations

Pour créer de nouvelles migrations après modification des modèles:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Structure

- `plants/`: Application pour gérer les plantes
- `feedback/`: Application pour gérer les feedbacks
- `django_project/`: Configuration Django

