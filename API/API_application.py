import pandas as pd
import pymongo
import os
import csv_to_MDB
import json
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

collection_y,collection_m = csv_to_MDB.init_db()

# results = collection_m.find()
# for item in results:
#     print(item)

# API routes
@app.route("/")
def home():
    return render_template("home.html")

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

# @app.route("/api/disasters/<int:year>")
# def disaster_by_year(year):
#     results = collection_m.find({"Year":year})
#     unique_months = []
#     months_data = {}
#     for item in results:
#         if item["Month"] not in unique_months:
#             unique_months.append(item["Month"])
#
#     for result in results:
#         if result["Month"] in unique_months:
#             months_data[result["Month"]].append({"Month": result["Month"],"State":result["State"],
#             "Type": result["Incident Type"], "Incident Count" : result["Count of Incidents"],
#             "Total": result["Total Obligated"]})
#     return jsonify({year : months_data})

# @app.route("/api/disasters/<string:disasterName>", methods=["POST"])
# def create_disaster(disasterName):
#     pass

if __name__ == '__main__':
    app.run(port=5000, debug=True)
