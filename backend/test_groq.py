#!/usr/bin/env python
"""
Script de test pour vérifier que Groq fonctionne correctement
"""
from dotenv import load_dotenv
import os
import asyncio
from app.services.llm_service import LLMService

load_dotenv()

async def test_groq():
    """Test du service Groq"""
    print("Test du service Groq...")
    print("=" * 50)
    
    # Initialiser le service
    llm = LLMService()
    
    print(f"[OK] Service pret: {llm.is_ready()}")
    print(f"[OK] Provider: {llm.client_type}")
    print(f"[OK] Modele: {llm.model_name}")
    print(f"[OK] Cle API configuree: {'Oui' if llm.groq_api_key else 'Non'}")
    print()
    
    if not llm.is_ready():
        print("[ERREUR] Le service n'est pas pret. Verifiez votre configuration.")
        return
    
    # Test avec une plante simple
    plant_info = {
        "scientific_name": "Moringa oleifera",
        "common_names": {"fr": "Moringa"},
        "family": "Moringaceae",
        "description": "Arbre medicinal aux nombreuses proprietes",
        "parts_used": ["feuilles", "racines"]
    }
    
    print("Test de generation d'informations medicinales...")
    print(f"Plante: {plant_info['scientific_name']}")
    print()
    
    try:
        result = await llm.generate_medicinal_info(plant_info, user_query="proprietes nutritives")
        
        print("[OK] Generation reussie!")
        print()
        print("Resume:")
        print(result.get('summary', 'N/A')[:200])
        print()
        print(f"Proprietes trouvees: {len(result.get('properties', []))}")
        print(f"Usages traditionnels: {len(result.get('traditional_uses', []))}")
        print()
        print("=" * 50)
        print("[OK] Tous les tests sont passes avec succes!")
        
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_groq())

