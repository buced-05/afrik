"""
Admin site personnalisé pour ivoire.ai avec dashboard complet
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth.models import User, Group
from django.urls import path, reverse
from django.shortcuts import render
from django.db.models import Count, Q, Avg, Sum, F
from django.utils import timezone
from datetime import timedelta
from plants.models import Plant, MedicinalProperty, TraditionalUse
from feedback.models import PredictionFeedback
from plants.admin import PlantAdmin, MedicinalPropertyAdmin, TraditionalUseAdmin
from feedback.admin import PredictionFeedbackAdmin


class IvoireAdminSite(admin.AdminSite):
    site_header = "ivoire.ai - Administration Professionnelle"
    site_title = "ivoire.ai Admin"
    index_title = "Tableau de bord"
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Enregistrer les modèles
        self.register(User, UserAdmin)
        self.register(Group, GroupAdmin)
        self.register(Plant, PlantAdmin)
        self.register(MedicinalProperty, MedicinalPropertyAdmin)
        self.register(TraditionalUse, TraditionalUseAdmin)
        self.register(PredictionFeedback, PredictionFeedbackAdmin)
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_view(self.dashboard_view), name='dashboard'),
        ]
        return custom_urls + urls
    
    def dashboard_view(self, request):
        """Vue personnalisée du tableau de bord avec statistiques complètes"""
        
        # ===== GESTION DES FILTRES TEMPORELS (EN PREMIER) =====
        period = request.GET.get('period', '7')
        date_from = request.GET.get('date_from')
        date_to = request.GET.get('date_to')
        
        # Déterminer la période de filtrage
        if date_from and date_to:
            # Période personnalisée
            try:
                from django.utils.dateparse import parse_date
                from datetime import datetime
                
                start_date = parse_date(date_from)
                end_date = parse_date(date_to)
                
                if start_date and end_date:
                    period_start = timezone.make_aware(datetime.combine(start_date, datetime.min.time()))
                    period_end = timezone.make_aware(datetime.combine(end_date, datetime.max.time()))
                    period_label = f"{start_date.strftime('%d/%m/%Y')} - {end_date.strftime('%d/%m/%Y')}"
                else:
                    raise ValueError("Invalid dates")
            except:
                period_start = timezone.now() - timedelta(days=7)
                period_end = timezone.now()
                period_label = "7 derniers jours"
                date_from = None
                date_to = None
        else:
            # Période prédéfinie
            try:
                period_days = int(period)
            except:
                period_days = 7
            
            period_end = timezone.now()
            
            if period_days == 1:
                period_start = period_end - timedelta(hours=24)
                period_label = "24 dernières heures"
            elif period_days == 7:
                period_start = period_end - timedelta(days=7)
                period_label = "7 derniers jours"
            elif period_days == 30:
                period_start = period_end - timedelta(days=30)
                period_label = "1 mois"
            elif period_days == 365:
                period_start = period_end - timedelta(days=365)
                period_label = "1 an"
            else:
                period_start = period_end - timedelta(days=period_days)
                period_label = f"{period_days} derniers jours"
        
        # Filtres de base pour les requêtes
        feedback_filter = Q(timestamp__gte=period_start) & Q(timestamp__lte=period_end)
        plant_filter = Q(created_at__gte=period_start) & Q(created_at__lte=period_end)
        
        # ===== STATISTIQUES GÉNÉRALES (FILTRÉES PAR PÉRIODE) =====
        total_plants = Plant.objects.filter(plant_filter).count()
        active_plants = Plant.objects.filter(plant_filter, is_active=True).count()
        total_feedbacks = PredictionFeedback.objects.filter(feedback_filter).count()
        pending_feedbacks = PredictionFeedback.objects.filter(feedback_filter, status='pending').count()
        approved_feedbacks = PredictionFeedback.objects.filter(feedback_filter, status='approved').count()
        
        # ===== STATISTIQUES PAR TYPE DE PLANTE (FILTRÉES) =====
        plants_by_type = list(Plant.objects.filter(plant_filter).values('plant_type').annotate(
            count=Count('id')
        ).order_by('-count'))
        
        # ===== STATISTIQUES PAR FAMILLE (FILTRÉES) =====
        plants_by_family = Plant.objects.filter(plant_filter).values('family').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # ===== STATISTIQUES DE FEEDBACKS (FILTRÉES) =====
        feedbacks_by_status = list(PredictionFeedback.objects.filter(feedback_filter).values('status').annotate(
            count=Count('id')
        ).order_by('-count'))
        
        feedbacks_by_type = PredictionFeedback.objects.filter(feedback_filter).values('feedback_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # ===== TAUX DE PRÉCISION (FILTRÉ) =====
        correct_predictions = PredictionFeedback.objects.filter(feedback_filter, is_correct=True).count()
        incorrect_predictions = PredictionFeedback.objects.filter(feedback_filter, is_correct=False).count()
        total_rated = correct_predictions + incorrect_predictions
        accuracy_rate = (correct_predictions / total_rated * 100) if total_rated > 0 else 0
        
        # ===== NOTE MOYENNE (FILTRÉE) =====
        avg_rating = PredictionFeedback.objects.filter(feedback_filter, rating__isnull=False).aggregate(
            avg=Avg('rating')
        )['avg'] or 0
        
        # ===== CONFIANCE MOYENNE (FILTRÉE) =====
        avg_confidence = PredictionFeedback.objects.filter(feedback_filter).aggregate(
            avg=Avg('predicted_confidence')
        )['avg'] or 0
        
        # ===== STATISTIQUES FILTRÉES PAR PÉRIODE (DÉJÀ CALCULÉES AU-DESSUS) =====
        recent_feedbacks = total_feedbacks
        recent_plants = total_plants
        
        # ===== TOP PLANTES LES PLUS IDENTIFIÉES (FILTRÉES) =====
        # Note: feedback_filter references PredictionFeedback fields, so we need to use the related field path
        top_plants = Plant.objects.annotate(
            feedback_count=Count('predicted_feedbacks', filter=Q(predicted_feedbacks__timestamp__gte=period_start) & Q(predicted_feedbacks__timestamp__lte=period_end))
        ).filter(feedback_count__gt=0).order_by('-feedback_count')[:10]
        
        # ===== FEEDBACKS RÉCENTS (FILTRÉS) =====
        recent_feedback_list = PredictionFeedback.objects.filter(feedback_filter).select_related(
            'predicted_plant', 'correct_plant'
        ).order_by('-timestamp')[:10]
        
        # ===== STATISTIQUES PAR INTENTION UTILISATEUR (FILTRÉES) =====
        feedbacks_by_intent = PredictionFeedback.objects.filter(feedback_filter).values('user_intent').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # ===== STATISTIQUES DE CONSERVATION (FILTRÉES PAR PÉRIODE) =====
        # Pour les images JSONField, on vérifie qu'il y a au moins un élément
        plants_in_period = Plant.objects.filter(plant_filter)
        plants_with_images = sum(1 for p in plants_in_period if p.images and len(p.images) > 0)
        plants_without_images = total_plants - plants_with_images
        plants_with_medicinal = plants_in_period.filter(medicinal_properties__isnull=False).distinct().count()
        plants_with_uses = plants_in_period.filter(traditional_uses__isnull=False).distinct().count()
        
        # ===== TAUX DE COMPLÉTUDE DES DONNÉES (FILTRÉ) =====
        completeness_rate = 0
        if total_plants > 0:
            plants_complete = sum(1 for p in plants_in_period.prefetch_related('medicinal_properties') 
                                  if p.images and len(p.images) > 0 and p.medicinal_properties.exists())
            completeness_rate = round((plants_complete / total_plants) * 100, 1)
        
        # ===== ÉVOLUTION DANS LA PÉRIODE =====
        # Calculer les points de données selon la période
        monthly_labels = []
        monthly_plants = []
        monthly_feedbacks = []
        
        # Utiliser la période sélectionnée pour l'évolution
        delta = period_end - period_start
        days_count = delta.days + 1
        
        if days_count <= 7:
            # Affichage par jour
            for i in range(days_count):
                day_start = period_start + timedelta(days=i)
                day_end = day_start + timedelta(days=1) if i < days_count - 1 else period_end
                monthly_labels.append(day_start.strftime('%d/%m'))
                monthly_plants.append(Plant.objects.filter(
                    created_at__gte=day_start,
                    created_at__lt=day_end
                ).count())
                monthly_feedbacks.append(PredictionFeedback.objects.filter(
                    timestamp__gte=day_start,
                    timestamp__lt=day_end
                ).count())
        elif days_count <= 30:
            # Affichage par jour
            for i in range(days_count):
                day_start = period_start + timedelta(days=i)
                day_end = day_start + timedelta(days=1) if i < days_count - 1 else period_end
                monthly_labels.append(day_start.strftime('%d/%m'))
                monthly_plants.append(Plant.objects.filter(
                    created_at__gte=day_start,
                    created_at__lt=day_end
                ).count())
                monthly_feedbacks.append(PredictionFeedback.objects.filter(
                    timestamp__gte=day_start,
                    timestamp__lt=day_end
                ).count())
        else:
            # Affichage par semaine/mois
            step = max(1, days_count // 30)
            points_count = min(30, days_count // step)
            for i in range(points_count):
                day_start = period_start + timedelta(days=i * step)
                day_end = day_start + timedelta(days=step) if i < points_count - 1 else period_end
                if days_count > 365:
                    monthly_labels.append(day_start.strftime('%m/%Y'))
                else:
                    monthly_labels.append(day_start.strftime('%d/%m'))
                monthly_plants.append(Plant.objects.filter(
                    created_at__gte=day_start,
                    created_at__lt=day_end
                ).count())
                monthly_feedbacks.append(PredictionFeedback.objects.filter(
                    timestamp__gte=day_start,
                    timestamp__lt=day_end
                ).count())
        
        # ===== DONNÉES TEMPORELLES POUR LE GRAPHIQUE (TIMELINE) =====
        timeline_labels = monthly_labels
        timeline_data = monthly_feedbacks
        
        # ===== FAMILLES LES PLUS REPRÉSENTÉES (FILTRÉES) =====
        top_families = list(Plant.objects.filter(plant_filter).values('family').annotate(
            count=Count('id')
        ).order_by('-count')[:5])
        
        # ===== PLANTES AVEC PLUS DE PROPRIÉTÉS MÉDICINALES (FILTRÉES) =====
        top_medicinal_plants = plants_in_period.annotate(
            prop_count=Count('medicinal_properties')
        ).filter(prop_count__gt=0).order_by('-prop_count')[:5]
        
        # ===== STATISTIQUES DE CONSERVATION DÉTAILLÉES (FILTRÉES) =====
        plants_with_description = plants_in_period.exclude(description__isnull=True).exclude(description='').count()
        plants_with_regions = plants_in_period.exclude(Q(regions__isnull=True) | Q(regions=[])).count()
        plants_with_parts_used = plants_in_period.exclude(Q(parts_used__isnull=True) | Q(parts_used=[])).count()
        
        # Plantes complètement documentées (avec images, propriétés médicinales ET usages traditionnels)
        fully_documented = sum(1 for p in plants_in_period.prefetch_related('medicinal_properties', 'traditional_uses')
                               if p.images and len(p.images) > 0 
                               and p.medicinal_properties.exists() 
                               and p.traditional_uses.exists())
        
        conservation_stats = {
            'documented': plants_with_medicinal + plants_with_uses,
            'with_images': plants_with_images,
            'fully_documented': fully_documented,
            'with_description': plants_with_description,
            'with_regions': plants_with_regions,
            'with_parts_used': plants_with_parts_used,
            'documentation_rate': round((plants_with_images / total_plants * 100) if total_plants > 0 else 0, 1),
            'medicinal_coverage': round((plants_with_medicinal / total_plants * 100) if total_plants > 0 else 0, 1)
        }
        
        # URLs pour le menu de navigation
        try:
            # Utiliser reverse avec le namespace admin
            admin_urls = {
                'dashboard': reverse('admin:dashboard'),
                'index': reverse('admin:index'),
                'plants': reverse('admin:plants_plant_changelist'),
                'plant_add': reverse('admin:plants_plant_add'),
                'medicinal_properties': reverse('admin:plants_medicinalproperty_changelist'),
                'medicinal_property_add': reverse('admin:plants_medicinalproperty_add'),
                'traditional_uses': reverse('admin:plants_traditionaluse_changelist'),
                'traditional_use_add': reverse('admin:plants_traditionaluse_add'),
                'feedbacks': reverse('admin:feedback_predictionfeedback_changelist'),
                'feedback_add': reverse('admin:feedback_predictionfeedback_add'),
                'users': reverse('admin:auth_user_changelist'),
                'user_add': reverse('admin:auth_user_add'),
                'groups': reverse('admin:auth_group_changelist'),
                'group_add': reverse('admin:auth_group_add'),
            }
        except Exception as e:
            # Fallback si les URLs ne sont pas encore disponibles
            admin_urls = {
                'dashboard': '/admin/dashboard/',
                'index': '/admin/',
                'plants': '/admin/plants/plant/',
                'plant_add': '/admin/plants/plant/add/',
                'medicinal_properties': '/admin/plants/medicinalproperty/',
                'medicinal_property_add': '/admin/plants/medicinalproperty/add/',
                'traditional_uses': '/admin/plants/traditionaluse/',
                'traditional_use_add': '/admin/plants/traditionaluse/add/',
                'feedbacks': '/admin/feedback/predictionfeedback/',
                'feedback_add': '/admin/feedback/predictionfeedback/add/',
                'users': '/admin/auth/user/',
                'user_add': '/admin/auth/user/add/',
                'groups': '/admin/auth/group/',
                'group_add': '/admin/auth/group/add/',
            }
        
        import json
        context = {
            **self.each_context(request),
            'admin_urls': admin_urls,
            'total_plants': total_plants,
            'active_plants': active_plants,
            'inactive_plants': total_plants - active_plants,
            'total_feedbacks': total_feedbacks,
            'pending_feedbacks': pending_feedbacks,
            'approved_feedbacks': approved_feedbacks,
            'rejected_feedbacks': PredictionFeedback.objects.filter(feedback_filter, status='rejected').count(),
            'used_feedbacks': PredictionFeedback.objects.filter(feedback_filter, status='used').count(),
            'plants_by_type': json.dumps(list(plants_by_type)),
            'plants_by_family': plants_by_family,
            'feedbacks_by_status': json.dumps(list(feedbacks_by_status)),
            'feedbacks_by_type': feedbacks_by_type,
            'correct_predictions': correct_predictions,
            'incorrect_predictions': incorrect_predictions,
            'accuracy_rate': round(accuracy_rate, 2),
            'avg_rating': round(avg_rating, 2),
            'avg_confidence': round(avg_confidence, 2),
            'recent_feedbacks': recent_feedbacks,
            'recent_plants': recent_plants,
            'top_plants': top_plants,
            'recent_feedback_list': recent_feedback_list,
            'feedbacks_by_intent': feedbacks_by_intent,
            'total_medicinal_properties': MedicinalProperty.objects.count(),
            'total_traditional_uses': TraditionalUse.objects.count(),
            'timeline_labels': json.dumps(timeline_labels),
            'timeline_data': json.dumps(timeline_data),
            'period': period,
            'period_label': period_label,
            'date_from': date_from or '',
            'date_to': date_to or '',
            'period_start_str': period_start.strftime('%Y-%m-%d'),
            'period_end_str': period_end.strftime('%Y-%m-%d'),
            # Nouvelles statistiques
            'plants_with_images': plants_with_images,
            'plants_without_images': plants_without_images,
            'plants_with_medicinal': plants_with_medicinal,
            'plants_with_uses': plants_with_uses,
            'completeness_rate': completeness_rate,
            'monthly_labels': json.dumps(monthly_labels),
            'monthly_plants': json.dumps(monthly_plants),
            'monthly_feedbacks': json.dumps(monthly_feedbacks),
            'top_families': json.dumps(top_families),
            'top_medicinal_plants': top_medicinal_plants,
            'conservation_stats': conservation_stats,
        }
        
        return render(request, 'admin/dashboard.html', context)


# Instance globale
admin_site = IvoireAdminSite(name='ivoire_admin')
