#Convert cleaned CSV to Pickle format
import pandas as pd

# Load the cleaned CSV file
df = pd.read_csv('cleaned_exploded.csv')

# Convert the DataFrame to a Pickle file
df.to_pickle('cleaned_features.pkl')
print("DataFrame saved as 'cleaned_features.pkl'")