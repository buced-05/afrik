'use client';

import { useState } from 'react';
import { Star, CheckCircle2, XCircle, MessageSquare, Edit3, Send, Loader2 } from 'lucide-react';
import { submitFeedback, hashImage, FeedbackData } from '@/lib/feedbackService';
import { Plant } from '@/types/plant';

interface FeedbackSystemProps {
  plant: Plant;
  confidence: number;
  imageFile?: File;
  alternatives?: Array<{ plant: Plant; confidence: number }>;
  userIntent?: 'agriculture' | 'medecine';
  onFeedbackSubmitted?: () => void;
}

export default function FeedbackSystem({
  plant,
  confidence,
  imageFile,
  alternatives,
  userIntent,
  onFeedbackSubmitted
}: FeedbackSystemProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctPlantId, setCorrectPlantId] = useState<string>('');
  const [comment, setComment] = useState('');
  const [showCorrection, setShowCorrection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRating = (value: number) => {
    setRating(value);
    // Si note faible, suggérer la correction
    if (value <= 2) {
      setShowCorrection(true);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      setError('Image requise pour soumettre le feedback');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Calculer le hash de l'image
      const imageHash = await hashImage(imageFile);

      // Déterminer le type de feedback
      let feedbackType: FeedbackData['feedbackType'] = 'rating';
      if (showCorrection && correctPlantId) {
        feedbackType = 'correction';
      } else if (isCorrect === true) {
        feedbackType = 'confirmation';
      } else if (comment) {
        feedbackType = 'comment';
      }

      // Préparer les données
      const feedbackData: FeedbackData = {
        imageHash,
        predictedPlantId: plant.id,
        predictedConfidence: confidence,
        alternatives: alternatives?.map(alt => ({
          plantId: alt.plant.id,
          confidence: alt.confidence
        })),
        feedbackType,
        rating: rating || undefined,
        correctPlantId: correctPlantId || undefined,
        comment: comment || undefined,
        isCorrect: isCorrect,
        userIntent
      };

      // Envoyer le feedback
      const result = await submitFeedback(feedbackData, imageFile);

      if (result.success) {
        setSubmitted(true);
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted();
        }
      } else {
        setError(result.message || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center space-x-2 text-green-800">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Merci pour votre feedback !</span>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Votre contribution aide à améliorer le modèle.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-primary-600" />
        <span>Aidez-nous à améliorer</span>
      </h3>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notez cette identification (1-5)
        </label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRating(value)}
              className={`focus:outline-none transition-transform hover:scale-110 ${
                rating === value ? 'scale-110' : ''
              }`}
            >
              <Star
                className={`w-8 h-8 ${
                  value <= (rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
          {rating && (
            <span className="ml-2 text-sm text-gray-600">
              {rating === 5 ? 'Excellent' :
               rating === 4 ? 'Très bien' :
               rating === 3 ? 'Correct' :
               rating === 2 ? 'Peu précis' :
               'Imprécis'}
            </span>
          )}
        </div>
      </div>

      {/* Confirmation/Correction */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Cette identification est-elle correcte ?
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => {
              setIsCorrect(true);
              setShowCorrection(false);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
              isCorrect === true
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Oui, correct</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCorrect(false);
              setShowCorrection(true);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
              isCorrect === false
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 hover:border-red-400'
            }`}
          >
            <XCircle className="w-5 h-5" />
            <span>Non, incorrect</span>
          </button>
        </div>
      </div>

      {/* Correction */}
      {showCorrection && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-amber-900 mb-2">
            Quelle est la plante correcte ?
          </label>
          <select
            value={correctPlantId}
            onChange={(e) => setCorrectPlantId(e.target.value)}
            className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">Sélectionnez une plante...</option>
            {alternatives?.map((alt) => (
              <option key={alt.plant.id} value={alt.plant.id}>
                {alt.plant.scientificName} ({alt.plant.commonNames.fr})
              </option>
            ))}
          </select>
          <p className="text-xs text-amber-700 mt-2">
            Si la plante n'est pas dans la liste, utilisez le champ commentaire ci-dessous.
          </p>
        </div>
      )}

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Commentaire (optionnel)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ajoutez des détails, suggestions, ou précisions..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || (!rating && isCorrect === null && !comment)}
        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Envoi en cours...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Envoyer le feedback</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Votre feedback nous aide à améliorer la précision du modèle. Merci !
      </p>
    </div>
  );
}

