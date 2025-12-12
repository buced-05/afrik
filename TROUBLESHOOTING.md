# Guide de Dépannage - ivoire.ai

## ❌ ERR_CONNECTION_REFUSED

### Symptôme
```
ERR_CONNECTION_REFUSED
localhost a refusé de se connecter
```

### Causes possibles

1. **Le backend n'est pas lancé**
2. **Le backend est lancé sur un autre port**
3. **Problème de firewall/antivirus**

### Solutions

#### Solution 1 : Démarrer le backend

**Option A : Script automatique (recommandé)**
```bash
npm run dev:all
```

**Option B : Manuellement**

Terminal 1 - Backend :
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Terminal 2 - Frontend :
```bash
npm run dev
```

#### Solution 2 : Vérifier que le backend fonctionne

Ouvrez dans votre navigateur : `http://localhost:8000/api/health`

Vous devriez voir :
```json
{
  "status": "healthy",
  "services": {
    "vision": "ready",
    "llm": "ready"
  }
}
```

#### Solution 3 : Utiliser le mode offline (sans backend)

L'application fonctionne en mode mock même sans backend. Si le backend n'est pas disponible, elle basculera automatiquement vers le mode offline.

Pour forcer le mode offline, modifiez `.env.local` :
```env
NEXT_PUBLIC_API_URL=
```

## 🔧 Autres Problèmes

### Backend ne démarre pas

**Erreur : "Module not found"**
```bash
cd backend
pip install -r requirements.txt
```

**Erreur : "Port already in use"**
```bash
# Trouver le processus utilisant le port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill
```

**Erreur : "Python not found"**
- Vérifier que Python 3.11+ est installé : `python --version`
- Sur Windows, essayer `py` au lieu de `python`

### Frontend ne démarre pas

**Erreur : "Module not found"**
```bash
npm install
```

**Erreur : "Port 3000 already in use"**
```bash
# Changer le port
npm run dev -- -p 3001
```

### L'identification ne fonctionne pas

**Mode mock activé automatiquement**
- Si le backend n'est pas disponible, l'application utilise le mode mock
- Les résultats sont aléatoires mais l'interface fonctionne

**Vérifier les logs**
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs dans les logs

### CORS Error

Si vous voyez une erreur CORS, vérifiez que :
1. Le backend est bien lancé
2. `FRONTEND_URL` dans `backend/.env` correspond à l'URL du frontend
3. Les origines CORS dans `backend/app/main.py` incluent votre URL

## 🐛 Debug

### Vérifier les services

**Backend :**
```bash
curl http://localhost:8000/api/health
```

**Frontend :**
```bash
curl http://localhost:3000
```

### Logs

**Backend :** Les logs apparaissent dans le terminal où vous avez lancé uvicorn

**Frontend :** Ouvrez la console du navigateur (F12 → Console)

### Variables d'environnement

Vérifiez que les variables sont bien définies :

**Frontend** (`.env.local`) :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** (`backend/.env`) :
```env
FRONTEND_URL=http://localhost:3000
MODEL_PATH=models/plant_recognition_model.h5
PLANT_DB_PATH=data/plants_database.json
```

## 📞 Aide Supplémentaire

1. Vérifiez que tous les ports sont libres
2. Vérifiez votre firewall/antivirus
3. Vérifiez les logs d'erreur dans la console
4. Essayez de redémarrer les serveurs

## ✅ Checklist de Démarrage

- [ ] Python 3.11+ installé
- [ ] Node.js installé
- [ ] Dépendances backend installées (`pip install -r requirements.txt`)
- [ ] Dépendances frontend installées (`npm install`)
- [ ] Backend lancé sur port 8000
- [ ] Frontend lancé sur port 3000
- [ ] Pas d'erreurs dans les logs

