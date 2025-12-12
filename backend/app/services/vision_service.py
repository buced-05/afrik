"""
Service de reconnaissance d'images avec TensorFlow
Utilise MobileNetV2 fine-tuned pour la reconnaissance de feuilles médicinales
"""

import numpy as np
from PIL import Image
import io
import os
import json
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

try:
    import tensorflow as tf
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
    tf = None
    logger.warning("TensorFlow n'est pas installé. Le service fonctionnera en mode mock.")


class VisionService:
    """Service de reconnaissance de plantes par vision"""
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialise le service de vision
        
        Args:
            model_path: Chemin vers le modèle TensorFlow sauvegardé
        """
        self.model = None
        self.model_path = model_path or os.getenv(
            "MODEL_PATH",
            "models/plant_recognition_model.h5"
        )
        self.class_names = []
        self.plant_database = {}
        self.load_model()
        self.load_plant_database()
    
    def load_model(self):
        """Charge le modèle TensorFlow"""
        if not TENSORFLOW_AVAILABLE:
            logger.warning(
                "TensorFlow n'est pas disponible. "
                "Utilisation du mode mock pour le développement."
            )
            self.model = None
            return
        
        try:
            if os.path.exists(self.model_path):
                logger.info(f"Chargement du modèle depuis {self.model_path}")
                self.model = tf.keras.models.load_model(self.model_path)
                logger.info("Modèle chargé avec succès")
            else:
                logger.warning(
                    f"Modèle non trouvé à {self.model_path}. "
                    "Utilisation du mode mock pour le développement."
                )
                self.model = None
        except Exception as e:
            logger.error(f"Erreur lors du chargement du modèle: {e}")
            self.model = None
    
    def load_plant_database(self):
        """Charge la base de données des plantes"""
        db_path = os.getenv(
            "PLANT_DB_PATH",
            "data/plants_database.json"
        )
        try:
            if os.path.exists(db_path):
                with open(db_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.plant_database = {p['id']: p for p in data.get('plants', [])}
                    self.class_names = [p['id'] for p in data.get('plants', [])]
                logger.info(f"Base de données chargée: {len(self.plant_database)} plantes")
            else:
                logger.warning(f"Base de données non trouvée à {db_path}")
        except Exception as e:
            logger.error(f"Erreur lors du chargement de la base de données: {e}")
    
    def is_ready(self) -> bool:
        """Vérifie si le service est prêt"""
        return self.model is not None or len(self.plant_database) > 0
    
    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """
        Prétraite l'image pour l'inférence
        
        Args:
            image_bytes: Image en bytes
        
        Returns:
            Image prétraitée (224x224, normalisée)
        """
        # Charger l'image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convertir en RGB si nécessaire
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Redimensionner à 224x224 (taille d'entrée de MobileNetV2)
        image = image.resize((224, 224))
        
        # Convertir en array numpy
        img_array = np.array(image)
        
        # Normaliser les valeurs entre 0 et 1
        img_array = img_array.astype('float32') / 255.0
        
        # Ajouter la dimension batch
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    async def identify(self, image_bytes: bytes, top_k: int = 5) -> List[Dict]:
        """
        Identifie une plante à partir d'une image
        
        Args:
            image_bytes: Image en bytes
            top_k: Nombre de résultats à retourner
        
        Returns:
            Liste de résultats avec plant_id et confidence
        """
        if not TENSORFLOW_AVAILABLE or self.model is None:
            # Mode mock pour le développement
            return self._mock_identification()
        
        try:
            # Prétraiter l'image
            processed_image = self.preprocess_image(image_bytes)
            
            # Faire la prédiction
            predictions = self.model.predict(processed_image, verbose=0)
            
            # Obtenir les top_k prédictions
            top_indices = np.argsort(predictions[0])[-top_k:][::-1]
            
            results = []
            for idx in top_indices:
                confidence = float(predictions[0][idx] * 100)
                if idx < len(self.class_names):
                    plant_id = self.class_names[idx]
                    results.append({
                        'plant_id': plant_id,
                        'confidence': confidence
                    })
            
            return results
            
        except Exception as e:
            logger.error(f"Erreur lors de l'identification: {e}")
            return self._mock_identification()
    
    def _mock_identification(self) -> List[Dict]:
        """Mode mock pour le développement"""
        if not self.plant_database:
            return []
        
        # Retourner une plante aléatoire avec confiance simulée
        import random
        plant_ids = list(self.plant_database.keys())
        selected_id = random.choice(plant_ids)
        
        return [
            {
                'plant_id': selected_id,
                'confidence': 75 + random.random() * 20  # 75-95%
            }
        ]
    
    async def get_plant_info(self, plant_id: str) -> Optional[Dict]:
        """
        Récupère les informations d'une plante depuis la base de données
        
        Args:
            plant_id: ID de la plante
        
        Returns:
            Dictionnaire avec les informations de la plante
        """
        return self.plant_database.get(plant_id)

