import os
import base64
import time
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from threading import Timer
from dotenv import load_dotenv
import pandas as pd
import ast

load_dotenv()

app = Flask(__name__)
CORS(app)

access_token = None
DATASET = pd.read_pickle(os.path.join('data', 'cleaned_features.pkl'))
# Fetch Spotify token
def get_token():
    global access_token

    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()

    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = { "grant_type": "client_credentials" }

    response = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)
    if response.ok:
        access_token = response.json()['access_token']
        print("Spotify access token:", access_token)
        Timer(3500, get_token).start()  # refresh after ~1 hour
    else:
        print("Failed to retrieve token:", response.text)


@app.route('/search')
def search():
    global access_token
    q = request.args.get('q', '')
    print(f'[SEARCH] Searched query: "{q}"')

    if not access_token:
        get_token()

    # Step 1: Get first artist ID from Spotify
    headers = {'Authorization': f'Bearer {access_token}'}
    try:
        spotify_res = requests.get(
            'https://api.spotify.com/v1/search',
            headers=headers,
            params={'q': q, 'type': 'artist', 'limit': 1}
        )
        artist_items = spotify_res.json().get('artists', {}).get('items', [])
        if not artist_items:
            return jsonify({'error': 'No artist found'}), 404
        artist_id = artist_items[0]['id']
        print('[SEARCH] Found artist ID:', artist_id)
    except Exception as e:
        return jsonify({'error': 'Failed to search Spotify'}), 500

    # Step 2: Filter dataset by artist_id
    filtered = DATASET[DATASET['artist_ids'] == artist_id]
    if filtered.empty:
        return jsonify({'error': 'No tracks found for this artist in the dataset'}), 404
    
    # Step 3: Get track metadata from Spotify
    track_ids = filtered['id'].dropna().unique().tolist()[:20]  # Limit to 20 tracks
    id_string = ','.join(track_ids)
    try:
        metadata_res = requests.get(
            'https://api.spotify.com/v1/tracks',
            headers=headers,
            params={'ids': id_string}
        )
        tracks = metadata_res.json().get('tracks', [])
    except Exception as e:
        return jsonify({'error': 'Failed to fetch track metadata'}), 500

    # Step 4: Join features from dataset
    dataset_features = filtered.set_index('id').to_dict(orient='index')
    final = []
    for track in tracks:
        track_id = track['id']
        track['audio_features'] = dataset_features.get(track_id, {})
        final.append(track)

    return jsonify({'tracks': {'items': final}})


# start script
if __name__ == '__main__':
    get_token()  # Initial token fetch
    app.run(port=3001, debug=True)
