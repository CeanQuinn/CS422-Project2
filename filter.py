import os
import base64
import time
#from flask import Flask, request, jsonify
#from flask_cors import CORS
from threading import Timer
from dotenv import load_dotenv
import pandas as pd
import numpy as np
import math
import ast

def filter_df(df, danceability = None, energy = None, loudness = None, 
acousticness = None, instrumentalness = None, speechiness = None, 
liveness = None, valence = None, tempo = None):
    """
    Takes values specified by user in sliders to filter dataframe,
    returns dataframe with songs that best fit
    """
    cols = ['danceability', 'energy', 'loudness', 'acousticness', 'instrumentalness', 'speechiness', 'liveness', 'valence', 'tempo']
    arr = [danceability, energy, loudness, acousticness, instrumentalness, speechiness, liveness, valence, tempo]
    tolerance = .1
    for i in range(len(arr)):
        if arr[i] is not None:
            df = df[abs(df[cols[i]] - arr[i]) <= tolerance]
    return df
            

if __name__ == "__main__":
    result = filter_df(valence=0.5)
    print(result)