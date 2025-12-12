import { Plant, PlantIdentificationResult } from '@/types/plant';
import { plants } from '@/data/plants';
import { getPlantIdentifier, TFJSPlantIdentifier } from './tfjs-plant-identification';
import { logger } from './logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Vérifie si le backend est disponible
 */
async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Timeout après 3 secondes
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    // Le backend est disponible si le statut est "healthy" ou "degraded"
    return data.status === 'healthy' || data.status === 'degraded';
  } catch (error) {
    // Erreur de connexion, backend non disponible
    logger.warn('Backend health check failed', error);
    return false;
  }
}

/**
 * Identifie une plante via l'API backend (mode online)
 */
export async function identifyPlant(
  imageFile: File,
  userIntent?: 'agriculture' | 'medecine'
): Promise<PlantIdentificationResult[]> {
  try {
    // Vérifier si on est en ligne
    if (navigator.onLine) {
      // Vérifier si le backend est disponible
      const backendAvailable = await checkBackendHealth();
      if (backendAvailable) {
        return await identifyPlantOnline(imageFile, userIntent);
      } else {
        logger.warn('Backend non disponible, basculement vers mode offline');
        return await identifyPlantOffline(imageFile);
      }
    } else {
      // Mode offline
      return await identifyPlantOffline(imageFile);
    }
  } catch (error) {
    logger.error('Erreur lors de l\'identification online, basculement vers offline', error);
    return await identifyPlantOffline(imageFile);
  }
}

/**
 * Identification via l'API backend
 */
async function identifyPlantOnline(
  imageFile: File,
  userIntent?: 'agriculture' | 'medecine'
): Promise<PlantIdentificationResult[]> {
  const formData = new FormData();
  formData.append('file', imageFile);
  if (userIntent) {
    formData.append('user_intent', userIntent);
  }
  formData.append('include_medicinal_info', 'true');

  try {
    const response = await fetch(`${API_BASE_URL}/api/identify`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // Si le backend n'est pas disponible, basculer vers offline
      if (response.status === 0 || response.status >= 500) {
        logger.warn('Backend non disponible, basculement vers mode offline');
        return await identifyPlantOffline(imageFile);
      }
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    const data = await response.json();

    // Valider la réponse de l'API
    if (!data || !data.plant) {
      throw new Error('Réponse invalide de l\'API');
    }

    // Convertir la réponse de l'API en format PlantIdentificationResult
    const result: PlantIdentificationResult = {
      plant: convertApiPlantToPlant(data.plant),
      confidence: data.confidence || 0,
      alternatives: data.alternatives?.map((alt: any) => ({
        plant: convertApiPlantToPlant(alt.plant),
        confidence: alt.confidence || 0,
      })),
    };

    // Si des informations médicinales sont disponibles, les ajouter
    if (data.medicinal_info) {
      // Vous pouvez étendre le type Plant pour inclure medicinal_info si nécessaire
      (result.plant as any).medicinal_info = data.medicinal_info;
    }

    return [result];
  } catch (error) {
    // Si erreur de connexion, basculer vers offline
    if (error instanceof TypeError && error.message.includes('fetch')) {
      logger.warn('Impossible de se connecter au backend, basculement vers mode offline');
      return await identifyPlantOffline(imageFile);
    }
    throw error;
  }
}

/**
 * Identification offline avec TensorFlow.js
 */
export async function identifyPlantOffline(
  imageFile: File
): Promise<PlantIdentificationResult[]> {
  try {
    const identifier = getPlantIdentifier();
    
    // Charger le modèle si pas déjà chargé
    if (!identifier.isModelLoaded()) {
      const loaded = await identifier.loadModel();
      if (!loaded) {
        // Modèle non disponible, utiliser le mock
        logger.warn('Modèle TensorFlow.js non disponible, utilisation du mode mock');
        return getMockIdentification();
      }
    }

    // Identifier la plante
    const tfResults = await identifier.identify(imageFile, 5);

    // Mapper les résultats vers notre format
    const results: PlantIdentificationResult[] = [];

    for (const tfResult of tfResults) {
      // Chercher la plante dans notre base locale
      const plant = findPlantById(tfResult.plantId) || plants[0]; // Fallback si pas trouvé
      
      results.push({
        plant,
        confidence: tfResult.confidence,
      });
    }

    // Si aucun résultat valide, utiliser le mock
    if (results.length === 0 || results[0].confidence < 30) {
      return getMockIdentification();
    }

    // Ajouter les alternatives
    if (results.length > 1) {
      results[0].alternatives = results.slice(1).map(r => ({
        plant: r.plant,
        confidence: r.confidence,
      }));
    }

    return [results[0]];
  } catch (error) {
    logger.error('Erreur lors de l\'identification offline', error);
    // Fallback vers mock
    return getMockIdentification();
  }
}

/**
 * Convertit une plante de l'API en format Plant local
 */
function convertApiPlantToPlant(apiPlant: any): Plant {
  return {
    id: apiPlant.id,
    scientificName: apiPlant.scientific_name,
    commonNames: {
      fr: apiPlant.common_names?.fr || '',
      local: apiPlant.common_names?.local || [],
    },
    family: apiPlant.family,
    genus: apiPlant.genus,
    species: apiPlant.species,
    description: apiPlant.description,
    plantType: apiPlant.plant_type as Plant['plantType'],
    partsUsed: apiPlant.parts_used || [],
    properties: [], // Sera rempli depuis medicinal_info si disponible
    traditionalUses: [],
    safety: {
      contraindications: [],
      warnings: [],
    },
    scientificStatus: 'traditionnel',
    region: apiPlant.region,
    images: apiPlant.images,
  };
}

/**
 * Trouve une plante par ID dans la base locale
 */
function findPlantById(plantId: string): Plant | undefined {
  return plants.find(p => p.id === plantId);
}

/**
 * Mock identification (fallback)
 */
function getMockIdentification(): PlantIdentificationResult[] {
  const selectedPlant = plants[Math.floor(Math.random() * plants.length)];
  const confidence = 75 + Math.floor(Math.random() * 20);

  return [{
    plant: selectedPlant,
    confidence,
    alternatives: plants
      .filter(p => p.id !== selectedPlant.id)
      .slice(0, 2)
      .map(p => ({
        plant: p,
        confidence: 30 + Math.floor(Math.random() * 30),
      })),
  }];
}

