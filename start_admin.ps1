# Script PowerShell pour démarrer Django Admin
# Utilise le chemin du script pour éviter les problèmes d'encodage

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$djangoPath = Join-Path $scriptPath "backend\django_project"
$venvPath = Join-Path $scriptPath "backend\venv"
$pythonExe = Join-Path $venvPath "Scripts\python.exe"

Write-Host "🌱 Démarrage de Django Admin pour ivoire.ai..." -ForegroundColor Green

# Vérifier que les chemins existent
if (-not (Test-Path $djangoPath)) {
    Write-Host "❌ Dossier django_project non trouvé: $djangoPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $pythonExe)) {
    Write-Host "❌ Python non trouvé dans l'environnement virtuel: $pythonExe" -ForegroundColor Red
    Write-Host "💡 Créez l'environnement virtuel: cd backend && python -m venv venv" -ForegroundColor Yellow
    exit 1
}

# Aller dans le dossier django_project
Set-Location $djangoPath

# Vérifier Django
Write-Host "📦 Vérification de Django..." -ForegroundColor Cyan
& $pythonExe -c "import django; print(django.get_version())" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📥 Installation de Django..." -ForegroundColor Yellow
    $requirements = Join-Path $djangoPath "requirements.txt"
    & $pythonExe -m pip install -r $requirements
}

# Créer les migrations si nécessaire
Write-Host "🔄 Vérification des migrations..." -ForegroundColor Cyan
& $pythonExe manage.py makemigrations --noinput 2>&1 | Out-Null
& $pythonExe manage.py migrate --noinput 2>&1 | Out-Null

# Créer le superutilisateur si nécessaire
Write-Host "👤 Vérification du superutilisateur..." -ForegroundColor Cyan
$createUser = @"
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@ivoire.ai', 'admin')
    print('✅ Superutilisateur créé')
else:
    print('ℹ️  Superutilisateur existe déjà')
"@
& $pythonExe manage.py shell -c $createUser 2>&1 | Out-Null

# Démarrer le serveur
Write-Host ""
Write-Host "✅ Django Admin est prêt!" -ForegroundColor Green
Write-Host "📍 Admin disponible sur http://localhost:8001/admin" -ForegroundColor Cyan
Write-Host "👤 Nom d'utilisateur: admin" -ForegroundColor Yellow
Write-Host "🔑 Mot de passe: admin" -ForegroundColor Yellow
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Gray
Write-Host ""

& $pythonExe manage.py runserver 8001

