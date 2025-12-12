# 🔒 Configuration des Variables d'Environnement

Ce guide explique comment configurer les clés API et secrets pour utiliser l'application en production.

## 📋 Vue d'ensemble

L'application utilise des fichiers `.env` pour stocker les clés API et secrets. Ces fichiers sont **automatiquement ignorés par Git** pour la sécurité.

## 🚀 Configuration Rapide

### Pour le Développement Local

1. **Copiez le fichier d'exemple** :
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Éditez `.env`** avec vos vraies clés API :
   ```env
   GROQ_API_KEY=votre_vraie_cle_api_ici
   LLM_PROVIDER=groq
   LLM_MODEL=llama-3.1-70b-versatile
   ```

3. **Ou utilisez le script automatique** :
   ```bash
   cd backend
   python setup_groq.py
   ```

### Pour la Production

**⚠️ IMPORTANT** : Ne jamais utiliser de fichiers `.env` en production. Utilisez plutôt :

1. **Variables d'environnement système**
2. **Gestionnaires de secrets** (AWS Secrets Manager, Azure Key Vault, etc.)
3. **Variables d'environnement de votre plateforme** (Vercel, Heroku, etc.)

## 📁 Structure des Fichiers

```
backend/
├── .env              # ⚠️ IGNORÉ PAR GIT - Vos vraies clés API
├── .env.example      # ✅ Dans Git - Template avec placeholders
└── setup_groq.py     # Script pour créer .env automatiquement
```

## 🔐 Fichiers Ignorés par Git

Les fichiers suivants sont automatiquement ignorés (voir `.gitignore`) :

- `.env`
- `.env.local`
- `.env.production`
- `.env.development`
- `*.env` (tous les fichiers .env)

## ✅ Fichiers dans Git (Sécurisés)

- `.env.example` - Template avec placeholders
- `setup_groq.py` - Script de configuration
- Documentation (README_GROQ.md, START_API.md, etc.)

## 🛠️ Configuration par Plateforme

### Développement Local

```bash
# Créer .env depuis l'exemple
cp backend/.env.example backend/.env

# Éditer avec vos clés
nano backend/.env  # ou votre éditeur préféré
```

### Vercel

1. Allez dans **Settings > Environment Variables**
2. Ajoutez vos variables :
   - `GROQ_API_KEY`
   - `LLM_PROVIDER`
   - `LLM_MODEL`
   - etc.

### Docker

```dockerfile
# Dans votre Dockerfile ou docker-compose.yml
ENV GROQ_API_KEY=${GROQ_API_KEY}
ENV LLM_PROVIDER=groq
```

Puis passez les variables lors du build :
```bash
docker build --build-arg GROQ_API_KEY=$GROQ_API_KEY .
```

### Serveur Linux/Mac

```bash
# Définir les variables d'environnement
export GROQ_API_KEY="votre_cle_api"
export LLM_PROVIDER="groq"
export LLM_MODEL="llama-3.1-70b-versatile"

# Démarrer l'application
python -m uvicorn app.main:app
```

### Windows (PowerShell)

```powershell
# Définir les variables d'environnement
$env:GROQ_API_KEY="votre_cle_api"
$env:LLM_PROVIDER="groq"
$env:LLM_MODEL="llama-3.1-70b-versatile"

# Démarrer l'application
python -m uvicorn app.main:app
```

## 🔍 Vérification

Pour vérifier que vos variables d'environnement sont bien chargées :

```bash
cd backend
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('GROQ_API_KEY:', '✅ Configurée' if os.getenv('GROQ_API_KEY') else '❌ Manquante')"
```

## 🆘 Dépannage

### "API key not found"

1. Vérifiez que le fichier `.env` existe dans `backend/`
2. Vérifiez que la clé API est correcte (sans espaces)
3. Redémarrez le serveur après modification de `.env`

### Variables d'environnement non chargées

1. Vérifiez que `python-dotenv` est installé : `pip install python-dotenv`
2. Vérifiez que le fichier `.env` est dans le bon répertoire
3. Vérifiez les permissions du fichier

## 📚 Ressources

- [Documentation python-dotenv](https://pypi.org/project/python-dotenv/)
- [Best practices pour les secrets](https://12factor.net/config)
- [GitHub Secrets Scanning](https://docs.github.com/en/code-security/secret-scanning)

## ⚠️ Sécurité

1. **Ne jamais commiter** les fichiers `.env` dans Git
2. **Ne jamais partager** vos clés API publiquement
3. **Utiliser des clés différentes** pour le développement et la production
4. **Roter les clés** régulièrement
5. **Utiliser des gestionnaires de secrets** en production

