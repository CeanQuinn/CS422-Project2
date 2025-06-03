# Used to find num of artists who only appear as non-primary artists in the dataset
import pandas as pd
import ast

df = pd.read_csv('tracks_features.csv')

# Get all artists (flattened list)
all_artists = set()
primary_artists = set()

# Extract artists from the 'artists' column
for artists_str in df['artists']:
    try: # Convert the string representation of the list to an actual list
        artists = ast.literal_eval(artists_str)
        if isinstance(artists, list) and artists: # Check if it's a list and not empty
            all_artists.update(artists)
            primary_artists.add(artists[0])
    except Exception: # If conversion fails, skip this entry
        continue

# Artists who only appear as non-primary
non_primary_only = all_artists - primary_artists

# Print the results
print(f"Number of artists who only appear as non-primary: {len(non_primary_only)}")
print("Sample of such artists:", list(non_primary_only)[:10])