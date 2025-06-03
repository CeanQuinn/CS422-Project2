# CS 422 Project 2 - Enhanced Spotify Search

## System Description
This project is an advanced Spotify song search tool designed to assist users, particularly those hard of hearing, in finding tracks based on audio features such as danceability, energy, acousticness, and valence. The system integrates Spotify's API for artist and track metadata and uses a preprocessed dataset for filtering tracks based on user-defined criteria.

## Directory Structure
- **/utils**: Contains scripts for setting up the virtual environment, activating it, and launching the Flask server.
- **/csv_cleanup**: Includes Python scripts for cleaning and preprocessing the dataset (e.g., dropping columns, exploding artist IDs, converting CSV to Pickle format).
- **/data**: Placeholder for the cleaned dataset (`cleaned_features.pkl`).
- **/templates**: Contains HTML files for the frontend (if applicable).
- **/static**: Placeholder for CSS, JavaScript, and other static assets (if applicable).

## Software Dependencies
- Python 3.10 or higher
- Flask 3.1.1
- pandas 2.2.3
- numpy 2.2.6
- flask-cors 6.0.0
- requests 2.32.3
- dotenv 1.1.0

All dependencies are listed in `requirements.txt` and will be installed during the setup process.

## Installation
1. **Configure `.env` file**:
   - Create a `.env` file in the root directory.
   - Add the following lines with your Spotify API credentials:
     ```
     SPOTIFY_CLIENT_ID=<your_client_id>
     SPOTIFY_CLIENT_SECRET=<your_client_secret>
     ```
   - Contact Cean if you need assistance with obtaining these credentials.

2. **Set up the virtual environment**:
   - Run `utils\setup.cmd` in a Windows CMD terminal from the root directory. This script will:
     - Create a virtual environment.
     - Install dependencies from `requirements.txt`.
     - Set necessary environment variables for Flask.
   - Bash alternatives exist within the utils\ directory as well with Mac_ prepended. 

3. **Activate the virtual environment**:
   - Run `utils\enterVenv.cmd` to activate the virtual environment.
   - You will see `(venv)` displayed before your command prompt.

4. **Launch the Flask server**:
   - Run `utils\launch.cmd` to start the Flask server on port 3001.
   - Ensure you are in the virtual environment before running this script.

## Running the Program
1. Open `index.html` in your default browser to access the frontend interface.
2. Use the search bar and sliders to filter tracks based on audio features.
3. Results will be displayed with links to Spotify and YouTube for additional accessibility.

## Testing
- Use known artists such as Nirvana, Pearl Jam, or Rage Against The Machine for testing.
- Debug logs will appear in the CMD terminal where the Flask server is running.

## Subdirectory Descriptions
- **/utils**: Scripts for environment setup and server management.
  - `setup.cmd`: Creates and configures the virtual environment.
  - `enterVenv.cmd`: Activates the virtual environment.
  - `launch.cmd`: Starts the Flask server.
- **/csv_cleanup**: Scripts for dataset preprocessing.
  - `dropCols.py`: Removes unnecessary columns from the dataset.
  - `explodeIds.py`: Splits artist IDs into individual rows.
  - `toPkl.py`: Converts cleaned CSV files to Pickle format.
  - `lineCount.py`: Counts lines in cleaned CSV files for validation.
  - `dart.py`: Identifies rows with multiple artists.
  - `nonPrimary.py`: Finds artists who only appear as non-primary contributors.
- **/data**: Contains the cleaned dataset (`cleaned_features.pkl`).
- **/static**: Placeholder for static assets like CSS and JavaScript.
- **/templates**: Placeholder for HTML templates.

## Additional Notes
- Ensure you are using a CMD terminal, as PowerShell may cause issues with the scripts.
- If you encounter any problems, contact Will for assistance.