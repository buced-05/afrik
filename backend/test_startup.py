#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Test script to check if the app can start without errors"""

import sys
import traceback
import os

# Fix Windows console encoding
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    print("Testing imports...")
    from app.main import app
    print("[OK] App imported successfully!")
    
    print("\nTesting service initialization...")
    from app.services.vision_service import VisionService
    from app.services.llm_service import LLMService
    from app.services.feedback_service import FeedbackService
    
    print("Initializing services...")
    vision_service = VisionService()
    print("[OK] VisionService initialized")
    
    llm_service = LLMService()
    print("[OK] LLMService initialized")
    
    feedback_service = FeedbackService()
    print("[OK] FeedbackService initialized")
    
    print("\n[OK] All services initialized successfully!")
    print("\nThe app should be ready to start.")
    print("Run: python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
    
except Exception as e:
    print(f"\n[ERROR] Error occurred:")
    print(f"Type: {type(e).__name__}")
    print(f"Message: {str(e)}")
    print("\nFull traceback:")
    traceback.print_exc()
    sys.exit(1)

