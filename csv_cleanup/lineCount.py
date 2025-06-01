# Simple script to count the number of lines in cleaned CSV files to ensure that the cleanup process worked correctly.
import pandas as pd

for fname in ['cleaned_file_step1.csv', 'cleaned_exploded.csv']:
    print(fname, pd.read_csv(fname).shape[0])