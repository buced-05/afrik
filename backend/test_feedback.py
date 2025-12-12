#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script de test pour l'endpoint de feedback
"""

import requests
import json
from pathlib import Path

API_URL = "http://localhost:8000"

def test_feedback_without_image():
    """Test d'envoi de feedback sans image"""
    print("Test 1: Feedback sans image...")
    
    feedback_data = {
        "image_hash": "test_hash_12345",
        "predicted_plant_id": "1",
        "predicted_confidence": 85.5,
        "feedback_type": "rating",
        "rating": 4,
        "comment": "Test feedback sans image"
    }
    
    form_data = {
        "feedback": json.dumps(feedback_data)
    }
    
    try:
        response = requests.post(f"{API_URL}/api/feedback", data=form_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Erreur: {e}")
        return False

def test_feedback_with_image():
    """Test d'envoi de feedback avec image"""
    print("\nTest 2: Feedback avec image...")
    
    # Créer une image de test simple (1x1 pixel PNG)
    test_image = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82'
    
    feedback_data = {
        "predicted_plant_id": "1",
        "predicted_confidence": 90.0,
        "feedback_type": "confirmation",
        "is_correct": True,
        "rating": 5
    }
    
    files = {
        "image": ("test.png", test_image, "image/png")
    }
    
    form_data = {
        "feedback": json.dumps(feedback_data)
    }
    
    try:
        response = requests.post(f"{API_URL}/api/feedback", files=files, data=form_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Erreur: {e}")
        return False

def test_feedback_invalid():
    """Test avec des données invalides"""
    print("\nTest 3: Feedback invalide (devrait échouer)...")
    
    feedback_data = {
        "predicted_plant_id": "1",
        # Manque predicted_confidence et feedback_type
    }
    
    form_data = {
        "feedback": json.dumps(feedback_data)
    }
    
    try:
        response = requests.post(f"{API_URL}/api/feedback", data=form_data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 400  # Devrait être 400
    except Exception as e:
        print(f"Erreur: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Tests de l'endpoint /api/feedback")
    print("=" * 50)
    print(f"\nAssurez-vous que le serveur est démarré sur {API_URL}")
    print("=" * 50)
    
    results = []
    
    try:
        # Vérifier que le serveur est accessible
        health = requests.get(f"{API_URL}/api/health")
        if health.status_code != 200:
            print(f"\n❌ Le serveur n'est pas accessible (status: {health.status_code})")
            print("Démarrez le serveur avec: python -m uvicorn app.main:app --reload")
            exit(1)
        
        print("\n✅ Serveur accessible")
        
        # Tests
        results.append(("Feedback sans image", test_feedback_without_image()))
        results.append(("Feedback avec image", test_feedback_with_image()))
        results.append(("Feedback invalide", test_feedback_invalid()))
        
        # Résumé
        print("\n" + "=" * 50)
        print("Résumé des tests:")
        print("=" * 50)
        for name, result in results:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status}: {name}")
        
        all_passed = all(result for _, result in results)
        if all_passed:
            print("\n✅ Tous les tests sont passés!")
        else:
            print("\n❌ Certains tests ont échoué")
            
    except requests.exceptions.ConnectionError:
        print(f"\n❌ Impossible de se connecter au serveur sur {API_URL}")
        print("Démarrez le serveur avec: python -m uvicorn app.main:app --reload")
    except Exception as e:
        print(f"\n❌ Erreur inattendue: {e}")
        import traceback
        traceback.print_exc()

