@echo off
echo Setting environment variables...
set FLASK_APP=app.py
set FLASK_ENV=development

echo Starting Flask server...
flask run --port=3001