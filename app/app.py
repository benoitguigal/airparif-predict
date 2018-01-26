from functools import reduce

from flask import app, Flask, render_template
import pandas as pd


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


years = ["2014", "2015", "2016", "2017"]
file_paths = ["data/datagouv/indices_QA_commune_IDF_%s.csv" % year for year in years]
dfs = [pd.read_csv(file_path, sep=',') for file_path in file_paths]

ninsee = 'ninsee'
date = 'date'
no2 = 'no2'


@app.route('/data')
def get_data():
    df = reduce(lambda df1, df2: df1.append(df2), dfs)
    df = df.loc[df[ninsee] == 0]
    return df.to_json(orient='table')








