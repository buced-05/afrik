'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-500 text-amber-900 px-4 py-3 text-center z-50 shadow-lg border-t border-amber-600">
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="w-4 h-4" />
        <p className="text-sm font-medium">
          Mode hors-ligne - Certaines fonctionnalités peuvent être limitées
        </p>
      </div>
    </div>
  );
}

