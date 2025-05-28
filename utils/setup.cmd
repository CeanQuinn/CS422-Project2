@echo off
REM create virutal env
echo Creating virtual environment...
python -m venv venv

REM go into venv
echo Activating virtual environment...
call venv\Scripts\activate

REM install dependencies from requirements.txt
echo Installing dependencies...
pip install -r requirements.txt

REM setting up flask environment variables
echo Setting flask environment variables...
set FLASK_APP=app.py
set FLASK_ENV=development

REM 
echo Setup complete. You can now activate the environment with:
echo     enterVenv.cmd
echo ...and run the app with:
echo     launch.cmd
