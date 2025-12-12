import type { Metadata, Viewport } from 'next';
import './globals.css';
import OfflineIndicator from '@/components/OfflineIndicator';
import OfflineInit from '@/components/OfflineInit';
import Header from '@/components/Header';
import { WebsiteStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: {
    default: 'ivoire.ai - Identification de Plantes Médicinales & Agricoles',
    template: '%s | ivoire.ai',
  },
  description: 'Identifiez les plantes médicinales et agricoles avec l\'IA. Découvrez leurs usages traditionnels, propriétés médicinales et applications agricoles. Application disponible hors-ligne.',
  keywords: ['plantes médicinales', 'identification plantes', 'IA botanique', 'plantes agricoles', 'médecine traditionnelle', 'agriculture', 'botanique', 'ivoire.ai'],
  authors: [{ name: 'ivoire.ai' }],
  creator: 'ivoire.ai',
  publisher: 'ivoire.ai',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'ivoire.ai - Identification de Plantes Médicinales & Agricoles',
    description: 'Identifiez les plantes médicinales et agricoles avec l\'IA. Découvrez leurs usages traditionnels, propriétés médicinales et applications agricoles.',
    siteName: 'ivoire.ai',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'ivoire.ai - Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ivoire.ai - Identification de Plantes Médicinales & Agricoles',
    description: 'Identifiez les plantes médicinales et agricoles avec l\'IA.',
    images: ['/icon-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ivoire.ai',
  },
  verification: {
    // Ajoutez vos codes de vérification ici si nécessaire
    // google: 'votre-code-google',
    // yandex: 'votre-code-yandex',
  },
};

export function generateViewport(): Viewport {
  return {
    themeColor: '#0ea5e9',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased bg-gray-50">
        <WebsiteStructuredData />
        <OfflineInit />
        <Header />
        <main className="pt-16 md:pt-20">
          {children}
        </main>
        <OfflineIndicator />
      </body>
    </html>
  );
}

