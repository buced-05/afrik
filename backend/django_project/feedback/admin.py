from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from django.contrib.auth.models import User
from django.urls import path
from django.db.models import Q
from .models import PredictionFeedback
import export_utils


class HighConfidenceFilter(admin.SimpleListFilter):
    title = 'Confiance élevée'
    parameter_name = 'high_confidence'
    
    def lookups(self, request, model_admin):
        return (
            ('high', 'Confiance élevée (≥70%)'),
            ('medium', 'Confiance moyenne (50-69%)'),
            ('low', 'Confiance faible (<50%)'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'high':
            return queryset.filter(predicted_confidence__gte=70)
        if self.value() == 'medium':
            return queryset.filter(predicted_confidence__gte=50, predicted_confidence__lt=70)
        if self.value() == 'low':
            return queryset.filter(predicted_confidence__lt=50)


class RatingFilter(admin.SimpleListFilter):
    title = 'Note'
    parameter_name = 'rating'
    
    def lookups(self, request, model_admin):
        return (
            ('5', '⭐⭐⭐⭐⭐ (5 étoiles)'),
            ('4', '⭐⭐⭐⭐ (4 étoiles)'),
            ('3', '⭐⭐⭐ (3 étoiles)'),
            ('2', '⭐⭐ (2 étoiles)'),
            ('1', '⭐ (1 étoile)'),
            ('no_rating', 'Sans note'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'no_rating':
            return queryset.filter(rating__isnull=True)
        if self.value():
            return queryset.filter(rating=int(self.value()))


@admin.register(PredictionFeedback)
class PredictionFeedbackAdmin(admin.ModelAdmin):
    list_display = ['id', 'image_thumb', 'predicted_plant', 'correct_plant', 'feedback_type', 'rating', 'status', 'timestamp', 'curated_by']
    list_filter = ['status', 'feedback_type', 'user_intent', 'timestamp', 'is_correct', 'predicted_plant__family', HighConfidenceFilter, RatingFilter]
    search_fields = ['predicted_plant__scientific_name', 'correct_plant__scientific_name', 'comment', 'session_id', 'image_hash', 'user__username']
    readonly_fields = ['timestamp', 'image_hash', 'image_preview', 'predicted_confidence_display']
    raw_id_fields = ['predicted_plant', 'correct_plant', 'user', 'curated_by']
    date_hierarchy = 'timestamp'
    list_per_page = 25
    list_select_related = ['predicted_plant', 'correct_plant', 'curated_by']
    
    def image_thumb(self, obj):
        if obj.image_path:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;" />',
                obj.image_path
            )
        return "-"
    image_thumb.short_description = "Image"
    
    def predicted_confidence_display(self, obj):
        color = "#28a745" if obj.predicted_confidence >= 70 else "#ffc107" if obj.predicted_confidence >= 50 else "#dc3545"
        return format_html(
            '<span style="color: {}; font-weight: bold;">{:.1f}%</span>',
            color, obj.predicted_confidence
        )
    predicted_confidence_display.short_description = "Confiance"
    
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('export/csv/', self.admin_site.admin_view(self.export_csv), name='feedback_predictionfeedback_export_csv'),
            path('export/excel/', self.admin_site.admin_view(self.export_excel), name='feedback_predictionfeedback_export_excel'),
            path('export/pdf/', self.admin_site.admin_view(self.export_pdf), name='feedback_predictionfeedback_export_pdf'),
            path('export/json/', self.admin_site.admin_view(self.export_json), name='feedback_predictionfeedback_export_json'),
        ]
        return custom_urls + urls
    
    def export_csv(self, request):
        queryset = self.get_queryset(request)
        fields = ['id', 'predicted_plant', 'correct_plant', 'feedback_type', 'rating', 'status', 
                 'predicted_confidence', 'is_correct', 'comment', 'user_intent', 'timestamp', 'curated_by']
        return export_utils.export_to_csv(self, request, queryset, fields, 'feedbacks')
    
    def export_excel(self, request):
        queryset = self.get_queryset(request)
        fields = ['id', 'predicted_plant', 'correct_plant', 'feedback_type', 'rating', 'status', 
                 'predicted_confidence', 'is_correct', 'comment', 'user_intent', 'timestamp', 'curated_by']
        return export_utils.export_to_excel(self, request, queryset, fields, 'feedbacks')
    
    def export_pdf(self, request):
        queryset = self.get_queryset(request)
        fields = ['id', 'predicted_plant', 'correct_plant', 'feedback_type', 'rating', 'status', 
                 'predicted_confidence', 'is_correct', 'timestamp']
        return export_utils.export_to_pdf(self, request, queryset, fields, 'feedbacks')
    
    def export_json(self, request):
        queryset = self.get_queryset(request)
        fields = ['id', 'predicted_plant', 'correct_plant', 'feedback_type', 'rating', 'status', 
                 'predicted_confidence', 'is_correct', 'comment', 'user_intent', 'timestamp', 'curated_by']
        return export_utils.export_to_json(self, request, queryset, fields, 'feedbacks')
    
    fieldsets = (
        ('Informations utilisateur', {
            'fields': ('user', 'session_id', 'user_intent', 'device_info')
        }),
        ('Prédiction originale', {
            'fields': ('predicted_plant', 'predicted_confidence', 'alternatives', 'image_hash', 'image_path', 'image_preview')
        }),
        ('Feedback', {
            'fields': ('feedback_type', 'rating', 'correct_plant', 'comment', 'is_correct')
        }),
        ('Curation', {
            'fields': ('status', 'curated_by', 'curated_at', 'curator_notes')
        }),
        ('Métadonnées', {
            'fields': ('timestamp',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['approve_feedbacks', 'reject_feedbacks', 'mark_as_used', 'reset_to_pending', 'bulk_curate']
    
    def image_preview(self, obj):
        if obj.image_path:
            return format_html(
                '<div style="position: relative; display: inline-block;">'
                '<img src="{}" style="max-width: 500px; max-height: 500px; border: 3px solid #667eea; border-radius: 12px; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.15); transition: transform 0.2s;" '
                'onclick="window.open(this.src, \'_blank\')" '
                'onmouseover="this.style.transform=\'scale(1.02)\'" '
                'onmouseout="this.style.transform=\'scale(1)\'" '
                'title="Cliquez pour ouvrir en plein écran" />'
                '<div style="margin-top: 15px; padding: 12px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #667eea;">'
                '<div style="font-size: 0.85em; color: #666; margin-bottom: 5px;"><strong>Hash:</strong> <code style="background: white; padding: 2px 6px; border-radius: 4px; font-size: 0.9em;">{}</code></div>'
                '<div style="font-size: 0.85em; color: #666;"><strong>Confiance:</strong> <span style="color: {}; font-weight: bold;">{:.1f}%</span></div>'
                '</div>'
                '</div>',
                obj.image_path, 
                obj.image_hash,
                "#28a745" if obj.predicted_confidence >= 70 else "#ffc107" if obj.predicted_confidence >= 50 else "#dc3545",
                obj.predicted_confidence
            )
        return format_html(
            '<div style="padding: 30px; text-align: center; background: #f9fafb; border-radius: 8px; color: #999;">'
            '📷 Aucune image disponible'
            '</div>'
        )
    image_preview.short_description = "Aperçu de l'image"
    
    def approve_feedbacks(self, request, queryset):
        updated = queryset.update(status='approved', curated_by=request.user, curated_at=timezone.now())
        self.message_user(request, f"{updated} feedback(s) approuvé(s).", level='success')
    approve_feedbacks.short_description = "✓ Approuver les feedbacks sélectionnés"
    
    def reject_feedbacks(self, request, queryset):
        updated = queryset.update(status='rejected', curated_by=request.user, curated_at=timezone.now())
        self.message_user(request, f"{updated} feedback(s) rejeté(s).", level='warning')
    reject_feedbacks.short_description = "✗ Rejeter les feedbacks sélectionnés"
    
    def mark_as_used(self, request, queryset):
        updated = queryset.update(status='used')
        self.message_user(request, f"{updated} feedback(s) marqué(s) comme utilisé(s).", level='success')
    mark_as_used.short_description = "📊 Marquer comme utilisé dans l'entraînement"
    
    def reset_to_pending(self, request, queryset):
        updated = queryset.update(status='pending', curated_by=None, curated_at=None)
        self.message_user(request, f"{updated} feedback(s) remis en attente.", level='info')
    reset_to_pending.short_description = "🔄 Remettre en attente"
    
    def bulk_curate(self, request, queryset):
        """Curater en masse avec note optionnelle"""
        # Cette action nécessiterait une interface plus complexe
        # Pour l'instant, on approuve simplement
        updated = queryset.update(status='approved', curated_by=request.user, curated_at=timezone.now())
        self.message_user(request, f"{updated} feedback(s) approuvé(s) en masse.", level='success')
    bulk_curate.short_description = "📝 Curater en masse (approbation)"

