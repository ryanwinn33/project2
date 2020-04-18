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

@app.route("/api/disasters/<int:year>")
def disaster_by_year(year):
    results = collection_m.find({"Year":year})
    months_data = {}
    for item in results:
        if item["Month"] not in months_data:
            months_data[item["Month"]] = [{"State":item["State"],
            "Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
            "Total": item["Total Obligated"]}]
        elif item["Month"] in months_data:
            months_data[item["Month"]].append({"State":item["State"],
            "Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
            "Total": item["Total Obligated"]})
        else:
            pass

    return jsonify({year : months_data})


@app.route("/api/disasters/<string:state>")
def state_disaster(state):
    results_state = collection_y.find({"State":state})
    state_data = {}
    for item in results_state:
        if item["Year"] not in state_data:
            state_data[item["Year"]] = [{"Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
            "Total": item["Total Obligated"]}]
        elif item["Year"] in state_data:
            state_data[item["Year"]].append({"Type": item["Incident Type"], "Incident Count" : item["Count of Incidents"],
            "Total": item["Total Obligated"]})
        else:
            pass

    return jsonify({state : state_data})
# @app.route("/api/disasters/<string:disasterName>", methods=["POST"])
# def create_disaster(disasterName):
#     pass

if __name__ == '__main__':
    app.run(port=5000, debug=True)
