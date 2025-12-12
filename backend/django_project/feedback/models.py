from django.db import models
from django.contrib.auth.models import User
from plants.models import Plant


class PredictionFeedback(models.Model):
    """Feedback sur une prédiction du modèle"""
    
    FEEDBACK_TYPES = [
        ('rating', 'Note'),
        ('correction', 'Correction'),
        ('comment', 'Commentaire'),
        ('confirmation', 'Confirmation'),
    ]
    
    FEEDBACK_STATUS = [
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
        ('used', 'Utilisé'),
    ]
    
    # Informations utilisateur
    session_id = models.CharField(max_length=200, blank=True, null=True, verbose_name="ID Session")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Utilisateur")
    
    # Données de la prédiction originale
    image_hash = models.CharField(max_length=64, db_index=True, verbose_name="Hash de l'image")
    image_path = models.CharField(max_length=500, blank=True, null=True, verbose_name="Chemin de l'image")
    predicted_plant = models.ForeignKey(Plant, on_delete=models.SET_NULL, null=True, related_name='predicted_feedbacks', verbose_name="Plante prédite")
    predicted_confidence = models.FloatField(verbose_name="Confiance prédite (%)")
    alternatives = models.JSONField(default=list, blank=True, verbose_name="Alternatives")
    
    # Feedback utilisateur
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPES, verbose_name="Type de feedback")
    rating = models.IntegerField(blank=True, null=True, verbose_name="Note (1-5)")
    correct_plant = models.ForeignKey(Plant, on_delete=models.SET_NULL, null=True, blank=True, related_name='correct_feedbacks', verbose_name="Plante correcte")
    comment = models.TextField(blank=True, verbose_name="Commentaire")
    is_correct = models.BooleanField(blank=True, null=True, verbose_name="Prédiction correcte")
    
    # Métadonnées
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Date")
    user_intent = models.CharField(max_length=50, blank=True, null=True, verbose_name="Intention utilisateur")
    device_info = models.JSONField(default=dict, blank=True, verbose_name="Informations appareil")
    status = models.CharField(max_length=20, choices=FEEDBACK_STATUS, default='pending', verbose_name="Statut")
    
    # Pour la curation
    curator_notes = models.TextField(blank=True, verbose_name="Notes du curateur")
    curated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='curated_feedbacks', verbose_name="Curateur")
    curated_at = models.DateTimeField(blank=True, null=True, verbose_name="Date de curation")
    
    class Meta:
        verbose_name = "Feedback de prédiction"
        verbose_name_plural = "Feedbacks de prédiction"
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['image_hash', 'status']),
            models.Index(fields=['status', '-timestamp']),
        ]
    
    def __str__(self):
        plant_name = self.predicted_plant.scientific_name if self.predicted_plant else "N/A"
        return f"Feedback {self.id} - {plant_name} ({self.feedback_type})"
    
    def save(self, *args, **kwargs):
        # Si le feedback est corrigé, marquer is_correct à False
        if self.feedback_type == 'correction' and self.correct_plant:
            self.is_correct = False
        elif self.feedback_type == 'confirmation':
            self.is_correct = True
        super().save(*args, **kwargs)

