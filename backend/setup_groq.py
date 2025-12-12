#!/usr/bin/env python
"""
Script pour configurer Groq et créer le fichier .env
"""
import os
import sys

def main():
    print("=" * 60)
    print("Configuration Groq API pour ivoire.ai")
    print("=" * 60)
    print()
    
    # Demander la clé API
    print("Pour obtenir votre clé API Groq :")
    print("1. Visitez https://console.groq.com/")
    print("2. Créez un compte (gratuit)")
    print("3. Générez une clé API dans la section 'API Keys'")
    print()
    
    api_key = input("Entrez votre clé API Groq (ou appuyez sur Entrée pour utiliser un placeholder) : ").strip()
    
    if not api_key:
        api_key = "votre_cle_api_groq_ici"
        print(f"⚠️  Utilisation du placeholder: {api_key}")
        print("   N'oubliez pas de remplacer par votre vraie clé API !")
    else:
        print("✅ Clé API reçue")
    
    # Demander le modèle
    print()
    print("Modèles disponibles :")
    print("1. llama-3.1-70b-versatile (recommandé - meilleure qualité)")
    print("2. llama-3.1-8b-instant (rapide)")
    print("3. mixtral-8x7b-32768 (bon compromis)")
    print()
    
    choice = input("Choisissez le modèle (1-3, défaut: 1) : ").strip() or "1"
    
    models = {
        "1": "llama-3.1-70b-versatile",
        "2": "llama-3.1-8b-instant",
        "3": "mixtral-8x7b-32768"
    }
    
    model = models.get(choice, "llama-3.1-70b-versatile")
    
    # Créer le contenu du fichier .env
    env_content = f"""# Groq API Configuration (Recommandé - Rapide et gratuit)
# Obtenez votre clé API sur https://console.groq.com/
GROQ_API_KEY={api_key}
LLM_PROVIDER=groq
LLM_MODEL={model}

# Modèles Groq disponibles:
# - llama-3.1-70b-versatile (recommandé pour qualité)
# - llama-3.1-8b-instant (rapide)
# - mixtral-8x7b-32768 (bon compromis)

# Alternative: OpenAI (si vous préférez)
# OPENAI_API_KEY=votre_cle_openai_ici
# LLM_PROVIDER=openai
# LLM_MODEL=gpt-4o

# TensorFlow Model Configuration
MODEL_PATH=models/plant_recognition_model.h5
PLANT_DB_PATH=data/plants_database.json

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# Server Port
PORT=8000

# Django Secret Key (pour l'admin)
# Générez une clé sécurisée avec: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
DJANGO_SECRET_KEY=django-insecure-change-me-in-production-ivoire-ai

# Database (optionnel - pour Django)
# DATABASE_URL=sqlite:///db.sqlite3
"""

    # Écrire le fichier .env
    env_file = os.path.join(os.path.dirname(__file__), '.env')
    
    try:
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write(env_content)
        
        print()
        print("=" * 60)
        print("✅ Configuration terminée avec succès !")
        print("=" * 60)
        print(f"📁 Fichier créé : {env_file}")
        print(f"🔑 Clé API : {'✅ Configurée' if api_key != 'votre_cle_api_groq_ici' else '⚠️  Placeholder (à remplacer)'}")
        print(f"🤖 Modèle : {model}")
        print()
        print("📝 Prochaines étapes :")
        print("1. Si vous avez utilisé un placeholder, éditez .env avec votre vraie clé API")
        print("2. Démarrez le serveur : python -m uvicorn app.main:app --reload")
        print("3. Testez la configuration : python test_groq.py")
        print()
        print("🔒 Sécurité : Le fichier .env est automatiquement ignoré par Git")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Erreur lors de la création du fichier .env : {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
