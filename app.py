import os
import base64
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from threading import Timer
from dotenv import load_dotenv
import pandas as pd

from filter import filter_df

load_dotenv() # load environment variables from .env file

app = Flask(__name__) #setup Flask app
CORS(app)

access_token = None # declaring access_token variable
DATASET = pd.read_pickle(os.path.join('data', 'cleaned_features.pkl')) # Load dataset

# Fetch Spotify token
def get_token():
    global access_token
    
    client_id = os.getenv("SPOTIFY_CLIENT_ID") # ID and secret from environment variables
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode() # create base64 encoded auth header

    # define headers and data for token request
    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = { "grant_type": "client_credentials" }
    # make request to Spotify API for token
    response = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)
    if response.ok:
        access_token = response.json()['access_token']
        # DEBUG print("Spotify access token:", access_token)
        Timer(3500, get_token).start()  # refresh after ~1 hour
    else:
        print("Failed to retrieve token:", response.text)

# Search endpoint for finding tracks based on artist query
@app.route('/search')
def search():
    # establish global access_token variable
    global access_token
    q = request.args.get('q', '') # get query parameter
    danceability_min = float(request.args.get('danceabilityMin', 0.0)) # get danceability min value and max value
    danceability_max = float(request.args.get('danceabilityMax', 1.0))
    energy_min = float(request.args.get('energyMin', 0.0)) # get energy min value and max value
    energy_max = float(request.args.get('energyMax', 1.0))
    acousticness_min = float(request.args.get('acousticnessMin', 0.0)) # get acousticness min value and max value
    acousticness_max = float(request.args.get('acousticnessMax', 1.0))
    valence_min = float(request.args.get('valenceMin', 0.0)) # get valence min value and max value
    valence_max = float(request.args.get('valenceMax', 1.0))

    print(f'[SEARCH] Searched query: "{q}"') # DEBUG log
    if not access_token:
        get_token()

    # Step 1: Get first artist ID from Spotify
    headers = {'Authorization': f'Bearer {access_token}'} # declare headers with access token
    try:
        spotify_res = requests.get( # get the first artist result from Spotify with the user's query
            'https://api.spotify.com/v1/search',
            headers=headers,
            params={'q': q, 'type': 'artist', 'limit': 1}
        )
        artist_items = spotify_res.json().get('artists', {}).get('items', []) # getting artist reponse item
        if not artist_items:
            return jsonify({'error': 'No artist found'}), 404
        artist_id = artist_items[0]['id'] # get the first artist ID
        print('[SEARCH] Found artist ID:', artist_id) # DEBUG log
    except Exception as e:
        return jsonify({'error': 'Failed to search Spotify'}), 500

    # Step 2: Filter dataset by artist_id
    filtered = DATASET[DATASET['artist_ids'] == artist_id] # get all track rows with the artist ID
    if filtered.empty:
        return jsonify({'error': 'No tracks found for this artist in the dataset'}), 404
    
    # passes of track results to filter_df function to filter by user specified values    
    filtered = filter_df(
        filtered,
        danceability=(danceability_min, danceability_max),
        energy=(energy_min, energy_max),
        acousticness=(acousticness_min, acousticness_max),
        valence=(valence_min, valence_max)
    )
    # Step 3: Get track metadata for resulting tracks from Spotify
    track_ids = filtered['id'].dropna().unique().tolist()[:30]  # Get ids of tracks, limit to 30 tracks
    id_string = ','.join(track_ids) # turn list of track IDs into a comma-separated string
    try: # metadata request to Spotify API
        metadata_res = requests.get(
            'https://api.spotify.com/v1/tracks',
            headers=headers,
            params={'ids': id_string}
        )
        tracks = metadata_res.json().get('tracks', [])
    except Exception as e:
        return jsonify({'error': 'Failed to fetch track metadata'}), 500

    # Step 4: Join features from dataset with Spotify metadata
    dataset_features = filtered.set_index('id').to_dict(orient='index') # convert filtered DataFrame to a dictionary with track IDs as keys
    final = []
    for track in tracks: # join metadata with dataset features
        track_id = track['id']
        track['audio_features'] = dataset_features.get(track_id, {})
        final.append(track)

    # final result array with Spotify metadata and dataset features
    return jsonify({'tracks': {'items': final}})


# start script
if __name__ == '__main__':
    get_token()  # Initial token fetch
    app.run(port=3001, debug=True)
