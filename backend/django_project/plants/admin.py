from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.urls import path
from django.shortcuts import redirect
from django.db.models import Count, Q
from .models import Plant, MedicinalProperty, TraditionalUse
import export_utils


class HasMedicinalPropertiesFilter(admin.SimpleListFilter):
    title = 'Propriétés médicinales'
    parameter_name = 'has_medicinal'
    
    def lookups(self, request, model_admin):
        return (
            ('yes', 'Avec propriétés médicinales'),
            ('no', 'Sans propriétés médicinales'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.annotate(prop_count=Count('medicinal_properties')).filter(prop_count__gt=0)
        if self.value() == 'no':
            return queryset.annotate(prop_count=Count('medicinal_properties')).filter(prop_count=0)


class HasImagesFilter(admin.SimpleListFilter):
    title = 'Images'
    parameter_name = 'has_images'
    
    def lookups(self, request, model_admin):
        return (
            ('yes', 'Avec images'),
            ('no', 'Sans images'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.exclude(Q(images__isnull=True) | Q(images=[]))
        if self.value() == 'no':
            return queryset.filter(Q(images__isnull=True) | Q(images=[]))


@admin.register(Plant)
class PlantAdmin(admin.ModelAdmin):
    list_display = ['scientific_name', 'common_name_fr', 'family', 'get_plant_type_display_short', 'is_active', 'created_at']
    list_filter = ['plant_type', 'family', 'is_active', 'created_at', HasMedicinalPropertiesFilter, HasImagesFilter]
    search_fields = ['scientific_name', 'common_name_fr', 'plant_id', 'family', 'genus', 'species']
    prepopulated_fields = {'plant_id': ('scientific_name',)}
    readonly_fields = ['created_at', 'updated_at', 'images_preview']
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('export/csv/', self.admin_site.admin_view(self.export_csv), name='plants_plant_export_csv'),
            path('export/excel/', self.admin_site.admin_view(self.export_excel), name='plants_plant_export_excel'),
            path('export/pdf/', self.admin_site.admin_view(self.export_pdf), name='plants_plant_export_pdf'),
            path('export/json/', self.admin_site.admin_view(self.export_json), name='plants_plant_export_json'),
        ]
        return custom_urls + urls
    
    def export_csv(self, request):
        queryset = self.get_queryset(request)
        fields = ['plant_id', 'scientific_name', 'common_name_fr', 'family', 'genus', 'species', 
                 'plant_type', 'description', 'parts_used', 'regions', 'is_active', 'created_at']
        return export_utils.export_to_csv(self, request, queryset, fields, 'plantes')
    
    def export_excel(self, request):
        queryset = self.get_queryset(request)
        fields = ['plant_id', 'scientific_name', 'common_name_fr', 'family', 'genus', 'species', 
                 'plant_type', 'description', 'parts_used', 'regions', 'is_active', 'created_at']
        return export_utils.export_to_excel(self, request, queryset, fields, 'plantes')
    
    def export_pdf(self, request):
        queryset = self.get_queryset(request)
        fields = ['plant_id', 'scientific_name', 'common_name_fr', 'family', 'genus', 'species', 
                 'plant_type', 'description', 'is_active', 'created_at']
        return export_utils.export_to_pdf(self, request, queryset, fields, 'plantes')
    
    def export_json(self, request):
        queryset = self.get_queryset(request)
        fields = ['plant_id', 'scientific_name', 'common_name_fr', 'family', 'genus', 'species', 
                 'plant_type', 'description', 'parts_used', 'regions', 'is_active', 'created_at']
        return export_utils.export_to_json(self, request, queryset, fields, 'plantes')
    fieldsets = (
        ('Identifiant', {
            'fields': ('plant_id', 'is_active')
        }),
        ('Informations botaniques', {
            'fields': ('scientific_name', 'common_name_fr', 'common_names_local', 'family', 'genus', 'species', 'plant_type')
        }),
        ('Description', {
            'fields': ('description',)
        }),
        ('Utilisation', {
            'fields': ('parts_used', 'regions')
        }),
        ('Images', {
            'fields': ('images', 'images_preview'),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def images_preview(self, obj):
        if obj.images and len(obj.images) > 0:
            html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; margin-top: 10px;">'
            for idx, img in enumerate(obj.images[:10]):  # Limiter à 10 images
                html += f'''
                <div style="position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s;">
                    <img src="{img}" 
                         style="width: 100%; height: 150px; object-fit: cover; cursor: pointer;" 
                         onclick="window.open(this.src, '_blank')" 
                         onmouseover="this.parentElement.style.transform='scale(1.05)'"
                         onmouseout="this.parentElement.style.transform='scale(1)'"
                         title="Cliquez pour agrandir" />
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); color: white; padding: 5px; font-size: 0.8em; text-align: center;">
                        Image {idx + 1}
                    </div>
                </div>
                '''
            if len(obj.images) > 10:
                html += f'<div style="grid-column: span 2; padding: 20px; text-align: center; color: #666; background: #f9fafb; border-radius: 8px;">+ {len(obj.images) - 10} autres images</div>'
            html += '</div>'
            html += f'<p style="margin-top: 15px; color: #666; font-size: 0.9em;"><strong>Total:</strong> {len(obj.images)} image(s)</p>'
            return mark_safe(html)
        return format_html('<div style="padding: 20px; text-align: center; color: #999; background: #f9fafb; border-radius: 8px;">Aucune image</div>')
    images_preview.short_description = "Aperçu des images"
    
    def get_plant_type_display_short(self, obj):
        return obj.get_plant_type_display_short()
    get_plant_type_display_short.short_description = "Type"
    
    actions = ['activate_plants', 'deactivate_plants', 'duplicate_plants', 'export_selected']
    
    def activate_plants(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} plante(s) activée(s).", level='success')
    activate_plants.short_description = "✓ Activer les plantes sélectionnées"
    
    def deactivate_plants(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} plante(s) désactivée(s).", level='warning')
    deactivate_plants.short_description = "✗ Désactiver les plantes sélectionnées"
    
    def duplicate_plants(self, request, queryset):
        """Dupliquer les plantes sélectionnées"""
        count = 0
        for original_plant in queryset:
            # Créer une nouvelle instance
            plant = Plant(
                plant_id=f"{original_plant.plant_id}_copy_{count}",
                scientific_name=f"{original_plant.scientific_name} (copie)",
                common_name_fr=original_plant.common_name_fr,
                common_names_local=original_plant.common_names_local.copy() if original_plant.common_names_local else [],
                family=original_plant.family,
                genus=original_plant.genus,
                species=original_plant.species,
                description=original_plant.description,
                plant_type=original_plant.plant_type,
                parts_used=original_plant.parts_used.copy() if original_plant.parts_used else [],
                regions=original_plant.regions.copy() if original_plant.regions else [],
                images=original_plant.images.copy() if original_plant.images else [],
                is_active=False  # Désactiver par défaut
            )
            plant.save()
            count += 1
        self.message_user(request, f"{count} plante(s) dupliquée(s).", level='success')
    duplicate_plants.short_description = "Dupliquer les plantes sélectionnées"
    
    def export_selected(self, request, queryset):
        """Exporter les plantes sélectionnées"""
        from django.http import HttpResponse
        import json
        
        data = []
        for plant in queryset:
            data.append({
                'plant_id': plant.plant_id,
                'scientific_name': plant.scientific_name,
                'common_name_fr': plant.common_name_fr,
                'family': plant.family,
                'plant_type': plant.plant_type,
                'is_active': plant.is_active,
            })
        
        response = HttpResponse(json.dumps(data, indent=2, ensure_ascii=False), content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="plants_export.json"'
        return response
    export_selected.short_description = "Exporter les plantes sélectionnées (JSON)"


@admin.register(MedicinalProperty)
class MedicinalPropertyAdmin(admin.ModelAdmin):
    list_display = ['plant', 'property_type', 'evidence_level', 'description_short']
    list_filter = ['evidence_level', 'plant__family']
    search_fields = ['plant__scientific_name', 'property_type', 'description']
    raw_id_fields = ['plant']
    
    def description_short(self, obj):
        return obj.description[:100] + '...' if len(obj.description) > 100 else obj.description
    description_short.short_description = "Description"


@admin.register(TraditionalUse)
class TraditionalUseAdmin(admin.ModelAdmin):
    list_display = ['plant', 'indication', 'region', 'preparation_short']
    list_filter = ['region', 'plant__family']
    search_fields = ['plant__scientific_name', 'indication', 'preparation', 'recipe']
    raw_id_fields = ['plant']
    
    def preparation_short(self, obj):
        return obj.preparation[:100] + '...' if len(obj.preparation) > 100 else obj.preparation
    preparation_short.short_description = "Préparation"

