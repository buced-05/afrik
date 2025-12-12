"""
Script d'entraînement avec feedback utilisateurs
Utilise les feedbacks approuvés pour améliorer le modèle avec sample weighting
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import os
import json
from pathlib import Path
from typing import List, Tuple, Optional

from app.services.feedback_service import FeedbackService
from app.models.feedback_schemas import TrainingDatasetEntry, FeedbackStatus

# Configuration
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 50
LEARNING_RATE = 0.0001
BASE_MODEL_PATH = "models/plant_recognition_model.h5"
FEEDBACK_STORAGE_PATH = "data/feedbacks"
OUTPUT_MODEL_PATH = "models/plant_recognition_model_improved.h5"


def create_weighted_dataset(
    original_data_dir: str,
    feedback_entries: List[TrainingDatasetEntry],
    class_names: List[str]
) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Crée un dataset combiné avec poids pour l'entraînement
    
    Args:
        original_data_dir: Répertoire des données originales
        feedback_entries: Entrées issues des feedbacks
        class_names: Liste des noms de classes
    
    Returns:
        (images, labels, sample_weights)
    """
    images = []
    labels = []
    sample_weights = []
    
    # Charger les données originales
    print("Chargement des données originales...")
    train_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
    train_gen = train_datagen.flow_from_directory(
        original_data_dir,
        target_size=IMAGE_SIZE,
        batch_size=None,  # Pour obtenir toutes les images
        class_mode='categorical',
        subset='training',
        shuffle=False
    )
    
    # Ajouter les données originales avec poids 1.0
    for i in range(len(train_gen)):
        img, label = train_gen[i]
        images.append(img)
        labels.append(label)
        sample_weights.append(np.ones(len(img)))  # Poids 1.0 pour les données originales
    
    # Ajouter les données de feedback avec poids personnalisés
    print(f"Ajout de {len(feedback_entries)} entrées de feedback...")
    from PIL import Image
    
    for entry in feedback_entries:
        try:
            # Charger l'image
            img = Image.open(entry.image_path)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            img = img.resize(IMAGE_SIZE)
            img_array = np.array(img).astype('float32') / 255.0
            
            # Créer le label one-hot
            plant_idx = class_names.index(entry.plant_id)
            label = np.zeros(len(class_names))
            label[plant_idx] = 1.0
            
            images.append(img_array)
            labels.append(label)
            sample_weights.append(np.array([entry.weight]))
            
        except Exception as e:
            print(f"Erreur lors du chargement de {entry.image_path}: {e}")
            continue
    
    # Convertir en arrays numpy
    images = np.array(images)
    labels = np.array(labels)
    sample_weights = np.concatenate(sample_weights)
    
    print(f"Dataset créé: {len(images)} images, {len(class_names)} classes")
    return images, labels, sample_weights


def create_model(num_classes: int, base_model_path: Optional[str] = None) -> keras.Model:
    """
    Crée ou charge un modèle pour fine-tuning
    
    Args:
        num_classes: Nombre de classes
        base_model_path: Chemin vers le modèle de base (optionnel)
    
    Returns:
        Modèle Keras
    """
    if base_model_path and os.path.exists(base_model_path):
        print(f"Chargement du modèle de base depuis {base_model_path}")
        base_model = keras.models.load_model(base_model_path)
        
        # Fine-tuning: dégeler quelques couches
        for layer in base_model.layers[-10:]:  # Dernières 10 couches
            layer.trainable = True
        
        # Réduire le learning rate pour le fine-tuning
        base_model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE * 0.1),
            loss='categorical_crossentropy',
            metrics=['accuracy', 'top_3_accuracy']
        )
        
        return base_model
    else:
        # Créer un nouveau modèle (même code que train_model.py)
        print("Création d'un nouveau modèle...")
        base_model = keras.applications.MobileNetV2(
            input_shape=(224, 224, 3),
            include_top=False,
            weights='imagenet'
        )
        base_model.trainable = False
        
        inputs = keras.Input(shape=(224, 224, 3))
        x = keras.applications.mobilenet_v2.preprocess_input(inputs)
        x = base_model(x, training=False)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.Dropout(0.2)(x)
        outputs = layers.Dense(num_classes, activation='softmax')(x)
        
        model = keras.Model(inputs, outputs)
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
            loss='categorical_crossentropy',
            metrics=['accuracy', 'top_3_accuracy']
        )
        
        return model


