'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Camera, 
  Upload, 
  X, 
  Loader2,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  Save
} from 'lucide-react';
import { DecorativePlants } from '@/components/PlantIllustrations';

interface ContributionForm {
  image: File | null;
  preview: string | null;
  scientificName: string;
  commonNameFr: string;
  commonNameLocal: string;
  family: string;
  genus: string;
  species: string;
  description: string;
  plantType: 'arbre' | 'arbuste' | 'herbe' | 'liane' | '';
  partsUsed: string[];
  properties: Array<{ type: string; description: string; evidenceLevel: string }>;
  traditionalUses: Array<{ indication: string; preparation: string; recipe: string }>;
  region: string;
  toxicity: string;
  sideEffects: string[];
  contraindications: string[];
  warnings: string[];
}

export default function ContributePage() {
  const router = useRouter();
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [form, setForm] = useState<ContributionForm>({
    image: null,
    preview: null,
    scientificName: '',
    commonNameFr: '',
    commonNameLocal: '',
    family: '',
    genus: '',
    species: '',
    description: '',
    plantType: '',
    partsUsed: [],
    properties: [{ type: '', description: '', evidenceLevel: 'traditionnel' }],
    traditionalUses: [{ indication: '', preparation: '', recipe: '' }],
    region: '',
    toxicity: '',
    sideEffects: [],
    contraindications: [],
    warnings: []
  });

  const [newPartUsed, setNewPartUsed] = useState('');
  const [newSideEffect, setNewSideEffect] = useState('');
  const [newContraindication, setNewContraindication] = useState('');
  const [newWarning, setNewWarning] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm(prev => ({ ...prev, preview: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setShowCamera(true);
      }
    } catch (err) {
      alert('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès.');
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
            setForm(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onload = (e) => {
              setForm(prev => ({ ...prev, preview: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
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

  const addPartUsed = () => {
    if (newPartUsed.trim()) {
      setForm(prev => ({ ...prev, partsUsed: [...prev.partsUsed, newPartUsed.trim()] }));
      setNewPartUsed('');
    }
  };

  const removePartUsed = (index: number) => {
    setForm(prev => ({ ...prev, partsUsed: prev.partsUsed.filter((_, i) => i !== index) }));
  };

  const addProperty = () => {
    setForm(prev => ({ 
      ...prev, 
      properties: [...prev.properties, { type: '', description: '', evidenceLevel: 'traditionnel' }] 
    }));
  };

  const removeProperty = (index: number) => {
    setForm(prev => ({ 
      ...prev, 
      properties: prev.properties.filter((_, i) => i !== index) 
    }));
  };

  const addTraditionalUse = () => {
    setForm(prev => ({ 
      ...prev, 
      traditionalUses: [...prev.traditionalUses, { indication: '', preparation: '', recipe: '' }] 
    }));
  };

  const removeTraditionalUse = (index: number) => {
    setForm(prev => ({ 
      ...prev, 
      traditionalUses: prev.traditionalUses.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi (dans une vraie app, envoyer à l'API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 p-12 max-w-md w-full text-center african-pattern relative overflow-hidden">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Merci pour votre contribution !</h2>
          <p className="text-gray-600 mb-8">
            Votre contribution a été enregistrée et sera examinée par notre équipe d'experts.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="decorative-circle decorative-circle-1"></div>
      <div className="decorative-circle decorative-circle-2"></div>
      {/* Decorative plants */}
      <DecorativePlants />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contribuer</h2>
          <p className="text-lg text-gray-600">
            Partagez vos connaissances sur les plantes médicinales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 african-pattern-dots relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-earth-100 to-terracotta-100 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-earth-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Photo de la plante</h3>
            </div>

            {!form.preview && !showCamera && (
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-br from-primary-600 to-primary-700 text-white px-6 py-5 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <Upload className="w-5 h-5" />
                  <span>Importer une image</span>
                </button>
                <button
                  type="button"
                  onClick={handleCameraCapture}
                  className="bg-gradient-to-br from-green-600 to-green-700 text-white px-6 py-5 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <Camera className="w-5 h-5" />
                  <span>Prendre une photo</span>
                </button>
              </div>
            )}

            {showCamera && (
              <div className="mb-4">
                <div className="relative rounded-xl overflow-hidden bg-black mb-4">
                  <video ref={videoRef} className="w-full h-auto" autoPlay playsInline muted />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all"
                  >
                    Capturer
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {form.preview && (
              <div className="mt-4">
                <img src={form.preview} alt="Preview" className="w-full rounded-xl mb-4" />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, preview: null, image: null }))}
                  className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Supprimer l'image</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Basic Information */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 african-pattern-dots relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Informations de base</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom scientifique *
                </label>
                <input
                  type="text"
                  required
                  value={form.scientificName}
                  onChange={(e) => setForm(prev => ({ ...prev, scientificName: e.target.value }))}
                  placeholder="Ex: Aloe vera"
                  className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom commun (français) *
                </label>
                <input
                  type="text"
                  required
                  value={form.commonNameFr}
                  onChange={(e) => setForm(prev => ({ ...prev, commonNameFr: e.target.value }))}
                  placeholder="Ex: Aloès"
                  className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom local
                </label>
                <input
                  type="text"
                  value={form.commonNameLocal}
                  onChange={(e) => setForm(prev => ({ ...prev, commonNameLocal: e.target.value }))}
                  placeholder="Ex: Aloé (langue locale)"
                  className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Famille *
                </label>
                <input
                  type="text"
                  required
                  value={form.family}
                  onChange={(e) => setForm(prev => ({ ...prev, family: e.target.value }))}
                  placeholder="Ex: Asphodelaceae"
                  className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  value={form.genus}
                  onChange={(e) => setForm(prev => ({ ...prev, genus: e.target.value }))}
                  placeholder="Ex: Aloe"
                  className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Espèce
                </label>
                <input
                  type="text"
                  value={form.species}
                  onChange={(e) => setForm(prev => ({ ...prev, species: e.target.value }))}
                  placeholder="Ex: vera"
                  className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de plante *
                </label>
                <select
                  required
                  value={form.plantType}
                  onChange={(e) => setForm(prev => ({ ...prev, plantType: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                >
                  <option value="">Sélectionner...</option>
                  <option value="arbre">Arbre</option>
                  <option value="arbuste">Arbuste</option>
                  <option value="herbe">Herbe</option>
                  <option value="liane">Liane</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la plante..."
                  rows={4}
                  className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Région
                </label>
                <input
                  type="text"
                  value={form.region}
                  onChange={(e) => setForm(prev => ({ ...prev, region: e.target.value }))}
                  placeholder="Ex: Région tropicale"
                  className="w-full px-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Parts Used */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 african-pattern-dots relative overflow-hidden">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Parties utilisées</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {form.partsUsed.map((part, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                >
                  <span>{part}</span>
                  <button
                    type="button"
                    onClick={() => removePartUsed(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPartUsed}
                onChange={(e) => setNewPartUsed(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPartUsed())}
                placeholder="Ex: feuilles, racines..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addPartUsed}
                className="bg-primary-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Properties */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 african-pattern-dots relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Propriétés médicinales</h3>
              <button
                type="button"
                onClick={addProperty}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                + Ajouter une propriété
              </button>
            </div>
            <div className="space-y-4">
              {form.properties.map((prop, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de propriété
                      </label>
                      <input
                        type="text"
                        value={prop.type}
                        onChange={(e) => {
                          const newProps = [...form.properties];
                          newProps[index].type = e.target.value;
                          setForm(prev => ({ ...prev, properties: newProps }));
                        }}
                        placeholder="Ex: antiseptique, antipaludique..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Niveau de preuve
                      </label>
                      <select
                        value={prop.evidenceLevel}
                        onChange={(e) => {
                          const newProps = [...form.properties];
                          newProps[index].evidenceLevel = e.target.value;
                          setForm(prev => ({ ...prev, properties: newProps }));
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="traditionnel">Traditionnel</option>
                        <option value="preliminaire">Études préliminaires</option>
                        <option value="clinique">Études cliniques</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={prop.description}
                      onChange={(e) => {
                        const newProps = [...form.properties];
                        newProps[index].description = e.target.value;
                        setForm(prev => ({ ...prev, properties: newProps }));
                      }}
                      placeholder="Description de la propriété..."
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  {form.properties.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProperty(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Traditional Uses */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 african-pattern-dots relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Usages traditionnels</h3>
              <button
                type="button"
                onClick={addTraditionalUse}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                + Ajouter un usage
              </button>
            </div>
            <div className="space-y-4">
              {form.traditionalUses.map((use, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Indication / Maladie
                      </label>
                      <input
                        type="text"
                        value={use.indication}
                        onChange={(e) => {
                          const newUses = [...form.traditionalUses];
                          newUses[index].indication = e.target.value;
                          setForm(prev => ({ ...prev, traditionalUses: newUses }));
                        }}
                        placeholder="Ex: paludisme, toux..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Préparation
                      </label>
                      <input
                        type="text"
                        value={use.preparation}
                        onChange={(e) => {
                          const newUses = [...form.traditionalUses];
                          newUses[index].preparation = e.target.value;
                          setForm(prev => ({ ...prev, traditionalUses: newUses }));
                        }}
                        placeholder="Ex: tisane, décoction..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recette / Mode d'emploi
                    </label>
                    <textarea
                      value={use.recipe}
                      onChange={(e) => {
                        const newUses = [...form.traditionalUses];
                        newUses[index].recipe = e.target.value;
                        setForm(prev => ({ ...prev, traditionalUses: newUses }));
                      }}
                      placeholder="Détails de la préparation..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  {form.traditionalUses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTraditionalUse(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Safety Information */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 african-pattern-dots relative overflow-hidden">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Informations de sécurité</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toxicité
              </label>
              <textarea
                value={form.toxicity}
                onChange={(e) => setForm(prev => ({ ...prev, toxicity: e.target.value }))}
                placeholder="Informations sur la toxicité..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effets secondaires
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.sideEffects.map((effect, index) => (
                  <span
                    key={index}
                    className="bg-red-50 text-red-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-2"
                  >
                    <span>{effect}</span>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, sideEffects: prev.sideEffects.filter((_, i) => i !== index) }))}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSideEffect}
                  onChange={(e) => setNewSideEffect(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setForm(prev => ({ ...prev, sideEffects: [...prev.sideEffects, newSideEffect] })), setNewSideEffect(''))}
                  placeholder="Ajouter un effet secondaire..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newSideEffect.trim()) {
                      setForm(prev => ({ ...prev, sideEffects: [...prev.sideEffects, newSideEffect.trim()] }));
                      setNewSideEffect('');
                    }
                  }}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-medium hover:bg-red-200 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contre-indications
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.contraindications.map((contra, index) => (
                  <span
                    key={index}
                    className="bg-amber-50 text-amber-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-2"
                  >
                    <span>{contra}</span>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, contraindications: prev.contraindications.filter((_, i) => i !== index) }))}
                      className="text-amber-600 hover:text-amber-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newContraindication}
                  onChange={(e) => setNewContraindication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setForm(prev => ({ ...prev, contraindications: [...prev.contraindications, newContraindication] })), setNewContraindication(''))}
                  placeholder="Ajouter une contre-indication..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newContraindication.trim()) {
                      setForm(prev => ({ ...prev, contraindications: [...prev.contraindications, newContraindication.trim()] }));
                      setNewContraindication('');
                    }
                  }}
                  className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-medium hover:bg-amber-200 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avertissements
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.warnings.map((warning, index) => (
                  <span
                    key={index}
                    className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-2"
                  >
                    <span>{warning}</span>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, warnings: prev.warnings.filter((_, i) => i !== index) }))}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWarning}
                  onChange={(e) => setNewWarning(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), setForm(prev => ({ ...prev, warnings: [...prev.warnings, newWarning] })), setNewWarning(''))}
                  placeholder="Ajouter un avertissement..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newWarning.trim()) {
                      setForm(prev => ({ ...prev, warnings: [...prev.warnings, newWarning.trim()] }));
                      setNewWarning('');
                    }
                  }}
                  className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-medium hover:bg-yellow-200 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Soumettre la contribution</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

