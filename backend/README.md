# Backend ivoire.ai - API de Reconnaissance de Plantes

Backend Python avec FastAPI pour la reconnaissance de plantes médicinales africaines.

## Architecture

- **FastAPI**: Framework web moderne et rapide
- **TensorFlow**: Modèle de vision (MobileNetV2 fine-tuned)
- **OpenAI GPT-4o**: Génération d'explications médicinales (optionnel)
- **PIL/Pillow**: Traitement d'images

## Installation

```bash
# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

## Configuration

1. Copier `.env.example` vers `.env`
2. Configurer les variables d'environnement:
   - `OPENAI_API_KEY`: Clé API OpenAI (optionnel, pour le LLM)
   - `MODEL_PATH`: Chemin vers le modèle TensorFlow
   - `PLANT_DB_PATH`: Chemin vers la base de données des plantes

## Structure des données

### Base de données des plantes (`data/plants_database.json`)

```json
{
  "plants": [
    {
      "id": "moringa_oleifera",
      "scientific_name": "Moringa oleifera",
      "common_names": {
        "fr": "Moringa",
        "local": ["Nébédaye", "Moringa"]
      },
      "family": "Moringaceae",
      "genus": "Moringa",
      "species": "Moringa oleifera",
      "description": "...",
      "plant_type": "arbre",
      "parts_used": ["feuilles", "racines", "écorce"],
      "region": ["Région tropicale"]
    }
  ]
}
```

### Structure des images d'entraînement

```
data/training_images/
├── moringa_oleifera/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── aloe_vera/
│   ├── image1.jpg
│   └── ...
└── ...
```

## Entraînement du modèle

```bash
# Organiser vos images dans data/training_images/
# Chaque sous-dossier = une classe de plante

# Lancer l'entraînement
python train_model.py
```

Le modèle sera sauvegardé dans `models/plant_recognition_model.h5`.

## Lancer l'API

```bash
# Mode développement
python -m uvicorn app.main:app --reload

# Mode production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

L'API sera accessible sur `http://localhost:8000`

## Endpoints

### `GET /`
Informations sur l'API

### `GET /api/health`
Vérification de l'état de l'API et des services

### `POST /api/identify`
Identifie une plante à partir d'une image

**Paramètres:**
- `file`: Image (multipart/form-data)
- `user_intent`: "agriculture" ou "medecine" (optionnel)
- `include_medicinal_info`: booléen (défaut: true)

**Réponse:**
```json
{
  "plant": {
    "id": "moringa_oleifera",
    "scientific_name": "Moringa oleifera",
    ...
  },
  "confidence": 95.5,
  "alternatives": [...],
  "medicinal_info": {...}
}
```

### `POST /api/medicinal-info`
Génère des informations médicinales pour une plante

**Paramètres:**
- `plant_id`: ID de la plante
- `query`: Requête spécifique (ex: "fièvre", "diabète")

## Conversion en TensorFlow Lite (pour mobile/offline)

```python
import tensorflow as tf

# Charger le modèle
model = tf.keras.models.load_model('models/plant_recognition_model.h5')

# Convertir en TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Sauvegarder
with open('models/plant_model.tflite', 'wb') as f:
    f.write(tflite_model)
```

## Développement

### Mode mock

Si le modèle n'est pas disponible, l'API fonctionne en mode mock pour le développement.

### Tests

```bash
# Installer pytest
pip install pytest pytest-asyncio httpx

# Lancer les tests
pytest tests/
```

## Déploiement

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Variables d'environnement de production

- `FRONTEND_URL`: URL du frontend
- `MODEL_PATH`: Chemin absolu vers le modèle
- `OPENAI_API_KEY`: Clé API (si utilisée)

