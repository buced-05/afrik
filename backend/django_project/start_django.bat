@echo off
REM Script de démarrage Django Admin pour Windows

echo 🌱 Démarrage de Django Admin pour ivoire.ai...

REM Vérifier si l'environnement virtuel existe
if not exist "..\venv" (
    echo ❌ Environnement virtuel non trouvé. Veuillez d'abord créer l'environnement dans le dossier backend.
    echo Exécutez: cd .. && python -m venv venv
    pause
    exit /b 1
)

REM Activer l'environnement virtuel
echo 🔌 Activation de l'environnement virtuel...
call ..\venv\Scripts\activate.bat

REM Installer Django si nécessaire
echo 📦 Vérification de Django...
pip show django >nul 2>&1
if errorlevel 1 (
    echo 📥 Installation de Django...
    pip install -r requirements.txt
)

REM Créer les migrations si nécessaire
echo 🔄 Vérification des migrations...
python manage.py makemigrations --noinput
python manage.py migrate --noinput

REM Créer un superutilisateur si aucun n'existe
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@ivoire.ai', 'admin')"

REM Démarrer le serveur
echo.
echo ✅ Django Admin est prêt!
echo 📍 Admin disponible sur http://localhost:8001/admin
echo 👤 Nom d'utilisateur: admin
echo 🔑 Mot de passe: admin
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

python manage.py runserver 8001

