"""
Script pour convertir le modèle TensorFlow en TensorFlow.js
"""

import tensorflow as tf
import json
import os
import subprocess
import sys

MODEL_PATH = "models/plant_recognition_model.h5"
OUTPUT_DIR = "../public/models/plant_model"
CLASS_MAPPING_PATH = "models/class_mapping.json"


def check_tensorflowjs():
    """Vérifie si tensorflowjs est installé"""
    try:
        import tensorflowjs
        return True
    except ImportError:
        return False


def install_tensorflowjs():
    """Installe tensorflowjs"""
    print("Installation de tensorflowjs...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "tensorflowjs"])


def convert_model():
    """Convertit le modèle Keras en TensorFlow.js"""
    print("=" * 50)
    print("Conversion du modèle en TensorFlow.js")
    print("=" * 50)
    
    # Vérifier que le modèle existe
    if not os.path.exists(MODEL_PATH):
        print(f"❌ Erreur: Modèle non trouvé à {MODEL_PATH}")
        print("   Veuillez d'abord entraîner le modèle avec train_model.py")
        return False
    
    # Vérifier/installer tensorflowjs
    if not check_tensorflowjs():
        print("tensorflowjs n'est pas installé.")
        response = input("Voulez-vous l'installer maintenant? (o/n): ")
        if response.lower() == 'o':
            install_tensorflowjs()
        else:
            print("❌ Conversion annulée")
            return False
    
    # Créer le répertoire de sortie
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print(f"\n1. Chargement du modèle depuis {MODEL_PATH}...")
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print("   ✅ Modèle chargé")
    except Exception as e:
        print(f"   ❌ Erreur lors du chargement: {e}")
        return False
    
    print(f"\n2. Conversion en TensorFlow.js...")
    print(f"   Répertoire de sortie: {OUTPUT_DIR}")
    
    try:
        # Utiliser tensorflowjs_converter
        import tensorflowjs as tfjs
        
        # Convertir
        tfjs.converters.save_keras_model(model, OUTPUT_DIR)
        print("   ✅ Conversion réussie")
    except Exception as e:
        print(f"   ❌ Erreur lors de la conversion: {e}")
        print("\n   Alternative: Utiliser la commande CLI")
        print(f"   tensorflowjs_converter --input_format=keras {MODEL_PATH} {OUTPUT_DIR}")
        return False
    
    # Copier le mapping des classes si disponible
    if os.path.exists(CLASS_MAPPING_PATH):
        print(f"\n3. Copie du mapping des classes...")
        with open(CLASS_MAPPING_PATH, 'r') as f:
            class_mapping = json.load(f)
        
        # Créer un fichier avec les noms de classes dans l'ordre
        class_names = [None] * len(class_mapping)
        for idx, name in class_mapping.items():
            class_names[int(idx)] = name
        
        class_names_path = os.path.join(OUTPUT_DIR, "class_names.json")
        with open(class_names_path, 'w', encoding='utf-8') as f:
            json.dump(class_names, f, indent=2, ensure_ascii=False)
        
        print(f"   ✅ Mapping sauvegardé dans {class_names_path}")
    
    print("\n" + "=" * 50)
    print("✅ Conversion terminée avec succès!")
    print(f"   Modèle disponible dans: {OUTPUT_DIR}")
    print("\n   Pour utiliser dans le frontend:")
    print(f"   - Modèle: {OUTPUT_DIR}/model.json")
    print(f"   - Classes: {OUTPUT_DIR}/class_names.json")
    print("=" * 50)
    
    return True


if __name__ == "__main__":
    success = convert_model()
    sys.exit(0 if success else 1)

