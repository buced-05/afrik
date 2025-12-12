# Modèles TensorFlow.js

Ce dossier contient les modèles TensorFlow.js pour l'identification de plantes en mode offline.

## Structure requise

Pour activer le mode offline, placez les fichiers du modèle converti dans :

```
public/models/plant_model/
├── model.json          # Architecture du modèle
├── group1-shard1of2.bin # Poids du modèle (peut être plusieurs fichiers)
├── group1-shard2of2.bin
└── class_names.json    # Noms des classes (optionnel)
```

## Conversion du modèle

Pour convertir un modèle TensorFlow (.h5) en TensorFlow.js :

```bash
# Installer tensorflowjs
pip install tensorflowjs

# Convertir le modèle
tensorflowjs_converter \
  --input_format=keras \
  backend/models/plant_recognition_model.h5 \
  public/models/plant_model/
```

## Fichier class_names.json

Créez un fichier `class_names.json` avec la liste des IDs de plantes :

```json
[
  "moringa_oleifera",
  "aloe_vera",
  "azadirachta_indica",
  ...
]
```

## Note

Si le modèle n'est pas présent, l'application fonctionnera toujours en utilisant uniquement l'API backend. Le mode offline ne sera simplement pas disponible.

