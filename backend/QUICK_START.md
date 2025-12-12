# 🚀 Démarrage Rapide - API ivoire.ai

## ✅ Configuration terminée

- ✅ Groq installé et configuré
- ✅ Clé API Groq dans `.env`
- ✅ Service LLM prêt avec `llama-3.1-70b-versatile`
- ✅ TensorFlow configuré pour l'apprentissage
- ✅ Uvicorn installé

## 🎯 Démarrer l'API

### Option 1: Utiliser le script (Recommandé)
```bash
cd backend
.\start.bat
```

### Option 2: Commande directe
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📍 URLs

Une fois démarré, l'API sera disponible sur :

- **API**: http://localhost:8000
- **Documentation interactive**: http://localhost:8000/docs
- **Health check**: http://localhost:8000/api/health

## 🧪 Tester rapidement

Dans un nouveau terminal :

```powershell
# Vérifier que le serveur fonctionne
Invoke-WebRequest http://localhost:8000/api/health

# Voir la documentation
Start-Process http://localhost:8000/docs
```

## 📚 Architecture

```
Frontend (Next.js) → API FastAPI → Groq (Llama) + TensorFlow
     ↓                    ↓
  Port 3000          Port 8000
```

## 🔧 Services

1. **Groq + Llama** : Génération d'informations médicinales
2. **TensorFlow** : Reconnaissance d'images de plantes
3. **FastAPI** : Serveur API REST

Tout est prêt ! Lancez `.\start.bat` pour démarrer l'API.

