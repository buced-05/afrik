# Script PowerShell pour nettoyer le cache Next.js
# Usage: .\scripts\clean-cache.ps1

Write-Host "🧹 Nettoyage du cache Next.js..." -ForegroundColor Cyan
Write-Host ""

$dirsToClean = @(
    ".next",
    "node_modules\.cache",
    ".turbo"
)

foreach ($dir in $dirsToClean) {
    $fullPath = Join-Path $PSScriptRoot "..\$dir"
    if (Test-Path $fullPath) {
        Write-Host "   Suppression de $dir..." -ForegroundColor Yellow
        try {
            Remove-Item -Path $fullPath -Recurse -Force -ErrorAction Stop
            Write-Host "   ✓ $dir supprimé" -ForegroundColor Green
        } catch {
            Write-Host "   ✗ Erreur lors de la suppression de $dir : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "   - $dir n'existe pas" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ Nettoyage terminé!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Pour reconstruire l'application:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White

