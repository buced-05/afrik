#!/bin/bash

# Script de démarrage du backend ivoire.ai

echo "🌱 Démarrage du backend ivoire.ai..."

# Vérifier si l'environnement virtuel existe
if [ ! -d "venv" ]; then
    echo "📦 Création de l'environnement virtuel..."
    python3 -m venv venv
fi

# Activer l'environnement virtuel
echo "🔌 Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer les dépendances si nécessaire
if [ ! -f "venv/.dependencies_installed" ]; then
    echo "📥 Installation des dépendances..."
    pip install -r requirements.txt
    touch venv/.dependencies_installed
fi

# Vérifier si le fichier .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé. Copie de .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé. Veuillez le configurer avant de continuer."
    else
        echo "❌ Fichier .env.example non trouvé."
    fi
fi

# Créer les dossiers nécessaires
mkdir -p models
mkdir -p data

# Démarrer l'API
echo "🚀 Démarrage de l'API FastAPI..."
echo "📍 API disponible sur http://localhost:8000"
echo "📚 Documentation: http://localhost:8000/docs"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