def train_with_feedback(
    original_data_dir: str,
    min_confidence: float = 0.0,
    only_approved: bool = True,
    correction_weight: float = 2.0
):
    """
    Entraîne le modèle avec les feedbacks utilisateurs
    
    Args:
        original_data_dir: Répertoire des données d'entraînement originales
        min_confidence: Confiance minimale pour inclure un feedback
        only_approved: Seulement les feedbacks approuvés
        correction_weight: Poids à donner aux corrections
    """
    print("=" * 60)
    print("Entraînement avec feedback utilisateurs")
    print("=" * 60)
    
    # Initialiser le service de feedback
    feedback_service = FeedbackService(storage_path=FEEDBACK_STORAGE_PATH)
    
    # Préparer le dataset de feedback
    print("\n1. Préparation du dataset de feedback...")
    feedback_entries = feedback_service.prepare_training_dataset(
        min_confidence=min_confidence,
        only_approved=only_approved,
        correction_weight=correction_weight
    )
    
    if len(feedback_entries) == 0:
        print("⚠️  Aucun feedback disponible. Utilisation des données originales uniquement.")
        # Utiliser train_model.py normalement
        return
    
    print(f"   ✅ {len(feedback_entries)} entrées de feedback préparées")
    
    # Charger les noms de classes
    class_mapping_path = "models/class_mapping.json"
    if os.path.exists(class_mapping_path):
        with open(class_mapping_path, 'r') as f:
            class_mapping = json.load(f)
        class_names = [class_mapping[str(i)] for i in range(len(class_mapping))]
    else:
        # Extraire depuis le répertoire de données
        class_names = sorted([d for d in os.listdir(original_data_dir) 
                             if os.path.isdir(os.path.join(original_data_dir, d))])
    
    print(f"   ✅ {len(class_names)} classes identifiées")
    
    # Créer le dataset combiné
    print("\n2. Création du dataset combiné...")
    images, labels, sample_weights = create_weighted_dataset(
        original_data_dir,
        feedback_entries,
        class_names
    )
    
    # Créer ou charger le modèle
    print("\n3. Préparation du modèle...")
    model = create_model(len(class_names), BASE_MODEL_PATH)
    model.summary()
    
    # Split train/validation
    split_idx = int(len(images) * 0.8)
    train_images = images[:split_idx]
    train_labels = labels[:split_idx]
    train_weights = sample_weights[:split_idx]
    
    val_images = images[split_idx:]
    val_labels = labels[split_idx:]
    val_weights = sample_weights[split_idx:]
    
    print(f"\n4. Dataset: {len(train_images)} train, {len(val_images)} validation")
    
    # Callbacks
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            OUTPUT_MODEL_PATH,
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
    print("\n5. Entraînement avec sample weighting...")
    history = model.fit(
        train_images,
        train_labels,
        sample_weight=train_weights,
        validation_data=(val_images, val_labels),
        validation_sample_weight=val_weights,
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        callbacks=callbacks,
        verbose=1
    )
    
    # Sauvegarder l'historique
    history_path = "models/training_history_feedback.json"
    with open(history_path, 'w') as f:
        json.dump({
            'loss': [float(x) for x in history.history['loss']],
            'accuracy': [float(x) for x in history.history['accuracy']],
            'val_loss': [float(x) for x in history.history['val_loss']],
            'val_accuracy': [float(x) for x in history.history['val_accuracy']],
            'feedback_entries_used': len(feedback_entries)
        }, f, indent=2)
    
    # Marquer les feedbacks comme utilisés
    for entry in feedback_entries:
        if entry.feedback_id:
            feedback_service.update_feedback_status(
                entry.feedback_id,
                FeedbackStatus.USED
            )
    
    print("\n6. Entraînement terminé!")
    print(f"   Modèle sauvegardé: {OUTPUT_MODEL_PATH}")
    print(f"   {len(feedback_entries)} feedbacks marqués comme utilisés")
    
    # Évaluation
    print("\n7. Évaluation...")
    val_loss, val_accuracy, val_top3 = model.evaluate(
        val_images, val_labels, sample_weight=val_weights, verbose=1
    )
    print(f"   Validation Accuracy: {val_accuracy:.2%}")
    print(f"   Validation Top-3 Accuracy: {val_top3:.2%}")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Entraîner le modèle avec feedback")
    parser.add_argument(
        '--data-dir',
        type=str,
        default='data/training_images',
        help='Répertoire des données d\'entraînement originales'
    )
    parser.add_argument(
        '--min-confidence',
        type=float,
        default=0.0,
        help='Confiance minimale pour inclure un feedback'
    )
    parser.add_argument(
        '--only-approved',
        action='store_true',
        default=True,
        help='Utiliser seulement les feedbacks approuvés'
    )
    parser.add_argument(
        '--correction-weight',
        type=float,
        default=2.0,
        help='Poids à donner aux corrections (vs confirmations)'
    )
    
    args = parser.parse_args()
    
    train_with_feedback(
        original_data_dir=args.data_dir,
        min_confidence=args.min_confidence,
        only_approved=args.only_approved,
        correction_weight=args.correction_weight
    )

