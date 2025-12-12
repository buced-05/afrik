'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logger will be imported if needed
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { logger } = require('@/lib/logger');
      logger.error('Global error', error);
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Erreur critique
            </h1>
            <p className="text-gray-600 mb-6">
              Une erreur critique s'est produite. Veuillez recharger la page.
            </p>
            <button
              onClick={() => {
                reset();
                window.location.href = '/';
              }}
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Recharger la page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

