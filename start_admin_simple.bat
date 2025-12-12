@echo off
REM Script simple pour démarrer Django Admin
cd /d "%~dp0backend\django_project"
call ..\venv\Scripts\activate.bat
python manage.py runserver 8001

