# Guide de Démarrage Rapide - ivoire.ai

Ce guide vous permet de démarrer rapidement avec ivoire.ai.

## 🚀 Démarrage Rapide (Mode Développement)

### Option 1 : Démarrage Automatique (Recommandé) ⚡

```bash
# Installer les dépendances frontend
npm install

# Installer les dépendances backend
npm run backend:install
# OU manuellement:
# cd backend && pip install -r requirements.txt

# Démarrer les deux serveurs en même temps
npm run dev:all
```

Cette commande démarre automatiquement :
- ✅ Backend sur `http://localhost:8000`
- ✅ Frontend sur `http://localhost:3000`

### Option 2 : Démarrage Manuel

#### 1. Frontend (Next.js)

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

#### 2. Backend (FastAPI)

**Dans un nouveau terminal :**

```bash
# Aller dans le dossier backend
cd backend

# Créer un environnement virtuel (première fois seulement)
python -m venv venv

# Activer l'environnement
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances (première fois seulement)
pip install -r requirements.txt

# Créer le fichier .env (première fois seulement)
cp .env.example .env
# Éditer .env et ajouter votre OPENAI_API_KEY si vous voulez utiliser le LLM

# Lancer l'API
python -m uvicorn app.main:app --reload
# OU utiliser la commande npm depuis la racine:
# npm run backend
```

Le backend sera accessible sur `http://localhost:8000`

> 💡 **Note** : Si le backend n'est pas disponible, l'application fonctionnera en mode mock (offline) automatiquement.

### 3. Tester l'API

```bash
# Vérifier que l'API fonctionne
curl http://localhost:8000/api/health

# Tester l'identification (remplacez image.jpg par votre image)
curl -X POST "http://localhost:8000/api/identify" \
  -F "file=@image.jpg" \
  -F "user_intent=medecine"
```

## 📦 Déploiement avec Docker

### Backend

```bash
cd backend
docker-compose up -d
```

### Frontend

```bash
# Build
npm run build

# Avec Docker (créer un Dockerfile pour Next.js)
docker build -t ivoire-ai-frontend .
docker run -p 3000:3000 ivoire-ai-frontend
```

## 🧠 Entraîner le Modèle de Vision

Voir `SETUP_ML.md` pour les instructions détaillées.

**Résumé :**
1. Organiser vos images dans `backend/data/training_images/` (un dossier par classe)
2. Lancer `python backend/train_model.py`
3. Le modèle sera sauvegardé dans `backend/models/plant_recognition_model.h5`

## 🔧 Configuration

### Variables d'environnement Backend (`.env`)

```env
FRONTEND_URL=http://localhost:3000
MODEL_PATH=models/plant_recognition_model.h5
PLANT_DB_PATH=data/plants_database.json
OPENAI_API_KEY=your_key_here  # Optionnel
LLM_MODEL=gpt-4o-mini
```

### Variables d'environnement Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📱 Mode Offline

L'application fonctionne en mode PWA :

1. **Première visite** : L'application se télécharge et s'installe
2. **Mode offline** : 
   - Le modèle TensorFlow.js est chargé depuis IndexedDB
   - La base de données locale est utilisée
   - L'identification fonctionne sans connexion

Pour activer le mode offline avec TensorFlow.js :

1. Convertir le modèle en TensorFlow.js (voir `SETUP_ML.md`)
2. Placer les fichiers dans `public/models/plant_model/`
3. Le modèle sera automatiquement chargé et mis en cache

## 🧪 Tests

### Backend

```bash
cd backend
pytest tests/  # Si vous avez créé des tests
```

### Frontend

```bash
npm run lint
npm run build  # Vérifier que le build fonctionne
```

## 📚 Documentation Complète

- **Architecture** : `ARCHITECTURE.md`
- **Configuration ML** : `SETUP_ML.md`
- **Backend** : `backend/README.md`

## 🆘 Problèmes Courants

### Backend ne démarre pas

- Vérifier que Python 3.11+ est installé
- Vérifier que toutes les dépendances sont installées
- Vérifier que le port 8000 n'est pas utilisé

### Frontend ne se connecte pas au backend

- Vérifier que `NEXT_PUBLIC_API_URL` est correct
- Vérifier les CORS dans `backend/app/main.py`
- Vérifier que le backend est bien lancé

### Modèle non trouvé

- Le backend fonctionne en mode mock si le modèle n'existe pas
- Pour utiliser le vrai modèle, voir `SETUP_ML.md`

## 🎯 Prochaines Étapes

1. ✅ Démarrer le frontend et backend
2. ✅ Tester l'identification (mode mock)
3. 📸 Collecter des images de plantes
4. 🧠 Entraîner le modèle (voir `SETUP_ML.md`)
5. 🚀 Déployer en production

## 💡 Astuces

- **Développement** : Utilisez le mode mock pour tester sans modèle
- **Production** : Entraînez votre propre modèle avec vos données
- **Offline** : Convertissez le modèle en TensorFlow.js pour le navigateur
- **LLM** : Optionnel, mais améliore l'expérience utilisateur

