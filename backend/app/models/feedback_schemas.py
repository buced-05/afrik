"""
Schémas pour le système de feedback et amélioration continue du modèle
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class FeedbackType(str, Enum):
    """Type de feedback"""
    RATING = "rating"  # Note simple (1-5)
    CORRECTION = "correction"  # Correction de la classe
    COMMENT = "comment"  # Commentaire textuel
    CONFIRMATION = "confirmation"  # Confirmation que la prédiction est correcte


class FeedbackStatus(str, Enum):
    """Statut du feedback"""
    PENDING = "pending"  # En attente de curation
    APPROVED = "approved"  # Approuvé pour l'entraînement
    REJECTED = "rejected"  # Rejeté (spam, incohérent, etc.)
    USED = "used"  # Déjà utilisé dans un entraînement


class PredictionFeedback(BaseModel):
    """Feedback sur une prédiction du modèle"""
    id: Optional[str] = None
    session_id: Optional[str] = None  # ID de session utilisateur
    user_id: Optional[str] = None  # ID utilisateur (si authentifié)
    
    # Données de la prédiction originale
    image_hash: str  # Hash de l'image pour éviter les doublons
    image_path: Optional[str] = None  # Chemin vers l'image stockée
    predicted_plant_id: str  # ID de la plante prédite
    predicted_confidence: float = Field(..., ge=0, le=100)
    alternatives: Optional[List[Dict[str, Any]]] = None
    
    # Feedback utilisateur
    feedback_type: FeedbackType
    rating: Optional[int] = Field(None, ge=1, le=5)  # Note 1-5
    correct_plant_id: Optional[str] = None  # ID de la plante correcte (si correction)
    comment: Optional[str] = None
    is_correct: Optional[bool] = None  # True si la prédiction est correcte
    
    # Métadonnées
    timestamp: datetime = Field(default_factory=datetime.now)
    user_intent: Optional[str] = None  # 'agriculture' ou 'medecine'
    device_info: Optional[Dict[str, Any]] = None
    status: FeedbackStatus = FeedbackStatus.PENDING
    
    # Pour la curation
    curator_notes: Optional[str] = None
    curated_by: Optional[str] = None
    curated_at: Optional[datetime] = None


class FeedbackStats(BaseModel):
    """Statistiques sur les feedbacks"""
    total_feedbacks: int
    pending_count: int
    approved_count: int
    rejected_count: int
    used_count: int
    
    average_rating: Optional[float] = None
    correction_rate: float  # Pourcentage de corrections
    accuracy_by_plant: Dict[str, float]  # Précision par plante
    low_confidence_feedbacks: int  # Feedbacks avec confiance < 70%


class TrainingDatasetEntry(BaseModel):
    """Entrée pour le dataset d'entraînement à partir des feedbacks"""
    image_path: str
    plant_id: str  # Classe correcte
    source: str  # 'feedback', 'original', 'curated'
    weight: float = 1.0  # Poids pour l'entraînement (plus élevé pour les corrections)
    feedback_id: Optional[str] = None
    verified: bool = True  # Vérifié par un humain


class FeedbackQuery(BaseModel):
    """Requête pour filtrer les feedbacks"""
    status: Optional[FeedbackStatus] = None
    plant_id: Optional[str] = None
    min_rating: Optional[int] = None
    max_rating: Optional[int] = None
    feedback_type: Optional[FeedbackType] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = Field(100, ge=1, le=1000)
    offset: int = Field(0, ge=0)

