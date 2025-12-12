# Guide de Configuration - ivoire.ai

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer les icônes PWA (optionnel mais recommandé) :
   - Créer `public/icon-192x192.png` (192x192 pixels)
   - Créer `public/icon-512x512.png` (512x512 pixels)
   - Créer `public/favicon.ico`

   Vous pouvez utiliser un outil en ligne comme [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) pour générer ces icônes.

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000)

## Build de Production

```bash
npm run build
npm start
```

## Fonctionnalités Implémentées

### ✅ Version 1 (MVP)

- [x] Page d'accueil avec navigation
- [x] Upload/prise de photo pour identification
- [x] Identification de plantes (mock AI - prêt pour intégration modèle réel)
- [x] Fiche plante complète avec :
  - Identification botanique
  - Parties utilisées
  - Propriétés médicinales
  - Usages traditionnels
  - Informations de sécurité
  - Statut scientifique
- [x] Recherche par nom, symptôme, type de plante, région
- [x] Filtres avancés
- [x] Avertissements médicaux systématiques
- [x] Design responsive mobile-first
- [x] Support PWA (Progressive Web App)
- [x] IndexedDB pour stockage hors-ligne
- [x] Indicateur de statut hors-ligne

## Architecture

- **Frontend** : Next.js 14 (App Router) + React + TypeScript
- **Styling** : Tailwind CSS
- **Base de données** : IndexedDB (client-side) + données statiques
- **PWA** : @ducanh2912/next-pwa pour service worker (version moderne et maintenue)
- **Offline** : IndexedDB + Service Worker

## Prochaines Étapes (Versions Futures)

### Version 2
- [ ] Intégration d'un vrai modèle de reconnaissance d'images (TensorFlow.js ou API)
- [ ] Recherche par symptôme améliorée
- [ ] Extension de la base de données (plus de plantes)
- [ ] Personnalisation de l'explication IA (niveau débutant/avancé)

### Version 3
- [ ] Espace expert pour enrichir les fiches
- [ ] Statistiques d'usage et tableau de bord
- [ ] Synchronisation cloud pour nouvelles fiches
- [ ] Modèle TensorFlow.js embarqué pour reconnaissance hors-ligne complète

## Intégration d'un Modèle IA Réel

Pour intégrer un vrai modèle de reconnaissance de plantes :

1. **Option 1 : TensorFlow.js (Offline)**
   - Télécharger un modèle pré-entraîné (ex: basé sur PlantNet)
   - Convertir au format TensorFlow.js
   - Modifier `lib/plantIdentification.ts` pour utiliser le modèle

2. **Option 2 : API Externe**
   - Utiliser une API comme PlantNet API
   - Modifier `lib/plantIdentification.ts` pour appeler l'API
   - Gérer le cache pour le mode hors-ligne

3. **Option 3 : Backend Dédié**
   - Créer un microservice FastAPI/Python
   - Héberger un modèle PyTorch/TensorFlow
   - Appeler depuis le frontend via API REST

## Notes Importantes

- ⚠️ L'identification actuelle est un **mock** pour démonstration
- ⚠️ Les données de plantes sont limitées (4 plantes d'exemple)
- ⚠️ Les icônes PWA doivent être créées pour une installation complète
- ⚠️ Le service worker est désactivé en développement (normal)

## Support

Pour toute question ou problème, consultez la documentation Next.js ou créez une issue.

