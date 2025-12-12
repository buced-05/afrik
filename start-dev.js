/**
 * Script pour démarrer le frontend et le backend en développement
 * Usage: node start-dev.js
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage de ivoire.ai en mode développement...\n');

// Démarrer le backend
console.log('📦 Démarrage du backend (port 8000)...');
const pythonCmd = process.platform === 'win32' ? 'py' : 'python3';
const backend = spawn(pythonCmd, ['-m', 'uvicorn', 'app.main:app', '--reload'], {
  cwd: path.join(__dirname, 'backend'),
  shell: true,
  stdio: 'inherit'
});

backend.on('error', (err) => {
  console.error('❌ Erreur lors du démarrage du backend:', err.message);
  console.log('\n💡 Le backend est optionnel. L\'application fonctionnera en mode offline/mock.');
  console.log('   Pour activer le backend:');
  console.log('   1. Python 3.11+ est installé');
  console.log('   2. Les dépendances sont installées: cd backend && pip install -r requirements.txt');
  console.log('   3. Vous êtes dans le bon répertoire\n');
});

// Démarrer le frontend
console.log('🌐 Démarrage du frontend (port 3000)...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  shell: true,
  stdio: 'inherit'
});

frontend.on('error', (err) => {
  console.error('❌ Erreur lors du démarrage du frontend:', err.message);
  console.log('\n💡 Assurez-vous que:');
  console.log('   1. Node.js est installé');
  console.log('   2. Les dépendances sont installées: npm install\n');
});

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n\n🛑 Arrêt des serveurs...');
  backend.kill();
  frontend.kill();
  process.exit();
});

console.log('\n✅ Les serveurs sont en cours de démarrage...');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:8000');
console.log('\n   Appuyez sur Ctrl+C pour arrêter\n');

