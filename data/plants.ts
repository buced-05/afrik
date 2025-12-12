import { Plant } from '@/types/plant';

export const plants: Plant[] = [
  {
    id: '1',
    scientificName: 'Aloe vera',
    commonNames: {
      fr: 'Aloès',
      local: ['Aloès', 'Aloé']
    },
    family: 'Asphodelaceae',
    genus: 'Aloe',
    species: 'Aloe vera',
    description: 'Plante succulente aux feuilles charnues et épineuses, largement utilisée en médecine traditionnelle.',
    plantType: 'herbe',
    partsUsed: ['feuilles', 'gel'],
    properties: [
      {
        id: 'p1',
        type: 'cicatrisant',
        description: 'Accélère la cicatrisation des plaies et brûlures',
        evidenceLevel: 'clinique'
      },
      {
        id: 'p2',
        type: 'anti-inflammatoire',
        description: 'Réduit l\'inflammation cutanée',
        evidenceLevel: 'preliminaire'
      },
      {
        id: 'p3',
        type: 'antiseptique',
        description: 'Prévient les infections',
        evidenceLevel: 'traditionnel'
      }
    ],
    traditionalUses: [
      {
        id: 'u1',
        preparation: 'gel',
        indication: 'brûlures et plaies',
        recipe: 'Appliquer le gel directement sur la zone affectée',
        region: 'Région tropicale'
      },
      {
        id: 'u2',
        preparation: 'décoction',
        indication: 'constipation',
        recipe: 'Faire bouillir 10g de feuilles dans 500ml d\'eau, filtrer et boire',
        region: 'Région tropicale'
      }
    ],
    safety: {
      toxicity: 'Faible toxicité en usage externe. Usage interne à éviter sans supervision médicale.',
      sideEffects: ['Diarrhée en cas de surdosage', 'Réactions allergiques cutanées possibles'],
      contraindications: ['Grossesse (usage interne)', 'Enfants de moins de 12 ans (usage interne)', 'Maladies rénales'],
      warnings: [
        'Ne pas utiliser sur des plaies profondes sans avis médical',
        'Tester sur une petite zone de peau avant usage généralisé'
      ]
    },
    scientificStatus: 'etudes_cliniques',
    region: ['Région tropicale', 'Région subtropicale'],
    images: [
      'https://images.unsplash.com/photo-1615367423051-739200480049?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=800&h=600&fit=crop'
    ]
  },
  {
    id: '2',
    scientificName: 'Azadirachta indica',
    commonNames: {
      fr: 'Neem',
      local: ['Neem', 'Margousier']
    },
    family: 'Meliaceae',
    genus: 'Azadirachta',
    species: 'Azadirachta indica',
    description: 'Arbre à feuilles persistantes, aux propriétés médicinales et insecticides reconnues.',
    plantType: 'arbre',
    partsUsed: ['feuilles', 'écorce', 'graines', 'huile'],
    properties: [
      {
        id: 'p4',
        type: 'antipaludique',
        description: 'Propriétés antipaludiques démontrées',
        evidenceLevel: 'preliminaire'
      },
      {
        id: 'p5',
        type: 'antiparasitaire',
        description: 'Efficace contre les parasites intestinaux',
        evidenceLevel: 'traditionnel'
      },
      {
        id: 'p6',
        type: 'antifongique',
        description: 'Traite les infections fongiques',
        evidenceLevel: 'preliminaire'
      }
    ],
    traditionalUses: [
      {
        id: 'u3',
        preparation: 'décoction',
        indication: 'paludisme',
        recipe: 'Faire bouillir 20g de feuilles dans 1L d\'eau pendant 15 minutes, boire 3 fois par jour',
        region: 'Région tropicale'
      },
      {
        id: 'u4',
        preparation: 'huile',
        indication: 'affections cutanées',
        recipe: 'Appliquer l\'huile de neem sur les zones affectées',
        region: 'Région tropicale'
      }
    ],
    safety: {
      toxicity: 'Toxicité modérée. Ne pas dépasser les doses recommandées.',
      sideEffects: ['Nausées', 'Vomissements en cas de surdosage'],
      contraindications: ['Grossesse', 'Allaitement', 'Enfants de moins de 5 ans'],
      warnings: [
        'Consulter un médecin avant usage prolongé',
        'Ne pas utiliser l\'huile pure sur de grandes surfaces'
      ]
    },
    scientificStatus: 'etudes_preliminaires',
    region: ['Région tropicale'],
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1615367423051-739200480049?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=800&h=600&fit=crop'
    ]
  },
  {
    id: '3',
    scientificName: 'Moringa oleifera',
    commonNames: {
      fr: 'Moringa',
      local: ['Moringa', 'Nébédaye']
    },
    family: 'Moringaceae',
    genus: 'Moringa',
    species: 'Moringa oleifera',
    description: 'Arbre à croissance rapide, toutes les parties sont utilisées en médecine traditionnelle.',
    plantType: 'arbre',
    partsUsed: ['feuilles', 'racines', 'écorce', 'graines', 'fleurs'],
    properties: [
      {
        id: 'p7',
        type: 'nutritif',
        description: 'Riche en vitamines et minéraux',
        evidenceLevel: 'clinique'
      },
      {
        id: 'p8',
        type: 'anti-inflammatoire',
        description: 'Réduit l\'inflammation',
        evidenceLevel: 'preliminaire'
      },
      {
        id: 'p9',
        type: 'antioxydant',
        description: 'Protège contre le stress oxydatif',
        evidenceLevel: 'preliminaire'
      }
    ],
    traditionalUses: [
      {
        id: 'u5',
        preparation: 'tisane',
        indication: 'malnutrition',
        recipe: 'Infuser 10g de feuilles séchées dans 250ml d\'eau bouillante',
        region: 'Région tropicale'
      },
      {
        id: 'u6',
        preparation: 'poudre',
        indication: 'diabète',
        recipe: 'Consommer 1 cuillère à café de poudre de feuilles par jour',
        region: 'Région tropicale'
      }
    ],
    safety: {
      toxicity: 'Très faible toxicité',
      sideEffects: ['Légers troubles digestifs en cas de consommation excessive'],
      contraindications: ['Aucune connue aux doses recommandées'],
      warnings: [
        'Les racines peuvent être toxiques à fortes doses',
        'Éviter pendant la grossesse (racines)'
      ]
    },
    scientificStatus: 'etudes_preliminaires',
    region: ['Région tropicale', 'Région subtropicale'],
    images: [
      'https://images.unsplash.com/photo-1615367423051-739200480049?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=800&h=600&fit=crop'
    ]
  },
  {
    id: '4',
    scientificName: 'Vernonia amygdalina',
    commonNames: {
      fr: 'Vernonie',
      local: ['Bitter leaf', 'Ndolé']
    },
    family: 'Asteraceae',
    genus: 'Vernonia',
    species: 'Vernonia amygdalina',
    description: 'Arbuste aux feuilles amères, très utilisé en cuisine et médecine traditionnelle.',
    plantType: 'arbuste',
    partsUsed: ['feuilles', 'racines', 'écorce'],
    properties: [
      {
        id: 'p10',
        type: 'antipaludique',
        description: 'Propriétés antipaludiques',
        evidenceLevel: 'preliminaire'
      },
      {
        id: 'p11',
        type: 'antiparasitaire',
        description: 'Efficace contre les parasites',
        evidenceLevel: 'traditionnel'
      },
      {
        id: 'p12',
        type: 'digestif',
        description: 'Améliore la digestion',
        evidenceLevel: 'traditionnel'
      }
    ],
    traditionalUses: [
      {
        id: 'u7',
        preparation: 'décoction',
        indication: 'paludisme',
        recipe: 'Faire bouillir 30g de feuilles dans 1L d\'eau, boire 2 fois par jour',
        region: 'Région tropicale'
      },
      {
        id: 'u8',
        preparation: 'tisane',
        indication: 'troubles digestifs',
        recipe: 'Infuser 15g de feuilles dans 500ml d\'eau bouillante',
        region: 'Région tropicale'
      }
    ],
    safety: {
      toxicity: 'Faible toxicité',
      sideEffects: ['Goût amer prononcé'],
      contraindications: ['Grossesse (à éviter aux premiers trimestres)'],
      warnings: [
        'Bien laver les feuilles avant usage',
        'Respecter les doses recommandées'
      ]
    },
    scientificStatus: 'etudes_preliminaires',
    region: ['Région tropicale'],
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1615367423051-739200480049?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=800&h=600&fit=crop'
    ]
  }
];

