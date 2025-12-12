#!/bin/bash
# Script de démarrage Django Admin pour Linux/Mac

echo "🌱 Démarrage de Django Admin pour ivoire.ai..."

# Vérifier si l'environnement virtuel existe
if [ ! -d "../venv" ]; then
    echo "❌ Environnement virtuel non trouvé. Veuillez d'abord créer l'environnement dans le dossier backend."
    echo "Exécutez: cd .. && python3 -m venv venv"
    exit 1
fi

# Activer l'environnement virtuel
echo "🔌 Activation de l'environnement virtuel..."
source ../venv/bin/activate

# Installer Django si nécessaire
echo "📦 Vérification de Django..."
if ! pip show django &> /dev/null; then
    echo "📥 Installation de Django..."
    pip install -r requirements.txt
fi

# Créer les migrations si nécessaire
echo "🔄 Vérification des migrations..."
python3 manage.py makemigrations --noinput
python3 manage.py migrate --noinput

# Créer un superutilisateur si aucun n'existe
python3 manage.py shell <<EOF
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@ivoire.ai', 'admin')
    print("✅ Superutilisateur créé: admin/admin")
else:
    print("ℹ️  Superutilisateur existe déjà")
EOF

# Démarrer le serveur
echo ""
echo "✅ Django Admin est prêt!"
echo "📍 Admin disponible sur http://localhost:8001/admin"
echo "👤 Nom d'utilisateur: admin"
echo "🔑 Mot de passe: admin"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

python3 manage.py runserver 8001

