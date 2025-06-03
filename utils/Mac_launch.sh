#!/bin/bash

#Written by Cean Quinn to launch the 'server' on Mac

echo "Setting environment variables..."
source venv/bin/activate
export FLASK_APP=app.py
export FLASK_ENV=development

echo "Starting Flask server..."
flask run --port=3001