export function getPlantById(id: string): Plant | undefined {
  return plants.find(p => p.id === id);
}

export function searchPlants(query: string): Plant[] {
  const lowerQuery = query.toLowerCase();
  return plants.filter(plant => 
    plant.scientificName.toLowerCase().includes(lowerQuery) ||
    plant.commonNames.fr.toLowerCase().includes(lowerQuery) ||
    plant.commonNames.local?.some(name => name.toLowerCase().includes(lowerQuery)) ||
    plant.properties.some(p => p.type.toLowerCase().includes(lowerQuery)) ||
    plant.traditionalUses.some(u => u.indication.toLowerCase().includes(lowerQuery))
  );
}

export function filterPlants(filters: {
  plantType?: string;
  partUsed?: string;
  region?: string;
  symptom?: string;
}): Plant[] {
  return plants.filter(plant => {
    if (filters.plantType && plant.plantType !== filters.plantType) return false;
    if (filters.partUsed && !plant.partsUsed.includes(filters.partUsed)) return false;
    if (filters.region && !plant.region?.includes(filters.region)) return false;
    if (filters.symptom) {
      const hasSymptom = plant.traditionalUses.some(u => 
        u.indication.toLowerCase().includes(filters.symptom!.toLowerCase())
      );
      if (!hasSymptom) return false;
    }
    return true;
  });
}

