# Architecture ivoire.ai

## Vue d'ensemble

ivoire.ai est une application de reconnaissance de plantes médicinales africaines avec deux composants principaux :

1. **Frontend** : Application Next.js (React) avec PWA pour fonctionner offline
2. **Backend** : API Python FastAPI avec modèles de vision et LLM

## Architecture Technique

### 1. Modèle de Vision (Reconnaissance de Feuilles)

#### Choix du modèle : MobileNetV2

**Pourquoi MobileNetV2 ?**
- ✅ Léger (~14MB) et rapide pour mobile/web
- ✅ Excellente précision (97-98%) avec transfer learning
- ✅ Compatible TensorFlow Lite pour offline
- ✅ Optimisé pour les appareils mobiles

#### Architecture

```
Input Image (224x224x3)
    ↓
MobileNetV2 (base pré-entraîné sur ImageNet)
    ↓
Global Average Pooling
    ↓
Dropout (0.2)
    ↓
Dense Layer (N classes)
    ↓
Softmax
    ↓
Output: Probabilités par classe
```

#### Flux d'entraînement

1. **Préparation des données**
   - Images organisées par classe dans `data/training_images/`
   - Augmentation de données (rotation, zoom, flip, etc.)
   - Split train/validation (80/20)

2. **Transfer Learning**
   - Base MobileNetV2 pré-entraîné (ImageNet)
   - Fine-tuning sur dataset de feuilles africaines
   - Couches de base gelées initialement

3. **Export**
   - Format Keras (.h5) pour backend Python
   - TensorFlow Lite (.tflite) pour mobile
   - TensorFlow.js pour navigateur

### 2. Modèle de Langage (Génération d'Explications)

#### Stack LLM

**Option 1 : OpenAI GPT-4o (Recommandé pour production)**
- ✅ Excellente qualité de génération
- ✅ Facile à intégrer
- ⚠️ Nécessite connexion internet
- ⚠️ Coût par requête

**Option 2 : Modèle Open Source (Llama, Mistral)**
- ✅ Gratuit et offline possible
- ✅ Contrôle total
- ⚠️ Nécessite infrastructure GPU
- ⚠️ Qualité variable selon le modèle

#### Flux de génération

```
Identification de plante
    ↓
Récupération infos base de données
    ↓
Construction prompt avec contexte
    ↓
Appel LLM (GPT-4o ou local)
    ↓
Parsing réponse JSON
    ↓
Structuration (propriétés, usages, précautions)
    ↓
Retour à l'utilisateur
```

### 3. Architecture Backend

```
FastAPI Application
├── /api/identify
│   ├── VisionService (TensorFlow)
│   │   ├── Preprocess image
│   │   ├── Model inference
│   │   └── Top-K results
│   ├── Plant Database lookup
│   └── LLMService (optionnel)
│       └── Generate medicinal info
└── /api/medicinal-info
    └── LLMService
        └── Query-specific generation
```

### 4. Architecture Frontend

```
Next.js Application
├── Pages
│   ├── /identify
│   │   └── Camera/Upload → API call
│   ├── /plant/[id]
│   │   └── Plant details
│   └── /search
│       └── Search interface
├── Services
│   ├── plantIdentification.ts
│   │   ├── identifyPlant() → API online
│   │   └── identifyPlantOffline() → TF.js
│   └── tfjs-plant-identification.ts
│       └── TF.js model inference
└── PWA
    ├── Service Worker
    ├── IndexedDB (model cache)
    └── Offline support
```

## Flux de Données

### Mode Online

```
User uploads image
    ↓
Frontend → POST /api/identify
    ↓
Backend VisionService
    ├── Preprocess image
    ├── TensorFlow inference
    └── Get top-K predictions
    ↓
Backend Plant Database
    └── Fetch plant info
    ↓
Backend LLMService (si demandé)
    └── Generate medicinal info
    ↓
Response JSON
    ↓
Frontend display results
```

### Mode Offline

```
User uploads image
    ↓
Frontend TF.js Service
    ├── Load model from IndexedDB
    ├── Preprocess image
    ├── TF.js inference
    └── Get predictions
    ↓
Frontend Local Database
    └── Fetch plant info
    ↓
Frontend display results
```

## Base de Données

### Structure des Plantes

```typescript
interface Plant {
  id: string;
  scientificName: string;
  commonNames: { fr: string; local?: string[] };
  family: string;
  description: string;
  plantType: 'arbre' | 'arbuste' | 'herbe' | 'liane';
  partsUsed: string[];
  properties: MedicinalProperty[];
  traditionalUses: TraditionalUse[];
  safety: SafetyInfo;
  region?: string[];
  images?: string[];
}
```

### Stockage

- **Backend** : JSON file ou PostgreSQL (pour production)
- **Frontend** : IndexedDB (PWA offline)

## Déploiement

### Backend

**Option 1 : Serveur dédié**
```bash
# Installation
pip install -r requirements.txt

# Lancer
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Option 2 : Docker**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Option 3 : Cloud (AWS, GCP, Azure)**
- Utiliser des services serverless (AWS Lambda, Cloud Functions)
- Stocker le modèle dans S3/Cloud Storage
- Utiliser API Gateway pour l'exposition

### Frontend

**Vercel/Netlify (Recommandé)**
```bash
npm run build
# Déployer sur Vercel
```

**Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Optimisations

### Modèle de Vision

1. **Quantization** : Réduire la précision (float32 → int8) pour TFLite
2. **Pruning** : Supprimer les poids non essentiels
3. **Knowledge Distillation** : Créer un modèle plus petit à partir du grand

### Performance

1. **Caching** : Cache des résultats d'identification
2. **CDN** : Servir le modèle TF.js depuis CDN
3. **Lazy Loading** : Charger le modèle seulement quand nécessaire

### Offline

1. **Service Worker** : Cache des assets et API calls
2. **IndexedDB** : Stockage du modèle et base de données
3. **Background Sync** : Synchroniser les données quand online

## Sécurité

1. **Validation** : Valider toutes les entrées utilisateur
2. **Rate Limiting** : Limiter les appels API
3. **CORS** : Configurer correctement les origines autorisées
4. **API Keys** : Protéger les clés API (OpenAI, etc.)
5. **HTTPS** : Forcer HTTPS en production

## Monitoring

1. **Logs** : Logger toutes les requêtes et erreurs
2. **Metrics** : Temps de réponse, précision, erreurs
3. **Alerts** : Alertes sur erreurs critiques
4. **Analytics** : Suivre l'usage et les identifications

## Roadmap

### Phase 1 : MVP (Actuel)
- ✅ Backend FastAPI avec modèle mock
- ✅ Frontend Next.js avec identification mock
- ✅ Structure de base de données

### Phase 2 : Modèle de Vision
- [ ] Collecte de dataset de feuilles africaines
- [ ] Entraînement MobileNetV2
- [ ] Intégration backend
- [ ] Conversion TensorFlow.js

### Phase 3 : LLM
- [ ] Intégration OpenAI GPT-4o
- [ ] Alternative modèle open source
- [ ] Fine-tuning sur données médicinales

### Phase 4 : Production
- [ ] Déploiement backend
- [ ] Déploiement frontend
- [ ] Monitoring et analytics
- [ ] Optimisations performance

### Phase 5 : Mobile Native
- [ ] Application React Native
- [ ] Modèle TensorFlow Lite
- [ ] Synchronisation offline/online

