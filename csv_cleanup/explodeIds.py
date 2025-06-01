# Explodes the 'artist_ids' column in a CSV file so that each artist_id has its own row
import pandas as pd
import ast

df = pd.read_csv('cleaned_file_step1.csv')

# Convert 'artist_ids' from string to list
df['artist_ids'] = df['artist_ids'].apply(lambda x: ast.literal_eval(x) if pd.notnull(x) else [])

# Explode the 'artist_ids' column so each artist_id gets its own row
df_exploded = df.explode('artist_ids').reset_index(drop=True)

# Save to a new CSV
df_exploded.to_csv('cleaned_exploded.csv', index=False)

print("Exploded CSV saved as 'cleaned_exploded.csv'")