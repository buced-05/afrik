# Guide de Configuration ML pour ivoire.ai

Ce guide explique comment configurer et entraîner le modèle de reconnaissance de plantes.

## Prérequis

- Python 3.11+
- TensorFlow 2.15+
- GPU recommandé (mais pas obligatoire, CPU fonctionne aussi)

## 1. Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Préparation des Données

### Structure des dossiers

Organisez vos images d'entraînement comme suit :

```
data/training_images/
├── aloe_vera/
│   ├── image001.jpg
│   ├── image002.jpg
│   └── ...
├── moringa_oleifera/
│   ├── image001.jpg
│   └── ...
├── azadirachta_indica/
│   └── ...
└── vernonia_amygdalina/
    └── ...
```

**Recommandations :**
- Minimum 100 images par classe pour de bons résultats
- Idéalement 200-500 images par classe
- Images variées : différentes conditions d'éclairage, angles, tailles
- Format : JPG, PNG (224x224 ou plus, sera redimensionné automatiquement)

### Sources de données

1. **Vos propres photos** : Prenez des photos de plantes dans la nature
2. **Bases de données publiques** :
   - PlantNet API
   - iNaturalist
   - GBIF (Global Biodiversity Information Facility)
3. **Collaboration** : Collecte participative via l'application

## 3. Entraînement du Modèle

### Configuration

Modifiez les paramètres dans `train_model.py` si nécessaire :

```python
IMAGE_SIZE = (224, 224)  # Taille d'entrée
BATCH_SIZE = 32          # Ajuster selon votre GPU
EPOCHS = 50              # Nombre d'époques
LEARNING_RATE = 0.0001   # Taux d'apprentissage
```

### Lancer l'entraînement

```bash
python train_model.py
```

L'entraînement peut prendre plusieurs heures selon :
- Nombre d'images
- Puissance du GPU/CPU
- Nombre d'époques

### Monitoring

Pendant l'entraînement, vous verrez :
- Loss (perte) : doit diminuer
- Accuracy (précision) : doit augmenter
- Validation metrics : pour éviter le surapprentissage

Le meilleur modèle est automatiquement sauvegardé dans `models/plant_recognition_model.h5`.

## 4. Évaluation

Après l'entraînement, le script affiche :
- **Validation Accuracy** : Précision sur les données de validation
- **Top-3 Accuracy** : Précision si on considère les 3 meilleures prédictions

**Objectifs :**
- Validation Accuracy > 90% : Excellent
- Validation Accuracy > 80% : Bon
- Validation Accuracy > 70% : Acceptable

## 5. Conversion pour Production

### TensorFlow Lite (Mobile/Offline)

```python
import tensorflow as tf

# Charger le modèle
model = tf.keras.models.load_model('models/plant_recognition_model.h5')

# Convertir en TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Sauvegarder
with open('models/plant_model.tflite', 'wb') as f:
    f.write(tflite_model)
```

### TensorFlow.js (Navigateur)

```bash
# Installer tensorflowjs
pip install tensorflowjs

# Convertir
tensorflowjs_converter \
    --input_format=keras \
    models/plant_recognition_model.h5 \
    public/models/plant_model/
```

Cela créera :
- `model.json` : Architecture du modèle
- `*.bin` : Poids du modèle (peut être plusieurs fichiers)

## 6. Intégration Backend

Le modèle est automatiquement chargé par `VisionService` au démarrage de l'API.

Vérifiez que le chemin est correct dans `.env` :
```
MODEL_PATH=models/plant_recognition_model.h5
```

## 7. Amélioration Continue

### Fine-tuning

Si vous avez plus de données ou voulez améliorer :

1. **Dégeler les couches de base** :
```python
base_model.trainable = True
# Réentraîner avec learning rate plus faible
```

2. **Data Augmentation** : Augmenter la variété des transformations

3. **Ensemble Models** : Combiner plusieurs modèles

### Monitoring Production

- Suivre la précision des prédictions
- Collecter les images mal identifiées
- Réentraîner périodiquement avec nouvelles données

## 8. Troubleshooting

### Erreur : "Out of Memory"
- Réduire `BATCH_SIZE`
- Utiliser des images plus petites
- Utiliser un GPU avec plus de mémoire

### Erreur : "Overfitting" (précision train >> validation)
- Augmenter le dropout
- Augmenter l'augmentation de données
- Réduire la complexité du modèle

### Précision faible
- Vérifier la qualité des images
- Augmenter le nombre d'images par classe
- Vérifier que les classes sont bien séparées

## 9. Ressources

- [TensorFlow Transfer Learning Guide](https://www.tensorflow.org/tutorials/images/transfer_learning)
- [MobileNetV2 Paper](https://arxiv.org/abs/1801.04381)
- [Plant Recognition Research](https://www.researchgate.net/topic/Plant-Recognition)

## 10. Prochaines Étapes

1. ✅ Collecter un dataset de 1000+ images
2. ✅ Entraîner le modèle
3. ✅ Évaluer et itérer
4. ✅ Déployer en production
5. ✅ Collecter les retours utilisateurs
6. ✅ Améliorer avec nouvelles données

