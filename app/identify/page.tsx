'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { identifyPlant } from '@/lib/plantIdentification';
import { PlantIdentificationResult } from '@/types/plant';
import { 
  Camera, 
  Upload, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Image as ImageIcon,
  Lightbulb,
  Sparkles,
  Sprout,
  Heart
} from 'lucide-react';
import FeedbackSystem from '@/components/FeedbackSystem';
import ImageComparison from '@/components/ImageComparison';
import { DecorativePlants } from '@/components/PlantIllustrations';
import { logger } from '@/lib/logger';

type UserIntent = 'agriculture' | 'medecine' | null;

export default function IdentifyPage() {
  const [userIntent, setUserIntent] = useState<UserIntent>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<PlantIdentificationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleImageFile = (file: File) => {
    setCurrentImageFile(file); // Stocker le fichier pour le feedback
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    processImage(file);
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResults([]);

    try {
      const identificationResults = await identifyPlant(file, userIntent || undefined);
      setResults(identificationResults);
    } catch (err) {
      setError('Erreur lors de l\'identification. Veuillez réessayer.');
      logger.error('Erreur lors de l\'identification', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Vérifier si l'API est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Votre navigateur ne supporte pas l\'accès à la caméra. Veuillez utiliser un navigateur moderne.');
        return;
      }

      // Vérifier les permissions si l'API est disponible
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
          if (permissionStatus.state === 'denied') {
            setError('L\'accès à la caméra a été refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.');
            return;
          }
        } catch (permErr) {
          // L'API permissions peut ne pas être supportée, on continue
          logger.debug('Permissions API not available, continuing...');
        }
      }

      // Demander l'accès à la caméra
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setShowCamera(true);
        setError(null); // Effacer toute erreur précédente
      }
    } catch (err: any) {
      logger.error('Camera access error', err);
      
      // Gérer les différents types d'erreurs
      let errorMessage = 'Impossible d\'accéder à la caméra.';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'L\'accès à la caméra a été refusé. Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur et réessayer.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'Aucune caméra n\'a été trouvée sur votre appareil.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'La caméra est déjà utilisée par une autre application. Veuillez fermer les autres applications utilisant la caméra.';
      } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        errorMessage = 'Les paramètres de la caméra ne sont pas supportés. Tentative avec des paramètres par défaut...';
        // Réessayer avec des paramètres plus simples
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setShowCamera(true);
            setError(null);
            return;
          }
        } catch (retryErr) {
          errorMessage = 'Impossible d\'accéder à la caméra avec les paramètres disponibles.';
        }
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Votre navigateur ne supporte pas l\'accès à la caméra. Veuillez utiliser un navigateur moderne (Chrome, Firefox, Safari, Edge).';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'L\'accès à la caméra est bloqué pour des raisons de sécurité. Assurez-vous que l\'application est servie via HTTPS ou localhost.';
      }
      
      setError(errorMessage);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
            handleImageFile(file);
            const stream = video.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            setShowCamera(false);
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const reset = () => {
    setPreview(null);
    setCurrentImageFile(null);
    setResults([]);
    setError(null);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const viewPlantDetails = (plantId: string) => {
    router.push(`/plant/${plantId}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageFile(file);
    } else {
      setError('Veuillez déposer une image valide.');
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="decorative-circle decorative-circle-1"></div>
      <div className="decorative-circle decorative-circle-2"></div>
      {/* Decorative plants */}
      <DecorativePlants />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Identifier une plante
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Prenez une photo ou importez une image pour identifier la plante. Comparez avec nos images de référence pour confirmer l'identification
          </p>
        </div>

        {/* Intent Selection */}
        {!userIntent && !preview && results.length === 0 && (
          <div className="card-premium rounded-3xl border border-green-200/50 p-10 md:p-16 mb-8 animate-scale-in relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 text-center">
                Quel est votre objectif ?
              </h3>
              <p className="text-gray-600 mb-12 text-center text-lg">
                Sélectionnez votre intention pour obtenir des informations adaptées
              </p>
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <button
                  onClick={() => setUserIntent('agriculture')}
                  className="group card-premium p-10 rounded-3xl border border-ochre-200/50 hover:border-ochre-400 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-ochre-50/50 via-white to-ochre-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-ochre-500 via-ochre-600 to-ochre-700 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-premium-lg relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-ochre-400 to-ochre-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                      <Sprout className="w-10 h-10 text-white relative z-10" />
                    </div>
                    <h4 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-ochre-700 transition-colors">Agriculture</h4>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Identification pour usage agricole, culture, production, ou gestion des cultures
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setUserIntent('medecine')}
                  className="group card-premium p-10 rounded-3xl border border-terracotta-200/50 hover:border-terracotta-400 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/50 via-white to-rose-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-terracotta-500 via-rose-600 to-pink-700 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-premium-lg relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-terracotta-400 to-rose-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                      <Heart className="w-10 h-10 text-white relative z-10" />
                    </div>
                    <h4 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-terracotta-700 transition-colors">Médecine</h4>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Identification pour usage médicinal, propriétés thérapeutiques, ou soins traditionnels
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Intent Badge */}
        {userIntent && (
          <div className="mb-6 flex items-center justify-center">
            <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${
              userIntent === 'agriculture' 
                ? 'bg-ochre-100 text-ochre-800 border-2 border-ochre-300' 
                : 'bg-terracotta-100 text-terracotta-800 border-2 border-terracotta-300'
            }`}>
              {userIntent === 'agriculture' ? (
                <>
                  <Sprout className="w-5 h-5" />
                  <span className="font-semibold">Objectif : Agriculture</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">Objectif : Médecine</span>
                </>
              )}
              <button
                onClick={() => {
                  setUserIntent(null);
                  setPreview(null);
                  setResults([]);
                  setError(null);
                }}
                className="ml-2 hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {userIntent && !preview && results.length === 0 && !showCamera && (
          <div className="space-y-6">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isDragging && fileInputRef.current?.click()}
              className={`glass-water rounded-3xl shadow-premium-lg border-2 border-dashed transition-all cursor-pointer relative overflow-hidden ${
                isDragging 
                  ? 'border-green-500/60 bg-green-500/20 scale-105 shadow-glow backdrop-blur-xl' 
                  : 'border-green-400/40 hover:border-green-500/60 hover:bg-green-500/15 backdrop-blur-lg'
              } p-16 text-center`}
            >
              <div className="flex flex-col items-center space-y-6">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all shadow-premium backdrop-blur-lg border border-white/30 ${
                  isDragging ? 'bg-gradient-to-br from-green-500/70 to-emerald-600/80 scale-110 rotate-6 shadow-glow' : 'bg-gradient-to-br from-green-100/60 to-emerald-100/60'
                }`}>
                  <Upload className={`w-12 h-12 ${isDragging ? 'text-white' : 'text-green-600'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {isDragging ? 'Déposez votre image ici' : 'Glissez-déposez une image'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    ou cliquez pour sélectionner un fichier
                  </p>
                  <p className="text-sm text-gray-500">
                    Formats supportés : JPG, PNG, WebP
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Alternative Methods */}
            <div className="glass-water rounded-3xl shadow-premium border border-green-400/30 p-6 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-8 py-5 rounded-2xl font-bold hover-lift shadow-premium flex items-center justify-center space-x-3 transition-colors duration-200 border-2 border-green-700"
                >
                  <Upload className="w-6 h-6 text-white" />
                  <span className="text-white font-black">Choisir un fichier</span>
                </button>
                <button
                  onClick={handleCameraCapture}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-8 py-5 rounded-2xl font-bold hover-lift shadow-premium flex items-center justify-center space-x-3 transition-colors duration-200 border-2 border-teal-700"
                >
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-white font-black">Prendre une photo</span>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-green-50/80 border border-green-300/50 rounded-xl p-5 backdrop-blur-lg glass-water">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-green-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 mb-2 drop-shadow-sm">Conseils pour une meilleure identification</h3>
                  <ul className="text-sm text-green-900 font-medium space-y-1.5">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Assurez-vous d'avoir une bonne luminosité</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Cadrez bien la feuille, fleur ou fruit</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Évitez les photos floues ou trop sombres</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Plusieurs photos améliorent la précision</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Camera View */}
        {showCamera && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="relative mb-4 rounded-xl overflow-hidden bg-black">
              <video
                ref={videoRef}
                className="w-full h-auto"
                autoPlay
                playsInline
                muted
              />
            </div>
            <div className="flex gap-4">
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-gradient-to-r from-earth-600 to-terracotta-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-earth-700 hover:to-terracotta-700 transition-all shadow-md flex items-center justify-center space-x-2"
                >
                <CheckCircle2 className="w-5 h-5" />
                <span>Capturer</span>
              </button>
              <button
                onClick={stopCamera}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Annuler</span>
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Preview */}
        {preview && !isProcessing && results.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-primary-600" />
                <span>Image sélectionnée</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Changer
                </button>
                <button
                  onClick={reset}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <img src={preview} alt="Preview" className="w-full h-auto max-h-96 object-contain" />
            </div>
          </div>
        )}

        {/* Processing */}
        {isProcessing && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 text-lg font-medium">Analyse en cours...</p>
            <p className="text-gray-500 text-sm mt-2">Identification de la plante en cours</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            {/* Retry Button */}
            <div className="flex justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Identifier une autre plante</span>
              </button>
            </div>

            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {result.plant.scientificName}
                    </h3>
                    <p className="text-lg text-gray-600 mb-1">
                      {result.plant.commonNames.fr}
                    </p>
                    {result.plant.commonNames.local && result.plant.commonNames.local.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {result.plant.commonNames.local.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className={`text-3xl font-bold ${
                      result.confidence >= 80 ? 'text-green-600' :
                      result.confidence >= 60 ? 'text-yellow-600' : 'text-orange-600'
                    }`}>
                      {result.confidence}%
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Confiance</div>
                  </div>
                </div>

                {result.confidence < 70 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-800">
                        Confiance faible. Vérifiez les alternatives ci-dessous pour confirmer l'identification.
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-gray-700 mb-6 leading-relaxed">{result.plant.description}</p>

                {/* Intent-specific information */}
                {userIntent === 'agriculture' && (
                  <div className="mb-6 p-5 bg-ochre-50 border border-ochre-200 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <Sprout className="w-5 h-5 text-ochre-600" />
                      <h4 className="font-semibold text-ochre-900">Informations agricoles</h4>
                    </div>
                    <div className="space-y-2 text-sm text-ochre-800">
                      <p><strong>Type :</strong> {result.plant.plantType}</p>
                      <p><strong>Famille :</strong> {result.plant.family}</p>
                      {result.plant.region && result.plant.region.length > 0 && (
                        <p><strong>Région :</strong> {result.plant.region.join(', ')}</p>
                      )}
                      <p className="mt-3 text-ochre-700">
                        Cette plante peut être utilisée pour l'agriculture. Consultez la fiche complète pour plus de détails sur la culture, la production et les usages agricoles.
                      </p>
                    </div>
                  </div>
                )}

                {userIntent === 'medecine' && (
                  <div className="mb-6 p-5 bg-terracotta-50 border border-terracotta-200 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <Heart className="w-5 h-5 text-terracotta-600" />
                      <h4 className="font-semibold text-terracotta-900">Informations médicales</h4>
                    </div>
                    <div className="space-y-2 text-sm text-terracotta-800">
                      {result.plant.properties && result.plant.properties.length > 0 && (
                        <div>
                          <p className="font-medium mb-1">Propriétés :</p>
                          <ul className="list-disc list-inside space-y-1">
                            {result.plant.properties.slice(0, 3).map((prop, idx) => (
                              <li key={idx}>{prop.type}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.plant.partsUsed && result.plant.partsUsed.length > 0 && (
                        <p><strong>Parties utilisées :</strong> {result.plant.partsUsed.join(', ')}</p>
                      )}
                      <p className="mt-3 text-terracotta-700">
                        Cette plante possède des propriétés médicinales. Consultez la fiche complète pour les usages traditionnels, préparations et contre-indications.
                      </p>
                    </div>
                  </div>
                )}

                {/* Image Comparison */}
                {preview && result.plant.images && result.plant.images.length > 0 && (
                  <div className="mb-6 bg-gradient-to-br from-green-50 to-primary-50 rounded-2xl p-6 border border-primary-200">
                    <ImageComparison
                      userImage={preview}
                      referenceImages={result.plant.images}
                      plantName={result.plant.scientificName}
                    />
                  </div>
                )}

                {/* Feedback System */}
                {currentImageFile && (
                  <div className="mb-6">
                    <FeedbackSystem
                      plant={result.plant}
                      confidence={result.confidence}
                      imageFile={currentImageFile}
                      alternatives={result.alternatives?.map(alt => ({
                        plant: alt.plant,
                        confidence: alt.confidence
                      }))}
                      userIntent={userIntent || undefined}
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => viewPlantDetails(result.plant.id)}
                    className="flex-1 bg-gradient-to-r from-earth-600 to-terracotta-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-earth-700 hover:to-terracotta-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Voir la fiche complète
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    Réessayer
                  </button>
                </div>

                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-primary-600" />
                      <span>Alternatives possibles</span>
                    </h4>
                    <div className="space-y-3">
                      {result.alternatives.map((alt, altIndex) => (
                        <div key={altIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{alt.plant.scientificName}</p>
                            <p className="text-sm text-gray-600">{alt.plant.commonNames.fr}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-700">{alt.confidence}%</div>
                              <div className="text-xs text-gray-500">Confiance</div>
                            </div>
                            <button
                              onClick={() => viewPlantDetails(alt.plant.id)}
                              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
                            >
                              <span>Voir</span>
                              <ArrowLeft className="w-4 h-4 rotate-180" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
