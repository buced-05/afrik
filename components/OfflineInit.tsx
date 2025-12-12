'use client';

import { useEffect } from 'react';
import { initializeOfflineMode } from '@/lib/offlineInit';

export default function OfflineInit() {
  useEffect(() => {
    // Initialize offline database
    initializeOfflineMode();
  }, []);

  return null;
}

