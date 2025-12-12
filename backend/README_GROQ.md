# Configuration Groq API

Groq est une excellente alternative gratuite et rapide pour l'IA. Cette application utilise Groq pour générer les explications sur les plantes.

## 🚀 Installation Rapide

### 1. Obtenir une clé API Groq

1. Visitez [https://console.groq.com/](https://console.groq.com/)
2. Créez un compte (gratuit)
3. Générez une clé API dans la section "API Keys"

### 2. Configuration automatique

Exécutez le script de configuration :

```bash
cd backend
python setup_groq.py
```

Le script vous demandera votre clé API et créera automatiquement le fichier `.env`.

### 3. Configuration manuelle

Créez un fichier `.env` dans le dossier `backend/` avec :

```env
GROQ_API_KEY=votre_cle_api_groq_ici
LLM_PROVIDER=groq
LLM_MODEL=llama-3.1-70b-versatile
```

Ou copiez le fichier d'exemple :

```bash
cd backend
cp .env.example .env
# Puis éditez .env et remplacez votre_cle_api_groq_ici par votre vraie clé
```

### 2. Vérifier la configuration

Assurez-vous que le fichier `.env` existe avec votre clé Groq :
```env
GROQ_API_KEY=votre_cle_api_groq_ici
LLM_PROVIDER=groq
LLM_MODEL=llama-3.1-70b-versatile
```

## 📋 Modèles Disponibles

- **llama-3.1-70b-versatile** (recommandé) - Meilleure qualité
- **llama-3.1-8b-instant** - Plus rapide
- **mixtral-8x7b-32768** - Bon compromis

## 🔒 Sécurité

⚠️ **IMPORTANT** : Le fichier `.env` est automatiquement ignoré par Git (voir `.gitignore`). Ne commitez JAMAIS votre clé API dans le dépôt.

Pour la production, utilisez des variables d'environnement sécurisées ou un gestionnaire de secrets.

## ✅ Vérification

Testez la configuration :

```bash
cd backend
python test_groq.py
```

Vous devriez voir un message de succès si tout est configuré correctement.

## 🆘 Dépannage

### Erreur : "API key not found"
- Vérifiez que le fichier `.env` existe dans `backend/`
- Vérifiez que la clé API est correcte (sans espaces, sans guillemets)
- Redémarrez le serveur après modification de `.env`

### Erreur : "Rate limit exceeded"
- Groq a des limites de taux. Attendez quelques secondes et réessayez.
- Pour la production, considérez un plan payant ou un cache.

## 📚 Ressources

- [Documentation Groq](https://console.groq.com/docs)
- [Modèles disponibles](https://console.groq.com/docs/models)
