# 🔐 Créer un Superutilisateur Django

## Méthode 1 : Commande automatique (déjà fait)

Le superutilisateur a été créé automatiquement avec :
- **Nom d'utilisateur** : `admin`
- **Email** : `admin@ivoire.ai`
- **Mot de passe** : `admin`

## Méthode 2 : Commande interactive

Si vous voulez créer un autre superutilisateur :

```bash
cd backend\django_project
call ..\venv\Scripts\activate.bat
python manage.py createsuperuser
```

## Méthode 3 : Script Python

```bash
cd backend\django_project
call ..\venv\Scripts\activate.bat
python manage.py shell
```

Puis dans le shell Python :
```python
from django.contrib.auth.models import User
User.objects.create_superuser('admin', 'admin@ivoire.ai', 'admin')
exit()
```

## Méthode 4 : Réinitialiser le mot de passe

Si vous avez oublié le mot de passe :

```bash
cd backend\django_project
call ..\venv\Scripts\activate.bat
python manage.py changepassword admin
```

## Informations de connexion actuelles

- **URL** : http://localhost:8001/admin
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin`

⚠️ **Important** : Changez le mot de passe après la première connexion pour des raisons de sécurité !

