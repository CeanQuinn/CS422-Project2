# Gets num of rows with multiple artists in 'artists' and 'artist_ids' columns
import pandas as pd
import ast

df = pd.read_csv('tracks_features.csv')

def has_multiple(val):
    try:
        items = ast.literal_eval(val)
        return isinstance(items, list) and len(items) > 1
    except Exception:
        return False

# Check for multiple artists
multiple_artists = df['artists'].apply(has_multiple)
multiple_artist_ids = df['artist_ids'].apply(has_multiple)

print(f"Rows with multiple artists in 'artists': {multiple_artists.sum()}")
print(f"Rows with multiple artists in 'artist_ids': {multiple_artist_ids.sum()}")

# Optionally, print the rows
'''
print("\nRows with multiple artists in 'artist':")
print(df[multiple_artists])

print("\nRows with multiple artists in 'artist_ids':")
print(df[multiple_artist_ids])
'''