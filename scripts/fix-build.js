/**
 * Script pour nettoyer et reconstruire l'application Next.js
 * Usage: node scripts/fix-build.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Nettoyage du cache Next.js...\n');

// Dossiers à nettoyer
const dirsToClean = [
  '.next',
  'node_modules/.cache',
  '.turbo'
];

dirsToClean.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`   Suppression de ${dir}...`);
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`   ✓ ${dir} supprimé`);
    } catch (err) {
      console.error(`   ✗ Erreur lors de la suppression de ${dir}:`, err.message);
    }
  } else {
    console.log(`   - ${dir} n'existe pas`);
  }
});

console.log('\n📦 Réinstallation des dépendances...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✓ Dépendances réinstallées\n');
} catch (err) {
  console.error('✗ Erreur lors de la réinstallation:', err.message);
  process.exit(1);
}

console.log('🔨 Reconstruction de l\'application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✅ Application reconstruite avec succès!');
  console.log('   Lancez "npm run dev" pour démarrer en mode développement');
} catch (err) {
  console.error('\n✗ Erreur lors de la reconstruction:', err.message);
  console.log('\n💡 Essayez de lancer "npm run dev" directement');
  process.exit(1);
}

