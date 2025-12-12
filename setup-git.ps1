# Script pour configurer Git et pousser vers GitHub
$ErrorActionPreference = "Stop"

# Définir le répertoire de travail
$projectPath = $PSScriptRoot

Write-Host "Répertoire du projet: $projectPath"

# Vérifier si git est initialisé
if (-not (Test-Path "$projectPath\.git")) {
    Write-Host "Initialisation du dépôt Git..."
    Set-Location $projectPath
    git init
}

# Vérifier si le remote existe déjà
$remoteExists = git -C $projectPath remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Ajout du remote GitHub..."
    git -C $projectPath remote add origin https://github.com/buced-05/afrik.git
} else {
    Write-Host "Le remote existe déjà: $remoteExists"
    Write-Host "Mise à jour du remote..."
    git -C $projectPath remote set-url origin https://github.com/buced-05/afrik.git
}

# Vérifier le statut
Write-Host "`nStatut Git:"
git -C $projectPath status --short

Write-Host "`nRemote configuré:"
git -C $projectPath remote -v

Write-Host "`nPour ajouter tous les fichiers et faire un commit:"
Write-Host "  git add ."
Write-Host "  git commit -m 'Initial commit'"
Write-Host "  git branch -M main"
Write-Host "  git push -u origin main"

