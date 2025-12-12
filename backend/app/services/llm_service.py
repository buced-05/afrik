"""
Service LLM pour générer des explications médicinales
Utilise Groq avec Llama pour des performances rapides
"""

import os
import json
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

# Essayer d'importer Groq, fallback vers OpenAI si nécessaire
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    logger.warning("Groq non disponible, installation requise: pip install groq")


class LLMService:
    """Service de génération de texte avec LLM (Groq/Llama)"""
    
    def __init__(self):
        """Initialise le service LLM avec Groq"""
        # Priorité: GROQ_API_KEY > OPENAI_API_KEY (rétrocompatibilité)
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.provider = os.getenv("LLM_PROVIDER", "groq")  # groq ou openai
        
        # Modèles Groq disponibles: llama-3.1-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768
        self.model_name = os.getenv("LLM_MODEL", "llama-3.1-70b-versatile")
        self.client = None
        self.client_type = None
        
        # Initialiser Groq si disponible et configuré
        if self.provider == "groq" and GROQ_AVAILABLE:
            if self.groq_api_key:
                try:
                    self.client = Groq(api_key=self.groq_api_key)
                    self.client_type = "groq"
                    logger.info(f"Service LLM Groq initialisé avec {self.model_name}")
                except Exception as e:
                    logger.error(f"Erreur lors de l'initialisation du client Groq: {e}")
            else:
                logger.warning("GROQ_API_KEY non définie. Vérifiez votre fichier .env")
        # Fallback vers OpenAI si configuré
        elif self.provider == "openai" and self.openai_api_key:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.openai_api_key)
                self.client_type = "openai"
                logger.info(f"Service LLM OpenAI initialisé avec {self.model_name}")
            except ImportError:
                logger.warning("OpenAI non installé, installation requise: pip install openai")
            except Exception as e:
                logger.error(f"Erreur lors de l'initialisation du client OpenAI: {e}")
        
        if not self.client:
            logger.warning("Aucun client LLM configuré. Mode mock activé.")
    
    def is_ready(self) -> bool:
        """Vérifie si le service est prêt"""
        return self.client is not None
    
    async def generate_medicinal_info(
        self,
        plant_info: Dict[str, Any],
        user_query: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Génère des informations médicinales pour une plante
        
        Args:
            plant_info: Informations de base sur la plante
            user_query: Requête spécifique de l'utilisateur (ex: "fièvre", "diabète")
        
        Returns:
            Dictionnaire avec les informations médicinales structurées
        """
        if not self.client:
            return self._generate_mock_info(plant_info, user_query)
        
        try:
            # Construire le prompt
            prompt = self._build_prompt(plant_info, user_query)
            
            # Appeler l'API (Groq ou OpenAI)
            if self.client_type == "groq":
                response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "Tu es un expert en plantes médicinales africaines. "
                                "Tu fournis des informations précises, basées sur les connaissances "
                                "traditionnelles et scientifiques, avec des avertissements de sécurité. "
                                "Réponds toujours en français."
                            )
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.7,
                    max_tokens=2000,
                    top_p=0.9
                )
            elif self.client_type == "openai":
                response = self.client.chat.completions.create(
                    model=self.model_name,
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "Tu es un expert en plantes médicinales africaines. "
                                "Tu fournis des informations précises, basées sur les connaissances "
                                "traditionnelles et scientifiques, avec des avertissements de sécurité."
                            )
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.7,
                    max_tokens=1500
                )
            else:
                return self._generate_mock_info(plant_info, user_query)
            
            # Parser la réponse
            content = response.choices[0].message.content
            return self._parse_llm_response(content, plant_info)
            
        except Exception as e:
            logger.error(f"Erreur lors de la génération LLM: {e}")
            return self._generate_mock_info(plant_info, user_query)
    
    def _build_prompt(self, plant_info: Dict, user_query: Optional[str]) -> str:
        """Construit le prompt pour le LLM"""
        base_info = f"""
Plante: {plant_info.get('scientific_name', 'N/A')}
Nom commun: {plant_info.get('common_names', {}).get('fr', 'N/A')}
Famille: {plant_info.get('family', 'N/A')}
Description: {plant_info.get('description', 'N/A')}
Parties utilisées: {', '.join(plant_info.get('parts_used', []))}
"""
        
        if user_query:
            prompt = f"""
{base_info}

L'utilisateur recherche des informations spécifiques sur: {user_query}

Génère une réponse structurée en JSON avec:
- summary: Résumé des propriétés médicinales
- properties: Liste des propriétés (type, description, evidence_level)
- traditional_uses: Usages traditionnels (preparation, indication, recipe)
- diseases_treated: Liste des maladies/symptômes traités
- preparation_methods: Méthodes de préparation
- precautions: Précautions d'usage
- warnings: Avertissements importants
- formatted_response: Réponse formatée en français pour l'utilisateur

Focus sur: {user_query}
"""
        else:
            prompt = f"""
{base_info}

Génère une réponse structurée en JSON avec toutes les informations médicinales:
- summary: Résumé des propriétés médicinales
- properties: Liste des propriétés (type, description, evidence_level)
- traditional_uses: Usages traditionnels (preparation, indication, recipe)
- diseases_treated: Liste des maladies/symptômes traités
- preparation_methods: Méthodes de préparation
- precautions: Précautions d'usage
- warnings: Avertissements importants
- formatted_response: Réponse formatée en français pour l'utilisateur
"""
        
        return prompt
    
    def _parse_llm_response(self, content: str, plant_info: Dict) -> Dict[str, Any]:
        """Parse la réponse du LLM en JSON structuré"""
        try:
            # Essayer d'extraire le JSON de la réponse
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
            else:
                # Fallback: créer une structure basique
                data = {
                    "summary": content[:200],
                    "formatted_response": content
                }
            
            return {
                "summary": data.get("summary", ""),
                "properties": data.get("properties", []),
                "traditional_uses": data.get("traditional_uses", []),
                "diseases_treated": data.get("diseases_treated", []),
                "preparation_methods": data.get("preparation_methods", []),
                "precautions": data.get("precautions", []),
                "warnings": data.get("warnings", []),
                "formatted_response": data.get("formatted_response", content)
            }
        except Exception as e:
            logger.error(f"Erreur lors du parsing de la réponse LLM: {e}")
            return self._generate_mock_info(plant_info, None)
    
    def _generate_mock_info(self, plant_info: Dict, user_query: Optional[str]) -> Dict[str, Any]:
        """Génère des informations mock pour le développement"""
        return {
            "summary": f"Informations médicinales pour {plant_info.get('scientific_name', 'cette plante')}.",
            "properties": [
                {
                    "type": "antiseptique",
                    "description": "Propriétés antiseptiques traditionnelles",
                    "evidence_level": "traditionnel"
                }
            ],
            "traditional_uses": [
                {
                    "preparation": "décoction",
                    "indication": "usage général",
                    "recipe": "Consulter un spécialiste pour les dosages"
                }
            ],
            "diseases_treated": ["usage traditionnel"],
            "preparation_methods": ["décoction", "tisane"],
            "precautions": ["Consulter un médecin avant usage"],
            "warnings": ["Ne pas utiliser sans supervision médicale"],
            "formatted_response": (
                f"Cette plante ({plant_info.get('scientific_name', 'N/A')}) "
                "possède des propriétés médicinales traditionnelles. "
                "Consultez un spécialiste pour les usages et dosages appropriés."
            )
        }

