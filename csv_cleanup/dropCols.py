# Dropping redundant columns from a CSV file
import pandas as pd


# Load your CSV
df = pd.read_csv('tracks_features.csv')

# Columns to drop
cols_to_drop = [
    'name','album','album_id','artists','track_number','disc_number','explicit','key', 
    'mode','duration_ms','time_signature','year','release_date'
]
df = df.drop(columns=[col for col in cols_to_drop if col in df.columns])



# Export to new CSV
df.to_csv('cleaned_file_step1.csv', index=False)
print("Cleaned CSV exported as 'cleaned_file_step1.csv'")