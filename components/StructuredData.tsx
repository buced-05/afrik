'use client';

import { useEffect } from 'react';
import { Plant } from '@/types/plant';

interface StructuredDataProps {
  type: 'Website' | 'WebApplication' | 'Organization' | 'Article' | 'Product';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [type, data]);

  return null;
}

export function WebsiteStructuredData() {
  return (
    <StructuredData
      type="WebApplication"
      data={{
        name: 'ivoire.ai',
        applicationCategory: 'EducationalApplication',
        description: 'Application d\'identification de plantes médicinales et agricoles utilisant l\'intelligence artificielle',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'XOF',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '100',
        },
      }}
    />
  );
}

export function PlantStructuredData({ plant }: { plant: Plant }) {
  return (
    <StructuredData
      type="Product"
      data={{
        name: plant.scientificName,
        description: plant.description,
        category: 'Plant',
        image: plant.images?.[0],
        brand: {
          '@type': 'Brand',
          name: 'ivoire.ai',
        },
      }}
    />
  );
}

