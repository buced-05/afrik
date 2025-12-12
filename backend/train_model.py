"""
Script d'entraînement du modèle de reconnaissance de plantes
Utilise MobileNetV2 avec transfer learning
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import os
import json
from pathlib import Path

# Configuration
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 50
LEARNING_RATE = 0.0001
NUM_CLASSES = None  # Sera déterminé automatiquement
DATA_DIR = "data/training_images"
MODEL_DIR = "models"
MODEL_NAME = "plant_recognition_model.h5"


def create_model(num_classes: int) -> keras.Model:
    """
    Crée un modèle MobileNetV2 fine-tuned
    
    Args:
        num_classes: Nombre de classes de plantes
    
    Returns:
        Modèle Keras compilé
    """
    # Charger MobileNetV2 pré-entraîné (sans les couches de classification)
    base_model = keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Geler les couches de base (optionnel, peut être dégelé pour fine-tuning)
    base_model.trainable = False
    
    # Ajouter les couches de classification personnalisées
    inputs = keras.Input(shape=(224, 224, 3))
    
    # Prétraitement (normalisation)
    x = keras.applications.mobilenet_v2.preprocess_input(inputs)
    
    # Base model
    x = base_model(x, training=False)
    
    # Global average pooling
    x = layers.GlobalAveragePooling2D()(x)
    
    # Dropout pour la régularisation
    x = layers.Dropout(0.2)(x)
    
    # Couche dense pour la classification
    outputs = layers.Dense(num_classes, activation='softmax')(x)
    
    model = keras.Model(inputs, outputs)
    
    # Compiler le modèle
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy', 'top_3_accuracy']
    )
    
    return model


def prepare_data(data_dir: str):
    """
    Prépare les données d'entraînement
    
    Args:
        data_dir: Répertoire contenant les images organisées par classe
    
    Returns:
        train_generator, val_generator, num_classes, class_names
    """
    # Vérifier que le répertoire existe
    if not os.path.exists(data_dir):
        raise ValueError(f"Le répertoire {data_dir} n'existe pas")
    
    # Créer les générateurs de données avec augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2  # 20% pour la validation
    )
    
    # Générateur d'entraînement
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )
    
    # Générateur de validation
    val_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )
    
    num_classes = len(train_generator.class_indices)
    class_names = list(train_generator.class_indices.keys())
    
    # Sauvegarder le mapping classe -> index
    class_mapping = {v: k for k, v in train_generator.class_indices.items()}
    with open(os.path.join(MODEL_DIR, "class_mapping.json"), 'w') as f:
        json.dump(class_mapping, f, indent=2)
    
    print(f"Nombre de classes: {num_classes}")
    print(f"Classes: {class_names}")
    print(f"Échantillons d'entraînement: {train_generator.samples}")
    print(f"Échantillons de validation: {val_generator.samples}")
    
    return train_generator, val_generator, num_classes, class_names


def train():
    """Fonction principale d'entraînement"""
    print("=" * 50)
    print("Entraînement du modèle de reconnaissance de plantes")
    print("=" * 50)
    
    # Créer le répertoire des modèles
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Préparer les données
    print("\n1. Préparation des données...")
    train_gen, val_gen, num_classes, class_names = prepare_data(DATA_DIR)
    
    # Créer le modèle
    print("\n2. Création du modèle...")
    model = create_model(num_classes)
    model.summary()
    
    # Callbacks
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            os.path.join(MODEL_DIR, MODEL_NAME),
            save_best_only=True,
            monitor='val_accuracy',
            mode='max'
        ),
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7
        )
    ]
    
    # Entraîner
    print("\n3. Entraînement...")
    history = model.fit(
        train_gen,
        epochs=EPOCHS,
        validation_data=val_gen,
        callbacks=callbacks,
        verbose=1
    )
    
    # Sauvegarder l'historique
    with open(os.path.join(MODEL_DIR, "training_history.json"), 'w') as f:
        json.dump({
            'loss': [float(x) for x in history.history['loss']],
            'accuracy': [float(x) for x in history.history['accuracy']],
            'val_loss': [float(x) for x in history.history['val_loss']],
            'val_accuracy': [float(x) for x in history.history['val_accuracy']]
        }, f, indent=2)
    
    print("\n4. Entraînement terminé!")
    print(f"Modèle sauvegardé dans {os.path.join(MODEL_DIR, MODEL_NAME)}")
    
    # Évaluation finale
    print("\n5. Évaluation sur le set de validation...")
    val_loss, val_accuracy, val_top3 = model.evaluate(val_gen, verbose=1)
    print(f"Validation Accuracy: {val_accuracy:.2%}")
    print(f"Validation Top-3 Accuracy: {val_top3:.2%}")


if __name__ == "__main__":
    # Vérifier la disponibilité de TensorFlow
    print(f"TensorFlow version: {tf.__version__}")
    print(f"GPU disponible: {tf.config.list_physical_devices('GPU')}")
    
    train()

