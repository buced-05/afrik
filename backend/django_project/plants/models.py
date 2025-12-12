from django.db import models
from django.contrib import admin
from django.utils.html import format_html


class Plant(models.Model):
    """Modèle pour les plantes"""
    
    PLANT_TYPES = [
        ('arbre', 'Arbre'),
        ('arbuste', 'Arbuste'),
        ('herbe', 'Herbe'),
        ('liane', 'Liane'),
        ('autre', 'Autre'),
    ]
    
    # Identifiant unique
    plant_id = models.SlugField(max_length=200, unique=True, verbose_name="ID Plante")
    
    # Informations botaniques
    scientific_name = models.CharField(max_length=200, verbose_name="Nom scientifique")
    common_name_fr = models.CharField(max_length=200, verbose_name="Nom commun (FR)")
    common_names_local = models.JSONField(default=list, blank=True, verbose_name="Noms locaux")
    family = models.CharField(max_length=100, verbose_name="Famille")
    genus = models.CharField(max_length=100, verbose_name="Genre")
    species = models.CharField(max_length=100, verbose_name="Espèce")
    description = models.TextField(verbose_name="Description")
    plant_type = models.CharField(max_length=20, choices=PLANT_TYPES, verbose_name="Type de plante")
    
    # Informations d'utilisation
    parts_used = models.JSONField(default=list, verbose_name="Parties utilisées")
    regions = models.JSONField(default=list, blank=True, verbose_name="Régions")
    
    # Images
    images = models.JSONField(default=list, blank=True, verbose_name="Images")
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    
    class Meta:
        verbose_name = "Plante"
        verbose_name_plural = "Plantes"
        ordering = ['scientific_name']
    
    def __str__(self):
        return f"{self.scientific_name} ({self.common_name_fr})"
    
    @admin.display(description="Type")
    def get_plant_type_display_short(self):
        return dict(self.PLANT_TYPES).get(self.plant_type, self.plant_type)


class MedicinalProperty(models.Model):
    """Propriétés médicinales d'une plante"""
    
    EVIDENCE_LEVELS = [
        ('traditionnel', 'Traditionnel'),
        ('preliminaire', 'Préliminaire'),
        ('clinique', 'Clinique'),
    ]
    
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE, related_name='medicinal_properties', verbose_name="Plante")
    property_type = models.CharField(max_length=200, verbose_name="Type de propriété")
    description = models.TextField(verbose_name="Description")
    evidence_level = models.CharField(max_length=20, choices=EVIDENCE_LEVELS, default='traditionnel', verbose_name="Niveau de preuve")
    
    class Meta:
        verbose_name = "Propriété médicinale"
        verbose_name_plural = "Propriétés médicinales"
        ordering = ['property_type']
    
    def __str__(self):
        return f"{self.plant.scientific_name} - {self.property_type}"


class TraditionalUse(models.Model):
    """Usages traditionnels d'une plante"""
    
    plant = models.ForeignKey(Plant, on_delete=models.CASCADE, related_name='traditional_uses', verbose_name="Plante")
    indication = models.CharField(max_length=300, verbose_name="Indication")
    preparation = models.TextField(verbose_name="Préparation")
    recipe = models.TextField(blank=True, verbose_name="Recette")
    region = models.CharField(max_length=100, blank=True, verbose_name="Région")
    
    class Meta:
        verbose_name = "Usage traditionnel"
        verbose_name_plural = "Usages traditionnels"
        ordering = ['indication']
    
    def __str__(self):
        return f"{self.plant.scientific_name} - {self.indication}"

