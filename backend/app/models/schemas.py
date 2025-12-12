"""
Schémas Pydantic pour l'API
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class PlantInfo(BaseModel):
    """Informations de base sur une plante"""
    id: str
    scientific_name: str
    common_names: Dict[str, Any]  # {"fr": "...", "local": [...]}
    family: str
    genus: str
    species: str
    description: str
    plant_type: str
    parts_used: List[str]
    region: Optional[List[str]] = None
    images: Optional[List[str]] = None


class MedicinalProperty(BaseModel):
    """Propriété médicinale"""
    type: str
    description: str
    evidence_level: str  # 'traditionnel', 'preliminaire', 'clinique'


class TraditionalUse(BaseModel):
    """Usage traditionnel"""
    preparation: str
    indication: str
    recipe: Optional[str] = None
    region: Optional[str] = None


class MedicinalInfo(BaseModel):
    """Informations médicinales générées par LLM"""
    summary: str
    properties: List[MedicinalProperty]
    traditional_uses: List[TraditionalUse]
    diseases_treated: List[str]
    preparation_methods: List[str]
    precautions: List[str]
    warnings: List[str]
    formatted_response: str  # Réponse formatée pour l'utilisateur


class AlternativeResult(BaseModel):
    """Résultat alternatif d'identification"""
    plant: PlantInfo
    confidence: float = Field(..., ge=0, le=100)


class IdentificationResponse(BaseModel):
    """Réponse d'identification complète"""
    plant: PlantInfo
    confidence: float = Field(..., ge=0, le=100)
    alternatives: Optional[List[AlternativeResult]] = None
    medicinal_info: Optional[MedicinalInfo] = None
    user_intent: Optional[str] = None

