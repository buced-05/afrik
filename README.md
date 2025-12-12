# ivoire.ai - Identification de Plantes Médicinales

Application web d'identification de plantes médicinales africaines avec reconnaissance d'images par IA et génération d'explications médicinales.

## 🌟 Fonctionnalités

- 📸 **Identification par photo** : Reconnaissance de plantes avec modèle MobileNetV2
- 🤖 **IA de vision** : Modèle TensorFlow fine-tuned sur feuilles africaines
- 💬 **Génération LLM** : Explications médicinales avec GPT-4o (optionnel)
- 🌿 **Fiches détaillées** : Propriétés, usages traditionnels, précautions
- 🔍 **Recherche avancée** : Par nom, symptôme, type de plante
- 📱 **PWA Offline** : Fonctionne sans connexion avec TensorFlow.js
- ⚠️ **Sécurité** : Avertissements et contre-indications

## 🏗️ Architecture

### Frontend
- **Next.js 14** (React, TypeScript)
- **TensorFlow.js** pour mode offline
- **PWA** avec Service Worker
- **Tailwind CSS** pour le design

### Backend
- **FastAPI** (Python)
- **TensorFlow/Keras** pour la reconnaissance d'images
- **MobileNetV2** fine-tuned
- **OpenAI GPT-4o** pour les explications (optionnel)

## 🚀 Démarrage Rapide

### Frontend

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

### Backend

```bash
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer (copier .env.example vers .env)
cp .env.example .env

# Lancer l'API
python -m uvicorn app.main:app --reload
```

L'API sera accessible sur [http://localhost:8000](http://localhost:8000)

**Voir [QUICKSTART.md](QUICKSTART.md) pour plus de détails.**

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** : Guide de démarrage rapide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** : Architecture détaillée du système
- **[SETUP_ML.md](SETUP_ML.md)** : Guide d'entraînement du modèle de vision
- **[backend/README.md](backend/README.md)** : Documentation de l'API

## 🧠 Modèle de Vision

Le modèle utilise **MobileNetV2** avec transfer learning :

- ✅ Léger (~14MB) et rapide
- ✅ Précision 97-98% avec fine-tuning
- ✅ Compatible TensorFlow Lite (mobile)
- ✅ Compatible TensorFlow.js (navigateur)

### Entraîner votre modèle

1. Organiser vos images dans `backend/data/training_images/` (un dossier par classe)
2. Lancer `python backend/train_model.py`
3. Le modèle sera sauvegardé dans `backend/models/plant_recognition_model.h5`

**Voir [SETUP_ML.md](SETUP_ML.md) pour les instructions complètes.**

## 🔧 Configuration

### Variables d'environnement

**Frontend** (`.env.local`) :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** (`backend/.env`) :
```env
FRONTEND_URL=http://localhost:3000
MODEL_PATH=models/plant_recognition_model.h5
PLANT_DB_PATH=data/plants_database.json
OPENAI_API_KEY=your_key_here  # Optionnel pour LLM
```

## 📱 Mode Offline

L'application fonctionne en mode PWA :

1. **Première visite** : Télécharge et installe l'application
2. **Mode offline** :
   - Modèle TensorFlow.js chargé depuis IndexedDB
   - Base de données locale
   - Identification sans connexion

Pour activer le mode offline :
1. Convertir le modèle en TensorFlow.js (voir `SETUP_ML.md`)
2. Placer dans `public/models/plant_model/`
3. Le modèle sera automatiquement mis en cache

## 🐳 Déploiement avec Docker

### Backend

```bash
cd backend
docker-compose up -d
```

## 🧪 Tests

```bash
# Frontend
npm run lint
npm run build

# Backend
cd backend
pytest tests/  # Si vous avez créé des tests
```

## 📦 Structure du Projet

```
ivoire-ai/
├── app/                    # Pages Next.js
├── components/             # Composants React
├── lib/                    # Services (identification, TF.js)
├── data/                   # Données des plantes
├── backend/                # API Python FastAPI
│   ├── app/
│   │   ├── main.py        # Point d'entrée API
│   │   ├── services/      # Services (vision, LLM)
│   │   └── models/        # Schémas Pydantic
│   ├── data/              # Base de données plantes
│   ├── models/            # Modèles TensorFlow
│   └── train_model.py     # Script d'entraînement
├── ARCHITECTURE.md         # Architecture détaillée
├── SETUP_ML.md            # Guide ML
└── QUICKSTART.md          # Démarrage rapide
```

## 🎯 Roadmap

- [x] Architecture backend avec FastAPI
- [x] Intégration TensorFlow.js pour offline
- [x] Service LLM pour explications
- [ ] Entraînement modèle sur dataset africain
- [ ] Déploiement production
- [ ] Application mobile native

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir les issues pour les tâches en cours.

## 📄 Licence

[À définir]

## 🙏 Remerciements

- PlantNet pour l'inspiration
- Communautés de médecine traditionnelle africaine
- Contributeurs open source

