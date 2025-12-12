"""
Service de gestion des feedbacks utilisateurs
Stockage, curation et préparation pour l'entraînement
"""

import os
import json
import hashlib
from datetime import datetime
from typing import List, Optional, Dict, Any
from pathlib import Path
import logging

from app.models.feedback_schemas import (
    PredictionFeedback,
    FeedbackStatus,
    FeedbackType,
    FeedbackStats,
    TrainingDatasetEntry,
    FeedbackQuery
)

logger = logging.getLogger(__name__)


class FeedbackService:
    """Service de gestion des feedbacks"""
    
    def __init__(self, storage_path: Optional[str] = None):
        """
        Initialise le service de feedback
        
        Args:
            storage_path: Chemin vers le répertoire de stockage
        """
        self.storage_path = Path(storage_path or os.getenv(
            "FEEDBACK_STORAGE_PATH",
            "data/feedbacks"
        ))
        self.feedbacks_file = self.storage_path / "feedbacks.json"
        self.images_dir = self.storage_path / "images"
        
        # Créer les répertoires si nécessaire
        self.storage_path.mkdir(parents=True, exist_ok=True)
        self.images_dir.mkdir(parents=True, exist_ok=True)
        
        # Charger les feedbacks existants
        self.feedbacks: List[Dict[str, Any]] = []
        self.load_feedbacks()
    
    def load_feedbacks(self):
        """Charge les feedbacks depuis le fichier JSON"""
        if self.feedbacks_file.exists():
            try:
                with open(self.feedbacks_file, 'r', encoding='utf-8') as f:
                    self.feedbacks = json.load(f)
                logger.info(f"Chargé {len(self.feedbacks)} feedbacks")
            except Exception as e:
                logger.error(f"Erreur lors du chargement des feedbacks: {e}")
                self.feedbacks = []
        else:
            self.feedbacks = []
    
    def save_feedbacks(self):
        """Sauvegarde les feedbacks dans le fichier JSON"""
        try:
            with open(self.feedbacks_file, 'w', encoding='utf-8') as f:
                json.dump(self.feedbacks, f, indent=2, default=str, ensure_ascii=False)
            logger.info(f"Sauvegardé {len(self.feedbacks)} feedbacks")
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde: {e}")
    
    def hash_image(self, image_bytes: bytes) -> str:
        """Calcule le hash d'une image pour éviter les doublons"""
        return hashlib.sha256(image_bytes).hexdigest()
    
    def save_image(self, image_bytes: bytes, image_hash: str) -> str:
        """
        Sauvegarde une image et retourne le chemin
        
        Args:
            image_bytes: Données de l'image
            image_hash: Hash de l'image
        
        Returns:
            Chemin relatif vers l'image sauvegardée
        """
        image_path = self.images_dir / f"{image_hash}.jpg"
        if not image_path.exists():
            with open(image_path, 'wb') as f:
                f.write(image_bytes)
        return str(image_path.relative_to(self.storage_path))
    
    async def submit_feedback(
        self,
        feedback: PredictionFeedback,
        image_bytes: Optional[bytes] = None
    ) -> str:
        """
        Soumet un nouveau feedback
        
        Args:
            feedback: Données du feedback
            image_bytes: Données de l'image (optionnel, sera sauvegardée)
        
        Returns:
            ID du feedback créé
        """
        # Générer un ID unique
        feedback_id = f"fb_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{len(self.feedbacks)}"
        feedback.id = feedback_id
        
        # Sauvegarder l'image si fournie
        if image_bytes:
            image_path = self.save_image(image_bytes, feedback.image_hash)
            feedback.image_path = image_path
        
        # Convertir en dict pour stockage
        feedback_dict = feedback.model_dump()
        feedback_dict['timestamp'] = feedback.timestamp.isoformat()
        if feedback.curated_at:
            feedback_dict['curated_at'] = feedback.curated_at.isoformat()
        
        # Ajouter au stockage
        self.feedbacks.append(feedback_dict)
        self.save_feedbacks()
        
        logger.info(f"Nouveau feedback soumis: {feedback_id}")
        return feedback_id
    
    def get_feedback(self, feedback_id: str) -> Optional[Dict[str, Any]]:
        """Récupère un feedback par son ID"""
        for fb in self.feedbacks:
            if fb.get('id') == feedback_id:
                return fb
        return None
    
    def query_feedbacks(self, query: FeedbackQuery) -> List[Dict[str, Any]]:
        """
        Interroge les feedbacks avec des filtres
        
        Args:
            query: Paramètres de requête
        
        Returns:
            Liste des feedbacks correspondants
        """
        results = self.feedbacks.copy()
        
        # Filtrer par statut
        if query.status:
            results = [fb for fb in results if fb.get('status') == query.status.value]
        
        # Filtrer par plante
        if query.plant_id:
            results = [fb for fb in results if fb.get('predicted_plant_id') == query.plant_id]
        
        # Filtrer par note
        if query.min_rating is not None:
            results = [fb for fb in results if fb.get('rating', 0) >= query.min_rating]
        if query.max_rating is not None:
            results = [fb for fb in results if fb.get('rating', 5) <= query.max_rating]
        
        # Filtrer par type
        if query.feedback_type:
            results = [fb for fb in results if fb.get('feedback_type') == query.feedback_type.value]
        
        # Filtrer par date
        if query.start_date:
            start_iso = query.start_date.isoformat()
            results = [fb for fb in results if fb.get('timestamp', '') >= start_iso]
        if query.end_date:
            end_iso = query.end_date.isoformat()
            results = [fb for fb in results if fb.get('timestamp', '') <= end_iso]
        
        # Trier par timestamp (plus récent en premier)
        results.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        # Pagination
        return results[query.offset:query.offset + query.limit]
    
    def update_feedback_status(
        self,
        feedback_id: str,
        status: FeedbackStatus,
        curator_notes: Optional[str] = None,
        curated_by: Optional[str] = None
    ) -> bool:
        """
        Met à jour le statut d'un feedback (curation)
        
        Args:
            feedback_id: ID du feedback
            status: Nouveau statut
            curator_notes: Notes du curateur
            curated_by: ID du curateur
        
        Returns:
            True si la mise à jour a réussi
        """
        for fb in self.feedbacks:
            if fb.get('id') == feedback_id:
                fb['status'] = status.value
                if curator_notes:
                    fb['curator_notes'] = curator_notes
                if curated_by:
                    fb['curated_by'] = curated_by
                fb['curated_at'] = datetime.now().isoformat()
                self.save_feedbacks()
                logger.info(f"Feedback {feedback_id} mis à jour: {status.value}")
                return True
        return False
    
    def get_stats(self) -> FeedbackStats:
        """Calcule les statistiques sur les feedbacks"""
        total = len(self.feedbacks)
        pending = sum(1 for fb in self.feedbacks if fb.get('status') == FeedbackStatus.PENDING.value)
        approved = sum(1 for fb in self.feedbacks if fb.get('status') == FeedbackStatus.APPROVED.value)
        rejected = sum(1 for fb in self.feedbacks if fb.get('status') == FeedbackStatus.REJECTED.value)
        used = sum(1 for fb in self.feedbacks if fb.get('status') == FeedbackStatus.USED.value)
        
        # Note moyenne
        ratings = [fb.get('rating') for fb in self.feedbacks if fb.get('rating')]
        avg_rating = sum(ratings) / len(ratings) if ratings else None
        
        # Taux de correction
        corrections = sum(1 for fb in self.feedbacks if fb.get('feedback_type') == FeedbackType.CORRECTION.value)
        correction_rate = (corrections / total * 100) if total > 0 else 0.0
        
        # Précision par plante
        accuracy_by_plant: Dict[str, List[bool]] = {}
        for fb in self.feedbacks:
            plant_id = fb.get('predicted_plant_id')
            is_correct = fb.get('is_correct')
            if plant_id and is_correct is not None:
                if plant_id not in accuracy_by_plant:
                    accuracy_by_plant[plant_id] = []
                accuracy_by_plant[plant_id].append(is_correct)
        
        accuracy_dict = {
            plant_id: sum(correct) / len(correct) * 100
            for plant_id, correct in accuracy_by_plant.items()
        }
        
        # Feedbacks à faible confiance
        low_confidence = sum(
            1 for fb in self.feedbacks
            if fb.get('predicted_confidence', 100) < 70
        )
        
        return FeedbackStats(
            total_feedbacks=total,
            pending_count=pending,
            approved_count=approved,
            rejected_count=rejected,
            used_count=used,
            average_rating=avg_rating,
            correction_rate=correction_rate,
            accuracy_by_plant=accuracy_dict,
            low_confidence_feedbacks=low_confidence
        )
    
    def prepare_training_dataset(
        self,
        min_confidence: float = 0.0,
        only_approved: bool = True,
        correction_weight: float = 2.0
    ) -> List[TrainingDatasetEntry]:
        """
        Prépare un dataset d'entraînement à partir des feedbacks approuvés
        
        Args:
            min_confidence: Confiance minimale pour inclure un feedback
            only_approved: Inclure seulement les feedbacks approuvés
            correction_weight: Poids à donner aux corrections (vs confirmations)
        
        Returns:
            Liste des entrées pour l'entraînement
        """
        entries: List[TrainingDatasetEntry] = []
        
        # Filtrer les feedbacks
        filtered = [
            fb for fb in self.feedbacks
            if (not only_approved or fb.get('status') == FeedbackStatus.APPROVED.value)
            and fb.get('predicted_confidence', 0) >= min_confidence
            and fb.get('image_path')  # Doit avoir une image
        ]
        
        for fb in filtered:
            # Déterminer la classe correcte
            if fb.get('feedback_type') == FeedbackType.CORRECTION.value:
                # Correction : utiliser la classe corrigée
                plant_id = fb.get('correct_plant_id')
                weight = correction_weight  # Plus de poids aux corrections
            elif fb.get('is_correct') is True:
                # Confirmation : utiliser la classe prédite
                plant_id = fb.get('predicted_plant_id')
                weight = 1.0
            else:
                # Ignorer si pas de confirmation ou correction
                continue
            
            if not plant_id:
                continue
            
            # Construire le chemin absolu
            image_path = str(self.storage_path / fb['image_path'])
            
            entries.append(TrainingDatasetEntry(
                image_path=image_path,
                plant_id=plant_id,
                source='feedback',
                weight=weight,
                feedback_id=fb.get('id'),
                verified=True
            ))
        
        logger.info(f"Préparé {len(entries)} entrées pour l'entraînement")
        return entries

