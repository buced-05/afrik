// Initialize offline database and cache
import { getDB } from './db';
import { plants } from '@/data/plants';
import { logger } from './logger';

export async function initializeOfflineMode() {
  if (typeof window === 'undefined') return false;
  
  try {
    // Initialize IndexedDB
    const db = await getDB();
    
    // Ensure all plants are cached
    const tx = db.transaction('plants', 'readwrite');
    const store = tx.objectStore('plants');
    
    for (const plant of plants) {
      await store.put(plant);
    }
    
    await tx.done;
    
    logger.info('Offline mode initialized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize offline mode', error);
    return false;
  }
}

