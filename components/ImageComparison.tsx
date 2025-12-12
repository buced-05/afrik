'use client';

import { useState } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageComparisonProps {
  userImage: string;
  referenceImages: string[];
  plantName: string;
}

export default function ImageComparison({ userImage, referenceImages, plantName }: ImageComparisonProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!referenceImages || referenceImages.length === 0) {
    return null;
  }

  const openModal = (index: number) => {
    setSelectedImage(referenceImages[index]);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const next = (currentIndex + 1) % referenceImages.length;
    setCurrentIndex(next);
    setSelectedImage(referenceImages[next]);
  };

  const prevImage = () => {
    const prev = (currentIndex - 1 + referenceImages.length) % referenceImages.length;
    setCurrentIndex(prev);
    setSelectedImage(referenceImages[prev]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">Images de référence pour comparaison</h4>
        <span className="text-sm text-gray-500">{referenceImages.length} image(s) disponible(s)</span>
      </div>

      {/* User Image */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Votre photo</p>
        <div className="relative rounded-xl overflow-hidden border-2 border-primary-300 bg-gray-100 aspect-video">
          <img
            src={userImage}
            alt="Votre photo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Reference Images Grid */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">
          Images de référence - {plantName}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {referenceImages.slice(0, 6).map((image, index) => (
            <div
              key={index}
              onClick={() => openModal(index)}
              className="group relative rounded-xl overflow-hidden border-2 border-gray-200 hover:border-primary-400 cursor-pointer transition-all bg-gray-100 aspect-square"
            >
              <img
                src={image}
                alt={`${plantName} - Référence ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Image+non+disponible';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Cliquez sur une image pour l'agrandir et comparer avec votre photo
        </p>
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {referenceImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full"
            >
              <img
                src={selectedImage}
                alt={`${plantName} - Référence agrandie`}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+non+disponible';
                }}
              />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
              Image {currentIndex + 1} sur {referenceImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

