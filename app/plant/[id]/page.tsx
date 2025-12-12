'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plant } from '@/types/plant';
import { getPlantById } from '@/data/plants';
import {
  Leaf,
  FlaskConical,
  BookOpen,
  AlertTriangle,
  Shield,
  CheckCircle2,
  Clock,
  Circle,
  Loader2,
  Image as ImageIcon,
  ArrowLeft
} from 'lucide-react';
import ImageComparison from '@/components/ImageComparison';
import { DecorativePlants } from '@/components/PlantIllustrations';
import { PlantStructuredData } from '@/components/StructuredData';

export default function PlantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const plantId = params.id as string;
    const foundPlant = getPlantById(plantId);
    setPlant(foundPlant || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Plante non trouvée</h2>
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (plant.scientificStatus) {
      case 'etudes_cliniques':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'etudes_preliminaires':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <PlantStructuredData plant={plant} />
      {/* Decorative circles */}
      <div className="decorative-circle decorative-circle-1"></div>
      <div className="decorative-circle decorative-circle-2"></div>
      {/* Decorative plants */}
      <DecorativePlants />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Plant Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 mb-8 relative overflow-hidden">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {plant.scientificName}
          </h1>
          <p className="text-2xl text-gray-600 mb-2">
            {plant.commonNames.fr}
          </p>
          {plant.commonNames.local && plant.commonNames.local.length > 0 && (
            <p className="text-lg text-gray-500 mb-6">
              {plant.commonNames.local.join(', ')}
            </p>
          )}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-xl text-sm font-semibold">
              {plant.family}
            </span>
            <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold">
              {plant.plantType}
            </span>
            {plant.region && plant.region.length > 0 && (
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl text-sm font-semibold">
                {plant.region.join(', ')}
              </span>
            )}
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">{plant.description}</p>
        </div>

        {/* Reference Images */}
        {plant.images && plant.images.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 mb-8 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Images de référence</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Comparez ces images avec votre plante pour confirmer l'identification. Ces photos montrent différentes parties et stades de croissance de <strong>{plant.scientificName}</strong>.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {plant.images.map((image, index) => (
                <div
                  key={index}
                  className="group relative rounded-xl overflow-hidden border-2 border-gray-200 hover:border-primary-400 cursor-pointer transition-all bg-gray-100 aspect-square"
                >
                  <img
                    src={image}
                    alt={`${plant.scientificName} - Référence ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+non+disponible';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Warning */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-red-900 mb-2 text-lg">Avertissement Médical</h3>
              <p className="text-sm text-red-800 mb-2 leading-relaxed">
                Cette information est fournie à titre éducatif uniquement. 
                <strong> Ne remplace pas l'avis d'un médecin ou d'un professionnel de santé.</strong>
              </p>
              <p className="text-sm text-red-800 leading-relaxed">
                Consultez toujours un professionnel avant d'utiliser des plantes médicinales, 
                surtout en cas de grossesse, d'allaitement, ou de pathologies existantes.
              </p>
            </div>
          </div>
        </div>

        {/* Parts Used */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 mb-8 relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Parties utilisées</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {plant.partsUsed.map((part, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-800 px-5 py-2.5 rounded-xl font-medium border border-blue-200"
              >
                {part}
              </span>
            ))}
          </div>
        </div>

        {/* Properties */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 mb-8 relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Propriétés médicinales</h2>
          </div>
          <div className="space-y-5">
            {plant.properties.map((property) => (
              <div key={property.id} className="border-l-4 border-primary-500 pl-5 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{property.type}</h3>
                  <span className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                    property.evidenceLevel === 'clinique' ? 'bg-green-100 text-green-800' :
                    property.evidenceLevel === 'preliminaire' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {property.evidenceLevel === 'clinique' ? 'Études cliniques' :
                     property.evidenceLevel === 'preliminaire' ? 'Études préliminaires' :
                     'Traditionnel'}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Traditional Uses */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 mb-8 relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Usages traditionnels</h2>
          </div>
          <div className="space-y-5">
            {plant.traditionalUses.map((use) => (
              <div key={use.id} className="border border-gray-200 rounded-xl p-5 hover:border-primary-200 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{use.indication}</h3>
                  <span className="bg-purple-100 text-purple-800 px-4 py-1.5 rounded-lg text-sm font-medium">
                    {use.preparation}
                  </span>
                </div>
                {use.recipe && (
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    <strong className="text-gray-900">Préparation :</strong> {use.recipe}
                  </p>
                )}
                {use.region && (
                  <p className="text-sm text-gray-500">Région : {use.region}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Safety Information */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 p-8 mb-8 relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Informations de sécurité</h2>
          </div>
          
          {plant.safety.toxicity && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Toxicité</h3>
              <p className="text-gray-700 leading-relaxed">{plant.safety.toxicity}</p>
            </div>
          )}

          {plant.safety.sideEffects && plant.safety.sideEffects.length > 0 && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Effets secondaires possibles</h3>
              <ul className="space-y-2">
                {plant.safety.sideEffects.map((effect, index) => (
                  <li key={index} className="flex items-start space-x-2 text-gray-700">
                    <span className="text-red-500 mt-1.5">•</span>
                    <span>{effect}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Contre-indications</h3>
            <ul className="space-y-2">
              {plant.safety.contraindications.map((contra, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-700">
                  <span className="text-red-500 mt-1.5">•</span>
                  <span>{contra}</span>
                </li>
              ))}
            </ul>
          </div>

          {plant.safety.warnings && plant.safety.warnings.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Avertissements</h3>
              <ul className="space-y-2">
                {plant.safety.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start space-x-2 text-gray-700">
                    <span className="text-amber-500 mt-1.5">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Scientific Status */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              {getStatusIcon()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Statut scientifique</h2>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            {getStatusIcon()}
            <span className={`text-lg font-semibold ${
              plant.scientificStatus === 'etudes_cliniques' ? 'text-green-600' :
              plant.scientificStatus === 'etudes_preliminaires' ? 'text-yellow-600' :
              'text-gray-600'
            }`}>
              {plant.scientificStatus === 'etudes_cliniques' ? 'Études cliniques disponibles' :
               plant.scientificStatus === 'etudes_preliminaires' ? 'Études préliminaires' :
               'Usage traditionnel'}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Le niveau de validation scientifique indique la quantité de preuves disponibles 
            pour les propriétés médicinales de cette plante.
          </p>
        </div>
      </main>
    </div>
  );
}
