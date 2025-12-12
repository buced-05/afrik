# 🚀 Guide de Démarrage Rapide

## Démarrage Simple

### Option 1 : Script PowerShell (Windows - Recommandé)
```powershell
.\start-app.ps1
```

### Option 2 : Commande npm
```bash
npm run app
# ou
npm run dev:all
```

### Option 3 : Frontend uniquement
```bash
npm run dev
```

## 📋 Ce que fait le script automatiquement

✅ Vérifie et installe les dépendances npm si nécessaire  
✅ Vérifie et installe @tensorflow/tfjs si manquant  
✅ Détecte si le backend est disponible  
✅ Démarre le frontend (toujours)  
✅ Démarre le backend (si disponible)  

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000 (si disponible)
- **Documentation API**: http://localhost:8000/docs

## ⚠️ Notes

- Le backend est **optionnel**. L'application fonctionne en mode mock/offline sans backend.
- Si le backend n'est pas disponible, l'application basculera automatiquement en mode offline.
- Pour installer le backend, voir `backend/README_SETUP.md`

## 🛑 Arrêter l'application

Appuyez sur `Ctrl+C` dans le terminal pour arrêter tous les serveurs.

