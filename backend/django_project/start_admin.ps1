# Script PowerShell pour démarrer Django Admin
$ErrorActionPreference = "Stop"

Write-Host "🌱 Démarrage de Django Admin pour ivoire.ai..." -ForegroundColor Green

# Chemin vers l'environnement virtuel
$venvPath = Join-Path $PSScriptRoot "..\venv"
$activateScript = Join-Path $venvPath "Scripts\Activate.ps1"

# Vérifier si l'environnement virtuel existe
if (-not (Test-Path $activateScript)) {
    Write-Host "❌ Environnement virtuel non trouvé." -ForegroundColor Red
    Write-Host "Exécutez: cd backend && python -m venv venv" -ForegroundColor Yellow
    exit 1
}

# Activer l'environnement virtuel
Write-Host "🔌 Activation de l'environnement virtuel..." -ForegroundColor Cyan
& $activateScript

# Installer Django si nécessaire
Write-Host "📦 Vérification de Django..." -ForegroundColor Cyan
$djangoInstalled = python -c "import django" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📥 Installation de Django..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

# Créer les migrations
Write-Host "🔄 Vérification des migrations..." -ForegroundColor Cyan
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Créer un superutilisateur si aucun n'existe
Write-Host "👤 Vérification du superutilisateur..." -ForegroundColor Cyan
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@ivoire.ai', 'admin')"

# Démarrer le serveur
Write-Host ""
Write-Host "✅ Django Admin est prêt!" -ForegroundColor Green
Write-Host "📍 Admin disponible sur http://localhost:8001/admin" -ForegroundColor Cyan
Write-Host "👤 Nom d'utilisateur: admin" -ForegroundColor Yellow
Write-Host "🔑 Mot de passe: admin" -ForegroundColor Yellow
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Gray
Write-Host ""

python manage.py runserver 8001

