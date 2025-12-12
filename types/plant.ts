export interface Plant {
  id: string;
  scientificName: string;
  commonNames: {
    fr: string;
    local?: string[];
  };
  family: string;
  genus: string;
  species: string;
  description: string;
  plantType: 'arbre' | 'arbuste' | 'herbe' | 'liane';
  partsUsed: string[];
  properties: MedicinalProperty[];
  traditionalUses: TraditionalUse[];
  safety: SafetyInfo;
  scientificStatus: 'traditionnel' | 'etudes_preliminaires' | 'etudes_cliniques';
  region?: string[];
  images?: string[];
}

export interface MedicinalProperty {
  id: string;
  type: string; // e.g., 'antiseptique', 'antipaludique', 'digestif'
  description: string;
  evidenceLevel: 'traditionnel' | 'preliminaire' | 'clinique';
}

export interface TraditionalUse {
  id: string;
  preparation: string; // e.g., 'tisane', 'décoction', 'cataplasme'
  indication: string; // e.g., 'paludisme', 'toux', 'plaies'
  recipe?: string;
  region?: string;
  source?: string;
}

export interface SafetyInfo {
  toxicity?: string;
  sideEffects?: string[];
  contraindications: string[];
  warnings: string[];
}

export interface PlantIdentificationResult {
  plant: Plant;
  confidence: number; // 0-100
  alternatives?: Array<{
    plant: Plant;
    confidence: number;
  }>;
}

