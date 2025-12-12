# Script de démarrage complet pour ivoire.ai
# Usage: .\start-app.ps1

Write-Host "🌱 Démarrage de ivoire.ai..." -ForegroundColor Green
Write-Host ""

# Vérifier si on est dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet." -ForegroundColor Red
    exit 1
}

# Vérifier et installer les dépendances npm
Write-Host "📦 Vérification des dépendances npm..." -ForegroundColor Cyan
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installation des dépendances npm..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation npm" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ✓ Dépendances npm déjà installées" -ForegroundColor Green
}

# Vérifier si TensorFlow.js est installé
$tfjsInstalled = npm list @tensorflow/tfjs 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Installation de @tensorflow/tfjs..." -ForegroundColor Yellow
    npm install @tensorflow/tfjs
}

Write-Host ""

# Vérifier le backend (optionnel)
$backendAvailable = $false
if (Test-Path "backend\app\main.py") {
    Write-Host "🔍 Vérification du backend..." -ForegroundColor Cyan
    
    # Vérifier si Python est disponible
    $pythonCmd = $null
    if (Get-Command python -ErrorAction SilentlyContinue) {
        $pythonCmd = "python"
    } elseif (Get-Command py -ErrorAction SilentlyContinue) {
        $pythonCmd = "py"
    }
    
    if ($pythonCmd) {
        Write-Host "   ✓ Python trouvé" -ForegroundColor Green
        
        # Vérifier si l'environnement virtuel existe
        if (Test-Path "backend\venv") {
            Write-Host "   ✓ Environnement virtuel trouvé" -ForegroundColor Green
            $backendAvailable = $true
        } else {
            Write-Host "   ⚠️  Environnement virtuel non trouvé (backend optionnel)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  Python non trouvé (backend optionnel)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🚀 Démarrage de l'application..." -ForegroundColor Green
Write-Host ""

# Démarrer le frontend
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📚 Backend:  http://localhost:8000 (si disponible)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Yellow
Write-Host ""

# Démarrer avec npm run dev:all si disponible, sinon juste dev
if ($backendAvailable) {
    Write-Host "Démarrage du frontend et du backend..." -ForegroundColor Cyan
    npm run dev:all
} else {
    Write-Host "Démarrage du frontend uniquement (mode offline/mock)..." -ForegroundColor Cyan
    npm run dev
}

