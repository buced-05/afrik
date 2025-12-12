"""
API FastAPI pour ivoire.ai
Reconnaissance de plantes médicinales avec modèles de vision et LLM
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import uvicorn
from dotenv import load_dotenv
import os
import logging

logger = logging.getLogger(__name__)

from app.services.vision_service import VisionService
from app.services.llm_service import LLMService
from app.services.feedback_service import FeedbackService
from app.models.schemas import (
    IdentificationResponse,
    PlantInfo,
    MedicinalInfo
)
from app.models.feedback_schemas import (
    PredictionFeedback,
    FeedbackQuery,
    FeedbackStats
)

load_dotenv()

app = FastAPI(
    title="ivoire.ai API",
    description="API de reconnaissance de plantes médicinales africaines",
    version="1.0.0"
)

# CORS configuration
# Collect all allowed origins
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# Add FRONTEND_URL from environment if provided
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

# In development, use regex to allow any localhost port for flexibility
# In production, use strict origin list
is_dev = os.getenv("ENV", "development") == "development"

if is_dev:
    # Development: allow localhost on any port
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Production: strict origin list
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Initialize services
vision_service = VisionService()
llm_service = LLMService()
feedback_service = FeedbackService()


@app.get("/")
async def root():
    return {
        "message": "ivoire.ai API",
        "version": "1.0.0",
        "endpoints": {
            "identify": "/api/identify",
            "health": "/api/health",
            "feedback": "/api/feedback",
            "feedback_stats": "/api/feedback/stats"
        }
    }


@app.get("/api/health")
async def health_check():
    """Vérifie l'état de l'API et des services"""
    try:
        vision_ready = vision_service.is_ready()
        llm_ready = llm_service.is_ready()
        
        return {
            "status": "healthy" if (vision_ready and llm_ready) else "degraded",
            "services": {
                "vision": "ready" if vision_ready else "not_ready",
                "llm": "ready" if llm_ready else "not_ready"
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


@app.post("/api/identify", response_model=IdentificationResponse)
async def identify_plant(
    file: UploadFile = File(...),
    user_intent: Optional[str] = Form(None),
    include_medicinal_info: bool = Form(True)
):
    """
    Identifie une plante à partir d'une image
    
    Args:
        file: Image de la plante (feuille, fleur, fruit)
        user_intent: 'agriculture' ou 'medecine'
        include_medicinal_info: Inclure les informations médicinales générées par LLM
    
    Returns:
        IdentificationResponse avec les résultats de l'identification
    """
    try:
        # Vérifier le type de fichier
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Le fichier doit être une image")
        
        # Lire l'image
        image_bytes = await file.read()
        
        # Identification avec le modèle de vision
        vision_results = await vision_service.identify(image_bytes)
        
        if not vision_results or len(vision_results) == 0:
            raise HTTPException(
                status_code=404,
                detail="Aucune plante identifiée. Veuillez essayer avec une autre image."
            )
        
        # Récupérer la meilleure prédiction
        best_match = vision_results[0]
        plant_id = best_match['plant_id']
        confidence = best_match['confidence']
        
        # Récupérer les informations de la plante depuis la base de données
        plant_info = await vision_service.get_plant_info(plant_id)
        
        if not plant_info:
            raise HTTPException(
                status_code=404,
                detail=f"Plante {plant_id} non trouvée dans la base de données"
            )
        
        # Générer les informations médicinales avec LLM si demandé
        medicinal_info = None
        if include_medicinal_info and user_intent == 'medecine':
            medicinal_info = await llm_service.generate_medicinal_info(
                plant_info=plant_info,
                user_query=None  # Peut être étendu pour des requêtes spécifiques
            )
        
        # Préparer les alternatives
        alternatives = []
        if len(vision_results) > 1:
            for alt in vision_results[1:4]:  # Top 3 alternatives
                alt_plant_info = await vision_service.get_plant_info(alt['plant_id'])
                if alt_plant_info:
                    alternatives.append({
                        "plant": alt_plant_info,
                        "confidence": alt['confidence']
                    })
        
        return IdentificationResponse(
            plant=plant_info,
            confidence=confidence,
            alternatives=alternatives if alternatives else None,
            medicinal_info=medicinal_info,
            user_intent=user_intent
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de l'identification: {str(e)}"
        )


@app.post("/api/medicinal-info")
async def get_medicinal_info(
    plant_id: str,
    query: Optional[str] = None
):
    """
    Génère des informations médicinales pour une plante spécifique
    
    Args:
        plant_id: ID de la plante
        query: Requête spécifique (ex: "fièvre", "diabète", "douleurs")
    
    Returns:
        Informations médicinales générées par le LLM
    """
    try:
        plant_info = await vision_service.get_plant_info(plant_id)
        if not plant_info:
            raise HTTPException(status_code=404, detail="Plante non trouvée")
        
        medicinal_info = await llm_service.generate_medicinal_info(
            plant_info=plant_info,
            user_query=query
        )
        
        return medicinal_info
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la génération: {str(e)}"
        )


# ==================== FEEDBACK ENDPOINTS ====================

@app.post("/api/feedback")
async def submit_feedback(
    image: Optional[UploadFile] = File(None),
    feedback: Optional[str] = Form(None)
):
    """
    Soumet un feedback utilisateur sur une prédiction
    
    Args:
        image: Image de la prédiction (optionnel, sera sauvegardée)
        feedback: JSON string avec les données du feedback (dans le formulaire)
    
    Returns:
        ID du feedback créé
    """
    try:
        import json
        
        # Parser le JSON du feedback
        if not feedback:
            raise HTTPException(status_code=400, detail="Données de feedback requises")
        
        try:
            feedback_data = json.loads(feedback)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=400, 
                detail=f"JSON invalide dans le feedback: {str(e)}"
            )
        
        # Lire l'image si fournie
        image_bytes = None
        if image:
            image_bytes = await image.read()
            # Calculer le hash si pas déjà fourni dans les données
            if not feedback_data.get('image_hash'):
                feedback_data['image_hash'] = feedback_service.hash_image(image_bytes)
        
        # Valider que image_hash est présent (soit fourni dans les données, soit calculé depuis l'image)
        if not feedback_data.get('image_hash'):
            raise HTTPException(
                status_code=400, 
                detail="image_hash est requis (fournir une image ou inclure image_hash dans les données)"
            )
        
        if not feedback_data.get('predicted_plant_id'):
            raise HTTPException(
                status_code=400, 
                detail="predicted_plant_id est requis"
            )
        
        if not feedback_data.get('predicted_confidence'):
            raise HTTPException(
                status_code=400, 
                detail="predicted_confidence est requis"
            )
        
        if not feedback_data.get('feedback_type'):
            raise HTTPException(
                status_code=400, 
                detail="feedback_type est requis"
            )
        
        # Créer l'objet PredictionFeedback
        try:
            feedback_obj = PredictionFeedback(**feedback_data)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Données de feedback invalides: {str(e)}"
            )
        
        # Soumettre le feedback
        feedback_id = await feedback_service.submit_feedback(feedback_obj, image_bytes)
        
        return {
            "success": True,
            "feedback_id": feedback_id,
            "message": "Feedback enregistré avec succès"
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        logger.error(f"Erreur lors de l'enregistrement du feedback: {e}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de l'enregistrement du feedback: {str(e)}"
        )


@app.get("/api/feedback/{feedback_id}")
async def get_feedback(feedback_id: str):
    """Récupère un feedback par son ID"""
    feedback = feedback_service.get_feedback(feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback non trouvé")
    return feedback


@app.post("/api/feedback/query")
async def query_feedbacks(query: FeedbackQuery):
    """Interroge les feedbacks avec des filtres"""
    try:
        results = feedback_service.query_feedbacks(query)
        return {
            "results": results,
            "count": len(results),
            "total": len(feedback_service.feedbacks)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la requête: {str(e)}"
        )


@app.get("/api/feedback/stats", response_model=FeedbackStats)
async def get_feedback_stats():
    """Récupère les statistiques sur les feedbacks"""
    return feedback_service.get_stats()


@app.post("/api/feedback/{feedback_id}/curate")
async def curate_feedback(
    feedback_id: str,
    status: str,
    curator_notes: Optional[str] = None,
    curated_by: Optional[str] = None
):
    """
    Curate un feedback (approuver/rejeter)
    
    Args:
        feedback_id: ID du feedback
        status: Nouveau statut ('approved', 'rejected')
        curator_notes: Notes du curateur
        curated_by: ID du curateur
    """
    from app.models.feedback_schemas import FeedbackStatus
    
    try:
        feedback_status = FeedbackStatus(status)
        success = feedback_service.update_feedback_status(
            feedback_id,
            feedback_status,
            curator_notes,
            curated_by
        )
        
        if not success:
            raise HTTPException(status_code=404, detail="Feedback non trouvé")
        
        return {
            "success": True,
            "message": f"Feedback {feedback_id} mis à jour: {status}"
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Statut invalide")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la curation: {str(e)}"
        )


@app.get("/api/feedback/training-dataset")
async def get_training_dataset(
    min_confidence: float = 0.0,
    only_approved: bool = True,
    correction_weight: float = 2.0
):
    """
    Prépare le dataset d'entraînement à partir des feedbacks
    
    Args:
        min_confidence: Confiance minimale
        only_approved: Seulement les feedbacks approuvés
        correction_weight: Poids des corrections
    
    Returns:
        Liste des entrées pour l'entraînement
    """
    try:
        entries = feedback_service.prepare_training_dataset(
            min_confidence=min_confidence,
            only_approved=only_approved,
            correction_weight=correction_weight
        )
        
        return {
            "entries": [entry.model_dump() for entry in entries],
            "count": len(entries)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la préparation: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

