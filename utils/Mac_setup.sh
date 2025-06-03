#!/bin/bash

#Written By Cean Quinn for Mac system setup

# create virtual env
echo "Creating virtual environment..."
python3 -m venv venv

# activate virtual env
echo "Activating virtual environment..."
source venv/bin/activate

# install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# set Flask environment variables
echo "Setting Flask environment variables..."
export FLASK_APP=app.py
export FLASK_ENV=development

echo Setup complete. You can now activate the environment with:
echo     Mac_enterVenv.sh
echo ...and run the app with:
echo     Mac_launch.sh
