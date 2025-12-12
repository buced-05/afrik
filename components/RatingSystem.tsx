'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingSystemProps {
  plantId: string;
  initialRating?: number;
  onRate?: (rating: number) => void;
}

export default function RatingSystem({ plantId, initialRating = 0, onRate }: RatingSystemProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(initialRating > 0);

  const handleRating = (value: number) => {
    setRating(value);
    setHasRated(true);
    if (onRate) {
      onRate(value);
    }
    // Ici, vous pourriez envoyer la note à votre API
    // saveRating(plantId, value);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Notez ce résultat :</span>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleRating(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
            disabled={hasRated}
          >
            <Star
              className={`w-6 h-6 ${
                value <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      {hasRated && (
        <span className="text-sm text-gray-600">
          {rating === 5 ? 'Excellent !' :
           rating === 4 ? 'Très bien' :
           rating === 3 ? 'Correct' :
           rating === 2 ? 'Peu précis' :
           'Imprécis'}
        </span>
      )}
    </div>
  );
}

