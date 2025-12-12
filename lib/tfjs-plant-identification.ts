/**
 * Service d'identification de plantes avec TensorFlow.js
 * Pour le mode offline dans le navigateur
 */

import * as tf from '@tensorflow/tfjs';
import { logger } from './logger';

export interface PlantIdentificationResult {
  plantId: string;
  confidence: number;
}

export class TFJSPlantIdentifier {
  private model: tf.LayersModel | null = null;
  private classNames: string[] = [];
  private isLoaded: boolean = false;

  /**
   * Charge le modèle TensorFlow.js depuis le serveur ou le cache
   */
  async loadModel(modelUrl?: string): Promise<boolean> {
    if (this.isLoaded && this.model) {
      return true;
    }

    try {
      const url = modelUrl || '/models/plant_model/model.json';
      
      // Essayer de charger depuis le cache IndexedDB
      try {
        this.model = await tf.loadLayersModel('indexeddb://plant-recognition-model');
        logger.info('Modèle chargé depuis IndexedDB');
        this.isLoaded = true;
        await this.loadClassNames();
        return true;
      } catch (e) {
        // Si pas dans le cache, vérifier d'abord si le fichier existe
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (!response.ok) {
            logger.warn(`Modèle non trouvé à ${url}. Le mode offline ne sera pas disponible.`);
            logger.warn('Pour activer le mode offline, placez le modèle TensorFlow.js dans public/models/plant_model/');
            return false;
          }
        } catch (fetchError) {
          logger.warn(`Impossible de vérifier l'existence du modèle à ${url}`);
          return false;
        }

        // Si le fichier existe, charger depuis le serveur
        this.model = await tf.loadLayersModel(url);
        
        // Sauvegarder dans IndexedDB pour usage offline
        try {
          await this.model.save('indexeddb://plant-recognition-model');
          logger.info('Modèle chargé depuis le serveur et sauvegardé');
        } catch (saveError) {
          logger.warn('Impossible de sauvegarder le modèle dans IndexedDB', saveError);
        }
      }

      // Charger les noms de classes
      await this.loadClassNames();

      this.isLoaded = true;
      return true;
    } catch (error) {
      logger.error('Erreur lors du chargement du modèle', error);
      logger.warn('Le mode offline ne sera pas disponible. L\'application utilisera uniquement l\'API backend.');
      return false;
    }
  }

  /**
   * Charge les noms de classes depuis le serveur
   */
  private async loadClassNames(): Promise<void> {
    try {
      const response = await fetch('/models/plant_model/class_names.json');
      if (response.ok) {
        this.classNames = await response.json();
      } else {
        logger.warn('Impossible de charger les noms de classes');
      }
    } catch (error) {
      logger.warn('Erreur lors du chargement des noms de classes', error);
    }
  }

  /**
   * Prétraite une image pour l'inférence
   */
  private preprocessImage(imageElement: HTMLImageElement | HTMLCanvasElement): tf.Tensor {
    return tf.tidy(() => {
      // Convertir l'image en tensor
      let tensor = tf.browser.fromPixels(imageElement);
      
      // Redimensionner à 224x224 (taille d'entrée de MobileNetV2)
      const resized = tf.image.resizeBilinear(tensor, [224, 224]);
      
      // Normaliser les valeurs entre 0 et 1
      const normalized = resized.div(255.0);
      
      // Ajouter la dimension batch
      const batched = normalized.expandDims(0);
      
      return batched;
    });
  }

  /**
   * Identifie une plante à partir d'une image
   */
  async identify(imageFile: File, topK: number = 5): Promise<PlantIdentificationResult[]> {
    if (!this.model || !this.isLoaded) {
      throw new Error('Modèle non chargé. Le mode offline n\'est pas disponible. Utilisez l\'API backend à la place.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const img = new Image();
          
          img.onload = async () => {
            try {
              // Prétraiter l'image
              const preprocessed = this.preprocessImage(img);
              
              // Faire la prédiction
              const predictions = this.model!.predict(preprocessed) as tf.Tensor;
              
              // Obtenir les valeurs
              const values = await predictions.data();
              
              // Trouver les top K prédictions
              const topIndices = this.getTopKIndices(Array.from(values), topK);
              
              // Construire les résultats
              const results: PlantIdentificationResult[] = topIndices.map(idx => ({
                plantId: this.classNames[idx] || `class_${idx}`,
                confidence: values[idx] * 100
              }));
              
              // Nettoyer les tensors
              preprocessed.dispose();
              predictions.dispose();
              
              resolve(results);
            } catch (error) {
              reject(error);
            }
          };
          
          img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
          img.src = e.target?.result as string;
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsDataURL(imageFile);
    });
  }

  /**
   * Trouve les indices des top K valeurs
   */
  private getTopKIndices(values: number[], k: number): number[] {
    const indexed = values.map((val, idx) => ({ val, idx }));
    indexed.sort((a, b) => b.val - a.val);
    return indexed.slice(0, k).map(item => item.idx);
  }

  /**
   * Vérifie si le modèle est chargé
   */
  isModelLoaded(): boolean {
    return this.isLoaded && this.model !== null;
  }

  /**
   * Libère les ressources du modèle
   */
  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isLoaded = false;
    }
  }
}

// Instance singleton
let plantIdentifierInstance: TFJSPlantIdentifier | null = null;

/**
 * Obtient l'instance singleton du service d'identification
 */
export function getPlantIdentifier(): TFJSPlantIdentifier {
  if (!plantIdentifierInstance) {
    plantIdentifierInstance = new TFJSPlantIdentifier();
  }
  return plantIdentifierInstance;
}

