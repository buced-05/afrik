"""
URL configuration for django_project project.
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static

# Importer l'admin personnalisé après que toutes les apps soient chargées
from dashboard.admin_site import admin_site

def redirect_to_admin(request):
    """Redirige la racine vers l'admin"""
    return redirect('admin:index')

urlpatterns = [
    path('', redirect_to_admin, name='home'),
    path('admin/', admin_site.urls),
]

# Configuration de l'admin
admin_site.site_header = "ivoire.ai - Administration Professionnelle"
admin_site.site_title = "ivoire.ai Admin"
admin_site.index_title = "Tableau de bord"

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

