@echo off
echo 🌱 Démarrage de Django Admin...
cd backend\django_project
call ..\venv\Scripts\activate.bat
python manage.py runserver 8001

