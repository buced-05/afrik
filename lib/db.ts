import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Plant } from '@/types/plant';
import { plants } from '@/data/plants';

interface PlantDB extends DBSchema {
  plants: {
    key: string;
    value: Plant;
    indexes: { 'by-scientificName': string; 'by-commonName': string };
  };
  images: {
    key: string;
    value: { id: string; blob: Blob; plantId?: string };
  };
}

let dbInstance: IDBPDatabase<PlantDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<PlantDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<PlantDB>('ivoire-ai-db', 1, {
    upgrade(db) {
      // Plants store
      if (!db.objectStoreNames.contains('plants')) {
        const plantStore = db.createObjectStore('plants', { keyPath: 'id' });
        plantStore.createIndex('by-scientificName', 'scientificName');
        plantStore.createIndex('by-commonName', 'commonNames.fr');
      }

      // Images store
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
      }
    },
  });

  // Seed database with initial plants if empty
  const tx = dbInstance.transaction('plants', 'readwrite');
  const store = tx.objectStore('plants');
  const count = await store.count();
  
  if (count === 0) {
    for (const plant of plants) {
      await store.put(plant);
    }
  }
  await tx.done;

  return dbInstance;
}

export async function getAllPlants(): Promise<Plant[]> {
  const db = await getDB();
  return db.getAll('plants');
}

export async function getPlantById(id: string): Promise<Plant | undefined> {
  const db = await getDB();
  return db.get('plants', id);
}

export async function searchPlantsInDB(query: string): Promise<Plant[]> {
  const db = await getDB();
  const allPlants = await db.getAll('plants');
  const lowerQuery = query.toLowerCase();
  
  return allPlants.filter(plant => 
    plant.scientificName.toLowerCase().includes(lowerQuery) ||
    plant.commonNames.fr.toLowerCase().includes(lowerQuery) ||
    plant.commonNames.local?.some(name => name.toLowerCase().includes(lowerQuery)) ||
    plant.properties.some(p => p.type.toLowerCase().includes(lowerQuery)) ||
    plant.traditionalUses.some(u => u.indication.toLowerCase().includes(lowerQuery))
  );
}

export async function saveImage(id: string, blob: Blob, plantId?: string): Promise<void> {
  const db = await getDB();
  await db.put('images', { id, blob, plantId });
}

export async function getImage(id: string): Promise<Blob | undefined> {
  const db = await getDB();
  const image = await db.get('images', id);
  return image?.blob;
}

