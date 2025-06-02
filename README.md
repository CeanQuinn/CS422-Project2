CS 422 Project 2 - Enhanced Spotify Search

## NOTES
All referenced scripts will be in /utils.
Some of them are simple wrappers others are more in depth.
*Intended to be ran in windows CMD terminal, while in the root project directory. Please make sure the terminal you are using is CMD; vscode typically defaults to poweshell.*

## Venv setup and use
The utils\setup.cmd script should create a new python venv, install all reqs from the .txt, and set some environment variables neccessary for the flask app to run correctly. Because the python file for the server is call 'app.py' ths environment setup is a little redundant but still relevant.

After the venv setup the utils\enterVenv.cmd script will get you into the python venv.
you will know you are in the venv when (venv) is displayed before you pwd, for example my command line looks like this when I'm in the venv:
(venv) C:\Users\willi\Desktop\CS 422\Group Proj 2\CS422-Project2>

Simply typing 'deactivate' will get you out of the python venv and back to you global python env.
*You must be in the venv when running the flask server.*

## Installation

configure .env file - ask Cean if you have questions
The .env needs to have the Spotify API client id and secret.
These do not have to be specific to any project, I (Will) am using ones that I generated on my own.
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
Formatted like so ^^^

## Running

use utils\launch.cmd to properly launch the flask server. This script reinforces the environment variable declarations and then laucnhes the flask server on the appropriate port.
*This script must be ran when you are in the venv!!*

find index.html in file browser and launch it to your default browser

## Testing
I have been doing some basic testing with bands/artists I know are in the dataset. Some ones I have been using:
Nirvana
Pearl Jam
Rage Against The Machine

All debug print lines should show up in the CMD terminal you launched the flask app from. I suggest just opening a CMD terminal within vscode.

Hopefully this helps with setup and execution, please ask me (Will) any questions if things seem to not be working.