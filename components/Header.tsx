'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  Camera,
  BookOpen,
  Sprout,
  Heart,
  History,
  Star,
  Home
} from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  }, [searchQuery, router]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <header className="bg-green-600 backdrop-blur-xl shadow-premium-lg border-b border-green-700/30 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-sm hidden sm:block">
                ivoire.ai
              </h1>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une plante..."
                  className="w-full pl-12 pr-4 py-2.5 border border-green-500 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-800 transition-colors"
                >
                  Rechercher
                </button>
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link
                href="/"
                  className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors drop-shadow-sm"
              >
                <Home className="w-4 h-4 text-white" />
                <span>Accueil</span>
              </Link>
              <Link
                href="/identify"
                  className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors drop-shadow-sm"
              >
                <Camera className="w-4 h-4 text-white" />
                <span>Identifier</span>
              </Link>
              <Link
                href="/search"
                  className="group flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors drop-shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-white" />
                <span>Rechercher</span>
              </Link>
              <Link
                href="/contribute"
                  className="flex items-center space-x-2 bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-all shadow-md hover:shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Contribuer</span>
              </Link>
            </nav>

            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 text-white hover:text-green-200 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-green-200 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Search */}
          {showSearch && (
            <div className="md:hidden pb-4 animate-in slide-in-from-top">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une plante..."
                  className="w-full pl-12 pr-4 py-2.5 border border-green-500 rounded-xl focus:ring-2 focus:ring-green-300 focus:border-transparent bg-white"
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl animate-in slide-in-from-top shadow-lg">
            <nav className="px-4 py-4 space-y-1">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-900 hover:bg-green-50 hover:text-green-700 transition-colors font-semibold text-base"
              >
                <Home className="w-6 h-6" />
                <span>Accueil</span>
              </Link>
              <Link
                href="/identify"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-900 hover:bg-green-50 hover:text-green-700 transition-colors font-semibold text-base"
              >
                <Camera className="w-6 h-6" />
                <span>Identifier une plante</span>
              </Link>
              <Link
                href="/search"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-900 hover:bg-green-50 hover:text-green-700 transition-colors font-semibold text-base"
              >
                <BookOpen className="w-6 h-6" />
                <span>Rechercher</span>
              </Link>
              <Link
                href="/contribute"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-md"
              >
                <Sparkles className="w-6 h-6" />
                <span>Contribuer</span>
              </Link>
              <div className="pt-4 border-t border-gray-200 mt-2">
                <div className="px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Par intention
                </div>
                <Link
                  href="/search?intent=agriculture"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-900 hover:bg-ochre-50 hover:text-ochre-700 transition-colors font-medium text-base"
                >
                  <Sprout className="w-6 h-6" />
                  <span>Agriculture</span>
                </Link>
                <Link
                  href="/search?intent=medecine"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-4 rounded-xl text-gray-900 hover:bg-terracotta-50 hover:text-terracotta-700 transition-colors font-medium text-base"
                >
                  <Heart className="w-6 h-6" />
                  <span>Médecine</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

