@echo off
REM Script de démarrage du backend ivoire.ai (Windows)

echo 🌱 Démarrage du backend ivoire.ai...

REM Vérifier si l'environnement virtuel existe
if not exist "venv" (
    echo 📦 Création de l'environnement virtuel...
    python -m venv venv
)

REM Activer l'environnement virtuel
echo 🔌 Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

REM Installer les dépendances si nécessaire
if not exist "venv\.dependencies_installed" (
    echo 📥 Installation des dépendances...
    pip install -r requirements.txt
    type nul > venv\.dependencies_installed
)

REM Vérifier si le fichier .env existe
if not exist ".env" (
    echo ⚠️  Fichier .env non trouvé. Copie de .env.example...
    if exist ".env.example" (
        copy .env.example .env
        echo ✅ Fichier .env créé. Veuillez le configurer avant de continuer.
    ) else (
        echo ❌ Fichier .env.example non trouvé.
    )
)

REM Créer les dossiers nécessaires
if not exist "models" mkdir models
if not exist "data" mkdir data

REM Démarrer l'API
echo 🚀 Démarrage de l'API FastAPI...
echo 📍 API disponible sur http://localhost:8000
echo 📚 Documentation: http://localhost:8000/docs
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

echo.
echo ========================================
echo  API ivoire.ai - Serveur de demarrage
echo ========================================
echo.
echo Configuration:
echo - Groq (LLM): Configure
echo - TensorFlow: Pret
echo - Port: 8000
echo.
echo Endpoints:
echo - API: http://localhost:8000
echo - Docs: http://localhost:8000/docs
echo - Health: http://localhost:8000/api/health
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
python -m python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

