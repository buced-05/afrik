# 🚀 Démarrer l'API Backend

Guide rapide pour démarrer le serveur backend de l'application d'identification de plantes.

## Prérequis

- Python 3.11 ou supérieur
- pip installé
- Clé API Groq (voir [README_GROQ.md](./README_GROQ.md))

## Installation

### 1. Installer les dépendances

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
GROQ_API_KEY=votre_cle_api_groq_ici
LLM_PROVIDER=groq
LLM_MODEL=llama-3.1-70b-versatile
FRONTEND_URL=http://localhost:3000
PORT=8000
```

**Option rapide** : Copiez le fichier d'exemple et modifiez-le :

```bash
cp .env.example .env
# Éditez .env avec votre clé API
```

### 3. Démarrer le serveur

**Option A : Script automatique (recommandé)**

```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

**Option B : Commande manuelle**

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Vérifier que le serveur fonctionne

Ouvrez dans votre navigateur : [http://localhost:8000/api/health](http://localhost:8000/api/health)

Vous devriez voir :
```json
{
  "status": "healthy",
  "services": {
    "vision": "ready",
    "llm": "ready"
  }
}
```

## 🔒 Sécurité en Production

Pour la production, utilisez :

1. **Variables d'environnement système** au lieu de fichiers `.env`
2. **Gestionnaires de secrets** (AWS Secrets Manager, Azure Key Vault, etc.)
3. **Clés API avec restrictions** (limites de domaine, IP, etc.)

### Exemple pour la production

```bash
# Définir les variables d'environnement
export GROQ_API_KEY="votre_cle_api"
export LLM_PROVIDER="groq"
export LLM_MODEL="llama-3.1-70b-versatile"
export FRONTEND_URL="https://votre-domaine.com"
export PORT=8000

# Démarrer le serveur
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📝 Notes

- Le fichier `.env` est automatiquement ignoré par Git (voir `.gitignore`)
- Ne commitez JAMAIS vos clés API dans le dépôt
- Pour le développement local, utilisez `.env`
- Pour la production, utilisez des variables d'environnement sécurisées

## 🆘 Dépannage

Voir [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) pour plus d'aide.
