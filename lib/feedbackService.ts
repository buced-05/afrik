/**
 * Service pour envoyer les feedbacks utilisateurs à l'API
 */

import { logger } from './logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface FeedbackData {
  imageHash: string;
  predictedPlantId: string;
  predictedConfidence: number;
  alternatives?: Array<{ plantId: string; confidence: number }>;
  feedbackType: 'rating' | 'correction' | 'comment' | 'confirmation';
  rating?: number; // 1-5
  correctPlantId?: string; // Si correction
  comment?: string;
  isCorrect?: boolean; // Si confirmation
  userIntent?: 'agriculture' | 'medecine';
  sessionId?: string;
}

export async function submitFeedback(
  feedback: FeedbackData,
  imageFile?: File
): Promise<{ success: boolean; feedbackId?: string; message?: string }> {
  try {
    const formData = new FormData();
    
    // Ajouter l'image si fournie
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // Préparer les données du feedback (snake_case pour l'API Python)
    const feedbackPayload = {
      image_hash: feedback.imageHash,
      predicted_plant_id: feedback.predictedPlantId,
      predicted_confidence: feedback.predictedConfidence,
      alternatives: feedback.alternatives?.map(alt => ({
        plant_id: alt.plantId,
        confidence: alt.confidence
      })),
      feedback_type: feedback.feedbackType,
      rating: feedback.rating,
      correct_plant_id: feedback.correctPlantId,
      comment: feedback.comment,
      is_correct: feedback.isCorrect,
      user_intent: feedback.userIntent,
      session_id: feedback.sessionId || getSessionId()
    };
    
    // Ajouter les données du feedback comme JSON string
    formData.append('feedback', JSON.stringify(feedbackPayload));
    
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Erreur inconnue' }));
      throw new Error(error.detail || 'Erreur lors de l\'envoi du feedback');
    }
    
    const data = await response.json();
    return {
      success: true,
      feedbackId: data.feedback_id,
      message: data.message
    };
  } catch (error) {
    logger.error('Erreur lors de l\'envoi du feedback', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Génère ou récupère un ID de session
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('ivoire_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('ivoire_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Calcule le hash d'une image
 */
export async function hashImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

