@echo off
chcp 65001 >nul
echo Configuration Git pour GitHub...

REM Initialiser Git si nécessaire
if not exist ".git" (
    echo Initialisation du dépôt Git...
    git init
)

REM Vérifier et configurer le remote
git remote remove origin 2>nul
git remote add origin https://github.com/buced-05/afrik.git

echo.
echo Remote configuré:
git remote -v

echo.
echo Statut Git:
git status --short

echo.
echo ========================================
echo Prochaines étapes:
echo ========================================
echo 1. Ajouter tous les fichiers: git add .
echo 2. Faire un commit: git commit -m "Initial commit"
echo 3. Renommer la branche: git branch -M main
echo 4. Pousser vers GitHub: git push -u origin main
echo ========================================

pause

