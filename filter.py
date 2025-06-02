import os
import pandas as pd

# Function to filter a DataFrame based on user-specified ranges for various audio features
def filter_df(df, danceability = None, energy = None, loudness = None, 
acousticness = None, instrumentalness = None, speechiness = None, 
liveness = None, valence = None, tempo = None):
    """
    Takes values specified by user in sliders to filter dataframe,
    returns dataframe with songs that best fit
    """
    data = df.copy() # Create a copy of the DataFrame to avoid modifying the original
    # Arrays for each feature to filter, column names and their corresponding filter values
    cols = ['danceability', 'energy', 'loudness', 'acousticness', 'instrumentalness', 'speechiness', 'liveness', 'valence', 'tempo']
    arr = [danceability, energy, loudness, acousticness, instrumentalness, speechiness, liveness, valence, tempo]
    # filter data based on the specified ranges
    for i in range(len(arr)): # for each feature
        if arr[i] is not None and isinstance(arr[i], tuple): #if the feature is specified as a tuple (min, max)
            min_val, max_val = arr[i]
            data = data[(data[cols[i]] >= min_val) & (data[cols[i]] <= max_val)] # keep rows where the feature value is within the specified range

    return data
            

if __name__ == "__main__":
    result = filter_df(df=pd.read_pickle(os.path.join('data', 'cleaned_features.pkl')), valence=0.5)
    print(result)
