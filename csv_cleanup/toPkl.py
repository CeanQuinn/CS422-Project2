#Convert cleaned CSV to Pickle format
import pandas as pd

df = pd.read_csv('cleaned_exploded.csv')

df.to_pickle('cleaned_features.pkl')
print("DataFrame saved as 'cleaned_features.pkl'")