# Système de Feedback Loop - ivoire.ai

Ce document décrit le système d'amélioration continue du modèle basé sur les retours utilisateurs.

## 🎯 Vue d'ensemble

Le système de feedback permet aux utilisateurs de :
1. **Noter** les prédictions (1-5 étoiles)
2. **Corriger** les identifications incorrectes
3. **Confirmer** les identifications correctes
4. **Commenter** pour apporter des précisions

Ces feedbacks sont ensuite utilisés pour ré-entraîner le modèle avec un poids plus élevé sur les corrections.

## 📊 Architecture

### 1. Collecte des Feedbacks

```
Utilisateur → Frontend (FeedbackSystem) → API /api/feedback → FeedbackService
                                                              ↓
                                                         Stockage JSON
                                                         + Images
```

### 2. Curation

Les feedbacks sont stockés avec le statut `pending`. Un curateur peut :
- **Approuver** : Le feedback sera utilisé pour l'entraînement
- **Rejeter** : Le feedback est ignoré (spam, incohérent, etc.)

### 3. Préparation du Dataset

Les feedbacks approuvés sont convertis en entrées d'entraînement avec :
- **Poids 1.0** : Confirmations (prédiction correcte)
- **Poids 2.0** (configurable) : Corrections (prédiction incorrecte)

### 4. Ré-entraînement

Le script `train_with_feedback.py` :
1. Charge les données originales
2. Ajoute les feedbacks approuvés avec leurs poids
3. Fine-tune le modèle existant
4. Marque les feedbacks comme "used"

## 🔧 Utilisation

### Enregistrer un Feedback

**Frontend :**
```typescript
import { submitFeedback, hashImage } from '@/lib/feedbackService';

const feedbackData = {
  imageHash: await hashImage(imageFile),
  predictedPlantId: 'moringa_oleifera',
  predictedConfidence: 85.5,
  feedbackType: 'correction',
  correctPlantId: 'aloe_vera',
  rating: 2,
  comment: 'Les feuilles sont différentes'
};

await submitFeedback(feedbackData, imageFile);
```

**API :**
```bash
POST /api/feedback
Content-Type: multipart/form-data

{
  "feedback": {
    "image_hash": "...",
    "predicted_plant_id": "...",
    "feedback_type": "correction",
    "correct_plant_id": "..."
  },
  "image": <file>
}
```

### Curater un Feedback

```bash
POST /api/feedback/{feedback_id}/curate
{
  "status": "approved",
  "curator_notes": "Correction valide",
  "curated_by": "admin"
}
```

### Préparer le Dataset d'Entraînement

```bash
GET /api/feedback/training-dataset?min_confidence=0.0&only_approved=true&correction_weight=2.0
```

### Ré-entraîner avec les Feedbacks

```bash
cd backend
python train_with_feedback.py \
  --data-dir data/training_images \
  --min-confidence 0.0 \
  --only-approved \
  --correction-weight 2.0
```

## 📈 Statistiques

Récupérer les statistiques sur les feedbacks :

```bash
GET /api/feedback/stats
```

Retourne :
- Nombre total de feedbacks
- Répartition par statut (pending, approved, rejected, used)
- Note moyenne
- Taux de correction
- Précision par plante
- Nombre de feedbacks à faible confiance

## 🔄 Pipeline Automatisé

### Option 1 : Script Cron (Recommandé)

Créer un script `retrain_periodic.py` :

```python
#!/usr/bin/env python3
"""
Script à exécuter périodiquement (cron) pour ré-entraîner avec les nouveaux feedbacks
"""

from train_with_feedback import train_with_feedback
from app.services.feedback_service import FeedbackService

# Vérifier s'il y a assez de nouveaux feedbacks
feedback_service = FeedbackService()
stats = feedback_service.get_stats()

if stats.approved_count >= 50:  # Seuil minimum
    print(f"Lancement de l'entraînement avec {stats.approved_count} feedbacks approuvés...")
    train_with_feedback(
        original_data_dir="data/training_images",
        min_confidence=0.0,
        only_approved=True,
        correction_weight=2.0
    )
    print("Entraînement terminé!")
else:
    print(f"Pas assez de feedbacks ({stats.approved_count}/50 minimum)")
```

**Cron job (hebdomadaire) :**
```bash
0 2 * * 0 cd /path/to/backend && python retrain_periodic.py >> logs/retrain.log 2>&1
```

### Option 2 : Webhook/API

Créer un endpoint admin pour déclencher manuellement :

```python
@app.post("/api/admin/retrain")
async def trigger_retraining():
    """Déclenche un ré-entraînement (admin seulement)"""
    # Vérifier les permissions admin
    # Lancer train_with_feedback en arrière-plan
    # Retourner un job_id pour suivre la progression
    pass
```

## 📊 Métriques de Succès

Suivre ces métriques pour évaluer l'efficacité :

1. **Taux de correction** : Devrait diminuer avec le temps
2. **Note moyenne** : Devrait augmenter
3. **Précision par plante** : Identifier les plantes problématiques
4. **Feedbacks à faible confiance** : Zones d'amélioration

## 🛡️ Qualité des Données

### Détection de Spam

- Limiter les feedbacks par session/IP
- Vérifier la cohérence (même image, feedbacks contradictoires)
- Détecter les patterns suspects

### Validation

- Vérifier que `correct_plant_id` existe dans la base
- Valider que l'image correspond au hash
- Vérifier les formats et types

## 🔐 Sécurité

1. **Rate Limiting** : Limiter les soumissions par utilisateur
2. **Validation** : Valider tous les inputs
3. **Curation** : Toujours curater avant d'utiliser pour l'entraînement
4. **Backup** : Sauvegarder les feedbacks avant ré-entraînement

## 📝 Exemple de Workflow Complet

1. **Utilisateur identifie une plante** → Prédiction avec 75% confiance
2. **Utilisateur note 2/5** → Feedback enregistré (pending)
3. **Curateur approuve** → Statut → approved
4. **Pipeline automatique** (hebdomadaire) :
   - Collecte les feedbacks approuvés
   - Prépare le dataset avec poids
   - Ré-entraîne le modèle
   - Marque les feedbacks comme "used"
5. **Nouveau modèle déployé** → Meilleure précision sur ce type de plante

## 🎓 Bonnes Pratiques

1. **Collecter activement** : Encourager les utilisateurs à donner du feedback
2. **Curater régulièrement** : Vérifier la qualité avant entraînement
3. **Ré-entraîner progressivement** : Ne pas tout ré-entraîner à chaque fois
4. **Monitorer** : Suivre les métriques et ajuster les poids si nécessaire
5. **Communiquer** : Informer les utilisateurs que leur feedback améliore le système

## 🚀 Prochaines Améliorations

- [ ] Interface de curation web
- [ ] Détection automatique de spam
- [ ] A/B testing des modèles
- [ ] Dashboard de métriques
- [ ] Notifications aux contributeurs
- [ ] Système de badges/récompenses

