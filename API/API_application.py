import pandas as pd
from flask_pymongo import PyMongo
import pymongo
import os
#import csv_to_MDB
import json
from flask import Flask, jsonify, request

app = Flask(__name__)

# app.config['MONGO_DBNAME'] = 'disaster_db'
# app.config["MONGO_URI"] = 'mongodb://localhost:27017'
# mongo = PyMongo(app)
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

#disaster_db = csv_to_MDB.init_db()
db = client.disasterDB
collection_y = db.disasterByYear
collection_m = db.disasterByMonth

data_by_month = pd.read_csv("../Data/Disaster_cost_by_month.csv")
data_by_year = pd.read_csv("../Data/Disaster_cost_by_year.csv")
#obligated_totals = pd.read_csv("Data/Obligated_totals_by_state.csv")

# Load csvs into databases
data1 = data_by_month
data1_json = json.loads(data1.to_json(orient='records'))
collection_m.insert_many(data1_json)

data2 = data_by_year
data2_json = json.loads(data2.to_json(orient='records'))
collection_y.insert_many(data2_json)

# results = collection_m.find()
# for item in results:
#     print(item)

# API routes
@app.route("/")
def api_index():
    return("HTML page here")

@app.route("/api/disasters", methods=['GET'])
def all_disasters():
    disasters_year = collection_y.find()
    results = []
    for item in disasters_year:
        results.append({"Year" : item["Year"], "State":item["State"],
        "Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
        "Total":item["Total Obligated"]})

    return jsonify({"Result" : results})

@app.route("/api/disastermonth", methods=['GET'])
def disasters_by_month():
    disasters_month = collection_m.find()
    results_month = []
    for item in disasters_month:
        results_month.append({"Year" : item["Year"], "Month": item["Month"], "State":item["State"],
        "Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
        "Total":item["Total Obligated"]})

    return jsonify({"Result" : results_month})
# 
# @app.route("/api/disasters/<int:year>")
# def disaster_by_year(year):
#     results = collection_m.find({"Year":year})
#     breakdown_by_month = {}
#     for item in results:
#         if item['Month'] == "Jan":
#             breakdown_by_month["Jan"] = f
#     return jsonify({year : breakdown_by_month})

if __name__ == '__main__':
    app.run(port=5000, debug=True)as
