# Backend-Frontend Connection Guide

## ✅ Configuration Complete

The backend and frontend are now properly configured to work together.

## 🔧 Configuration Details

### Backend (FastAPI - Port 8000)
- **CORS**: Configured to allow requests from:
  - `http://localhost:3000`
  - `http://localhost:3001`
  - `http://127.0.0.1:3000`
  - `http://127.0.0.1:3001`
  - Any localhost port in development mode (via regex)
- **Health Check Endpoint**: `/api/health`
- **Main Endpoints**:
  - `POST /api/identify` - Plant identification
  - `POST /api/feedback` - Submit feedback
  - `GET /api/feedback/stats` - Feedback statistics

### Frontend (Next.js - Port 3000)
- **API Base URL**: `http://localhost:8000` (default)
- **Environment Variable**: `NEXT_PUBLIC_API_URL` (optional, defaults to localhost:8000)
- **Health Check**: Automatically checks backend availability before making API calls
- **Fallback**: Automatically falls back to offline mode if backend is unavailable

## 🚀 Starting the Application

### Option 1: Start Both Together (Recommended)
```bash
npm run dev:all
```
or
```bash
npm run app
```

This will start both backend and frontend simultaneously.

### Option 2: Start Separately

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🧪 Testing the Connection

### 1. Test Backend Health
Open in browser: `http://localhost:8000/api/health`

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "vision": "ready",
    "llm": "ready"
  }
}
```

### 2. Test Frontend Connection
1. Open `http://localhost:3000`
2. Navigate to the identify page
3. Upload an image
4. Check browser console (F12) for connection status

### 3. Verify API Calls
In browser DevTools (F12) → Network tab:
- Look for requests to `http://localhost:8000/api/identify`
- Check for CORS errors (should be none)
- Verify responses are successful (200 status)

## 🔍 Troubleshooting

### Backend Not Responding
1. **Check if backend is running:**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Check backend logs** for errors

3. **Verify Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### CORS Errors
If you see CORS errors:
1. Verify backend is running on port 8000
2. Check that frontend URL matches allowed origins in `backend/app/main.py`
3. Restart backend after CORS changes

### Frontend Falls Back to Offline Mode
This is normal behavior! The frontend will:
1. Check backend health first
2. If backend is unavailable, use offline TensorFlow.js model
3. If model not available, use mock data

To force online mode, ensure:
- Backend is running
- `NEXT_PUBLIC_API_URL` is set correctly (or using default)
- No network/firewall issues

## 📝 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (backend/.env)
```env
FRONTEND_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
```

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Health check endpoint returns 200
- [ ] Frontend can reach backend (check Network tab)
- [ ] No CORS errors in browser console
- [ ] Plant identification works (online or offline)
- [ ] Feedback submission works

## 🎯 Key Features

1. **Automatic Health Checking**: Frontend checks backend availability before API calls
2. **Graceful Fallback**: Falls back to offline mode if backend unavailable
3. **CORS Configured**: Properly configured for development and production
4. **Error Handling**: Comprehensive error handling with fallbacks

## 📚 API Endpoints

### POST /api/identify
- **Purpose**: Identify a plant from an image
- **Request**: FormData with `file` (image), optional `user_intent`, `include_medicinal_info`
- **Response**: Plant identification result with confidence and alternatives

### POST /api/feedback
- **Purpose**: Submit user feedback on predictions
- **Request**: FormData with `image` (optional), `feedback` (JSON string)
- **Response**: Success status and feedback ID

### GET /api/health
- **Purpose**: Check backend and service status
- **Response**: Health status of vision and LLM services

