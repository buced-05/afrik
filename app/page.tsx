'use client';

import Link from 'next/link';
import { Camera, Search, Leaf, FlaskConical, Smartphone, AlertTriangle, Sparkles, Sprout, Heart, ArrowRight, Zap, Shield } from 'lucide-react';
import { DecorativePlants } from '@/components/PlantIllustrations';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="decorative-circle decorative-circle-1"></div>
      <div className="decorative-circle decorative-circle-2"></div>
      {/* Decorative plants */}
      <DecorativePlants />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-12 pt-20 md:pt-24">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center space-x-2 md:space-x-3 glass-premium px-4 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-base font-bold mb-4 md:mb-6 animate-fade-in shadow-premium-lg border border-green-300/60 backdrop-blur-xl">
              <div className="relative">
                <Zap className="w-3 h-3 md:w-5 md:h-5 text-green-700 relative z-10" />
              </div>
              <span className="text-gray-900 font-semibold text-xs md:text-base">IA de reconnaissance avancée</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-gray-900 mb-4 md:mb-6 leading-[1.1] animate-slide-up tracking-tight px-2">
              <span className="block">Identification</span>
              <span className="block text-gray-800 mt-1 md:mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold">
                de Plantes
              </span>
              <span className="block text-green-600 text-2xl sm:text-3xl md:text-4xl lg:text-6xl mt-2 md:mt-3 font-extrabold">
                Médicinales & Agricoles
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-700 mb-6 md:mb-10 max-w-4xl mx-auto leading-relaxed animate-slide-up-delay font-semibold px-4">
              <span className="text-gray-900">Identifiez les plantes</span> pour leurs usages médicinaux et agricoles. 
              <span className="text-gray-600"> Comparez vos photos</span> avec nos images de référence pour une <span className="text-green-700 font-bold">identification précise</span>.
            </p>
            <div className="flex flex-col gap-3 md:gap-4 justify-center mb-8 md:mb-12 animate-slide-up-delay-2 px-2">
              <Link
                href="/identify"
                className="group relative bg-green-600 hover:bg-green-700 text-white px-6 md:px-14 py-4 md:py-7 rounded-2xl md:rounded-[2rem] font-black text-base md:text-2xl shadow-ultra flex items-center justify-center space-x-2 md:space-x-4 transform hover-lift-smooth w-full sm:w-auto transition-colors duration-200 border-2 border-green-700"
              >
                <Camera className="w-5 h-5 md:w-9 md:h-9 relative z-10 text-white" />
                <span className="relative z-10 tracking-tight text-white font-black text-sm md:text-2xl">Identifier une plante</span>
                <ArrowRight className="w-5 h-5 md:w-9 md:h-9 relative z-10 text-white" />
              </Link>
              <Link
                href="/search"
                className="group bg-white hover:bg-green-50 text-gray-900 px-6 md:px-14 py-4 md:py-7 rounded-2xl md:rounded-[2rem] font-black text-base md:text-2xl border-2 border-green-600 hover:border-green-700 transition-all shadow-premium-lg hover:shadow-ultra flex items-center justify-center space-x-2 md:space-x-4 transform hover-lift-smooth w-full sm:w-auto"
              >
                <Search className="w-5 h-5 md:w-9 md:h-9 text-green-700" />
                <span className="tracking-tight font-black text-gray-900 text-sm md:text-2xl">Rechercher</span>
              </Link>
              <Link
                href="/contribute"
                className="group relative bg-teal-600 hover:bg-teal-700 text-white px-6 md:px-14 py-4 md:py-7 rounded-2xl md:rounded-[2rem] font-black text-base md:text-2xl shadow-ultra flex items-center justify-center space-x-2 md:space-x-4 transform hover-lift-smooth w-full sm:w-auto transition-colors duration-200 border-2 border-teal-700"
              >
                <Sparkles className="w-5 h-5 md:w-9 md:h-9 relative z-10 text-white" />
                <span className="relative z-10 tracking-tight text-white font-black text-sm md:text-2xl">Contribuer</span>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-10 mb-12 md:mb-24 max-w-6xl mx-auto relative px-2">
            <Link
              href="/identify?intent=agriculture"
              className="group card-ultra p-6 md:p-12 rounded-2xl md:rounded-[2.5rem] border border-ochre-200/60 hover:border-ochre-500 relative overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-ochre-50/50 via-white/80 to-ochre-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-ochre-500 via-ochre-600 to-ochre-700 rounded-xl md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-ultra relative mx-auto md:mx-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-ochre-400 to-ochre-600 rounded-xl md:rounded-[2rem] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"></div>
                  <Sprout className="w-8 h-8 md:w-12 md:h-12 text-white relative z-10 drop-shadow-2xl" />
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-3 md:mb-5 group-hover:text-ochre-700 transition-colors drop-shadow-sm text-center md:text-left">Usage Agricole</h3>
                <p className="text-gray-700 leading-relaxed mb-4 md:mb-8 text-sm md:text-xl font-semibold text-center md:text-left">
                  Identifiez les plantes pour la culture, la production et la gestion agricole
                </p>
                <div className="flex items-center justify-center md:justify-start text-ochre-700 font-black text-base md:text-xl group-hover:text-ochre-800">
                  <span>Commencer</span>
                  <ArrowRight className="w-4 h-4 md:w-6 md:h-6 ml-2 md:ml-4 group-hover:translate-x-3 transition-transform" />
                </div>
              </div>
            </Link>
            <Link
              href="/identify?intent=medecine"
              className="group card-ultra p-6 md:p-12 rounded-2xl md:rounded-[2.5rem] border border-terracotta-200/60 hover:border-terracotta-500 relative overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/50 via-white/80 to-rose-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-terracotta-500 via-rose-600 to-pink-700 rounded-xl md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-ultra relative mx-auto md:mx-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-terracotta-400 to-rose-600 rounded-xl md:rounded-[2rem] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"></div>
                  <Heart className="w-8 h-8 md:w-12 md:h-12 text-white relative z-10 drop-shadow-2xl" />
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-3 md:mb-5 group-hover:text-terracotta-700 transition-colors drop-shadow-sm text-center md:text-left">Usage Médical</h3>
                <p className="text-gray-700 leading-relaxed mb-4 md:mb-8 text-sm md:text-xl font-semibold text-center md:text-left">
                  Découvrez les propriétés médicinales et les usages traditionnels des plantes
                </p>
                <div className="flex items-center justify-center md:justify-start text-terracotta-700 font-black text-base md:text-xl group-hover:text-terracotta-800">
                  <span>Commencer</span>
                  <ArrowRight className="w-4 h-4 md:w-6 md:h-6 ml-2 md:ml-4 group-hover:translate-x-3 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-10 mb-12 md:mb-28 px-2">
            <div className="group card-ultra p-6 md:p-14 rounded-2xl md:rounded-[2.5rem] border border-green-300/40 hover:border-green-500/60 relative overflow-hidden glass-water backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(34,197,94,0.08)_90deg,transparent_180deg)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(34,197,94,0.05)_50%,transparent_100%)] opacity-30"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-green-500/80 via-emerald-600/90 to-teal-600/80 backdrop-blur-lg rounded-xl md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-ultra relative border border-white/20 mx-auto md:mx-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/60 to-emerald-500/70 rounded-xl md:rounded-[2rem] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"></div>
                  <Leaf className="w-8 h-8 md:w-12 md:h-12 text-black relative z-10 drop-shadow-lg" />
                </div>
                <h3 className="text-xl md:text-3xl font-black text-gray-900 mb-3 md:mb-6 group-hover:text-green-700 transition-colors drop-shadow-sm text-center md:text-left">Identification IA</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-lg font-semibold text-center md:text-left">
                  Prenez une photo et identifiez instantanément la plante. Comparez avec nos images de référence pour confirmer l'identification
                </p>
              </div>
            </div>
            <div className="group card-ultra p-6 md:p-14 rounded-2xl md:rounded-[2.5rem] border border-amber-200/70 hover:border-amber-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.12),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(245,158,11,0.05)_90deg,transparent_180deg)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 rounded-xl md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-ultra relative mx-auto md:mx-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl md:rounded-[2rem] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"></div>
                  <FlaskConical className="w-8 h-8 md:w-12 md:h-12 text-white relative z-10 drop-shadow-2xl" />
                </div>
                <h3 className="text-xl md:text-3xl font-black text-gray-900 mb-3 md:mb-6 group-hover:text-amber-700 transition-colors drop-shadow-sm text-center md:text-left">Usages Médicinaux & Agricoles</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-lg font-semibold text-center md:text-left">
                  Découvrez les propriétés médicinales, usages agricoles, préparations et informations détaillées pour chaque plante
                </p>
              </div>
            </div>
            <div className="group card-ultra p-6 md:p-14 rounded-2xl md:rounded-[2.5rem] border border-green-300/40 hover:border-green-500/60 relative overflow-hidden glass-water backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(34,197,94,0.08)_90deg,transparent_180deg)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(34,197,94,0.05)_50%,transparent_100%)] opacity-30"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-green-500/80 via-teal-600/90 to-cyan-600/80 backdrop-blur-lg rounded-xl md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-ultra relative border border-white/20 mx-auto md:mx-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/60 to-teal-500/70 rounded-xl md:rounded-[2rem] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"></div>
                  <Smartphone className="w-8 h-8 md:w-12 md:h-12 text-black relative z-10 drop-shadow-lg" />
                </div>
                <h3 className="text-xl md:text-3xl font-black text-gray-900 mb-3 md:mb-6 group-hover:text-green-700 transition-colors drop-shadow-sm text-center md:text-left">Mode Hors-ligne</h3>
                <p className="text-gray-700 leading-relaxed text-sm md:text-lg font-semibold text-center md:text-left">
                  Fonctionne sans connexion internet après la première installation pour une utilisation sur le terrain
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="relative rounded-2xl md:rounded-[3rem] p-8 md:p-24 mb-12 md:mb-28 overflow-hidden bg-green-600 mx-2 md:mx-0">
            <div className="relative z-10 grid md:grid-cols-3 gap-8 md:gap-20 text-center">
              <div className="group">
                <div className="relative inline-block mb-4 md:mb-8">
                  <div className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-2 md:mb-4 text-white drop-shadow-lg relative z-10">100+</div>
                </div>
                <div className="text-white text-base md:text-2xl font-bold tracking-wide">Plantes référencées</div>
                <div className="text-green-100 text-sm md:text-lg mt-2 md:mt-3 font-semibold">Base de données complète</div>
              </div>
              <div className="group">
                <div className="relative inline-block mb-4 md:mb-8">
                  <div className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-2 md:mb-4 text-white drop-shadow-lg relative z-10">95%</div>
                </div>
                <div className="text-white text-base md:text-2xl font-bold tracking-wide">Précision d'identification</div>
                <div className="text-green-100 text-sm md:text-lg mt-2 md:mt-3 font-semibold">Technologie IA avancée</div>
              </div>
              <div className="group">
                <div className="relative inline-block mb-4 md:mb-8">
                  <div className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-2 md:mb-4 text-white drop-shadow-lg relative z-10">24/7</div>
                </div>
                <div className="text-white text-base md:text-2xl font-bold tracking-wide">Disponible hors-ligne</div>
                <div className="text-green-100 text-sm md:text-lg mt-2 md:mt-3 font-semibold">Accessible partout</div>
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 mb-2 text-lg">Avertissement Important</h4>
                <p className="text-amber-800 text-sm leading-relaxed">
                  Cette application fournit des informations à titre éducatif uniquement. 
                  Pour les usages médicinaux, elle ne remplace pas l'avis d'un médecin ou d'un professionnel de santé. 
                  Pour les usages agricoles, consultez un agronome pour des conseils adaptés à votre contexte. 
                  Consultez toujours un professionnel avant d'utiliser des plantes médicinales, 
                  surtout en cas de grossesse, d'allaitement, ou de pathologies existantes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white py-12 border-t border-earth-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-earth-600 to-terracotta-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">ivoire.ai</span>
              </div>
              <p className="text-gray-400 text-sm">
                Identification intelligente de plantes pour usages médicinaux et agricoles
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Navigation</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
                <li><Link href="/identify" className="hover:text-white transition-colors">Identifier</Link></li>
                <li><Link href="/search" className="hover:text-white transition-colors">Rechercher</Link></li>
                <li><Link href="/contribute" className="hover:text-white transition-colors">Contribuer</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Par intention</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/search?intent=agriculture" className="hover:text-white transition-colors">Agriculture</Link></li>
                <li><Link href="/search?intent=medecine" className="hover:text-white transition-colors">Médecine</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">À propos</h5>
              <p className="text-gray-400 text-sm">
                Valorisation des savoirs traditionnels sur les plantes médicinales et agricoles
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2024 ivoire.ai - Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  );
}
