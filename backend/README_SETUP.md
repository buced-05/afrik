# Guide de Configuration Rapide - Backend ivoire.ai

## 🚀 Démarrage Rapide

### Windows
```bash
cd backend
start.bat
```

### Linux/Mac
```bash
cd backend
chmod +x start.sh
./start.sh
```

## 📋 Configuration Manuelle

### 1. Créer l'environnement virtuel
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 3. Configurer les variables d'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec vos clés API
```

### 4. Démarrer l'API
```bash
# Mode développement (avec rechargement automatique)
uvicorn app.main:app --reload

# Mode production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🔧 Configuration Requise

### Variables d'environnement (.env)

| Variable | Description | Requis | Défaut |
|----------|-------------|--------|--------|
| `OPENAI_API_KEY` | Clé API OpenAI pour LLM | Non | - |
| `LLM_MODEL` | Modèle LLM à utiliser | Non | `gpt-4o-mini` |
| `MODEL_PATH` | Chemin vers le modèle TensorFlow | Non | `models/plant_recognition_model.h5` |
| `PLANT_DB_PATH` | Chemin vers la base de données | Non | `data/plants_database.json` |
| `FRONTEND_URL` | URL du frontend (CORS) | Non | `http://localhost:3000` |
| `PORT` | Port de l'API | Non | `8000` |

## 📁 Structure des Fichiers

```
backend/
├── app/
│   ├── main.py              # Point d'entrée FastAPI
│   ├── models/
│   │   ├── schemas.py        # Schémas Pydantic
│   │   └── feedback_schemas.py
│   └── services/
│       ├── vision_service.py # Service de reconnaissance
│       ├── llm_service.py    # Service LLM
│       └── feedback_service.py
├── data/
│   └── plants_database.json  # Base de données des plantes
├── models/                   # Modèles TensorFlow (à créer)
├── requirements.txt
├── .env.example
├── start.sh                  # Script Linux/Mac
└── start.bat                 # Script Windows
```

## 🧪 Tester l'API

### Vérifier la santé de l'API
```bash
curl http://localhost:8000/api/health
```

### Documentation interactive
Ouvrir dans le navigateur: `http://localhost:8000/docs`

### Tester l'identification
```bash
curl -X POST "http://localhost:8000/api/identify" \
  -F "file=@path/to/image.jpg" \
  -F "user_intent=medecine"
```

## 🐳 Docker

### Construire l'image
```bash
docker build -t ivoire-ai-backend .
```

### Lancer le conteneur
```bash
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=your_key \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/models:/app/models \
  ivoire-ai-backend
```

## 🔍 Mode Mock

Si le modèle TensorFlow n'est pas disponible, l'API fonctionne en **mode mock** :
- Retourne des résultats simulés
- Utilise la base de données des plantes si disponible
- Permet le développement sans modèle entraîné

## 📝 Notes

- Le backend fonctionne sans modèle TensorFlow (mode mock)
- L'API OpenAI est optionnelle (mode mock si non configurée)
- La base de données des plantes peut être créée manuellement ou générée depuis le frontend

