'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plant } from '@/types/plant';
import { searchPlants, filterPlants } from '@/data/plants';
import { 
  Search, 
  Filter, 
  X, 
  Leaf, 
  ChevronRight,
  Sprout,
  Heart
} from 'lucide-react';
import { DecorativePlants } from '@/components/PlantIllustrations';
export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [intent, setIntent] = useState<'agriculture' | 'medecine' | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') || '');
    const intentParam = params.get('intent');
    if (intentParam === 'agriculture' || intentParam === 'medecine') {
      setIntent(intentParam);
    }
  }, []);
  const [results, setResults] = useState<Plant[]>([]);
  const [filters, setFilters] = useState({
    plantType: '',
    partUsed: '',
    region: '',
    symptom: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchPlants(query);
      const filtered = applyFilters(searchResults);
      setResults(filtered);
    } else if (hasActiveFilters()) {
      const allPlants = filterPlants(filters);
      setResults(allPlants);
    } else {
      setResults([]);
    }
  }, [query, filters]);

  const hasActiveFilters = () => {
    return filters.plantType || filters.partUsed || filters.region || filters.symptom;
  };

  const applyFilters = (plants: Plant[]) => {
    if (!hasActiveFilters()) return plants;
    return filterPlants({
      plantType: filters.plantType || undefined,
      partUsed: filters.partUsed || undefined,
      region: filters.region || undefined,
      symptom: filters.symptom || undefined,
    }).filter(p => plants.includes(p));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      plantType: '',
      partUsed: '',
      region: '',
      symptom: '',
    });
    setQuery('');
  };

  const viewPlant = (plantId: string) => {
    router.push(`/plant/${plantId}`);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="decorative-circle decorative-circle-1"></div>
      <div className="decorative-circle decorative-circle-2"></div>
      {/* Decorative plants */}
      <DecorativePlants />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Rechercher une plante</h2>
          <p className="text-lg text-gray-600 mb-6">Trouvez des plantes par nom, symptôme ou caractéristiques</p>
          
          {/* Intent Selector */}
          {!intent && (
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setIntent('agriculture')}
                className="flex items-center space-x-2 px-6 py-3 bg-ochre-50 border-2 border-ochre-200 text-ochre-700 rounded-xl font-medium hover:bg-ochre-100 hover:border-ochre-300 transition-all"
              >
                <Sprout className="w-5 h-5" />
                <span>Agriculture</span>
              </button>
              <button
                onClick={() => setIntent('medecine')}
                className="flex items-center space-x-2 px-6 py-3 bg-terracotta-50 border-2 border-terracotta-200 text-terracotta-700 rounded-xl font-medium hover:bg-terracotta-100 hover:border-terracotta-300 transition-all"
              >
                <Heart className="w-5 h-5" />
                <span>Médecine</span>
              </button>
            </div>
          )}
          
          {intent && (
            <div className="mb-6">
              <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full ${
                intent === 'agriculture' 
                  ? 'bg-ochre-100 text-ochre-800 border-2 border-ochre-300' 
                  : 'bg-terracotta-100 text-terracotta-800 border-2 border-terracotta-300'
              }`}>
                {intent === 'agriculture' ? (
                  <>
                    <Sprout className="w-5 h-5" />
                    <span className="font-semibold">Filtre : Agriculture</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    <span className="font-semibold">Filtre : Médecine</span>
                  </>
                )}
                <button
                  onClick={() => setIntent(null)}
                  className="ml-2 hover:opacity-70 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-earth-200 p-6 mb-6 african-pattern-dots relative overflow-hidden">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par nom de plante, symptôme ou maladie..."
                className="w-full pl-12 pr-4 py-3 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                showFilters || hasActiveFilters()
                  ? 'bg-gradient-to-r from-earth-600 to-terracotta-600 text-white hover:from-earth-700 hover:to-terracotta-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filtres</span>
              {hasActiveFilters() && (
                <span className="bg-white text-earth-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {Object.values(filters).filter(v => v).length}
                </span>
              )}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de plante
                </label>
                <select
                  value={filters.plantType}
                  onChange={(e) => handleFilterChange('plantType', e.target.value)}
                  className="w-full px-4 py-2.5 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                >
                  <option value="">Tous</option>
                  <option value="arbre">Arbre</option>
                  <option value="arbuste">Arbuste</option>
                  <option value="herbe">Herbe</option>
                  <option value="liane">Liane</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partie utilisée
                </label>
                <select
                  value={filters.partUsed}
                  onChange={(e) => handleFilterChange('partUsed', e.target.value)}
                  className="w-full px-4 py-2.5 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                >
                  <option value="">Toutes</option>
                  <option value="feuilles">Feuilles</option>
                  <option value="racines">Racines</option>
                  <option value="écorce">Écorce</option>
                  <option value="fleurs">Fleurs</option>
                  <option value="fruits">Fruits</option>
                  <option value="graines">Graines</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Région
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full px-4 py-2.5 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                >
                  <option value="">Toutes</option>
                  <option value="Région tropicale">Région tropicale</option>
                  <option value="Région subtropicale">Région subtropicale</option>
                  <option value="Région tempérée">Région tempérée</option>
                  <option value="Région méditerranéenne">Région méditerranéenne</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptôme / Maladie
                </label>
                <input
                  type="text"
                  value={filters.symptom}
                  onChange={(e) => handleFilterChange('symptom', e.target.value)}
                  placeholder="Ex: paludisme, toux..."
                  className="w-full px-4 py-2.5 border border-earth-200 rounded-xl focus:ring-2 focus:ring-earth-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {(query || hasActiveFilters()) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="text-earth-600 hover:text-earth-700 font-medium text-sm flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Effacer tous les filtres</span>
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((plant) => (
              <div
                key={plant.id}
                onClick={() => viewPlant(plant.id)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-green-200 p-6 cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative z-10">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors line-clamp-1 relative z-10">
                      {plant.scientificName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{plant.commonNames.fr}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {plant.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-medium">
                    {plant.plantType}
                  </span>
                  {plant.properties.slice(0, 2).map((prop, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-xs font-medium"
                    >
                      {prop.type}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-green-600 font-medium text-sm group-hover:text-green-700 relative z-10">
                  <span>Voir la fiche</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : query || hasActiveFilters() ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg mb-4">Aucun résultat trouvé</p>
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-earth-100 to-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-earth-600" />
            </div>
            <p className="text-gray-600 text-lg">
              Commencez votre recherche en saisissant un nom de plante, un symptôme ou utilisez les filtres
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
